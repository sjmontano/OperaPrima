import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/authApi'
import cloudinary from '@/lib/cloudinary'

interface CloudinaryResource {
  public_id: string
  format: string
  bytes: number
  width: number
  height: number
  created_at: string
  secure_url: string
  folder: string
}

interface ImageUsage {
  model: string
  field: string
  label: string
  href: string
  category: string
}

interface EnrichedImage extends CloudinaryResource {
  usages: ImageUsage[]
}

function urlToPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.(?:png|jpe?g|gif|webp|avif|tiff|svg)$/i)
  return match ? match[1] : null
}

function matchesCloudinaryUrl(dbUrl: string, cloudUrl: string): boolean {
  const dbPublicId = urlToPublicId(dbUrl)
  if (!dbPublicId) return false
  return cloudUrl.includes(dbPublicId)
}

function extractImageUrlsFromBlocks(blocks: unknown): string[] {
  const urls: string[] = []
  function walk(obj: unknown) {
    if (typeof obj === 'string' && obj.includes('res.cloudinary.com')) {
      urls.push(obj)
    } else if (Array.isArray(obj)) {
      for (const item of obj) walk(item)
    } else if (obj && typeof obj === 'object') {
      for (const val of Object.values(obj as Record<string, unknown>)) walk(val)
    }
  }
  walk(blocks)
  return urls
}

export async function GET(req: Request) {
  try {
    const autorizado = await verifyAdmin(req)
    if (!autorizado) {
      const token = req.headers.get('Authorization')
      return Response.json({ error: 'No autorizado' }, { status: token ? 403 : 401 })
    }

    // Parse optional pagination params from query string
    const { searchParams } = new URL(req.url)
    const requestedCursor = searchParams.get('cursor') || undefined
    const limit = Math.min(Number(searchParams.get('limit')) || 500, 500)

    // Fetch Cloudinary resources
    const result = (await cloudinary.api.resources({
      type: 'upload',
      prefix: 'opera-prima/',
      max_results: limit,
      next_cursor: requestedCursor,
    })) as {
      resources: CloudinaryResource[]
      next_cursor?: string
    }

    const allResources: CloudinaryResource[] = result.resources

    // Fetch all DB records that reference images
    const [eventos, proyectos, perfiles, galleryImages, mentores, pages] = await Promise.all([
      prisma.evento.findMany({
        select: { id: true, titulo: true, imagen: true, tipo: true },
        where: { imagen: { not: null } },
      }),
      prisma.proyecto.findMany({
        select: { id: true, nombre: true, imagen: true },
        where: { imagen: { not: null } },
      }),
      prisma.perfil.findMany({
        select: {
          id: true,
          artisticName: true,
          avatar: true,
          banner: true,
          usuario: { select: { username: true } },
        },
      }),
      prisma.userGallery.findMany({
        select: { id: true, src: true, publicId: true, usuario: { select: { username: true } } },
      }),
      prisma.mentor.findMany({
        select: { id: true, name: true, galleryImages: true },
      }),
      prisma.pageContent.findMany({
        select: { slug: true, title: true, blocks: true },
      }),
    ])

    // Build URL lookup map: DB image URL -> usage entries
    const usageMap = new Map<string, ImageUsage[]>()

    for (const e of eventos) {
      if (!e.imagen) continue
      usageMap.set(e.imagen, [
        ...(usageMap.get(e.imagen) || []),
        {
          model: 'Evento',
          field: 'imagen',
          label: e.titulo,
          href: `/admin/eventos?id=${e.id}`,
          category: e.tipo === 'COMUNIDAD' ? 'evento-comunidad' : 'evento-opera',
        },
      ])
    }

    for (const p of proyectos) {
      if (!p.imagen) continue
      usageMap.set(p.imagen, [
        ...(usageMap.get(p.imagen) || []),
        {
          model: 'Proyecto',
          field: 'imagen',
          label: p.nombre,
          href: `/admin/proyectos?id=${p.id}`,
          category: 'proyecto',
        },
      ])
    }

    for (const p of perfiles) {
      const username = p.usuario?.username ?? 'sin-username'
      if (p.avatar) {
        usageMap.set(p.avatar, [
          ...(usageMap.get(p.avatar) || []),
          {
            model: 'Perfil',
            field: 'avatar',
            label: p.artisticName ?? username,
            href: `/perfil/${username}`,
            category: 'perfil',
          },
        ])
      }
      if (p.banner) {
        usageMap.set(p.banner, [
          ...(usageMap.get(p.banner) || []),
          {
            model: 'Perfil',
            field: 'banner',
            label: p.artisticName ?? username,
            href: `/perfil/${username}`,
            category: 'perfil',
          },
        ])
      }
    }

    for (const g of galleryImages) {
      usageMap.set(g.src, [
        ...(usageMap.get(g.src) || []),
        {
          model: 'UserGallery',
          field: 'src',
          label: `Galería de ${g.usuario?.username ?? 'usuario'}`,
          href: `/perfil/${g.usuario?.username ?? ''}`,
          category: 'galeria',
        },
      ])
    }

    for (const m of mentores) {
      if (!m.galleryImages) continue
      const images = m.galleryImages as { url: string }[]
      for (const img of images) {
        usageMap.set(img.url, [
          ...(usageMap.get(img.url) || []),
          {
            model: 'Mentor',
            field: 'galleryImages',
            label: m.name,
            href: `/admin/mentores?id=${m.id}`,
            category: 'mentor',
          },
        ])
      }
    }

    for (const page of pages) {
      const imageUrls = extractImageUrlsFromBlocks(page.blocks)
      for (const url of imageUrls) {
        usageMap.set(url, [
          ...(usageMap.get(url) || []),
          {
            model: 'PageContent',
            field: 'blocks',
            label: page.title,
            href: `/admin/pages/${page.slug}`,
            category: 'pagina',
          },
        ])
      }
    }

    // Enrich each Cloudinary resource with its DB usages
    const images: EnrichedImage[] = allResources.map((r) => {
      const usages: ImageUsage[] = []
      for (const [dbUrl, entries] of usageMap) {
        if (matchesCloudinaryUrl(dbUrl, r.secure_url)) {
          usages.push(...entries)
        }
      }
      return { ...r, usages }
    })

    // Stats
    const totalBytes = images.reduce((sum, img) => sum + img.bytes, 0)
    const avgBytes = images.length > 0 ? Math.round(totalBytes / images.length) : 0

    const formatMap = new Map<string, { count: number; bytes: number }>()
    const folderMap = new Map<string, { count: number; bytes: number }>()

    for (const img of images) {
      const f = img.format.toLowerCase()
      formatMap.set(f, {
        count: (formatMap.get(f)?.count ?? 0) + 1,
        bytes: (formatMap.get(f)?.bytes ?? 0) + img.bytes,
      })

      const folder = img.folder || '(root)'
      folderMap.set(folder, {
        count: (folderMap.get(folder)?.count ?? 0) + 1,
        bytes: (folderMap.get(folder)?.bytes ?? 0) + img.bytes,
      })
    }

    const byFormat = Array.from(formatMap.entries()).map(([format, data]) => ({ format, ...data }))
    const byFolder = Array.from(folderMap.entries()).map(([folder, data]) => ({ folder, ...data }))
    const topHeavy = [...images].sort((a, b) => b.bytes - a.bytes).slice(0, 10)
    const orphaned = images.filter((img) => img.usages.length === 0).length

    return Response.json({
      images,
      next_cursor: result.next_cursor ?? null,
      stats: {
        totalImages: images.length,
        totalBytes,
        avgBytes,
        orphaned,
        byFormat,
        byFolder,
        topHeavy,
      },
    })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener imágenes' }, { status: 500 })
  }
}

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'

async function getUsuario(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser(token)
  if (!user) return null

  return prisma.usuario.findUnique({ where: { supabaseId: user.id } })
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')

    const usuario = await getUsuario(req)

    const where = userId ? { usuarioId: userId } : usuario ? { usuarioId: usuario.id } : null

    if (!where) {
      return Response.json({ images: [] })
    }

    const images = await prisma.userGallery.findMany({
      where,
      orderBy: { orden: 'asc' },
    })

    return Response.json({ images })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener galería' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    if (!user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const usuario = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
    if (!usuario) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const body = await req.json()
    const { src, publicId, title, alt } = body

    if (!src) {
      return Response.json({ error: 'src es obligatorio' }, { status: 400 })
    }

    const count = await prisma.userGallery.count({ where: { usuarioId: usuario.id } })
    const span = count === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'

    const image = await prisma.userGallery.create({
      data: {
        usuarioId: usuario.id,
        src,
        publicId: publicId || null,
        title: title || null,
        alt: alt || null,
        span,
        orden: count,
      },
    })

    return Response.json({ image }, { status: 201 })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al crear imagen' }, { status: 500 })
  }
}

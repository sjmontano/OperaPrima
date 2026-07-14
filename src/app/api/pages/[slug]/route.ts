import { prisma } from '@/lib/prisma'
import { createServerClient } from '@supabase/ssr'
import { Rol } from '@prisma/client'

function parseCookies(cookieHeader: string | null): Map<string, string> {
  const map = new Map<string, string>()
  if (!cookieHeader) return map
  for (const pair of cookieHeader.split(';')) {
    const eq = pair.indexOf('=')
    if (eq === -1) continue
    map.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim())
  }
  return map
}

async function getAdmin(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  const cookieMap = parseCookies(req.headers.get('Cookie'))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => Array.from(cookieMap.entries()).map(([name, value]) => ({ name, value })),
        setAll: () => {},
      },
    }
  )

  let userId: string | null = null

  if (token) {
    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    if (user) userId = user.id
  }

  if (!userId) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) userId = user.id
  }

  if (!userId) return null

  const usuario = await prisma.usuario.findUnique({ where: { supabaseId: userId } })
  if (!usuario || usuario.rol !== Rol.ADMIN) return null

  return usuario
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const page = await prisma.pageContent.findUnique({
    where: { slug },
  })

  if (!page || !page.published) {
    return Response.json({ error: 'Página no encontrada' }, { status: 404 })
  }

  return Response.json({ page })
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const admin = await getAdmin(req)
    if (!admin) {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { slug } = await params
    const body = await req.json()

    const page = await prisma.pageContent.upsert({
      where: { slug },
      update: {
        ...(body.title ? { title: body.title } : {}),
        blocks: body.blocks ?? [],
        published: body.published ?? true,
      },
      create: {
        slug,
        title: body.title || 'Sin título',
        blocks: body.blocks ?? [],
        published: body.published ?? true,
      },
    })

    return Response.json({ page })
  } catch (error) {
    console.error('[PUT /api/pages] Error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Error interno' },
      { status: 500 }
    )
  }
}

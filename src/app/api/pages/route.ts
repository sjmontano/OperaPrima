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

export async function GET(req: Request) {
  const admin = await getAdmin(req)

  const pages = await prisma.pageContent.findMany({
    select: { id: true, slug: true, title: true, published: true, updatedAt: true },
    orderBy: { slug: 'asc' },
  })

  if (!admin) {
    return Response.json({ pages: pages.filter((p) => p.published) })
  }

  return Response.json({ pages })
}

export async function POST(req: Request) {
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

  if (!userId) return Response.json({ error: 'No autorizado' }, { status: 401 })

  const usuario = await prisma.usuario.findUnique({ where: { supabaseId: userId } })
  if (!usuario || usuario.rol !== Rol.ADMIN) {
    return Response.json({ error: 'Se requieren permisos de administrador' }, { status: 403 })
  }

  const body = await req.json()

  if (!body.slug || !body.title) {
    return Response.json({ error: 'slug y title son requeridos' }, { status: 400 })
  }

  const page = await prisma.pageContent.create({
    data: {
      slug: body.slug,
      title: body.title,
      blocks: body.blocks ?? [],
      published: body.published ?? true,
    },
  })

  return Response.json({ page })
}

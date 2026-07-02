import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'
import { Rol } from '@prisma/client'

async function getAdmin(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return null

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser(token)
  if (!user) return null

  const usuario = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
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
  if (!token) return Response.json({ error: 'No autorizado' }, { status: 401 })

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser(token)
  if (!user) return Response.json({ error: 'No autorizado' }, { status: 401 })

  const usuario = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
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

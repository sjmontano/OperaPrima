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
  const admin = await getAdmin(req)
  if (!admin) {
    return Response.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { slug } = await params
  const body = await req.json()

  const page = await prisma.pageContent.upsert({
    where: { slug },
    update: {
      title: body.title,
      blocks: body.blocks ?? [],
      published: body.published ?? true,
    },
    create: {
      slug,
      title: body.title,
      blocks: body.blocks ?? [],
      published: body.published ?? true,
    },
  })

  return Response.json({ page })
}

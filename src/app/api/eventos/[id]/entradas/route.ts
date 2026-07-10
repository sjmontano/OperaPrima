import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'
import { Rol } from '@prisma/client'

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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const usuario = await getUsuario(_req)
    if (!usuario || usuario.rol !== Rol.ADMIN) {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params

    const evento = await prisma.evento.findUnique({
      where: { id },
      select: { id: true, titulo: true },
    })
    if (!evento) {
      return Response.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    const entradas = await prisma.entrada.findMany({
      where: { eventoId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    })

    return Response.json({ entradas, total: entradas.length })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener entradas' }, { status: 500 })
  }
}

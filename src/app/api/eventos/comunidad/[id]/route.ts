import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const usuario = await prisma.usuario.findUnique({
      where: { supabaseId: user.id },
    })
    if (!usuario) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const existing = await prisma.evento.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'Evento no encontrado' }, { status: 404 })
    }
    if (existing.usuarioId !== usuario.id) {
      return Response.json({ error: 'No puedes editar este evento' }, { status: 403 })
    }

    const body = await req.json()
    const evento = await prisma.evento.update({
      where: { id },
      data: {
        titulo: body.titulo,
        descripcion: body.descripcion,
        categoria: body.categoria,
        disciplinas: body.disciplinas ?? existing.disciplinas,
        link: body.link ?? existing.link,
        fecha: body.fecha ? new Date(body.fecha) : existing.fecha,
        ubicacion: body.ubicacion,
        imagen: body.imagen ?? existing.imagen,
        precio: body.precio,
      },
      include: {
        usuario: { include: { perfil: true } },
      },
    })

    return Response.json({ evento })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al actualizar el evento' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const usuario = await prisma.usuario.findUnique({
      where: { supabaseId: user.id },
    })
    if (!usuario) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const existing = await prisma.evento.findUnique({ where: { id } })
    if (!existing) {
      return Response.json({ error: 'Evento no encontrado' }, { status: 404 })
    }
    if (existing.usuarioId !== usuario.id) {
      return Response.json({ error: 'No puedes eliminar este evento' }, { status: 403 })
    }

    await prisma.evento.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al eliminar el evento' }, { status: 500 })
  }
}

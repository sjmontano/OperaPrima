import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const usuario = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
    if (!usuario || usuario.rol !== 'ADMIN') {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = await params
    const { active } = await req.json()

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { active },
    })

    return Response.json({ testimonial })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al actualizar testimonio' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const usuario = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
    if (!usuario) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const { id } = await params

    const testimonial = await prisma.testimonial.findUnique({ where: { id } })
    if (!testimonial) {
      return Response.json({ error: 'Testimonio no encontrado' }, { status: 404 })
    }

    if (testimonial.usuarioId !== usuario.id && usuario.rol !== 'ADMIN') {
      return Response.json(
        { error: 'No tienes permiso para eliminar este testimonio' },
        { status: 403 }
      )
    }

    await prisma.testimonial.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al eliminar testimonio' }, { status: 500 })
  }
}

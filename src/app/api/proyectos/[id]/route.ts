import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return Response.json({ error: 'No autorizado' }, { status: 401 })

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    if (!user) return Response.json({ error: 'No autorizado' }, { status: 401 })

    const usuario = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
    if (!usuario || usuario.rol !== 'ADMIN')
      return Response.json({ error: 'No autorizado' }, { status: 401 })

    const body = await req.json()
    const proyecto = await prisma.proyecto.update({
      where: { id },
      data: {
        ...(body.nombre !== undefined && { nombre: body.nombre }),
        ...(body.representante !== undefined && { representante: body.representante }),
        ...(body.descripcion !== undefined && { descripcion: body.descripcion }),
        ...(body.queBuscan !== undefined && { queBuscan: body.queBuscan }),
        ...(body.requisitos !== undefined && { requisitos: body.requisitos }),
        ...(body.proceso !== undefined && { proceso: body.proceso }),
        ...(body.imagen !== undefined && { imagen: body.imagen }),
        ...(body.contacto !== undefined && { contacto: body.contacto }),
        ...(body.disciplinas !== undefined && { disciplinas: body.disciplinas }),
        ...(body.ubicacion !== undefined && { ubicacion: body.ubicacion }),
        ...(body.fechaLimite !== undefined && { fechaLimite: new Date(body.fechaLimite) }),
        ...(body.destacado !== undefined && { destacado: body.destacado }),
      },
    })

    return Response.json({ proyecto })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return Response.json({ error: 'No autorizado' }, { status: 401 })

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    if (!user) return Response.json({ error: 'No autorizado' }, { status: 401 })

    const usuario = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
    if (!usuario || usuario.rol !== 'ADMIN')
      return Response.json({ error: 'No autorizado' }, { status: 401 })

    await prisma.proyecto.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}

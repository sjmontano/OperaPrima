import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'
import { Rol } from '@prisma/client'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return Response.json({ error: 'No autorizado' }, { status: 401 })

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    if (!user) return Response.json({ error: 'No autorizado' }, { status: 401 })

    const usuario = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
    if (!usuario || usuario.rol !== Rol.ADMIN)
      return Response.json({ error: 'No autorizado' }, { status: 401 })

    const body = await req.json()

    const updated = await prisma.usuario.update({
      where: { id },
      data: {
        ...(body.destacado !== undefined && { destacado: body.destacado }),
      },
      include: { perfil: true },
    })

    return Response.json({ usuario: updated })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al actualizar usuario' }, { status: 500 })
  }
}

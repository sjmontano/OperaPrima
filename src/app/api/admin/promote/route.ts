import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'

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

    const requester = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
    if (!requester || requester.rol !== 'ADMIN') {
      return Response.json({ error: 'Se requieren permisos de administrador' }, { status: 403 })
    }

    const body = await req.json()
    const { email, rol } = body

    if (!email || !rol) {
      return Response.json({ error: 'email y rol son requeridos' }, { status: 400 })
    }

    if (!['USUARIO', 'MENTOR', 'ADMIN'].includes(rol)) {
      return Response.json({ error: 'Rol inválido' }, { status: 400 })
    }

    const updated = await prisma.usuario.update({
      where: { email },
      data: { rol },
      select: { id: true, email: true, username: true, rol: true },
    })

    return Response.json({ usuario: updated })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al actualizar rol' }, { status: 500 })
  }
}

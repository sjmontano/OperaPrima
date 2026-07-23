import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/authApi'

export async function POST(req: Request) {
  try {
    const autorizado = await verifyAdmin(req)
    if (!autorizado) {
      const token = req.headers.get('Authorization')
      return Response.json(
        { error: 'Se requieren permisos de administrador' },
        { status: token ? 403 : 401 }
      )
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

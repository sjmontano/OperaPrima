import { prisma } from '@/lib/prisma'
import { Rol } from '@prisma/client'

export const dynamic = 'force-dynamic'

async function getAuthUser(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return null

  const supabaseAdmin = (await import('@/lib/supabaseAdmin')).default
  const token = authHeader.replace('Bearer ', '')
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null

  const dbUser = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
  return dbUser
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const dbUser = await getAuthUser(req)
    if (!dbUser) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const mentor = await prisma.mentor.findUnique({ where: { id } })
    if (!mentor) {
      return Response.json({ error: 'Mentor no encontrado' }, { status: 404 })
    }

    const isAdmin = dbUser.rol === Rol.ADMIN
    const isOwner = mentor.usuarioId === dbUser.id
    if (!isAdmin && !isOwner) {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()
    const { usuarioId, name, title, location, focus, notes, galleryImages, active, orden } = body

    if (isAdmin && usuarioId !== undefined && usuarioId !== mentor.usuarioId) {
      const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } })
      if (!usuario) {
        return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
      }
      if (usuario.rol !== Rol.ADMIN) {
        await prisma.usuario.update({
          where: { id: usuarioId },
          data: { rol: Rol.MENTOR },
        })
      }
      if (mentor.usuarioId && mentor.usuarioId !== usuarioId) {
        await prisma.usuario.update({
          where: { id: mentor.usuarioId },
          data: { rol: Rol.USUARIO },
        })
      }
    }

    const updated = await prisma.mentor.update({
      where: { id },
      data: {
        ...(isAdmin && usuarioId !== undefined ? { usuarioId: usuarioId || null } : {}),
        ...(name !== undefined ? { name } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(location !== undefined ? { location } : {}),
        ...(focus !== undefined ? { focus } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(galleryImages !== undefined ? { galleryImages } : {}),
        ...(isAdmin && active !== undefined ? { active } : {}),
        ...(isAdmin && orden !== undefined ? { orden } : {}),
      },
      include: { usuario: { include: { perfil: true } } },
    })

    return Response.json({ mentor: updated })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al actualizar mentor' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const dbUser = await getAuthUser(req)
    if (!dbUser || dbUser.rol !== Rol.ADMIN) {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    const mentor = await prisma.mentor.findUnique({ where: { id } })
    if (!mentor) {
      return Response.json({ error: 'Mentor no encontrado' }, { status: 404 })
    }

    if (mentor.usuarioId) {
      await prisma.usuario.update({
        where: { id: mentor.usuarioId },
        data: { rol: Rol.USUARIO },
      })
    }

    await prisma.mentor.delete({ where: { id } })
    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al eliminar mentor' }, { status: 500 })
  }
}

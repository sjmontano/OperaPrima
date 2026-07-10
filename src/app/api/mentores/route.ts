import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const admin = url.searchParams.get('admin') === 'true'

    if (admin) {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return Response.json({ error: 'No autorizado' }, { status: 401 })
      }
      const supabaseAdmin = (await import('@/lib/supabaseAdmin')).default
      const token = authHeader.replace('Bearer ', '')
      const {
        data: { user },
        error: authError,
      } = await supabaseAdmin.auth.getUser(token)
      if (authError || !user) {
        return Response.json({ error: 'Token inválido' }, { status: 401 })
      }
      const dbUser = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
      if (!dbUser || dbUser.rol !== 'ADMIN') {
        return Response.json({ error: 'No autorizado' }, { status: 403 })
      }

      const mentores = await prisma.mentor.findMany({
        include: { usuario: { include: { perfil: true } } },
        orderBy: { orden: 'asc' },
      })
      return Response.json({ mentores })
    }

    const mentores = await prisma.mentor.findMany({
      where: { active: true },
      include: { usuario: { include: { perfil: true } } },
      orderBy: { orden: 'asc' },
    })
    return Response.json({ mentores })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener mentores' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const supabaseAdmin = (await import('@/lib/supabaseAdmin')).default
    const token = authHeader.replace('Bearer ', '')
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return Response.json({ error: 'Token inválido' }, { status: 401 })
    }

    const dbUser = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
    if (!dbUser || dbUser.rol !== 'ADMIN') {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()
    const { usuarioId, name, title, location, focus, notes, galleryImages, active, orden } = body

    if (!name || !title || !location || !focus) {
      return Response.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    if (usuarioId) {
      const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } })
      if (!usuario) {
        return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
      }
      if (usuario.rol !== 'ADMIN') {
        await prisma.usuario.update({
          where: { id: usuarioId },
          data: { rol: 'MENTOR' },
        })
      }
    }

    const mentor = await prisma.mentor.create({
      data: {
        usuarioId: usuarioId || null,
        name,
        title,
        location,
        focus,
        notes: notes || [],
        galleryImages: galleryImages || null,
        active: active !== undefined ? active : true,
        orden: orden !== undefined ? orden : 0,
      },
      include: { usuario: { include: { perfil: true } } },
    })

    return Response.json({ mentor }, { status: 201 })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al crear mentor' }, { status: 500 })
  }
}

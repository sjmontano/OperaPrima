import cloudinary from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'
import { Rol } from '@prisma/client'

function getPublicId(url: string) {
  const parts = url.split('/upload/')[1]
  if (!parts) return null
  const withoutVersion = parts.replace(/^v\d+\//, '')
  return withoutVersion.replace(/\.[^.]+$/, '')
}

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
    const { id } = await params

    const evento = await prisma.evento.findUnique({
      where: { id },
      include: {
        usuario: { include: { perfil: true } },
      },
    })

    if (!evento) {
      return Response.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    return Response.json({ evento })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener evento' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const usuario = await getUsuario(req)
    if (!usuario) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    const evento = await prisma.evento.findUnique({ where: { id } })
    if (!evento) {
      return Response.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    const isOwner = evento.usuarioId === usuario.id
    const isAdmin = usuario.rol === Rol.ADMIN

    if (!isOwner && !isAdmin) {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()

    if (evento.imagen && body.imagen && body.imagen !== evento.imagen) {
      const publicId = getPublicId(evento.imagen)
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId)
        } catch {}
      }
    }

    const actualizado = await prisma.evento.update({
      where: { id },
      data: {
        titulo: body.titulo,
        descripcion: body.descripcion,
        categoria: body.categoria,
        tipo: body.tipo,
        disciplinas: body.disciplinas ?? [],
        fecha: new Date(body.fecha),
        ubicacion: body.ubicacion,
        precio: Number(body.precio),
        imagen: body.imagen,
        urlPago: body.urlPago || null,
      },
      include: {
        usuario: { include: { perfil: true } },
      },
    })

    return Response.json({ evento: actualizado })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al actualizar evento' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const usuario = await getUsuario(req)
    if (!usuario) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const url = new URL(req.url)
    const force = url.searchParams.get('force') === 'true'
    const confirm = url.searchParams.get('confirm') === 'true'

    const evento = await prisma.evento.findUnique({ where: { id } })
    if (!evento) {
      return Response.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    const isOwner = evento.usuarioId === usuario.id
    const isAdmin = usuario.rol === Rol.ADMIN

    if (!isOwner && !isAdmin) {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    const entradasCount = await prisma.entrada.count({ where: { eventoId: id } })

    if (entradasCount > 0 && !(force && confirm)) {
      return Response.json({
        warning: true,
        hasEntries: true,
        count: entradasCount,
        message: `Este evento tiene ${entradasCount} entrada(s) registrada(s). Si lo eliminas, se perderán permanentemente.`,
      })
    }

    if (entradasCount > 0 && force && confirm) {
      const entradas = await prisma.entrada.findMany({
        where: { eventoId: id },
        include: {
          usuario: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
      })

      await prisma.deletedEventBackup.create({
        data: {
          eventoId: id,
          data: {
            evento,
            entradas,
          },
        },
      })
    }

    if (evento.imagen) {
      const publicId = getPublicId(evento.imagen)
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId)
        } catch {}
      }
    }

    await prisma.evento.delete({ where: { id } })

    return Response.json({ ok: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al eliminar evento' }, { status: 500 })
  }
}

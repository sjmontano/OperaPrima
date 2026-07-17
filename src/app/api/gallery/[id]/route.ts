import cloudinary from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'

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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const usuario = await getUsuario(req)
    if (!usuario) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    const image = await prisma.userGallery.findUnique({ where: { id } })
    if (!image) {
      return Response.json({ error: 'Imagen no encontrada' }, { status: 404 })
    }

    if (image.usuarioId !== usuario.id) {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()
    const updated = await prisma.userGallery.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.alt !== undefined ? { alt: body.alt } : {}),
      },
    })

    return Response.json({ image: updated })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al actualizar imagen' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const usuario = await getUsuario(req)
    if (!usuario) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    const image = await prisma.userGallery.findUnique({ where: { id } })
    if (!image) {
      return Response.json({ error: 'Imagen no encontrada' }, { status: 404 })
    }

    if (image.usuarioId !== usuario.id) {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    if (image.publicId) {
      try {
        await cloudinary.uploader.destroy(image.publicId)
      } catch {}
    }

    await prisma.userGallery.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al eliminar imagen' }, { status: 500 })
  }
}

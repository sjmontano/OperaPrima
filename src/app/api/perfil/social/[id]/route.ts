import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { label, handle, href } = body

    const updated = await prisma.social.update({
      where: { id },
      data: {
        ...(label !== undefined && { label }),
        ...(handle !== undefined && { handle }),
        ...(href !== undefined && { href }),
      },
    })

    return Response.json({ ok: true, social: updated })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al actualizar red social' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await prisma.social.delete({ where: { id } })

    return Response.json({ ok: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al eliminar red social' }, { status: 500 })
  }
}

import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: {
        perfil: {
          include: { redes: true },
        },
      },
    })

    if (!usuario) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return Response.json({
      usuario: {
        id: usuario.id,
        username: usuario.username,
        firstName: usuario.firstName,
        lastName: usuario.lastName,
        perfil: usuario.perfil,
      },
    })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener perfil' }, { status: 500 })
  }
}

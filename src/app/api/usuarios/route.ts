import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      where: {
        perfil: { isNot: null },
      },
      include: {
        perfil: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return Response.json({ usuarios })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener usuarios' }, { status: 500 })
  }
}

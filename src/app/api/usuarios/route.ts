import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    const search = url.searchParams.get('q') || ''

    if (id) {
      const usuario = await prisma.usuario.findUnique({
        where: { id },
        include: { perfil: true },
      })
      if (!usuario) {
        return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
      }
      return Response.json({ usuario })
    }

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { username: { startsWith: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ]
    }

    const usuarios = await prisma.usuario.findMany({
      where: where as Parameters<typeof prisma.usuario.findMany>[0]['where'],
      include: { perfil: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return Response.json({ usuarios })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener usuarios' }, { status: 500 })
  }
}

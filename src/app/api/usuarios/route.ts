import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const search = url.searchParams.get('q') || ''

    const where: Record<string, unknown> = {
      perfil: { isNot: null },
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
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

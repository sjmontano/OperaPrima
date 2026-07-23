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
      const clean = search.replace(/^@/, '')
      where.OR = [
        { username: { startsWith: clean, mode: 'insensitive' } },
        { firstName: { contains: clean, mode: 'insensitive' } },
        { lastName: { contains: clean, mode: 'insensitive' } },
        { email: { contains: clean, mode: 'insensitive' } },
        { perfil: { artisticName: { contains: clean, mode: 'insensitive' } } },
      ]
    }

    const usuarios = await prisma.usuario.findMany({
      where: where as Parameters<typeof prisma.usuario.findMany>[0]['where'],
      include: {
        perfil: true,
        gallery: { select: { id: true } },
      },
      take: 50,
    })

    const scored = usuarios
      .map((u) => {
        const score =
          (u.perfil?.avatar ? 3 : 0) +
          (u.perfil?.bio ? 2 : 0) +
          ((u.perfil?.tags?.length ?? 0) > 0 ? 2 : 0) +
          (u.perfil?.artisticName ? 1 : 0) +
          ((u.perfil?.interests?.length ?? 0) > 0 ? 1 : 0) +
          Math.min(u.gallery.length, 3)
        return { ...u, score }
      })
      .sort((a, b) => {
        if (a.destacado !== b.destacado) return a.destacado ? -1 : 1
        return b.score - a.score
      })

    return Response.json({ usuarios: scored })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener usuarios' }, { status: 500 })
  }
}

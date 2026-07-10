import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalUsuarios, totalMentores, totalEventos, paises] = await Promise.all([
      prisma.usuario.count(),
      prisma.usuario.count({ where: { rol: 'MENTOR' } }),
      prisma.evento.count(),
      prisma.usuario.groupBy({ by: ['countryCode'], _count: true }).then((r) => r.length),
    ])

    return Response.json({
      totalUsuarios,
      totalMentores,
      totalEventos,
      paises,
    })
  } catch {
    return Response.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }
}

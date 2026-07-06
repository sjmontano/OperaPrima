import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalUsuarios, totalEventos, paises] = await Promise.all([
      prisma.usuario.count(),
      prisma.evento.count(),
      prisma.usuario.groupBy({ by: ['countryCode'], _count: true }).then((r) => r.length),
    ])

    return Response.json({
      totalUsuarios,
      totalEventos,
      paises,
    })
  } catch {
    return Response.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }
}

import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/authApi'

export async function GET(req: Request) {
  try {
    const autorizado = await verifyAdmin(req)
    if (!autorizado) {
      const token = req.headers.get('Authorization')
      return Response.json({ error: 'No autorizado' }, { status: token ? 403 : 401 })
    }
    const [
      totalUsuarios,
      usuariosPorRol,
      totalEventos,
      eventosPorTipo,
      proximosEventos,
      totalEntradas,
      ingresos,
      totalPages,
      eventosRecientes,
      usuariosRecientes,
    ] = await Promise.all([
      prisma.usuario.count(),
      prisma.usuario.groupBy({ by: ['rol'], _count: true }),
      prisma.evento.count(),
      prisma.evento.groupBy({ by: ['tipo'], _count: true }),
      prisma.evento.count({ where: { fecha: { gte: new Date() } } }),
      prisma.entrada.count(),
      prisma.pago.aggregate({ _sum: { monto: true }, where: { estado: 'APROBADO' } }),
      prisma.pageContent.count(),
      prisma.evento.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, titulo: true, tipo: true, fecha: true, createdAt: true },
      }),
      prisma.usuario.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          rol: true,
          createdAt: true,
        },
      }),
    ])

    const ingresosTotales = ingresos._sum?.monto ?? 0

    return Response.json({
      totalUsuarios,
      usuariosPorRol,
      totalEventos,
      eventosPorTipo,
      proximosEventos,
      totalEntradas,
      ingresosTotales,
      totalPages,
      eventosRecientes,
      usuariosRecientes,
    })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }
}

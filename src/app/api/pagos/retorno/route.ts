import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const referencia = req.nextUrl.searchParams.get('referencia')

  if (!referencia) {
    return NextResponse.redirect(new URL('/eventos?pago=error', req.url))
  }

  try {
    const pago = await prisma.pago.findUnique({
      where: { referencia },
      select: { estado: true },
    })

    if (!pago) {
      return NextResponse.redirect(new URL('/eventos?pago=error', req.url))
    }

    if (pago.estado === 'APROBADO') {
      return NextResponse.redirect(new URL('/eventos?pago=exitoso', req.url))
    }

    if (pago.estado === 'RECHAZADO' || pago.estado === 'EXPIRADO') {
      return NextResponse.redirect(new URL('/eventos?pago=fallido', req.url))
    }

    return NextResponse.redirect(new URL('/eventos?pago=pendiente', req.url))
  } catch {
    return NextResponse.redirect(new URL('/eventos?pago=error', req.url))
  }
}

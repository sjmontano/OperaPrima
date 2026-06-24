import { prisma } from '@/lib/prisma'
import { verifyWebhookSignature } from '@/lib/wompi'
import { NextRequest } from 'next/server'
import type { EstadoPago } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signatureHeader = req.headers.get('x-event-signature') ?? ''

    if (!verifyWebhookSignature(rawBody, signatureHeader)) {
      return Response.json({ error: 'Firma inválida' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)

    const evento = payload.event
    if (evento !== 'transaction.updated') {
      return Response.json({ received: true })
    }

    const transactionData = payload.data?.transaction
    if (!transactionData?.id) {
      return Response.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const txnId: string = transactionData.id
    const wompiStatus: string = transactionData.status

    const pago = await prisma.pago.findUnique({
      where: { transaccionWompiId: txnId },
      include: { entrada: true },
    })

    if (!pago) {
      return Response.json({ error: 'Pago no encontrado' }, { status: 404 })
    }

    const statusMap: Record<string, EstadoPago> = {
      APPROVED: 'APROBADO',
      DECLINED: 'RECHAZADO',
      VOIDED: 'REEMBOLSADO',
      ERROR: 'RECHAZADO',
    }

    const nuevoEstado: EstadoPago = statusMap[wompiStatus] ?? 'PENDIENTE'

    await prisma.$transaction(async (tx) => {
      await tx.pago.update({
        where: { id: pago.id },
        data: { estado: nuevoEstado },
      })

      if (nuevoEstado === 'RECHAZADO' || nuevoEstado === 'REEMBOLSADO') {
        await tx.evento.update({
          where: { id: pago.entrada.eventoId },
          data: { cuposDisponibles: { increment: 1 } },
        })
      }

      if (nuevoEstado === 'APROBADO') {
        const evento = await tx.evento.findUnique({
          where: { id: pago.entrada.eventoId },
          select: { cuposDisponibles: true },
        })

        if (evento && evento.cuposDisponibles <= 0) {
          await tx.evento.update({
            where: { id: pago.entrada.eventoId },
            data: { agotado: true },
          })
        }
      }
    })

    return Response.json({ received: true })
  } catch (error) {
    console.error('webhook error:', error)
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}

import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.text()

  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return new NextResponse('Firma inválida', {
      status: 400,
    })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new NextResponse('Webhook inválido', {
      status: 400,
    })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  const stripeSessionId = session.id
  const paymentIntentId = session.payment_intent?.toString() ?? null

  const usuarioId = session.metadata?.usuarioId
  const eventoId = session.metadata?.eventoId
  const cantidad = Number(session.metadata?.cantidad ?? '1')
  const precio = Number(session.metadata?.precio ?? '0')

  if (!usuarioId || !eventoId) {
    return new NextResponse('Metadata incompleta', {
      status: 400,
    })
  }

  // Evitar procesar dos veces la misma compra
  const existente = await prisma.pago.findUnique({
    where: {
      stripeSessionId,
    },
  })

  if (existente) {
    return NextResponse.json({ received: true })
  }

  await prisma.$transaction(async (tx) => {
    const evento = await tx.evento.findUnique({
      where: {
        id: eventoId,
      },
    })

    if (!evento) {
      throw new Error('Evento no encontrado')
    }

    if (evento.cuposDisponibles < cantidad) {
      throw new Error('No hay suficientes cupos')
    }

    const pago = await tx.pago.create({
      data: {
        referencia: crypto.randomUUID(),
        stripeSessionId,
        stripePaymentIntentId: paymentIntentId,
        monto: precio * cantidad,
        estado: 'APROBADO',
      },
    })

    for (let i = 0; i < cantidad; i++) {
      await tx.entrada.create({
        data: {
          usuarioId,
          eventoId,
          pagoId: pago.id,
        },
      })
    }

    const nuevosCupos = evento.cuposDisponibles - cantidad

    await tx.evento.update({
      where: {
        id: eventoId,
      },
      data: {
        cuposDisponibles: nuevosCupos,
        agotado: nuevosCupos <= 0,
      },
    })
  })

  return NextResponse.json({ received: true })
}

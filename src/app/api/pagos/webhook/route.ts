import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const body = await req.text()

  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return new NextResponse('Firma no encontrada', {
      status: 400,
    })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error(err)

    return new NextResponse('Firma inválida', {
      status: 400,
    })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      console.log('✅ Pago recibido')

      const session = event.data.object as Stripe.Checkout.Session

      console.log(session.id)
      console.log(session.metadata)

      break
  }

  return NextResponse.json({
    received: true,
  })
}

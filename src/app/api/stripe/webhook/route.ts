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
  } catch (err) {
    return new NextResponse('Webhook inválido', {
      status: 400,
    })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  console.log(session.id)
  console.log(session.payment_intent)
  console.log(session.metadata)

  return NextResponse.json({ received: true })
}

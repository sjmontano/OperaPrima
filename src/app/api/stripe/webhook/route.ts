import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.text()

  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return new NextResponse('No signature', {
      status: 400,
    })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error(err)

    return new NextResponse('Invalid signature', {
      status: 400,
    })
  }

  return NextResponse.json({
    received: true,
  })
}

import type Stripe from 'stripe'
import { stripe } from './client'

export function constructWebhookEvent(payload: string, signature: string): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!)
}

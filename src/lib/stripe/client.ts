import Stripe from 'stripe'

// Solo se usa en el servidor — nunca importar en componentes cliente
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

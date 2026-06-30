import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  try {
    const { eventoId, cantidad } = await req.json()

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        supabaseId: user.id,
      },
    })

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const evento = await prisma.evento.findUnique({
      where: {
        id: eventoId,
      },
    })

    if (!evento) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',

      payment_method_types: ['card'],

      line_items: [
        {
          quantity: cantidad,
          price_data: {
            currency: 'cop',
            unit_amount: evento.precio * 100,
            product_data: {
              name: evento.titulo,
              description: evento.descripcion,
              images: evento.imagen ? [evento.imagen] : [],
            },
          },
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,

      metadata: {
        usuarioId: usuario.id,
        eventoId: evento.id,
        cantidad: cantidad.toString(),
      },
    })

    return NextResponse.json({
      url: session.url,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

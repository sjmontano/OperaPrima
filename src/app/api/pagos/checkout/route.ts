import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'
import { createTransaction, generateReference, getAcceptanceToken } from '@/lib/wompi'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return Response.json({ error: 'Debes iniciar sesión' }, { status: 401 })
    }

    const { eventoId } = await req.json()
    if (!eventoId || typeof eventoId !== 'string') {
      return Response.json({ error: 'eventoId requerido' }, { status: 400 })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { supabaseId: session.user.id },
    })

    if (!usuario) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const evento = await prisma.evento.findUnique({
      where: { id: eventoId },
    })

    if (!evento) {
      return Response.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    if (evento.cuposDisponibles <= 0) {
      return Response.json({ error: 'Evento agotado' }, { status: 400 })
    }

    if (evento.precio <= 0) {
      return Response.json({ error: 'Evento gratuito — no necesita pago' }, { status: 400 })
    }

    const existing = await prisma.entrada.findFirst({
      where: {
        usuarioId: usuario.id,
        eventoId: evento.id,
      },
      include: { pago: true },
    })

    if (existing) {
      if (existing.pago?.estado === 'APROBADO') {
        return Response.json({ error: 'Ya tienes una entrada para este evento' }, { status: 409 })
      }

      if (existing.pago?.estado === 'PENDIENTE') {
        return Response.json(
          { error: 'Ya tienes un pago pendiente para este evento' },
          { status: 409 }
        )
      }
    }

    const referencia = generateReference(evento.id, usuario.id)
    const baseUrl = req.nextUrl.origin
    const acceptanceToken = await getAcceptanceToken()

    const wompi = await createTransaction({
      amountInCents: evento.precio,
      reference: referencia,
      customerEmail: usuario.email,
      redirectUrl: `${baseUrl}/api/pagos/retorno?referencia=${referencia}`,
      webhookUrl: `${baseUrl}/api/pagos/webhook`,
      acceptanceToken,
    })

    await prisma.$transaction([
      prisma.entrada.create({
        data: {
          usuarioId: usuario.id,
          eventoId: evento.id,
          pago: {
            create: {
              referencia,
              transaccionWompiId: wompi.id,
              monto: evento.precio,
              estado: 'PENDIENTE',
            },
          },
        },
      }),
      prisma.evento.update({
        where: { id: evento.id },
        data: { cuposDisponibles: { decrement: 1 } },
      }),
    ])

    return Response.json({ url: wompi.url, referencia })
  } catch (error) {
    console.error('checkout error:', error)
    return Response.json({ error: 'Error al procesar el pago' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseServer'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

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

    const entrada = await prisma.entrada.findUnique({
      where: {
        id,
      },
      include: {
        evento: true,
      },
    })

    if (!entrada) {
      return NextResponse.json({ error: 'Entrada no encontrada' }, { status: 404 })
    }

    // Seguridad: solo el dueño puede ver su QR
    if (entrada.usuarioId !== usuario.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    if (!entrada.qrCode) {
      return NextResponse.json({ error: 'La entrada no tiene QR' }, { status: 400 })
    }

    const qr = await QRCode.toDataURL(entrada.qrCode)

    return NextResponse.json({
      qr,
      usada: entrada.usada,
      usadaEn: entrada.usadaEn,
      createdAt: entrada.createdAt,
      evento: {
        titulo: entrada.evento.titulo,
        descripcion: entrada.evento.descripcion,
        fecha: entrada.evento.fecha,
        ubicacion: entrada.evento.ubicacion,
        precio: entrada.evento.precio,
        categoria: entrada.evento.categoria,
        disciplinas: entrada.evento.disciplinas,
        imagen: entrada.evento.imagen,
        cuposTotales: entrada.evento.cuposTotales,
        cuposDisponibles: entrada.evento.cuposDisponibles,
      },
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

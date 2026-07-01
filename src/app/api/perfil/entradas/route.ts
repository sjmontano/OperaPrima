import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseServer'

export async function GET() {
  try {
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

    const entradas = await prisma.entrada.findMany({
      where: {
        usuarioId: usuario.id,
      },
      include: {
        evento: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(entradas)
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

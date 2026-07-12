import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookieHeader = req.headers.get('cookie') ?? ''
            return cookieHeader
              .split(';')
              .filter(Boolean)
              .map((c) => {
                const [name, ...rest] = c.trim().split('=')
                return { name, value: rest.join('=') }
              })
          },
          setAll() {
            // read-only — no necesitamos setear cookies acá
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({}, { status: 401 })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { supabaseId: user.id },
      include: {
        perfil: {
          include: {
            redes: true,
          },
        },
      },
    })

    return NextResponse.json({ usuario })
  } catch {
    return NextResponse.json({}, { status: 401 })
  }
}

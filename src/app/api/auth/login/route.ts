import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const cookieContainer = NextResponse.next()
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
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieContainer.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    })

    if (error) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 401 })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { supabaseId: data.user.id },
      include: { perfil: true },
    })

    const jsonResponse = NextResponse.json({ session: data.session, usuario })

    for (const cookie of cookieContainer.cookies.getAll()) {
      jsonResponse.cookies.set(cookie.name, cookie.value)
    }

    return jsonResponse
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

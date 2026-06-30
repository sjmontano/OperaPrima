import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.redirect(new URL('/?error=no_code', origin))
    }

    let destination = '/'
    const supabaseResponse = NextResponse.next()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('exchangeCodeForSession error:', error)
      return NextResponse.redirect(new URL('/?error=auth_exchange', origin))
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/?error=no_user', origin))
    }

    const exists = await prisma.usuario.findUnique({
      where: { supabaseId: user.id },
    })

    if (!exists) {
      try {
        await prisma.usuario.create({
          data: {
            supabaseId: user.id,
            email: user.email ?? '',
            username: user.email?.split('@')[0] ?? 'user',
            firstName: user.user_metadata?.full_name ?? '',
            lastName: '',
            rol: 'USUARIO',
            countryCode: '',
            phone: '',
            perfil: { create: {} },
          },
        })
      } catch (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.redirect(new URL('/?error=create_failed', origin))
      }

      destination = '/onboarding'
    }

    const redirectResponse = NextResponse.redirect(new URL(destination, origin))
    for (const cookie of supabaseResponse.cookies.getAll()) {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    }

    return redirectResponse
  } catch (err) {
    console.error('Callback error:', err)
    return NextResponse.redirect(new URL('/?error=unexpected', request.url))
  }
}

import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/

export async function PATCH(req: Request) {
  try {
    const token = req.headers.get('Authorization')

    if (!token) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const accessToken = token.replace('Bearer ', '')

    const { data, error } = await supabase.auth.getUser(accessToken)

    if (error || !data.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { username } = body

    if (!username || !USERNAME_REGEX.test(username)) {
      return Response.json(
        { error: 'Username inválido — usa 3-20 caracteres alfanuméricos o guion bajo' },
        { status: 400 }
      )
    }

    const existing = await prisma.usuario.findFirst({
      where: {
        username,
        supabaseId: { not: data.user.id },
      },
    })

    if (existing) {
      return Response.json({ error: 'Este username ya está en uso' }, { status: 409 })
    }

    const updated = await prisma.usuario.update({
      where: { supabaseId: data.user.id },
      data: { username },
    })

    return Response.json({ ok: true, username: updated.username })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al actualizar username' }, { status: 500 })
  }
}

import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization')
    if (!token) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const accessToken = token.replace('Bearer ', '')
    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken)
    if (authError || !authData.user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { supabaseId: authData.user.id },
      include: { perfil: true },
    })
    if (!usuario?.perfil) {
      return Response.json({ error: 'Perfil no encontrado' }, { status: 404 })
    }

    const body = await req.json()
    const { label, handle, href } = body

    if (!label || !href) {
      return Response.json({ error: 'label y href son requeridos' }, { status: 400 })
    }

    const social = await prisma.social.create({
      data: {
        perfilId: usuario.perfil.id,
        label,
        handle: handle ?? '',
        href,
      },
    })

    return Response.json({ ok: true, social })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al crear red social' }, { status: 500 })
  }
}

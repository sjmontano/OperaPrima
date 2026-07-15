import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function PATCH(req: Request) {
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
    })
    if (!usuario) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const body = await req.json()
    const { avatar, banner, artisticName, realName, bio, tags, interests } = body

    const updated = await prisma.perfil.update({
      where: { usuarioId: usuario.id },
      data: {
        ...(avatar !== undefined && { avatar }),
        ...(banner !== undefined && { banner }),
        ...(artisticName !== undefined && { artisticName }),
        ...(realName !== undefined && { realName }),
        ...(bio !== undefined && { bio }),
        ...(tags !== undefined && { tags }),
        ...(interests !== undefined && { interests }),
      },
    })

    return Response.json({ ok: true, perfil: updated })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al actualizar perfil' }, { status: 500 })
  }
}

export async function GET(req: Request) {
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
      include: { perfil: { include: { redes: true } } },
    })
    if (!usuario) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return Response.json({ usuario })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener perfil' }, { status: 500 })
  }
}

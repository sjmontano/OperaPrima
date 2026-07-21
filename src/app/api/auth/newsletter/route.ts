import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'

export async function PATCH(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    if (!user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { newsletter } = body

    if (typeof newsletter !== 'boolean') {
      return Response.json({ error: 'newsletter debe ser boolean' }, { status: 400 })
    }

    await prisma.usuario.update({
      where: { supabaseId: user.id },
      data: { newsletter },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al actualizar preferencia' }, { status: 500 })
  }
}

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'

export async function GET(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const usuario = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
    if (!usuario || usuario.rol !== 'ADMIN') {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    const testimonials = await prisma.testimonial.findMany({
      include: {
        usuario: {
          include: { perfil: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return Response.json({ testimonials })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener testimonios' }, { status: 500 })
  }
}

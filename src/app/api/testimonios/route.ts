import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'

export async function GET() {
  try {
    const testimonios = await prisma.testimonial.findMany({
      where: { active: true },
      include: {
        usuario: {
          include: { perfil: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return Response.json({ testimonios })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener testimonios' }, { status: 500 })
  }
}

export async function POST(req: Request) {
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
    if (!usuario) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const { text } = await req.json()
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return Response.json({ error: 'El texto del testimonio es requerido' }, { status: 400 })
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        text: text.trim(),
        usuarioId: usuario.id,
      },
      include: {
        usuario: {
          include: { perfil: true },
        },
      },
    })

    return Response.json({ testimonial }, { status: 201 })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al crear testimonio' }, { status: 500 })
  }
}

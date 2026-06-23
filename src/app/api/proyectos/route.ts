import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'

export async function GET() {
  try {
    const proyectos = await prisma.proyecto.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return Response.json({ proyectos })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener proyectos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    let usuarioId: string | null = null
    let tipo = 'COMUNIDAD'

    if (token) {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser(token)
      if (user) {
        const usuario = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
        if (usuario) {
          usuarioId = usuario.id
          tipo = 'COMUNIDAD'
        }
      }
    } else {
      tipo = 'ENTIDAD'
    }

    const body = await req.json()
    const proyecto = await prisma.proyecto.create({
      data: {
        tipo: tipo as 'COMUNIDAD' | 'ENTIDAD',
        nombre: body.nombre,
        representante: body.representante,
        descripcion: body.descripcion,
        queBuscan: body.queBuscan,
        requisitos: body.requisitos,
        proceso: body.proceso,
        imagen: body.imagen ?? null,
        contacto: body.contacto,
        disciplinas: body.disciplinas ?? [],
        ubicacion: body.ubicacion,
        destacado: false,
        fechaLimite: new Date(body.fechaLimite),
        usuarioId,
      },
    })

    return Response.json({ proyecto })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al crear el proyecto' }, { status: 500 })
  }
}

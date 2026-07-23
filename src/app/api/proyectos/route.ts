import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'
import { Rol } from '@prisma/client'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const destacado = searchParams.get('destacado')

    const where = destacado === 'true' ? { destacado: true } : {}

    const proyectos = await prisma.proyecto.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        usuario: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            perfil: { select: { avatar: true } },
          },
        },
      },
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

    const usuario = await prisma.usuario.findUnique({ where: { supabaseId: user.id } })
    if (!usuario || usuario.rol !== Rol.ADMIN) {
      return Response.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()
    const proyecto = await prisma.proyecto.create({
      data: {
        tipo: 'ENTIDAD',
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
        usuarioId: usuario.id,
      },
    })

    return Response.json({ proyecto })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al crear el proyecto' }, { status: 500 })
  }
}

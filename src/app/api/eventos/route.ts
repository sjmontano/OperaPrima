import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'
import { Prisma, Rol } from '@prisma/client'

async function getUsuario(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  console.log('token:', token)
  if (!token) return null

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser(token)
  if (!user) return null

  return prisma.usuario.findUnique({ where: { supabaseId: user.id } })
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const rolParam = searchParams.get('rol')
    const tipoParam = searchParams.get('tipo')

    const usuario = await getUsuario(req)
    console.log('usuario:', usuario)
    const isAuthenticated = !!usuario

    const where: Prisma.EventoWhereInput = {}

    const rawWhere: Record<string, unknown> = {}

    if (tipoParam) {
      rawWhere.tipo = tipoParam
    }

    if (rolParam) {
      rawWhere.usuario = { rol: rolParam as Rol }
    }

    console.log('isAuthenticated:', isAuthenticated)
    if (!isAuthenticated) {
      rawWhere.usuario = { ...((rawWhere.usuario as object) || {}), rol: { not: Rol.USUARIO } }
    }

    const eventos = await prisma.evento.findMany({
      where: rawWhere as Prisma.EventoWhereInput,
      include: {
        usuario: { include: { perfil: true } },
      },
      orderBy: { fecha: 'asc' },
    })

    return Response.json({ eventos })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al obtener eventos' }, { status: 500 })
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
    if (!usuario) {
      return Response.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    const body = await req.json()
    const tipo = body.tipo || 'COMUNIDAD'

    if (usuario.rol === Rol.USUARIO && tipo !== 'COMUNIDAD') {
      return Response.json(
        { error: 'No autorizado para crear este tipo de evento' },
        { status: 403 }
      )
    }

    if (usuario.rol === Rol.MENTOR) {
      return Response.json({ error: 'Los mentores no pueden crear eventos' }, { status: 403 })
    }

    if (!body.titulo?.trim()) {
      return Response.json({ error: 'El título es obligatorio' }, { status: 400 })
    }
    if (!body.descripcion?.trim()) {
      return Response.json({ error: 'La descripción es obligatoria' }, { status: 400 })
    }
    if (!body.categoria?.trim()) {
      return Response.json({ error: 'La categoría es obligatoria' }, { status: 400 })
    }
    if (!body.fecha) {
      return Response.json({ error: 'La fecha es obligatoria' }, { status: 400 })
    }
    if (!body.ubicacion?.trim()) {
      return Response.json({ error: 'La ubicación es obligatoria' }, { status: 400 })
    }
    const precioNumerico = Number(body.precio)
    if (isNaN(precioNumerico) || precioNumerico < 0) {
      return Response.json({ error: 'El precio no es válido' }, { status: 400 })
    }
    const cupos = Number(body.cuposTotales)
    if (isNaN(cupos) || cupos < 1) {
      return Response.json({ error: 'Debe haber al menos un cupo' }, { status: 400 })
    }
    if (body.urlPago) {
      try {
        new URL(body.urlPago)
      } catch {
        return Response.json({ error: 'La URL de pago no es válida' }, { status: 400 })
      }
    }

    const evento = await prisma.evento.create({
      data: {
        titulo: body.titulo.trim(),
        descripcion: body.descripcion.trim(),
        categoria: body.categoria.trim(),
        tipo,
        disciplinas: body.disciplinas ?? [],
        fecha: new Date(body.fecha),
        ubicacion: body.ubicacion.trim(),
        imagen: body.imagen || null,
        urlPago: body.urlPago || null,
        precio: precioNumerico,
        cuposTotales: cupos,
        cuposDisponibles: cupos,
        usuarioId: usuario.id,
        likes: 0,
        comentarios: 0,
        vistas: 0,
        agotado: false,
      },
      include: {
        usuario: { include: { perfil: true } },
      },
    })

    return Response.json({ evento })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al crear el evento' }, { status: 500 })
  }
}

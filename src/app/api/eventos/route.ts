import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabaseClient'

export async function GET() {

  try {

    const eventos = await prisma.evento.findMany({

      where: {
        usuario: {
          rol: 'MENTOR'
        }

      },

      include: {
        usuario: {
          include: {
            perfil: true
          }
        }
      },

      orderBy: {
        fecha: 'asc'
      }
    })

    return Response.json({
      eventos
    })

  } catch (error) {

    console.error(error)

    return Response.json(
      { error: 'Error al obtener eventos' },
      { status: 500 }
    )

  }

}

export async function POST(req: Request) {

  try {

    const token =
      req.headers
        .get("Authorization")
        ?.replace("Bearer ", "");

    if (!token) {

      return Response.json(
        { error: "No autorizado" },
        { status: 401 }
      );

    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {

      return Response.json(
        { error: "No autorizado" },
        { status: 401 }
      );

    }

    const usuario = await prisma.usuario.findUnique({

      where: {

        supabaseId: user.id,

      },

    });

    if (!usuario) {

      return Response.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );

    }

    if (usuario.rol !== "MENTOR") {

      return Response.json(
        { error: "No autorizado" },
        { status: 403 }
      );

    }

    const body = await req.json();

    const evento = await prisma.evento.create({

  data: {

    titulo: body.titulo,

    descripcion: body.descripcion,

    categoria: body.categoria,

    fecha: new Date(body.fecha),

    ubicacion: body.ubicacion,

    imagen: body.imagen,

    precio: body.precio,

    usuarioId: usuario.id,

    likes: 0,

    comentarios: 0,

    vistas: 0,

    agotado: false,

  },

  include: {

    usuario: {

      include: {

        perfil: true

      }

    }

  }

})

return Response.json({
  evento
})

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: "Error al crear el evento" },
      { status: 500 }
    );

  }

}
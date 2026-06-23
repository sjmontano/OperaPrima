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

    const {
      titulo,
      descripcion,
      categoria,
      fecha,
      ubicacion,
      imagen,
      precio,
      cuposTotales,
      urlPago,
    } = body;

    // Validaciones

    if (!titulo?.trim()) {

      return Response.json(
        { error: "El título es obligatorio" },
        { status: 400 }
      );

    }

    if (!descripcion?.trim()) {

      return Response.json(
        { error: "La descripción es obligatoria" },
        { status: 400 }
      );

    }

    if (!categoria?.trim()) {

      return Response.json(
        { error: "La categoría es obligatoria" },
        { status: 400 }
      );

    }

    if (!fecha) {

      return Response.json(
        { error: "La fecha es obligatoria" },
        { status: 400 }
      );

    }

    if (!ubicacion?.trim()) {

      return Response.json(
        { error: "La ubicación es obligatoria" },
        { status: 400 }
      );

    }

    const precioNumerico = Number(precio);

    if (isNaN(precioNumerico) || precioNumerico < 0) {

      return Response.json(
        { error: "El precio no es válido" },
        { status: 400 }
      );

    }

    const cupos = Number(cuposTotales);

    if (isNaN(cupos) || cupos < 1) {

      return Response.json(
        { error: "Debe haber al menos un cupo" },
        { status: 400 }
      );

    }

    // Validar URL de pago si existe

    if (urlPago) {

      try {

        new URL(urlPago);

      } catch {

        return Response.json(
          { error: "La URL de pago no es válida" },
          { status: 400 }
        );

      }

    }

    const evento = await prisma.evento.create({

      data: {

        titulo: titulo.trim(),

        descripcion: descripcion.trim(),

        categoria: categoria.trim(),

        fecha: new Date(fecha),

        ubicacion: ubicacion.trim(),

        imagen: imagen || null,

        precio: precioNumerico,

        urlPago: urlPago || null,

        cuposTotales: cupos,

        cuposDisponibles: cupos,

        usuarioId: usuario.id,

        likes: 0,

        comentarios: 0,

        vistas: 0,

        agotado: false,

      },

      include: {

        usuario: {

          include: {

            perfil: true,

          },

        },

      },

    });

    return Response.json({

      evento,

    });

  } catch (error) {

    console.error(error);

    return Response.json(

      { error: "Error al crear el evento" },

      { status: 500 }

    );

  }

}
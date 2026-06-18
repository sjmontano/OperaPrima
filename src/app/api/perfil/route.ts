import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    console.log(body)

    const { usuarioId, avatar, banner } = body;

    if (!usuarioId) {
      return Response.json(
        { error: "usuarioId required" },
        { status: 400 }
      );
    }

    const updated = await prisma.perfil.update({
      where: {
        usuarioId,
      },
      data: {
        ...(avatar && { avatar }),
        ...(banner && { banner }),
      },
    });

    return Response.json({
      ok: true,
      perfil: updated,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
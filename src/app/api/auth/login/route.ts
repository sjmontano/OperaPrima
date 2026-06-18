import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: body.email,
        password: body.password,
      });

    if (error) {
  console.log(error);

  return Response.json(
    {
      error: error.message,
      code: error.code,
    },
    { status: 401 }
  );
}

    const usuario =
      await prisma.usuario.findUnique({
        where: {
          supabaseId: data.user.id,
        },
        include: {
          perfil: true,
        },
      });

    return Response.json({
      session: data.session,
      usuario,
    });
  } catch {
    return Response.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
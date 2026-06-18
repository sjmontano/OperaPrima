import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {

  const token =
    req.headers.get("Authorization");

  if (!token) {
    return Response.json(
      {},
      { status: 401 }
    );
  }

  const accessToken =
    token.replace("Bearer ", "");

  const { data, error } =
    await supabase.auth.getUser(
      accessToken
    );

  if (error) {
    return Response.json(
      {},
      { status: 401 }
    );
  }

  const usuario =
    await prisma.usuario.findUnique({
      where: {
        supabaseId: data.user.id,
      },
      include: {
    perfil: {
      include: {
        redes: true
      }
    }
  }
    });

  return Response.json({
    usuario,
  });
}
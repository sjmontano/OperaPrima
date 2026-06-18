import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {

  const body = await req.json();

  const supabase = await createClient();
  console.log(supabase)
   
  const authResult =
    await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
    });

  if (authResult.error) {
    return Response.json(
      { error: authResult.error.message },
      { status: 400 }
    );
  }

  const usuario =
    await prisma.usuario.create({
      data: {
        supabaseId: authResult.data.user.id,

        username: body.username.trim(),

        email: body.email.trim().toLowerCase(),

        firstName: body.firstName.trim(),

        lastName: body.lastName.trim(),

        countryCode: body.countryCode,

        phone: body.phone.trim(),

        birthDate: body.birthDate
          ? new Date(body.birthDate)
          : null,

        gender: body.gender,

        rol: body.rol,

        perfil: {
          create: {}
        }
      },
      include: {
        perfil: true
      }
    });

  return Response.json(usuario);
}
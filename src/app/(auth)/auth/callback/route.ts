import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabaseServer";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  const supabase = await createClient();

  await supabase.auth.exchangeCodeForSession(code);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }
  console.log(user.user_metadata)

  const exists = await prisma.usuario.findUnique({
    where: {
      supabaseId: user.id,
    },
  });

  if (!exists) {
    await prisma.usuario.create({
      data: {
        supabaseId: user.id,

        email: user.email ?? "",

        username:
          user.email?.split("@")[0] ?? "user",

        firstName:
          user.user_metadata?.full_name ?? "",

        lastName: "",

        rol: "USUARIO",
        countryCode: "",
        phone: "",

        perfil: {
          create: {},
        },
      },
    });
  }

  return NextResponse.redirect(
    new URL("/", request.url)
  );
}
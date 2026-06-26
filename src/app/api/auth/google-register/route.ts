import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { id, email, fullName } = body

    const exists = await prisma.usuario.findUnique({
      where: {
        supabaseId: id,
      },
    })

    if (!exists) {
      await prisma.usuario.create({
        data: {
          supabaseId: id,

          email,

          username: email.split('@')[0],

          firstName: fullName ?? '',

          lastName: '',

          countryCode: 'ES',

          phone: '',

          rol: 'USUARIO',

          perfil: {
            create: {},
          },
        },
      })
    }

    return Response.json({ ok: true })
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error,
      },
      {
        status: 500,
      }
    )
  }
}

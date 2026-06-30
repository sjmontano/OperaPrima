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
      const base = email.split('@')[0]
      let username = base
      let suffix = 1
      while (await prisma.usuario.findUnique({ where: { username } })) {
        username = `${base}${suffix}`
        suffix++
      }

      await prisma.usuario.create({
        data: {
          supabaseId: id,

          email,

          username,

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

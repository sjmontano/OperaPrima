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

      const existing = await prisma.usuario.findMany({
        where: { username: { startsWith: base } },
        select: { username: true },
      })
      const maxSuffix = existing.reduce((max, u) => {
        const s = u.username === base ? 0 : Number.parseInt(u.username.slice(base.length), 10)
        return Number.isNaN(s) ? max : Math.max(max, s)
      }, -1)
      const username = maxSuffix === -1 ? base : `${base}${maxSuffix + 1}`

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

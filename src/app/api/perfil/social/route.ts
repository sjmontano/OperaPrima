import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { perfilId, label, handle, href } = body

    if (!perfilId || !label || !href) {
      return Response.json({ error: 'perfilId, label y href son requeridos' }, { status: 400 })
    }

    const social = await prisma.social.create({
      data: {
        perfilId,
        label,
        handle: handle ?? '',
        href,
      },
    })

    return Response.json({ ok: true, social })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Error al crear red social' }, { status: 500 })
  }
}

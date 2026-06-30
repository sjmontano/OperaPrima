import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { usuarioId, avatar, banner, artisticName, realName, bio, tags, interests } = body

    if (!usuarioId) {
      return Response.json({ error: 'usuarioId required' }, { status: 400 })
    }

    const updated = await prisma.perfil.update({
      where: {
        usuarioId,
      },
      data: {
        ...(avatar !== undefined && { avatar }),
        ...(banner !== undefined && { banner }),
        ...(artisticName !== undefined && { artisticName }),
        ...(realName !== undefined && { realName }),
        ...(bio !== undefined && { bio }),
        ...(tags !== undefined && { tags }),
        ...(interests !== undefined && { interests }),
      },
    })

    return Response.json({
      ok: true,
      perfil: updated,
    })
  } catch (error) {
    console.error(error)

    return Response.json({ error: 'Update failed' }, { status: 500 })
  }
}

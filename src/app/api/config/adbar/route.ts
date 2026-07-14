import { prisma } from '@/lib/prisma'
import { createServerClient } from '@supabase/ssr'
import { Rol } from '@prisma/client'

function parseCookies(cookieHeader: string | null): Map<string, string> {
  const map = new Map<string, string>()
  if (!cookieHeader) return map
  for (const pair of cookieHeader.split(';')) {
    const eq = pair.indexOf('=')
    if (eq === -1) continue
    map.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim())
  }
  return map
}

async function getAdmin(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  const cookieMap = parseCookies(req.headers.get('Cookie'))
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => Array.from(cookieMap.entries()).map(([name, value]) => ({ name, value })),
        setAll: () => {},
      },
    }
  )

  let userId: string | null = null
  if (token) {
    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    if (user) userId = user.id
  }
  if (!userId) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) userId = user.id
  }
  if (!userId) return null

  const usuario = await prisma.usuario.findUnique({ where: { supabaseId: userId } })
  return usuario?.rol === Rol.ADMIN ? usuario : null
}

export async function GET() {
  const config = await prisma.siteConfig.findUnique({ where: { key: 'adbar' } })
  return Response.json(
    config?.value || {
      icon: '✦',
      text: 'Convocatoria abierta — Residencia artística Mayo 2026',
      href: '/eventos',
      bgColor: '#E63946',
    }
  )
}

export async function PUT(req: Request) {
  const admin = await getAdmin(req)
  if (!admin) {
    return Response.json({ error: 'No autorizado' }, { status: 403 })
  }

  const body = await req.json()
  const { icon, text, href, bgColor } = body

  const value = { icon, text, href, bgColor }

  await prisma.siteConfig.upsert({
    where: { key: 'adbar' },
    create: { key: 'adbar', value },
    update: { value },
  })

  return Response.json({ value })
}

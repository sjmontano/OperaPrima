import { prisma } from '@/lib/prisma'
import { createServerClient } from '@supabase/ssr'

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

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const cookieHeader = req.headers.get('Cookie') || ''
  const authHeader = req.headers.get('Authorization') || ''
  const cookieMap = parseCookies(cookieHeader)
  const allCookieNames = Array.from(cookieMap.keys())

  // Ver cookie sb-*-auth-token
  const sbCookies = allCookieNames.filter((n) => n.includes('auth-token'))

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

  // 1. Probar con Bearer token si existe
  let tokenUser: { id: string; email?: string } | null = null
  const token = authHeader.replace('Bearer ', '')
  if (token && token !== authHeader) {
    const { data } = await supabase.auth.getUser(token)
    tokenUser = data.user ? { id: data.user.id, email: data.user.email } : null
  }

  // 2. Probar con cookies
  let cookieUser: { id: string; email?: string } | null = null
  const { data: cookieData } = await supabase.auth.getUser()
  cookieUser = cookieData.user ? { id: cookieData.user.id, email: cookieData.user.email } : null

  // 3. Probar conexión a DB
  let dbOk = false
  try {
    await prisma.$queryRaw`SELECT 1`
    dbOk = true
  } catch {
    dbOk = false
  }

  // 4. Buscar admin en DB (si hay usuario)
  let adminInDb = false
  const userId = tokenUser?.id || cookieUser?.id
  if (userId) {
    const u = await prisma.usuario.findUnique({
      where: { supabaseId: userId },
      select: { rol: true },
    })
    adminInDb = u?.rol === 'ADMIN'
  }

  return Response.json({
    cookies_encontradas: allCookieNames,
    sb_auth_cookies: sbCookies,
    token_presente: !!(token && token !== authHeader),
    token_primeros_20: token && token !== authHeader ? token.slice(0, 20) : null,
    auth_por_token: tokenUser,
    auth_por_cookie: cookieUser,
    db_conexion_ok: dbOk,
    admin_en_db: adminInDb,
  })
}

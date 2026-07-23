import { createClient } from '@supabase/supabase-js'
import { prisma } from './prisma'
import { Rol } from '@prisma/client'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function verifyToken(req: Request) {
  const token = req.headers.get('Authorization')
  if (!token) return null

  const { data, error } = await supabase.auth.getUser(token.replace('Bearer ', ''))
  if (error || !data?.user) return null

  return data.user
}

export async function verifyAdmin(req: Request) {
  const supabaseUser = await verifyToken(req)
  if (!supabaseUser) return null

  const usuario = await prisma.usuario.findUnique({
    where: { supabaseId: supabaseUser.id },
  })
  if (!usuario || usuario.rol !== Rol.ADMIN) return null

  return usuario
}

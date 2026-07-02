import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

export function createClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

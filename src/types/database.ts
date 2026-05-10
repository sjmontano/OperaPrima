// Este archivo es generado automáticamente por Supabase CLI.
// Ejecutar: npx supabase gen types typescript --local > src/types/database.ts
// NO editar manualmente.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          membership: 'free' | 'premium'
          bio: string | null
          discipline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          membership?: 'free' | 'premium'
          bio?: string | null
          discipline?: string | null
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          membership?: 'free' | 'premium'
          bio?: string | null
          discipline?: string | null
        }
      }
      mentors: {
        Row: {
          id: string
          slug: string
          name: string
          bio: string
          specialty: string
          avatar_url: string | null
          price_per_session: number
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['mentors']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['mentors']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          mentor_id: string
          starts_at: string
          ends_at: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          stripe_payment_intent_id: string | null
          price: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

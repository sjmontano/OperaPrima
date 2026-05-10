// Tipos de dominio de Opera Prima
// Los tipos de DB se importan desde @/types/database (generado por Supabase CLI)

export type Mentor = {
  id: string
  slug: string
  name: string
  bio: string
  specialty: string
  avatar_url: string | null
  price_per_session: number
  is_active: boolean
}

export type Booking = {
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

export type UserProfile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  membership: 'free' | 'premium'
  bio: string | null
  discipline: string | null
}

export type Event = {
  id: string
  title: string
  slug: string
  description: string
  starts_at: string
  ends_at: string
  location: string | null
  is_online: boolean
  image_url: string | null
  is_free: boolean
  price: number | null
}

export type Opportunity = {
  id: string
  title: string
  description: string
  discipline: string
  country: string
  deadline: string | null
  posted_by: string
  is_active: boolean
  created_at: string
}

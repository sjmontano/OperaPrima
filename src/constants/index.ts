// -- Rutas --
export const ROUTES = {
  HOME: '/',
  MENTORS: '/mentores',
  MENTOR_PROFILE: (slug: string) => `/mentores/${slug}`,
  EVENTS: '/eventos',
  OPPORTUNITIES: '/oportunidades',
  LOGIN: '/login',
  REGISTER: '/registro',
  DASHBOARD: '/dashboard',
  MY_BOOKINGS: '/mis-reservas',
  PROFILE: '/perfil',
  BOOK: (mentorId: string) => `/reservar/${mentorId}`,
} as const

// -- Sesiones --
export const SESSION_DURATION_MIN = 60
export const SESSION_DURATION_MS = SESSION_DURATION_MIN * 60 * 1000

// -- Moneda --
export const DEFAULT_CURRENCY = 'COP'
export const STRIPE_CURRENCY = 'cop'

// -- Membresías --
export const MEMBERSHIP_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
} as const

export type MembershipTier = (typeof MEMBERSHIP_TIERS)[keyof typeof MEMBERSHIP_TIERS]

// -- Booking --
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS]

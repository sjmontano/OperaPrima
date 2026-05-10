// ── Local user store (no backend — localStorage) ─────────────────────────
// Usado temporalmente hasta que se conecte Supabase Auth.

export type DocumentType = 'cedula' | 'cedula_ext' | 'pasaporte' | 'dni' | 'nie' | 'tarjeta_id'

export interface LocalUser {
  id: string
  username: string
  email: string
  /** bcrypt-style hash placeholder — se almacena en SHA-256 hex (navegador) */
  passwordHash: string
  firstName: string
  lastName: string
  countryCode: string
  phone: string
  documentType: DocumentType
  document: string
  birthDate: string
  gender: string
  newsletter: boolean
  createdAt: string
}

// ── Storage key ────────────────────────────────────────────────────────────
const STORAGE_KEY = 'op_local_users'

function loadUsers(): LocalUser[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as LocalUser[]) : []
  } catch {
    return []
  }
}

function saveUsers(users: LocalUser[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

// ── Simple hash (no bcrypt in browser, SHA-256 is good enough for local dev) ─
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return (await hashPassword(password)) === hash
}

// ── Public API ─────────────────────────────────────────────────────────────

/** Returns true if the given field value is already taken. */
export function isFieldTaken(
  field: 'username' | 'email' | 'phone' | 'document',
  value: string
): boolean {
  const users = loadUsers()
  const normalized = value.trim().toLowerCase()
  switch (field) {
    case 'username':
      return users.some((u) => u.username.toLowerCase() === normalized)
    case 'email':
      return users.some((u) => u.email.toLowerCase() === normalized)
    case 'phone':
      return users.some((u) => u.phone === value.trim())
    case 'document':
      return users.some((u) => u.document === value.trim())
  }
}

interface CreateUserInput {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  countryCode: string
  phone: string
  documentType: DocumentType
  document: string
  birthDate: string
  gender: string
  newsletter: boolean
}

/** Creates a user and persists to localStorage. Returns the new user. */
export async function createUser(input: CreateUserInput): Promise<LocalUser> {
  const users = loadUsers()
  const passwordHash = await hashPassword(input.password)
  const newUser: LocalUser = {
    id: crypto.randomUUID(),
    username: input.username.trim(),
    email: input.email.trim().toLowerCase(),
    passwordHash,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    countryCode: input.countryCode,
    phone: input.phone.trim(),
    documentType: input.documentType,
    document: input.document.trim(),
    birthDate: input.birthDate,
    gender: input.gender,
    newsletter: input.newsletter,
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

/** Finds a user by email or username + verifies password. Returns user or null. */
export async function findUserByCredential(
  credential: string,
  password: string
): Promise<LocalUser | null> {
  const users = loadUsers()
  const normalized = credential.trim().toLowerCase()
  const user = users.find(
    (u) => u.email.toLowerCase() === normalized || u.username.toLowerCase() === normalized
  )
  if (!user) return null
  const valid = await verifyPassword(password, user.passwordHash)
  return valid ? user : null
}

/** Returns all local users (for debugging). */
export function getAllUsers(): LocalUser[] {
  return loadUsers()
}

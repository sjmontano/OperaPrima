'use client'

import { createClient } from '@/lib/supabaseClient'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

interface DevUser {
  label: string
  email: string
  password: string
  rol: string
  initials: string
  color: string
}

const DEV_USERS: DevUser[] = [
  {
    label: 'Admin',
    email: 'opera@email.com',
    password: 'Opera123.*',
    rol: 'ADMIN',
    initials: 'A',
    color: '#E63946',
  },
  {
    label: 'Mentor',
    email: 'felipe@email.com',
    password: 'Opera123.*',
    rol: 'MENTOR',
    initials: 'M',
    color: '#8ECAE6',
  },
  {
    label: 'Usuario',
    email: 'valentina@email.com',
    password: 'Opera123.*',
    rol: 'USUARIO',
    initials: 'U',
    color: '#023047',
  },
]

function ToolbarInner() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<string | null>(null)
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; msg: string } | null>(null)

  if (searchParams.get('dev') !== '1') return null

  const handleLogin = async (user: DevUser) => {
    setLoading(user.label)
    setStatus(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      })
      if (error) {
        setStatus({ type: 'error', msg: `${user.label}: ${error.message}` })
      } else {
        setStatus({ type: 'ok', msg: `Sesión iniciada como ${user.label}` })
        setTimeout(() => setStatus(null), 3000)
      }
    } catch {
      setStatus({ type: 'error', msg: `${user.label}: Error inesperado` })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      {status && (
        <div
          className={`mb-2 rounded px-3 py-1 text-center text-[10px] font-semibold tracking-wider uppercase ${
            status.type === 'ok'
              ? 'bg-emerald-900/80 text-emerald-300'
              : 'bg-red-900/80 text-red-300'
          }`}
        >
          {status.msg}
        </div>
      )}
      <div className="flex items-center gap-1.5 rounded-sm border border-zinc-700 bg-[#0f0f0f]/95 px-3 py-2 shadow-[4px_4px_0_#000] backdrop-blur">
        <span className="mr-1 text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
          Dev
        </span>
        <span className="h-4 w-px bg-zinc-700" />
        {DEV_USERS.map((user) => (
          <button
            key={user.label}
            type="button"
            onClick={() => handleLogin(user)}
            disabled={loading !== null}
            className="flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-40"
            style={{
              borderColor: `${user.color}40`,
              color: user.color,
              backgroundColor: `${user.color}10`,
            }}
          >
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white"
              style={{ backgroundColor: user.color }}
            >
              {loading === user.label ? '…' : user.initials}
            </span>
            {user.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function DevLoginToolbar() {
  return (
    <Suspense fallback={null}>
      <ToolbarInner />
    </Suspense>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (res.ok) {
          const data = await res.json()
          if (data.usuario?.rol === 'ADMIN') {
            router.replace('/admin')
          }
        }
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError || !data.session) {
        setError('Credenciales inválidas')
        setLoading(false)
        return
      }

      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      })
      const json = await res.json()

      if (json.usuario?.rol !== 'ADMIN') {
        await supabase.auth.signOut()
        setError('No tienes permisos de administrador')
        setLoading(false)
        return
      }

      router.replace('/admin')
    } catch {
      setError('Error al iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F0F8FF] px-4">
      <div className="w-full max-w-sm border-2 border-zinc-200 bg-white p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center border-2 border-[#023047] bg-[#023047]">
            <LogIn size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-[#353535]">Admin</h1>
          <p className="mt-1 text-xs text-zinc-500">Inicia sesión con tu cuenta de administrador</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold tracking-widest text-[#353535] uppercase">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 block w-full border-2 border-zinc-200 px-3 py-2.5 text-sm transition-colors outline-none focus:border-[#023047]"
              placeholder="admin@ejemplo.com"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold tracking-widest text-[#353535] uppercase">
              Contraseña
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full border-2 border-zinc-200 px-3 py-2.5 pr-10 text-sm transition-colors outline-none focus:border-[#023047]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="border-2 border-[#E63946]/20 bg-[#E63946]/5 px-3 py-2 text-xs font-semibold text-[#E63946]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-[#023047] bg-[#023047] px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition-all hover:bg-[#023047]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  )
}

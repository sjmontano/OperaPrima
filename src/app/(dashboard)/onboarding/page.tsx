'use client'

import { buildAvatarUrl } from '@/components/shared/DefaultAvatar'
import {
  AvatarCustomizer,
  buildUrl as buildDicebearUrl,
} from '@/components/shared/AvatarCustomizer'
import type { AvatarConfig } from '@/components/shared/AvatarCustomizer'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const INTERESTS = [
  'Artes plásticas',
  'Danza',
  'Teatro',
  'Música',
  'Literatura',
  'Cine',
  'Fotografía',
  'Artesanías',
  'Diseño',
  'Arte digital',
  'Performance',
  'Gastronomía',
  'Arte urbano',
  'Gestión cultural',
]

const STEP_LABELS = ['Usuario', 'Avatar', 'Intereses']

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(0)
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({ style: 'lorelei', seed: '' })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/auth')
        return
      }
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) return
        const emailPrefix = user.email?.split('@')[0] ?? ''
        setUsername(emailPrefix)
        setAvatarConfig((prev) => ({ ...prev, seed: emailPrefix }))
      })
    })
  }, [router, supabase])

  async function validateUsername(val: string) {
    if (!val || val.length < 3) {
      setUsernameError('Mínimo 3 caracteres')
      return false
    }
    if (!/^[a-z0-9_]+$/.test(val)) {
      setUsernameError('Solo minúsculas, números y _')
      return false
    }
    setUsernameError('')
    return true
  }

  async function handleSubmit() {
    if (!(await validateUsername(username))) return
    setLoading(true)
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return

    const token = session.access_token
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }

    const usernameRes = await fetch('/api/auth/username', {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ username }),
    })
    if (!usernameRes.ok) {
      const err = await usernameRes.json()
      setUsernameError(err.error || 'Error al actualizar usuario')
      setLoading(false)
      return
    }

    await fetch('/api/perfil', {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ interests, avatar: buildDicebearUrl(avatarConfig) }),
    })

    router.push('/perfil')
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
      style={{ fontFamily: 'var(--font-poppins)' }}
    >
      {/* Editorial gradient background */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            'linear-gradient(135deg, oklch(0.97 0.004 340) 0%, oklch(0.93 0.008 340) 40%, oklch(0.88 0.012 165) 100%)',
        }}
      />
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      {/* Frosted blur */}
      <div className="absolute inset-0 -z-10 backdrop-blur-[6px]" aria-hidden />

      {/* Card */}
      <div
        className="relative z-10 w-full overflow-y-auto"
        style={{
          maxWidth: '520px',
          maxHeight: 'min(90vh, 700px)',
          background: 'oklch(0.985 0.004 340)',
          borderTop: '3px solid #F65B7F',
          borderRight: '2px solid oklch(0.12 0 0)',
          borderBottom: '2px solid oklch(0.12 0 0)',
          borderLeft: '2px solid oklch(0.12 0 0)',
          boxShadow: '5px 5px 0 oklch(0.12 0 0)',
        }}
      >
        <div className="flex flex-col" style={{ minHeight: '500px' }}>
          {/* Progress */}
          <div
            className="flex items-center gap-2 border-b px-6 pt-5 pb-4"
            style={{ borderColor: 'oklch(0.88 0.010 350)' }}
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all"
                  style={{
                    backgroundColor: step >= i ? '#023047' : 'oklch(0.88 0.010 350)',
                    color: step >= i ? '#fff' : 'oklch(0.52 0.010 350)',
                  }}
                >
                  {i + 1}
                </div>
                <span
                  className="text-[10px] font-bold tracking-wider uppercase"
                  style={{ color: step >= i ? '#023047' : 'oklch(0.70 0.010 350)' }}
                >
                  {STEP_LABELS[i]}
                </span>
                {i < 2 && (
                  <div
                    className="h-px w-6"
                    style={{ backgroundColor: step > i ? '#023047' : 'oklch(0.88 0.010 350)' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Step 0 — Username */}
            {step === 0 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-xl font-bold tracking-tight" style={{ color: '#023047' }}>
                    Bienvenido a Ópera Prima
                  </h1>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: 'oklch(0.52 0.010 350)' }}
                  >
                    Elige un nombre de usuario para tu perfil público.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={buildAvatarUrl(username || 'new', avatarConfig.style, {
                      ...avatarConfig,
                    } as Record<string, string>)}
                    alt="Avatar"
                    width={56}
                    height={56}
                    className="size-14 shrink-0 rounded-full border-2"
                    style={{ borderColor: '#8ECAE6' }}
                  />
                  <div className="flex-1">
                    <input
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value)
                        if (usernameError) validateUsername(e.target.value)
                      }}
                      onBlur={() => validateUsername(username)}
                      placeholder="tu_usuario"
                      className="w-full border-2 px-3 py-2.5 text-sm transition-all outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[3px_3px_0_#353535]"
                      style={{
                        borderColor: usernameError ? '#DC2626' : 'oklch(0.88 0.010 350)',
                        color: '#353535',
                      }}
                    />
                    {usernameError && (
                      <p className="mt-1 text-xs" style={{ color: '#DC2626' }}>
                        {usernameError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => router.push('/')}
                    className="border-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:bg-[oklch(0.88_0.010_350)]"
                    style={{ borderColor: 'oklch(0.88 0.010 350)', color: '#353535' }}
                  >
                    Después
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    disabled={!!usernameError || username.length < 3}
                    className="border-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#023047] hover:text-white hover:shadow-[3px_3px_0_#353535] disabled:pointer-events-none disabled:opacity-40"
                    style={{ borderColor: '#023047', color: '#023047' }}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 — Avatar */}
            {step === 1 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-xl font-bold tracking-tight" style={{ color: '#023047' }}>
                    Personaliza tu avatar
                  </h1>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: 'oklch(0.52 0.010 350)' }}
                  >
                    Elige un estilo y personaliza cada detalle.
                  </p>
                </div>

                <AvatarCustomizer
                  initialStyle={avatarConfig.style}
                  initialSeed={avatarConfig.seed || username}
                  initialConfig={avatarConfig}
                  onChange={setAvatarConfig}
                  size={160}
                />

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(0)}
                    className="border-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:bg-[oklch(0.88_0.010_350)]"
                    style={{ borderColor: 'oklch(0.88 0.010 350)', color: '#353535' }}
                  >
                    Atrás
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="border-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#023047] hover:text-white hover:shadow-[3px_3px_0_#353535]"
                    style={{ borderColor: '#023047', color: '#023047' }}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Interests */}
            {step === 2 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-xl font-bold tracking-tight" style={{ color: '#023047' }}>
                    ¿Qué te apasiona?
                  </h1>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: 'oklch(0.52 0.010 350)' }}
                  >
                    Selecciona tus intereses creativos.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => {
                    const active = interests.includes(interest)
                    return (
                      <button
                        key={interest}
                        onClick={() =>
                          setInterests((prev) =>
                            active ? prev.filter((i) => i !== interest) : [...prev, interest]
                          )
                        }
                        className="border-2 px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition-all"
                        style={{
                          borderColor: active ? '#023047' : 'oklch(0.88 0.010 350)',
                          backgroundColor: active ? '#023047' : 'transparent',
                          color: active ? '#fff' : '#353535',
                        }}
                      >
                        {interest}
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="border-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:bg-[oklch(0.88_0.010_350)]"
                    style={{ borderColor: 'oklch(0.88 0.010 350)', color: '#353535' }}
                  >
                    Atrás
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="border-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#023047] hover:text-white hover:shadow-[3px_3px_0_#353535] disabled:pointer-events-none disabled:opacity-40"
                    style={{ borderColor: '#023047', color: '#023047' }}
                  >
                    {loading ? 'Guardando...' : 'Comenzar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

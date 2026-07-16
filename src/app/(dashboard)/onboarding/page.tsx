'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Check, Loader, Plus, X } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabaseClient'
import { useAuthModal } from '@/components/auth/AuthModalProvider'
import {
  AvatarCustomizer,
  buildUrl as buildDicebearUrl,
} from '@/components/shared/AvatarCustomizer'
import type { AvatarConfig } from '@/components/shared/AvatarCustomizer'

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

const SOCIAL_PLATFORMS = [
  { label: 'Instagram', placeholder: '@usuario', urlPrefix: 'https://instagram.com/' },
  { label: 'TikTok', placeholder: '@usuario', urlPrefix: 'https://tiktok.com/@' },
  { label: 'YouTube', placeholder: 'nombre del canal', urlPrefix: 'https://youtube.com/@' },
  { label: 'X (Twitter)', placeholder: '@usuario', urlPrefix: 'https://x.com/' },
  { label: 'Facebook', placeholder: 'nombre de perfil', urlPrefix: 'https://facebook.com/' },
  { label: 'LinkedIn', placeholder: 'nombre de perfil', urlPrefix: 'https://linkedin.com/in/' },
]

const STEP_LABELS = ['Identidad', 'Avatar', 'Sobre ti', 'Redes']

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const { currentUser, login } = useAuthModal()

  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [realName, setRealName] = useState('')
  const [artisticName, setArtisticName] = useState('')

  const [useDicebear, setUseDicebear] = useState(true)
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({ style: 'lorelei', seed: '' })
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [bio, setBio] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [interests, setInterests] = useState<string[]>([])

  const [socials, setSocials] = useState<{ label: string; handle: string }[]>([])

  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/auth')
        return
      }
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const u = data.usuario
          if (!u) return
          setUsername(u.username || '')
          setRealName([u.firstName, u.lastName].filter(Boolean).join(' ') || '')
          setArtisticName(u.perfil?.artisticName || '')
          setBio(u.perfil?.bio || '')
          setTags(u.perfil?.tags || [])
          setInterests(u.perfil?.interests || [])
          if (u.perfil?.avatar) {
            setAvatarUrl(u.perfil.avatar)
          }
          if (u.perfil?.redes) {
            setSocials(
              u.perfil.redes.map((r: { label: string; handle: string }) => ({
                label: r.label,
                handle: r.handle,
              }))
            )
          }
          const seed = u.username || u.email?.split('@')[0] || 'user'
          setAvatarConfig((prev) => ({ ...prev, seed }))
          if (!u.perfil?.avatar) {
            setAvatarUrl(buildDicebearUrl({ style: 'lorelei', seed }))
          }
          setDataLoaded(true)
        })
    })
  }, [router, supabase])

  async function validateUsername(val: string) {
    if (!val || val.length < 3) {
      setUsernameError('Mínimo 3 caracteres')
      return false
    }
    if (!/^[a-zA-Z0-9_.\-]+$/.test(val)) {
      setUsernameError('Solo letras, números, puntos, guiones y _')
      return false
    }
    setUsernameError('')
    return true
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload/image', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Error al subir imagen')
    const data = await res.json()
    return data.url
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const url = await uploadFile(file)
      setAvatarUrl(url)
      setUseDicebear(false)
    } catch {
      /* ignore */
    }
    setUploadingAvatar(false)
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) {
      setTags([...tags, t])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  const setSocialHandle = (label: string, handle: string) => {
    setSocials((prev) => {
      const existing = prev.find((s) => s.label === label)
      if (existing) {
        return prev.map((s) => (s.label === label ? { ...s, handle } : s))
      }
      return [...prev, { label, handle }]
    })
  }

  const removeSocial = (label: string) => {
    setSocials((prev) => prev.filter((s) => s.label !== label))
  }

  async function handleSubmit() {
    if (!(await validateUsername(username))) {
      setStep(0)
      return
    }
    setSaving(true)
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
      setSaving(false)
      setStep(0)
      return
    }

    const avatar = useDicebear ? buildDicebearUrl(avatarConfig) : avatarUrl

    const perfilRes = await fetch('/api/perfil', {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        artisticName: artisticName || null,
        realName: realName || null,
        bio: bio || null,
        tags,
        interests,
        avatar,
      }),
    })
    if (!perfilRes.ok) {
      setSaving(false)
      return
    }

    for (const social of socials) {
      if (social.label && social.handle) {
        const platform = SOCIAL_PLATFORMS.find((p) => p.label === social.label)
        const href = platform
          ? `${platform.urlPrefix}${social.handle.replace(/^@/, '')}`
          : social.handle
        await fetch('/api/perfil/social', {
          method: 'POST',
          headers,
          body: JSON.stringify({ label: social.label, handle: social.handle, href }),
        })
      }
    }

    const updatedUser = { ...currentUser, perfil: { avatar } }
    login(updatedUser)
    router.push('/perfil')
  }

  if (!dataLoaded) {
    return (
      <main className="relative flex min-h-screen items-center justify-center">
        <Loader className="animate-spin" size={24} style={{ color: '#023047' }} />
      </main>
    )
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
      style={{ fontFamily: 'var(--font-poppins)' }}
    >
      <div
        className="absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            'linear-gradient(135deg, oklch(0.97 0.004 340) 0%, oklch(0.93 0.008 340) 40%, oklch(0.88 0.012 165) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute inset-0 -z-10 backdrop-blur-[6px]" aria-hidden />

      <div
        className="relative z-10 w-full overflow-y-auto"
        style={{
          maxWidth: '560px',
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
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all"
                  style={{
                    backgroundColor: step >= i ? '#023047' : 'oklch(0.88 0.010 350)',
                    color: step >= i ? '#fff' : 'oklch(0.52 0.010 350)',
                  }}
                >
                  {step > i ? <Check size={12} /> : i + 1}
                </div>
                <span
                  className="text-[10px] font-bold tracking-wider uppercase"
                  style={{ color: step >= i ? '#023047' : 'oklch(0.70 0.010 350)' }}
                >
                  {STEP_LABELS[i]}
                </span>
                {i < 3 && (
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
            {/* Step 0 — Identidad */}
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h1 className="text-xl font-bold tracking-tight" style={{ color: '#023047' }}>
                    Tu identidad
                  </h1>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: 'oklch(0.52 0.010 350)' }}
                  >
                    Define tu nombre de usuario y cómo quieres aparecer en Ópera Prima.
                  </p>
                </div>

                <div>
                  <label
                    className="mb-1 block text-[11px] font-bold tracking-wider uppercase"
                    style={{ color: 'oklch(0.45 0 0)' }}
                  >
                    Nombre de usuario *
                  </label>
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

                <div>
                  <label
                    className="mb-1 block text-[11px] font-bold tracking-wider uppercase"
                    style={{ color: 'oklch(0.45 0 0)' }}
                  >
                    Nombre real
                  </label>
                  <input
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full border-2 border-[oklch(0.88_0.010_350)] px-3 py-2.5 text-sm transition-all outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[3px_3px_0_#353535]"
                    style={{ color: '#353535' }}
                  />
                </div>

                <div>
                  <label
                    className="mb-1 block text-[11px] font-bold tracking-wider uppercase"
                    style={{ color: 'oklch(0.45 0 0)' }}
                  >
                    Nombre artístico
                  </label>
                  <input
                    value={artisticName}
                    onChange={(e) => setArtisticName(e.target.value)}
                    placeholder="Cómo te conocen en el arte"
                    className="w-full border-2 border-[oklch(0.88_0.010_350)] px-3 py-2.5 text-sm transition-all outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[3px_3px_0_#353535]"
                    style={{ color: '#353535' }}
                  />
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
              <div className="flex flex-col gap-5">
                <div>
                  <h1 className="text-xl font-bold tracking-tight" style={{ color: '#023047' }}>
                    Tu avatar
                  </h1>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: 'oklch(0.52 0.010 350)' }}
                  >
                    Elige un avatar generado o sube tu propia foto.
                  </p>
                </div>

                {/* Mode selector pills */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUseDicebear(true)
                      setAvatarUrl(buildDicebearUrl(avatarConfig))
                    }}
                    className={`border-2 px-4 py-2 text-[11px] font-bold tracking-wider uppercase transition-all ${
                      useDicebear ? 'text-white' : ''
                    }`}
                    style={{
                      borderColor: '#023047',
                      color: useDicebear ? '#fff' : '#023047',
                      backgroundColor: useDicebear ? '#023047' : 'transparent',
                    }}
                  >
                    Generado
                  </button>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className={`border-2 px-4 py-2 text-[11px] font-bold tracking-wider uppercase transition-all ${
                      !useDicebear ? 'text-white' : ''
                    }`}
                    style={{
                      borderColor: '#023047',
                      color: !useDicebear ? '#fff' : '#023047',
                      backgroundColor: !useDicebear ? '#023047' : 'transparent',
                    }}
                  >
                    {uploadingAvatar ? 'Subiendo...' : 'Foto'}
                  </button>
                </div>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />

                {/* DiceBear avatar customizer */}
                {useDicebear && (
                  <AvatarCustomizer
                    initialStyle={avatarConfig.style}
                    initialSeed={avatarConfig.seed || username}
                    initialConfig={avatarConfig}
                    onChange={(config) => {
                      setAvatarConfig(config)
                      setAvatarUrl(buildDicebearUrl(config))
                    }}
                    size={140}
                  />
                )}

                {/* Uploaded photo preview */}
                {!useDicebear && avatarUrl && (
                  <div className="flex items-center gap-4">
                    <Image
                      src={avatarUrl}
                      alt="Foto subida"
                      width={80}
                      height={80}
                      className="size-20 rounded-full border-2 object-cover"
                      style={{ borderColor: '#8ECAE6' }}
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUseDicebear(true)
                        setAvatarUrl(buildDicebearUrl(avatarConfig))
                      }}
                      className="border-2 border-[#DC2626] px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#DC2626] uppercase transition-all hover:bg-[#DC2626] hover:text-white"
                    >
                      Quitar foto
                    </button>
                  </div>
                )}

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

            {/* Step 2 — Sobre ti */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h1 className="text-xl font-bold tracking-tight" style={{ color: '#023047' }}>
                    Sobre ti
                  </h1>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: 'oklch(0.52 0.010 350)' }}
                  >
                    Cuéntanos de ti y qué te apasiona.
                  </p>
                </div>

                <div>
                  <label
                    className="mb-1 block text-[11px] font-bold tracking-wider uppercase"
                    style={{ color: 'oklch(0.45 0 0)' }}
                  >
                    Biografía
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Cuéntanos sobre ti, tu trayectoria artística, tus influencias..."
                    rows={3}
                    className="w-full resize-none border-2 border-[oklch(0.88_0.010_350)] px-3 py-2.5 text-sm transition-all outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[3px_3px_0_#353535]"
                    style={{ color: '#353535' }}
                  />
                </div>

                <div>
                  <label
                    className="mb-1 block text-[11px] font-bold tracking-wider uppercase"
                    style={{ color: 'oklch(0.45 0 0)' }}
                  >
                    Tags
                  </label>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 border-2 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
                        style={{ borderColor: '#023047', color: '#023047' }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:opacity-60"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                      placeholder="Escribe un tag y presiona Enter"
                      className="flex-1 border-2 border-[oklch(0.88_0.010_350)] px-3 py-2 text-sm transition-all outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[3px_3px_0_#353535]"
                      style={{ color: '#353535' }}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="border-2 px-3 py-2 text-xs font-bold uppercase transition-all hover:bg-[#023047] hover:text-white"
                      style={{ borderColor: '#023047', color: '#023047' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    className="mb-1 block text-[11px] font-bold tracking-wider uppercase"
                    style={{ color: 'oklch(0.45 0 0)' }}
                  >
                    Intereses creativos
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => {
                      const active = interests.includes(interest)
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
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
                    onClick={() => setStep(3)}
                    className="border-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#023047] hover:text-white hover:shadow-[3px_3px_0_#353535]"
                    style={{ borderColor: '#023047', color: '#023047' }}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Redes */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <div>
                  <h1 className="text-xl font-bold tracking-tight" style={{ color: '#023047' }}>
                    Redes sociales
                  </h1>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: 'oklch(0.52 0.010 350)' }}
                  >
                    Conecta tus perfiles para que te encuentren fácilmente.
                  </p>
                </div>

                {SOCIAL_PLATFORMS.map((platform) => {
                  const social = socials.find((s) => s.label === platform.label)
                  const isActive = !!social
                  return (
                    <div key={platform.label}>
                      <div className="mb-1 flex items-center justify-between">
                        <label
                          className="text-[11px] font-bold tracking-wider uppercase"
                          style={{ color: 'oklch(0.45 0 0)' }}
                        >
                          {platform.label}
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (isActive) {
                              removeSocial(platform.label)
                            } else {
                              setSocialHandle(platform.label, '')
                            }
                          }}
                          className="text-[10px] font-bold tracking-wider uppercase transition-all hover:opacity-60"
                          style={{ color: isActive ? '#DC2626' : '#023047' }}
                        >
                          {isActive ? 'Eliminar' : 'Agregar'}
                        </button>
                      </div>
                      {isActive && (
                        <input
                          value={social.handle}
                          onChange={(e) => setSocialHandle(platform.label, e.target.value)}
                          placeholder={platform.placeholder}
                          className="w-full border-2 border-[oklch(0.88_0.010_350)] px-3 py-2.5 text-sm transition-all outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[3px_3px_0_#353535]"
                          style={{ color: '#353535' }}
                        />
                      )}
                    </div>
                  )
                })}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="border-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:bg-[oklch(0.88_0.010_350)]"
                    style={{ borderColor: 'oklch(0.88 0.010 350)', color: '#353535' }}
                  >
                    Atrás
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="border-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#023047] hover:text-white hover:shadow-[3px_3px_0_#353535] disabled:pointer-events-none disabled:opacity-40"
                    style={{ borderColor: '#023047', color: '#023047' }}
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <Loader size={12} className="animate-spin" />
                        Guardando...
                      </span>
                    ) : (
                      'Comenzar'
                    )}
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

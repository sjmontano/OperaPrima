'use client'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { AdBar } from '@/components/layout/AdBar'
import { createClient } from '@/lib/supabaseClient'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  AvatarCustomizer,
  buildUrl as buildDicebearUrl,
} from '@/components/shared/AvatarCustomizer'
import type { AvatarConfig, AvatarStyle } from '@/components/shared/AvatarCustomizer'
import { ArrowLeft, Check, Loader, Plus, X, Upload, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthModal } from '@/components/auth/AuthModalProvider'

const INTEREST_OPTIONS = [
  'Música',
  'Artes Visuales',
  'Danza',
  'Teatro',
  'Performance',
  'Circo',
  'Literatura',
  'Cine',
  'Fotografía',
  'Artesanía',
  'Multimedia',
  'Gestión Cultural',
  'Curaduría',
  'Docencia',
]

const INTEREST_COLORS = [
  { bg: '#8ECAE6', text: '#353535' },
  { bg: '#023047', text: '#FFFFFF' },
  { bg: '#4682B4', text: '#FFFFFF' },
  { bg: '#E63946', text: '#FFFFFF' },
  { bg: '#FB6F92', text: '#FFFFFF' },
]

interface SocialEntry {
  id?: string
  label: string
  handle: string
  href: string
}

interface FormData {
  artisticName: string
  realName: string
  bio: string
  tags: string[]
  interests: string[]
  avatar: string | null
  banner: string | null
  socials: SocialEntry[]
}

function generateBannerUrl(seed: string) {
  return `https://api.dicebear.com/10.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=8ECAE6,023047,4682B4&backgroundType=gradientLinear&size=800&shapeColor=f0f8ff`
}

export default function EditarPerfilPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    artisticName: '',
    realName: '',
    bio: '',
    tags: [],
    interests: [],
    avatar: null,
    banner: null,
    socials: [],
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [usuarioId, setUsuarioId] = useState<string | null>(null)
  const [perfilId, setPerfilId] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({ style: 'lorelei', seed: '' })
  const [useDicebear, setUseDicebear] = useState(true)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { refreshUser } = useAuthModal()

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) {
          router.replace('/auth')
          return
        }

        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (!res.ok) {
          router.replace('/auth')
          return
        }

        const data = await res.json()
        const u = data.usuario
        setUsuarioId(u.id)
        setPerfilId(u.perfil?.id ?? null)
        setUsername(u.username)
        const savedAvatar = u.perfil?.avatar
        if (savedAvatar?.includes('dicebear.com')) {
          try {
            const parsedUrl = new URL(savedAvatar)
            const style = (parsedUrl.pathname.match(/\/(\w+(?:-\w+)*)\/svg/)?.[1] ??
              'lorelei') as AvatarStyle
            const seed = parsedUrl.searchParams.get('seed') || u.username
            const options: Record<string, string> = {}
            parsedUrl.searchParams.forEach((val, key) => {
              if (key !== 'seed') options[key] = val
            })
            setAvatarConfig({ style, seed, ...options })
          } catch {
            setAvatarConfig((prev) => ({ ...prev, seed: u.username }))
          }
        } else {
          setAvatarConfig((prev) => ({ ...prev, seed: u.username }))
        }
        setUseDicebear(!u.perfil?.avatar || u.perfil.avatar.includes('dicebear.com'))

        setForm({
          artisticName: u.perfil?.artisticName ?? '',
          realName: u.perfil?.realName ?? '',
          bio: u.perfil?.bio ?? '',
          tags: u.perfil?.tags ?? [],
          interests: u.perfil?.interests ?? [],
          avatar: u.perfil?.avatar ?? null,
          banner: u.perfil?.banner ?? null,
          socials: (u.perfil?.redes ?? []).map(
            (r: { id: string; label: string; handle: string; href: string }) => ({
              id: r.id,
              label: r.label,
              handle: r.handle ?? '',
              href: r.href,
            })
          ),
        })
        setLoaded(true)
      } catch {
        router.replace('/auth')
      }
    }
    loadProfile()
  }, [router])

  const addTag = useCallback(() => {
    const t = tagInput.trim().replace(/^#/, '')
    if (!t || form.tags.includes(t)) return
    setForm((f) => ({ ...f, tags: [...f.tags, t] }))
    setTagInput('')
  }, [tagInput, form.tags])

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))
  }

  const toggleInterest = (interest: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }))
  }

  const addSocial = () => {
    setForm((f) => ({
      ...f,
      socials: [...f.socials, { label: '', handle: '', href: '' }],
    }))
  }

  const updateSocial = (index: number, field: keyof SocialEntry, value: string) => {
    setForm((f) => {
      const socials = [...f.socials]
      socials[index] = { ...socials[index], [field]: value }
      if (field === 'handle' && !socials[index].href) {
        socials[index].href = value.startsWith('http') ? value : `https://${value}`
      }
      return { ...f, socials }
    })
  }

  const removeSocial = (index: number) => {
    setForm((f) => ({
      ...f,
      socials: f.socials.filter((_, i) => i !== index),
    }))
  }

  const uploadFile = async (file: File, type: 'avatar' | 'banner') => {
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
      const url = await uploadFile(file, 'avatar')
      setForm((f) => ({ ...f, avatar: url }))
    } catch {
      setError('Error al subir avatar')
    }
    setUploadingAvatar(false)
  }

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingBanner(true)
    try {
      const url = await uploadFile(file, 'banner')
      setForm((f) => ({ ...f, banner: url }))
    } catch {
      setError('Error al subir banner')
    }
    setUploadingBanner(false)
  }

  const handleAvatarCustomizerChange = (config: AvatarConfig) => {
    setAvatarConfig(config)
    const url = buildDicebearUrl(config)
    setForm((f) => ({ ...f, avatar: url }))
  }

  const switchToUpload = () => {
    setUseDicebear(false)
    avatarInputRef.current?.click()
  }

  const switchToDicebear = () => {
    setUseDicebear(true)
    const url = buildDicebearUrl(avatarConfig)
    setForm((f) => ({ ...f, avatar: url }))
  }

  const generateDefaultBanner = () => {
    const url = generateBannerUrl(username || 'artista')
    setForm((f) => ({ ...f, banner: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuarioId) return
    setSaving(true)
    setSaved(false)
    setError('')

    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const res = await fetch('/api/perfil', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          usuarioId,
          artisticName: form.artisticName || null,
          realName: form.realName || null,
          bio: form.bio || null,
          tags: form.tags,
          interests: form.interests,
          avatar: form.avatar,
          banner: form.banner,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al guardar')
      }

      // Save social links
      const token = session?.access_token
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      for (const social of form.socials) {
        if (social.id) {
          await fetch(`/api/perfil/social/${social.id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ label: social.label, handle: social.handle, href: social.href }),
          })
        } else if (social.label && social.href && perfilId) {
          await fetch('/api/perfil/social', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              perfilId,
              label: social.label,
              handle: social.handle,
              href: social.href,
            }),
          })
        }
      }

      setSaved(true)
      refreshUser()
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    }
    setSaving(false)
  }

  const displayAvatar =
    form.avatar || buildDicebearUrl({ ...avatarConfig, style: avatarConfig.style })
  const displayBanner = form.banner || generateBannerUrl(username || 'artista')

  return (
    <>
      <AdBar />
      <Navbar />
      <main className="min-h-screen bg-[#F0F8FF]">
        <div className="no-borders mx-[100px] border-zinc-200 bg-white max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-8 py-6">
            <div className="flex items-center gap-4">
              <Link
                href="/perfil"
                className="flex size-9 items-center justify-center border-2 border-zinc-200 text-zinc-600 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#023047] hover:text-[#023047] hover:shadow-[3px_3px_0_#353535]"
              >
                <ArrowLeft size={16} />
              </Link>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#353535]">Editar Perfil</h1>
                <p className="text-xs text-zinc-500">Personaliza tu perfil de artista</p>
              </div>
            </div>
            <button
              type="submit"
              form="profile-form"
              disabled={saving}
              className="flex items-center gap-2 border-2 border-[#023047] bg-[#023047] px-6 py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-all hover:bg-white hover:text-[#023047] hover:shadow-[4px_4px_0_#353535] disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>

          <form id="profile-form" onSubmit={handleSubmit}>
            {/* Banner */}
            <div className="relative">
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#8ECAE6] via-[#4682B4] to-[#023047] sm:h-56">
                <Image src={displayBanner} alt="Banner" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-black/20" />
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="absolute right-4 bottom-4 flex items-center gap-1.5 border-2 border-white/60 bg-black/40 px-3 py-1.5 text-[0.6rem] font-bold tracking-widest text-white uppercase backdrop-blur-sm transition-colors hover:bg-black/60"
                >
                  <Upload size={12} /> {uploadingBanner ? 'Subiendo...' : 'Banner'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = generateBannerUrl(username || 'artista')
                    setForm((f) => ({ ...f, banner: url }))
                  }}
                  className="absolute right-4 bottom-4 mr-28 flex items-center gap-1.5 border-2 border-white/60 bg-black/40 px-3 py-1.5 text-[0.6rem] font-bold tracking-widest text-white uppercase backdrop-blur-sm transition-colors hover:bg-black/60"
                >
                  <Sparkles size={12} /> Generar
                </button>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerUpload}
                />
              </div>
            </div>

            {/* Avatar Customizer */}
            <div className="border-b border-zinc-200 px-6 py-6">
              <div className="flex items-center justify-between">
                <label className="text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase">
                  Avatar
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={switchToDicebear}
                    className="border-2 px-3 py-1 text-[0.55rem] font-bold uppercase transition-all"
                    style={{
                      borderColor: useDicebear ? '#023047' : '#E4E4E7',
                      backgroundColor: useDicebear ? '#023047' : 'transparent',
                      color: useDicebear ? '#fff' : '#353535',
                    }}
                  >
                    Virtual
                  </button>
                  <button
                    type="button"
                    onClick={switchToUpload}
                    className="border-2 px-3 py-1 text-[0.55rem] font-bold uppercase transition-all"
                    style={{
                      borderColor: !useDicebear ? '#023047' : '#E4E4E7',
                      backgroundColor: !useDicebear ? '#023047' : 'transparent',
                      color: !useDicebear ? '#fff' : '#353535',
                    }}
                  >
                    Subir foto
                  </button>
                </div>
              </div>

              {useDicebear && loaded ? (
                <div className="mt-4">
                  <AvatarCustomizer
                    initialStyle={avatarConfig.style}
                    initialSeed={avatarConfig.seed || username}
                    initialConfig={avatarConfig}
                    onChange={handleAvatarCustomizerChange}
                    size={160}
                  />
                </div>
              ) : useDicebear ? (
                <div className="mt-4 flex items-center justify-center py-8">
                  <button
                    type="button"
                    disabled
                    className="inline-flex cursor-not-allowed items-center gap-2 border-2 border-zinc-200 bg-zinc-100 px-6 py-3 text-xs font-bold tracking-widest text-zinc-400 uppercase"
                  >
                    <Loader size={14} className="animate-spin" />
                    Cargando
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-6">
                  <div className="relative size-28 overflow-hidden border-4 border-white shadow-lg">
                    {form.avatar && !form.avatar.includes('dicebear.com') ? (
                      <Image
                        src={form.avatar}
                        alt="Avatar"
                        width={112}
                        height={112}
                        className="size-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-zinc-100">
                        <Upload size={24} className="text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="border-2 border-[#023047] px-4 py-2 text-xs font-bold uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#023047] hover:text-white hover:shadow-[3px_3px_0_#353535]"
                    style={{ color: '#023047' }}
                  >
                    {uploadingAvatar ? 'Subiendo...' : 'Seleccionar imagen'}
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handleAvatarUpload(e)
                      setUseDicebear(false)
                    }}
                  />
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="mt-20 space-y-8 px-8 pb-12">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase">
                    Nombre artístico
                  </label>
                  <input
                    value={form.artisticName}
                    onChange={(e) => setForm((f) => ({ ...f, artisticName: e.target.value }))}
                    placeholder="Tu nombre artístico"
                    className="w-full border-2 border-zinc-200 px-4 py-3 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-[#023047] focus:shadow-[4px_4px_0_#023047] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase">
                    Nombre real
                  </label>
                  <input
                    value={form.realName}
                    onChange={(e) => setForm((f) => ({ ...f, realName: e.target.value }))}
                    placeholder="Tu nombre real (opcional)"
                    className="w-full border-2 border-zinc-200 px-4 py-3 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-[#023047] focus:shadow-[4px_4px_0_#023047] focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="mb-2 block text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase">
                  Biografía
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Cuéntanos sobre ti, tu arte, tu trayectoria..."
                  rows={4}
                  className="w-full resize-none border-2 border-zinc-200 px-4 py-3 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-[#023047] focus:shadow-[4px_4px_0_#023047] focus:outline-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 block text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase">
                  # Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 border-2 border-[#023047] bg-[#F0F8FF] px-2.5 py-1 text-[0.6rem] font-bold tracking-widest text-[#023047] uppercase"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-[#E63946] hover:text-[#FB6F92]"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="#agrega un tag"
                    className="flex-1 border-2 border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-[#023047] focus:shadow-[4px_4px_0_#023047] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="flex items-center gap-1.5 border-2 border-[#023047] px-4 py-2.5 text-[0.62rem] font-bold tracking-widest text-[#023047] uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#023047] hover:text-white hover:shadow-[3px_3px_0_#353535]"
                  >
                    <Plus size={12} /> Agregar
                  </button>
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="mb-3 block text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase">
                  Intereses creativos
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest, i) => {
                    const selected = form.interests.includes(interest)
                    const c = INTEREST_COLORS[i % INTEREST_COLORS.length]
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`flex items-center gap-1.5 border-2 px-3.5 py-2 text-[0.62rem] font-bold tracking-widest uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#353535] ${
                          selected
                            ? '-translate-x-0.5 -translate-y-0.5 border-[#353535] text-white shadow-[3px_3px_0_#353535]'
                            : 'border-zinc-200 text-zinc-600 hover:border-[#023047] hover:text-[#023047]'
                        }`}
                        style={selected ? { background: c.bg, color: c.text } : undefined}
                      >
                        {selected && <Check size={10} />}
                        {interest}
                      </button>
                    )
                  })}
                </div>
                {form.interests.length === 0 && (
                  <p className="mt-3 text-xs text-zinc-400 italic">
                    Selecciona tus intereses para que otros artistas te encuentren
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase">
                    Redes sociales
                  </label>
                  <button
                    type="button"
                    onClick={addSocial}
                    className="flex items-center gap-1.5 border-2 border-[#023047] px-3 py-1.5 text-[0.55rem] font-bold tracking-widest text-[#023047] uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#023047] hover:text-white hover:shadow-[3px_3px_0_#353535]"
                  >
                    <Plus size={10} /> Agregar red
                  </button>
                </div>
                <div className="space-y-3">
                  {form.socials.map((social, i) => (
                    <div key={i} className="flex items-center gap-3 border-2 border-zinc-200 p-3">
                      <div className="flex-1">
                        <input
                          value={social.label}
                          onChange={(e) => updateSocial(i, 'label', e.target.value)}
                          placeholder="Ej: Instagram"
                          className="w-full border-b border-zinc-200 pb-1 text-xs font-bold tracking-widest text-[#023047] uppercase placeholder:text-zinc-300 focus:border-[#023047] focus:outline-none"
                        />
                      </div>
                      <div className="flex-[2]">
                        <input
                          value={social.handle}
                          onChange={(e) => updateSocial(i, 'handle', e.target.value)}
                          placeholder="@usuario"
                          className="w-full border-b border-zinc-200 pb-1 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#023047] focus:outline-none"
                        />
                      </div>
                      <div className="flex-[2]">
                        <input
                          value={social.href}
                          onChange={(e) => updateSocial(i, 'href', e.target.value)}
                          placeholder="https://..."
                          className="w-full border-b border-zinc-200 pb-1 text-xs text-zinc-500 placeholder:text-zinc-300 focus:border-[#023047] focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSocial(i)}
                        className="shrink-0 border-2 border-[#E63946] px-2 py-1 text-[#E63946] transition-colors hover:bg-[#E63946] hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {form.socials.length === 0 && (
                    <div className="border-2 border-dashed border-zinc-200 px-4 py-8 text-center">
                      <p className="text-xs text-zinc-400 italic">
                        Agrega tus redes sociales para que te encuentren
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error / Success */}
              {error && (
                <div className="border-2 border-[#E63946] bg-[#E63946]/5 px-4 py-3">
                  <p className="text-xs font-bold text-[#E63946]">{error}</p>
                </div>
              )}
              {saved && (
                <div className="border-2 border-[#16A34A] bg-[#16A34A]/5 px-4 py-3">
                  <p className="flex items-center gap-2 text-xs font-bold text-[#16A34A]">
                    <Check size={14} /> Perfil guardado correctamente
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

'use client'

import { Camera, ImageIcon } from 'lucide-react'
import { useRef, useState } from 'react'

export interface ProfileHeroUser {
  id: string
  artisticName: string
  realName: string
  username: string

  avatar: string | null

  banner: string | null

  tags: string[]
}

interface ProfileHeroProps {
  user: ProfileHeroUser
}
interface UpdateProfileData {
  usuarioId: string
  avatar?: string
  banner?: string
}

async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/upload/image', {
    method: 'POST',
    body: formData,
  })

  return await res.json() // { url }
}

async function updateProfile(data: UpdateProfileData) {
  await fetch('/api/perfil', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export function ProfileHero({ user }: ProfileHeroProps) {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(user.avatar ?? null)

  const [bannerSrc, setBannerSrc] = useState<string | null>(user.banner ?? null)

  const [avatarHover, setAvatarHover] = useState(false)
  const [bannerHover, setBannerHover] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  return (
    <section
      style={{
        background: '#353535',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid overlay — editorial texture with stronger vertical lines */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(0deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px, 80px 80px',
          opacity: 0.06,
        }}
      />
      {/* Vertical accent lines — denser, more visible */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: 'linear-gradient(90deg, transparent 39px, #fff 1px, transparent 40px)',
          backgroundSize: '80px 80px',
          opacity: 0.08,
        }}
      />

      {/* ── Banner area ── */}
      <div
        className="relative w-full"
        style={{ height: 'clamp(100px, 18vw, 200px)' }}
        onMouseEnter={() => setBannerHover(true)}
        onMouseLeave={() => setBannerHover(false)}
      >
        {bannerSrc ? (
          <img
            src={bannerSrc}
            alt="Banner de perfil"
            className="h-full w-full object-cover"
            style={{ opacity: 0.82 }}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                'repeating-linear-gradient(45deg, rgba(246,91,127,0.07) 0px, rgba(246,91,127,0.07) 1px, transparent 1px, transparent 24px)',
            }}
          />
        )}

        {/* Edit banner button */}
        <button
          type="button"
          onClick={() => bannerInputRef.current?.click()}
          aria-label="Cambiar foto de banner"
          className="absolute top-3 right-3 flex items-center gap-1.5 border-2 border-white/30 px-3 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase transition-all duration-200"
          style={{
            background: bannerHover ? 'rgba(246,91,127,0.85)' : 'rgba(17,17,17,0.65)',
            borderColor: bannerHover ? '#8ECAE6' : 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
            opacity: bannerHover ? 1 : 0.6,
          }}
        >
          <ImageIcon size={11} />
          {bannerSrc ? 'Cambiar banner' : 'Añadir banner'}
        </button>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return

            const { url } = await uploadImage(file)

            setBannerSrc(url)

            await updateProfile({
              usuarioId: user.id,
              banner: url,
            })

            e.target.value = ''
          }}
        />

        {/* Bottom fade */}
        <div
          className="pointer-events-none absolute right-0 bottom-0 left-0"
          style={{
            height: '60px',
            background: 'linear-gradient(to bottom, transparent, #353535)',
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div
        className="relative z-10 mx-auto px-6 pt-4 pb-12 lg:pb-16"
        style={{ maxWidth: '1024px' }}
      >
        <div className="flex items-start justify-between gap-8 lg:gap-16">
          {/* Name block */}
          <div className="min-w-0 flex-1">
            <p
              className="mb-4 text-xs font-bold tracking-[0.25em] uppercase"
              style={{ color: '#F65B7F' }}
            >
              Perfil Artístico
            </p>
            <h1
              style={{
                fontSize: 'clamp(2.25rem, 8vw, 6rem)',
                fontWeight: 700,
                color: '#F0F8FF',
                letterSpacing: '-0.025em',
                textTransform: 'uppercase',
                lineHeight: 0.95,
                marginBottom: '1rem',
              }}
            >
              {user.artisticName}
            </h1>
            <p
              style={{
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'rgba(250,250,249,0.45)',
                fontSize: '1.0625rem',
                marginBottom: '0.5rem',
              }}
            >
              {user.realName}
            </p>
            <p className="text-sm font-semibold" style={{ color: '#F65B7F' }}>
              @{user.username}
            </p>
          </div>

          {/* ── Avatar with edit overlay ── */}
          <div className="shrink-0 pt-1">
            <div
              className="relative cursor-pointer"
              style={{
                width: 'clamp(100px, 14vw, 192px)',
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                border: '2px solid #023047',
                boxShadow: '6px 6px 0 #023047',
              }}
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
              onClick={() => avatarInputRef.current?.click()}
            >
              <img
                src={avatarSrc ?? '/default-avatar.png'}
                alt={user.artisticName}
                className="block h-full w-full object-cover transition-transform duration-500"
                style={{
                  transform: avatarHover ? 'scale(1.06)' : 'scale(1)',
                }}
              />
              {/* Edit overlay */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-200"
                style={{
                  background: 'rgba(17,17,17,0.72)',
                  opacity: avatarHover ? 1 : 0,
                }}
              >
                <Camera size={22} color="#8ECAE6" strokeWidth={2} />
                <span
                  className="text-[9px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: '#FAFAF9' }}
                >
                  Cambiar foto
                </span>
              </div>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return

                const { url } = await uploadImage(file)

                setAvatarSrc(url)

                await updateProfile({
                  usuarioId: user.id, // IMPORTANTE
                  avatar: url,
                })

                e.target.value = ''
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: 'rgba(250,250,249,0.07)' }} />
    </section>
  )
}

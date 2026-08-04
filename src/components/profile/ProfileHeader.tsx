'use client'

import { generateBannerUrl } from '@/lib/banner'
import { DefaultAvatar } from '@/components/shared/DefaultAvatar'
import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { createClient } from '@/lib/supabaseClient'
import { Camera, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'

interface ProfileHeaderProps {
  artisticName: string
  realName?: string
  username: string
  avatar: string | null
  banner: string | null
  isOwner?: boolean
  onAvatarChange?: (url: string) => void
  onBannerChange?: (url: string) => void
}

async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch('/api/upload/image', { method: 'POST', body: formData })
  return (await res.json()) as { url: string }
}

async function updateProfile(data: { avatar?: string; banner?: string }) {
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
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al guardar perfil')
}

export function ProfileHeader({
  artisticName,
  realName,
  username,
  avatar,
  banner,
  isOwner = false,
  onAvatarChange,
  onBannerChange,
}: ProfileHeaderProps) {
  const [avatarSrc, setAvatarSrc] = useState<string | null>(avatar ?? null)
  const [bannerSrc, setBannerSrc] = useState<string | null>(banner ?? null)
  const [avatarHover, setAvatarHover] = useState(false)
  const [bannerHover, setBannerHover] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const { refreshUser } = useAuthModal()

  const bannerUrl = bannerSrc || generateBannerUrl(username)

  return (
    <>
      <div className="relative h-48 overflow-hidden sm:h-64">
        <div
          className="h-full w-full"
          style={{
            background: `url(${bannerUrl}) center/cover no-repeat`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 50%, oklch(0.98 0.005 350) 100%)',
          }}
        />
        {isOwner && (
          <>
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
              onMouseEnter={() => setBannerHover(true)}
              onMouseLeave={() => setBannerHover(false)}
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
                await updateProfile({ banner: url })
                onBannerChange?.(url)
                refreshUser()
                e.target.value = ''
              }}
            />
          </>
        )}
      </div>

      <div className="mx-auto px-6 pb-2" style={{ maxWidth: '1024px' }}>
        <div className="relative z-10 -mt-16 mb-6 flex items-end gap-5">
          <div
            className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg"
            onMouseEnter={() => isOwner && setAvatarHover(true)}
            onMouseLeave={() => isOwner && setAvatarHover(false)}
          >
            {avatarSrc ? (
              <Image src={avatarSrc} alt={artisticName} fill className="object-cover" unoptimized />
            ) : (
              <DefaultAvatar seed={username} size={112} className="h-full w-full" />
            )}
            {isOwner && (
              <>
                <div
                  className="absolute inset-0 flex cursor-pointer items-center justify-center transition-opacity duration-200"
                  style={{
                    background: 'rgba(17,17,17,0.72)',
                    opacity: avatarHover ? 1 : 0,
                  }}
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <Camera size={20} color="#8ECAE6" strokeWidth={2} />
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
                    await updateProfile({ avatar: url })
                    onAvatarChange?.(url)
                    refreshUser()
                    e.target.value = ''
                  }}
                />
              </>
            )}
          </div>
          <div className="pb-1">
            <h1
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: '#023047' }}
            >
              {artisticName}
            </h1>
            {realName && (
              <p className="text-sm italic" style={{ color: 'oklch(0.52 0.010 350)' }}>
                {realName}
              </p>
            )}
            <p className="text-sm font-semibold" style={{ color: '#F65B7F' }}>
              @{username}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

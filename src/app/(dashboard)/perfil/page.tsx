'use client'

import { AdUnit } from '@/components/ads/AdUnit'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { AdBar } from '@/components/layout/AdBar'
import { ContentFrame } from '@/components/layout/ContentFrame'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { Gallery } from '@/components/gallery/Gallery'
import { useAuthModal } from '@/components/auth/AuthModalProvider'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MyTickets from '@/components/profile/MyTickets'

interface UsuarioApi {
  id?: string
  firstName?: string
  lastName?: string
  username?: string
  perfil?: {
    artisticName?: string
    realName?: string
    bio?: string
    tags?: string[]
    interests?: string[]
    avatar?: string | null
    banner?: string | null
    redes?: { label: string; handle: string; href: string }[]
  }
}

interface PerfilUsuario {
  id: string
  artisticName: string
  realName: string
  username: string
  bio: string
  tags: string[]
  interests: string[]
  avatar: string | null
  banner: string | null
  socials: { label: string; handle: string; href: string }[]
}

function mapUser(usuario: UsuarioApi): PerfilUsuario {
  return {
    id: usuario.id ?? '',
    artisticName: usuario.perfil?.artisticName ?? '',
    realName:
      usuario.perfil?.realName ?? `${usuario.firstName ?? ''} ${usuario.lastName ?? ''}`.trim(),
    username: usuario.username ?? '',
    bio: usuario.perfil?.bio ?? '',
    tags: usuario.perfil?.tags ?? [],
    interests: usuario.perfil?.interests ?? [],
    avatar: usuario.perfil?.avatar ?? null,
    banner: usuario.perfil?.banner ?? null,
    socials:
      usuario.perfil?.redes?.map((r) => ({ label: r.label, handle: r.handle, href: r.href })) ?? [],
  }
}

export default function PerfilPage() {
  const { currentUser, ready } = useAuthModal()
  const [user, setUser] = useState<PerfilUsuario | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!ready) return
    if (!currentUser) {
      router.replace('/')
      return
    }
    const id = requestAnimationFrame(() =>
      setUser(mapUser(currentUser as unknown as Record<string, unknown>))
    )
    return () => cancelAnimationFrame(id)
  }, [currentUser, ready, router])

  if (!user)
    return (
      <>
        <AdBar />
        <Navbar />
        <main className="min-h-screen bg-[#F0F8FF]">
          <ContentFrame>
            <div className="h-48 animate-pulse bg-zinc-200 sm:h-64" />
            <div className="mx-auto px-6 pb-2" style={{ maxWidth: '1024px' }}>
              <div className="-mt-16 mb-6 flex items-end gap-5">
                <div className="h-28 w-28 animate-pulse rounded-full border-4 border-white bg-zinc-200 shadow-lg" />
                <div className="space-y-2 pb-1">
                  <div className="h-5 w-48 animate-pulse rounded bg-zinc-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
                </div>
              </div>
              <div className="mb-8 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-zinc-200" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-200" />
              </div>
              <div className="mb-8 flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-7 w-20 animate-pulse rounded bg-zinc-200" />
                ))}
              </div>
            </div>
          </ContentFrame>
          <div className="mx-[100px] border-x-2 border-zinc-200 bg-white max-lg:mx-[48px] max-md:mx-[18px]">
            <div className="mx-auto px-6 py-10" style={{ maxWidth: '1024px' }}>
              <div className="mb-6 flex items-baseline gap-3">
                <div className="h-5 w-20 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[3/4] animate-pulse rounded bg-zinc-200" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )

  return (
    <>
      <AdBar />
      <Navbar />
      <main className="min-h-screen bg-[#F0F8FF]">
        <ContentFrame>
          <ProfileHeader
            artisticName={user.artisticName}
            realName={user.realName}
            username={user.username}
            handle={user.artisticName || undefined}
            avatar={user.avatar}
            banner={user.banner}
            isOwner
          />

          <div className="mx-auto px-6 pb-2" style={{ maxWidth: '1024px' }}>
            {/* Edit button (always visible) */}
            <div className="mb-3 flex items-center gap-3">
              <Link
                href="/perfil/editar"
                className="border-2 border-[#023047] px-2.5 py-1 text-[0.5rem] font-bold tracking-widest text-[#023047] uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#023047] hover:text-white hover:shadow-[3px_3px_0_#353535]"
              >
                Editar perfil
              </Link>
            </div>

            {/* Bio */}
            {user.bio && (
              <section className="mb-8">
                <p
                  className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
                  style={{ color: 'oklch(0.40 0.008 350)' }}
                >
                  Sobre @{user.artisticName || user.username}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.40 0.008 350)' }}>
                  {user.bio}
                </p>
              </section>
            )}

            {/* Tags */}
            {user.tags.length > 0 && (
              <section className="mb-8">
                <p
                  className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
                  style={{ color: 'oklch(0.40 0.008 350)' }}
                >
                  Disciplinas
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border-2 px-3 py-1 text-xs font-bold uppercase"
                      style={{ borderColor: '#8ECAE6', color: '#023047' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Interests */}
            {user.interests.length > 0 && (
              <section className="mb-8">
                <p
                  className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
                  style={{ color: 'oklch(0.40 0.008 350)' }}
                >
                  Intereses
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 text-xs"
                      style={{ backgroundColor: '#F0F8FF', color: '#4682B4' }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Social Links */}
            {user.socials.length > 0 && (
              <section className="mb-8">
                <p
                  className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
                  style={{ color: 'oklch(0.40 0.008 350)' }}
                >
                  Redes sociales
                </p>
                <div className="flex flex-wrap gap-3">
                  {user.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 border-2 px-3.5 py-2 text-xs font-bold uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#023047] hover:shadow-[3px_3px_0_#353535]"
                      style={{ borderColor: '#E4E4E7', color: '#353535' }}
                    >
                      <span style={{ color: '#8ECAE6' }}>{s.label}</span>
                      <span>/</span>
                      <span>{s.handle}</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            <AdUnit slot="perfil-gallery-tickets" format="horizontal" />
            <Gallery />

            {/* Tickets */}
            <section className="border-t border-zinc-200 pt-8">
              <h2
                className="mb-6 text-lg font-bold tracking-wide uppercase"
                style={{ color: '#353535' }}
              >
                Mis Tickets
              </h2>
              <MyTickets />
            </section>
          </div>
        </ContentFrame>
      </main>
      <Footer />
    </>
  )
}

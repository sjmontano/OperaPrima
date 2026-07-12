'use client'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { AdBar } from '@/components/layout/AdBar'
import { GalleryMasonry, type GalleryItem } from '@/components/profile/GalleryMasonry'
import { MemberGrid, type Member } from '@/components/profile/MemberGrid'
import { ProfileHero } from '@/components/profile/ProfileHero'
import { createClient } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MyTickets from '@/components/profile/MyTickets'
import { SkeletonHero, SkeletonText, SkeletonCard } from '@/components/shared/Skeleton'

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

    redes?: {
      label: string
      handle: string
      href: string
    }[]
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

  socials: {
    label: string
    handle: string
    href: string
  }[]
}

// ── Mock data ──────────────────────────────────────────────────────────────────

function mapUser(usuario: UsuarioApi): PerfilUsuario {
  console.log(usuario)
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
      usuario.perfil?.redes?.map((r) => ({
        label: r.label,
        handle: r.handle,
        href: r.href,
      })) ?? [],
  }
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=70',
    title: 'Fragmentos del silencio',
    date: 'Mar 2025',
  },
  {
    src: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&auto=format&fit=crop&q=70',
    title: 'Cuerpo y territorio',
    date: 'Ene 2025',
  },
  {
    src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=70',
    title: 'Ensayo abierto #3',
    date: 'Oct 2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&auto=format&fit=crop&q=70',
    title: 'Residencia Bogotá',
    date: 'Sep 2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=600&auto=format&fit=crop&q=70',
    title: 'La piel que habito',
    date: 'Ago 2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=70',
    title: 'Duelo coreográfico',
    date: 'Jul 2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1545959570-a94084071b5d?w=600&auto=format&fit=crop&q=70',
    title: 'Festival Iberoamericano',
    date: 'Jun 2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1614859324967-bdf413c35703?w=600&auto=format&fit=crop&q=70',
    title: 'Improvisación en sitio',
    date: 'May 2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&auto=format&fit=crop&q=70',
    title: 'Arquitecturas del cuerpo',
    date: 'Mar 2024',
  },
]

const COMMUNITY_MEMBERS: Member[] = [
  {
    name: 'Andrés Ospina',
    discipline: 'Música',
    location: 'Medellín',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Laura Jiménez',
    discipline: 'Artes Visuales',
    location: 'Bogotá',
    image:
      'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Camila Torres',
    discipline: 'Danza',
    location: 'Cali',
    image:
      'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Sebastián Ríos',
    discipline: 'Teatro',
    location: 'Cartagena',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Mariana López',
    discipline: 'Performance',
    location: 'Bogotá',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Felipe Mora',
    discipline: 'Circo',
    location: 'Medellín',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Isabella García',
    discipline: 'Música',
    location: 'Cali',
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Daniel Castro',
    discipline: 'Artes Visuales',
    location: 'Barranquilla',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&auto=format&fit=crop&q=70',
  },
]

const DISCIPLINES = ['Música', 'Artes Visuales', 'Danza', 'Teatro', 'Performance', 'Circo']

// ── Interest badge color rotation ─────────────────────────────────────────────
const INTEREST_COLORS = [
  { bg: 'oklch(0.30 0.07 165)', text: '#F0F8FF' },
  { bg: 'oklch(0.40 0.14 295)', text: '#F0F8FF' },
  { bg: 'oklch(0.92 0.008 350)', text: '#353535' },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PerfilPage() {
  const [user, setUser] = useState<PerfilUsuario | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient()

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.replace('/')
          return
        }

        const { access_token } = session

        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })

        if (!response.ok) {
          router.replace('/')
          return
        }

        const data = await response.json()

        setUser(mapUser(data.usuario))
      } catch (error) {
        console.error(error)
        router.replace('/')
      }
    }

    loadUser()
  }, [router])
  console.log(user)

  if (!user)
    return (
      <>
        <AdBar />
        <Navbar />
        <main className="min-h-screen bg-[#F0F8FF]">
          <SkeletonHero />
          <div className="mx-[100px] border-zinc-200 bg-white max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
            <section className="border-b border-zinc-200 px-8 py-10">
              <div className="mx-auto" style={{ maxWidth: '1024px' }}>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-16">
                  <div className="space-y-4 lg:col-span-2">
                    <div className="h-3 w-32 animate-pulse rounded bg-zinc-200" />
                    <SkeletonText lines={4} />
                    <div className="mt-8 flex flex-wrap gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-7 w-24 animate-pulse rounded bg-zinc-200" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 w-16 animate-pulse rounded bg-zinc-200" />
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <section className="border-b border-zinc-200 px-8 py-10">
              <div className="mx-auto" style={{ maxWidth: '1024px' }}>
                <div className="mb-6 flex items-baseline gap-3">
                  <div className="h-5 w-20 animate-pulse rounded bg-zinc-200" />
                  <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              </div>
            </section>
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
        {/* ── HERO ── */}
        <ProfileHero user={user} />

        {/* ── BORDER CONTAINER ── */}
        <div className="mx-[100px] border-zinc-200 bg-white max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
          {/* ── BIO + TAGS ── */}
          <section className="border-b border-zinc-200 px-8 py-10">
            <div className="mx-auto" style={{ maxWidth: '1024px' }}>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-16">
                {/* Bio (2/3) */}
                <div className="lg:col-span-2">
                  <div className="mb-3 flex items-center gap-3">
                    <p
                      className="text-xs font-bold tracking-[0.18em] uppercase"
                      style={{ color: 'oklch(0.40 0.008 350)' }}
                    >
                      Sobre @{user.username}
                    </p>
                    <Link
                      href="/perfil/editar"
                      className="border-2 border-[#023047] px-2.5 py-1 text-[0.5rem] font-bold tracking-widest text-[#023047] uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#023047] hover:text-white hover:shadow-[3px_3px_0_#353535]"
                    >
                      Editar perfil
                    </Link>
                  </div>
                  <p
                    style={{
                      color: 'oklch(0.28 0.008 350)',
                      lineHeight: 1.7,
                      fontSize: '0.9375rem',
                      maxWidth: '58ch',
                    }}
                  >
                    {user.bio}
                  </p>

                  {user.interests.length > 0 && (
                    <div className="mt-8">
                      <p
                        className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
                        style={{ color: 'oklch(0.40 0.008 350)' }}
                      >
                        Intereses creativos
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {user.interests.map((interest, idx) => {
                          const c = INTEREST_COLORS[idx % INTEREST_COLORS.length]
                          return (
                            <span
                              key={interest}
                              className="border-2 border-[#353535] px-3 py-1 text-xs font-bold"
                              style={{ background: c.bg, color: c.text }}
                            >
                              {interest}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags (1/3) */}
                {user.tags.length > 0 && (
                  <div>
                    <p
                      className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
                      style={{ color: 'oklch(0.40 0.008 350)' }}
                    >
                      Tags
                    </p>
                    <ul className="space-y-1.5">
                      {user.tags.map((tag) => (
                        <li key={tag}>
                          <a
                            href="#"
                            className="text-base font-semibold transition-colors hover:text-[#c8405f] hover:underline"
                            style={{ color: '#023047' }}
                          >
                            #{tag}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── GALERÍA ── */}
          <section className="border-b border-zinc-200 px-8 py-10">
            <div className="mx-auto" style={{ maxWidth: '1024px' }}>
              <div className="mb-6 flex items-baseline gap-3">
                <h2
                  className="text-lg font-bold tracking-wide uppercase"
                  style={{ color: '#353535' }}
                >
                  Galería
                </h2>
                <span className="text-sm" style={{ color: 'oklch(0.52 0.010 350)' }}>
                  {GALLERY_ITEMS.length} obras
                </span>
              </div>
              <GalleryMasonry items={GALLERY_ITEMS} showUpload />
            </div>
          </section>

          {/* ── SÍGUEME ── */}
          {user.socials.length > 0 && (
            <section className="border-b border-zinc-200 px-8 py-10">
              <div className="mx-auto" style={{ maxWidth: '1024px' }}>
                <p
                  className="mb-6 text-xs font-bold tracking-[0.18em] uppercase"
                  style={{ color: 'oklch(0.40 0.008 350)' }}
                >
                  Sígueme
                </p>
                <div className="flex flex-wrap gap-6">
                  {user.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="group flex items-baseline gap-2 border-b-2 border-[#353535] pb-0.5 transition-colors duration-150 hover:border-[#023047]"
                    >
                      <span
                        className="text-xs font-medium tracking-widest uppercase"
                        style={{ color: 'oklch(0.52 0.010 350)' }}
                      >
                        {s.label}
                      </span>
                      <span
                        className="text-base font-bold transition-colors duration-150 group-hover:text-[#023047]"
                        style={{ color: '#353535' }}
                      >
                        {s.handle}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── COMUNIDAD ── */}
          <section className="px-8 py-10">
            <div className="mx-auto" style={{ maxWidth: '1024px' }}>
              <div className="mb-6">
                <h2
                  className="text-lg font-bold tracking-wide uppercase"
                  style={{ color: '#353535' }}
                >
                  Descubre a otros miembros
                </h2>
                <p className="text-sm" style={{ color: 'oklch(0.52 0.010 350)' }}>
                  Artistas de tu comunidad — filtra por disciplina
                </p>
              </div>
              <MemberGrid members={COMMUNITY_MEMBERS} disciplines={DISCIPLINES} />
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </>
  )
}

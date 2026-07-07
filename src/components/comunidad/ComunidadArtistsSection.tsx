'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { MemberGrid, type Member } from '@/components/profile/MemberGrid'
import { Star } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const DISCIPLINES = [
  'Música',
  'Artes Visuales',
  'Danza',
  'Teatro',
  'Performance',
  'Circo',
  'Literatura',
  'Multimedia',
]

function mapDiscipline(tags: string[]): string {
  if (tags.length === 0) return 'Artes'
  const tag = tags[0].toLowerCase()
  if (tag.includes('músic') || tag.includes('canto') || tag.includes('compos')) return 'Música'
  if (
    tag.includes('visual') ||
    tag.includes('pintur') ||
    tag.includes('acuarel') ||
    tag.includes('mural') ||
    tag.includes('fotogr') ||
    tag.includes('street')
  )
    return 'Artes Visuales'
  if (tag.includes('danza') || tag.includes('coreogr')) return 'Danza'
  if (tag.includes('teatro') || tag.includes('dramat') || tag.includes('actuac')) return 'Teatro'
  if (tag.includes('perform') || tag.includes('video arte')) return 'Performance'
  if (tag.includes('circo') || tag.includes('acrobac') || tag.includes('malabar')) return 'Circo'
  if (tag.includes('literat') || tag.includes('poesía') || tag.includes('narrat'))
    return 'Literatura'
  if (tag.includes('multimedia') || tag.includes('instalac')) return 'Multimedia'
  return 'Artes'
}

export function ComunidadArtistsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/usuarios')
      .then(async (r) => {
        if (!r.ok) throw new Error('Error ' + r.status)
        const data = await r.json()
        const mapped: Member[] = (data.usuarios || []).map(
          (u: {
            username: string
            firstName: string
            lastName?: string
            perfil?: {
              artisticName?: string
              avatar?: string
              tags?: string[]
              bio?: string
            } | null
          }) => ({
            name: u.perfil?.artisticName || `${u.firstName} ${u.lastName || ''}`.trim(),
            discipline: mapDiscipline(u.perfil?.tags || []),
            location: 'Colombia',
            image:
              u.perfil?.avatar || `https://api.dicebear.com/9.x/lorelei/svg?seed=${u.username}`,
            href: `/perfil/${u.username}`,
          })
        )
        setMembers(mapped)
      })
      .catch((err) => {
        console.error('Error fetching usuarios:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section ref={sectionRef} className="bg-background w-full border-b-2 border-zinc-200">
        <div className="mx-[100px] max-lg:mx-[48px] max-md:mx-[18px]">
          <div className="flex justify-center py-24">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#023047] border-t-transparent" />
          </div>
        </div>
      </section>
    )
  }

  const featuredArtist = members.length > 0 ? members[0] : null

  return (
    <section ref={sectionRef} className="bg-background w-full border-b-2 border-zinc-200">
      <div className="mx-[100px] border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
        {featuredArtist && (
          <div className="border-b-2 border-zinc-200 px-8 pt-20 pb-16">
            <TimelineAnimation as="div" animationNum={0} timelineRef={sectionRef}>
              <div className="mb-2 flex items-center gap-2">
                <Star size={14} className="fill-[#E63946] text-[#E63946]" />
                <p className="text-[0.6rem] font-bold tracking-[0.25em] text-zinc-400 uppercase">
                  Artista destacado del mes
                </p>
              </div>
            </TimelineAnimation>

            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <TimelineAnimation as="div" animationNum={1} timelineRef={sectionRef}>
                <a
                  href={featuredArtist.href ?? '#'}
                  className="relative block aspect-[4/5] overflow-hidden border-2 border-zinc-200"
                >
                  <Image
                    src={featuredArtist.image}
                    alt={featuredArtist.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-zinc-950/85 via-transparent to-transparent p-5">
                    <p className="text-lg font-bold text-white">{featuredArtist.name}</p>
                    <p className="text-sm text-white/70">{featuredArtist.discipline}</p>
                  </div>
                </a>
              </TimelineAnimation>

              <TimelineAnimation as="div" animationNum={2} timelineRef={sectionRef}>
                <div className="space-y-4">
                  <h3 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
                    {featuredArtist.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    Artista destacado del mes por su trayectoria y contribución a la comunidad de
                    {featuredArtist.discipline.toLowerCase()} en Colombia. Su trabajo ha inspirado a
                    otros miembros y representa los valores de Ópera Prima.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['Obra reciente', 'Entrevista', 'Galería'].map((label) => (
                      <span
                        key={label}
                        className="border-2 border-zinc-200 px-3 py-1.5 text-[0.55rem] font-bold tracking-widest text-zinc-500 uppercase transition hover:border-[#023047] hover:text-[#023047]"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </TimelineAnimation>
            </div>
          </div>
        )}

        <div className="px-8 py-14">
          <TimelineAnimation as="div" animationNum={3} timelineRef={sectionRef}>
            <div className="mb-6">
              <h2 className="text-lg font-bold tracking-wide text-zinc-800 uppercase">
                Descubre a otros miembros
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Artistas de tu comunidad — filtra por disciplina
              </p>
            </div>
          </TimelineAnimation>
          <TimelineAnimation as="div" animationNum={4} timelineRef={sectionRef}>
            <MemberGrid members={members} disciplines={DISCIPLINES} />
          </TimelineAnimation>
        </div>
      </div>
    </section>
  )
}

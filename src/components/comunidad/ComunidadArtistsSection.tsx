'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { MemberGrid, type Member } from '@/components/profile/MemberGrid'
import { Star } from 'lucide-react'
import { useRef } from 'react'

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

const FEATURED_ARTIST = COMMUNITY_MEMBERS[0]

export function ComunidadArtistsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className="bg-background w-full border-b-2 border-zinc-200">
      <div className="mx-[100px] border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
        {/* Artista destacado del mes */}
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
              <div className="relative aspect-[4/5] overflow-hidden border-2 border-zinc-200">
                <img
                  src={FEATURED_ARTIST.image}
                  alt={FEATURED_ARTIST.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-zinc-950/85 via-transparent to-transparent p-5">
                  <p className="text-lg font-bold text-white">{FEATURED_ARTIST.name}</p>
                  <p className="text-sm text-white/70">{FEATURED_ARTIST.discipline}</p>
                  <p className="text-xs text-white/50">{FEATURED_ARTIST.location}</p>
                </div>
              </div>
            </TimelineAnimation>

            <TimelineAnimation as="div" animationNum={2} timelineRef={sectionRef}>
              <div className="space-y-4">
                <h3 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
                  {FEATURED_ARTIST.name}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  Artista destacado del mes por su trayectoria y contribución a la comunidad de
                  {FEATURED_ARTIST.discipline.toLowerCase()} en {FEATURED_ARTIST.location}. Su
                  trabajo ha inspirado a otros miembros y representa los valores de Ópera Prima.
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

        {/* Descubre a otros miembros */}
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
            <MemberGrid members={COMMUNITY_MEMBERS} disciplines={DISCIPLINES} />
          </TimelineAnimation>
        </div>
      </div>
    </section>
  )
}

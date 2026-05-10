'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { CalendarDays, Compass, Layers, Users } from 'lucide-react'
import { useRef } from 'react'

const SERVICES = [
  {
    num: '01',
    icon: Users,
    title: 'Mentorías 1:1',
    desc: 'Sesiones personalizadas con artistas y gestores culturales que ya han recorrido el camino. Aprende directo de quien lo vive.',
    accent: '#F65B7F',
    href: '/mentorias',
  },
  {
    num: '02',
    icon: CalendarDays,
    title: 'Talleres y Eventos',
    desc: 'Workshops prácticos, encuentros de networking y residencias. Presenciales y online, pensados para el contexto colombiano.',
    accent: '#1A4A3C',
    href: '/eventos',
  },
  {
    num: '03',
    icon: Compass,
    title: 'Tablero de Oportunidades',
    desc: 'Convocatorias, becas y proyectos que buscan artistas como tú. Actualizado constantemente por nuestro equipo editorial.',
    accent: '#5E3A8A',
    href: '/tablero',
  },
  {
    num: '04',
    icon: Layers,
    title: 'Membresía Premium',
    desc: 'Acceso completo a contenido exclusivo, tarifas preferenciales en eventos y visibilidad dentro de la comunidad.',
    accent: '#F65B7F',
    href: '/membresia',
  },
]

export function WhatIsSection() {
  const ref = useRef<HTMLElement>(null)

  return (
    <section ref={ref} className="bg-background w-full border-b-2 border-zinc-200">
      <div className="mx-auto max-w-420 border-zinc-200 sm:border-x">
        {/* -- Intro block -- */}
        <div className="border-b border-zinc-200 px-8 pt-20 pb-16">
          <div className="grid items-end gap-12 lg:grid-cols-[1fr_1.6fr]">
            {/* Label + headline */}
            <div>
              <TimelineAnimation
                as="p"
                animationNum={0}
                timelineRef={ref}
                className="mb-5 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
              >
                02 -- ¿Qué es Opera Prima?
              </TimelineAnimation>

              {/* Headline grande con la palabra destacada */}
              <TimelineAnimation
                as="h2"
                animationNum={1}
                timelineRef={ref}
                className="text-4xl leading-none font-bold tracking-[-0.03em] text-zinc-900 lg:text-[3.4rem]"
              >
                Bienvenido a{' '}
                <span className="relative inline-block" style={{ color: '#F65B7F' }}>
                  Ópera
                  {/* Underline pintada con el color de marca */}
                  <span
                    aria-hidden
                    className="absolute right-0 -bottom-1 left-0 h-0.75"
                    style={{ background: '#F65B7F' }}
                  />
                </span>{' '}
                Prima
              </TimelineAnimation>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-6 lg:pb-1">
              <TimelineAnimation
                as="p"
                animationNum={2}
                timelineRef={ref}
                className="max-w-lg text-lg leading-relaxed text-zinc-500"
              >
                Una plataforma digital que acompaña a artistas emergentes con herramientas reales
                para dar sus primeros pasos profesionales.
              </TimelineAnimation>
              <TimelineAnimation
                as="p"
                animationNum={3}
                timelineRef={ref}
                className="max-w-lg text-base leading-relaxed text-zinc-400"
              >
                Aquí encuentras herramientas, oportunidades y una comunidad que te ayuda a construir
                tu camino profesional con estrategia, no con suerte.
              </TimelineAnimation>
            </div>
          </div>
        </div>

        {/* -- Services tagline -- */}
        <div className="flex items-center justify-between gap-8 border-b border-zinc-200 px-8 py-8">
          <TimelineAnimation
            as="p"
            animationNum={4}
            timelineRef={ref}
            className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
          >
            Nuestros servicios
          </TimelineAnimation>
          <div className="h-px flex-1 bg-zinc-200" aria-hidden />
        </div>

        {/* -- Services grid -- */}
        <div className="grid grid-cols-1 divide-y divide-zinc-200 md:grid-cols-2 md:divide-y-0">
          {SERVICES.map((s, i) => {
            const Icon = s.icon
            return (
              <TimelineAnimation
                key={s.num}
                as="a"
                href={s.href}
                animationNum={i + 5}
                timelineRef={ref}
                className={`group flex flex-col gap-6 border-zinc-200 px-8 py-12 transition-all duration-200 hover:bg-zinc-50 ${i % 2 === 0 ? 'md:border-r' : ''} ${i < 2 ? 'border-b' : ''}`}
              >
                {/* Num + Icon row */}
                <div className="flex items-start justify-between">
                  <span
                    className="text-[0.6rem] font-bold tracking-[0.24em] uppercase"
                    style={{ color: s.accent }}
                  >
                    {s.num}
                  </span>
                  <div
                    className="flex h-10 w-10 items-center justify-center border-2 transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{
                      borderColor: `${s.accent}50`,
                      color: s.accent,
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = `3px 3px 0 ${s.accent}`
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                    }}
                  >
                    <Icon size={18} />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-xl leading-snug font-bold tracking-tight text-zinc-900">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500">{s.desc}</p>
                </div>

                <span
                  className="mt-auto flex items-center gap-1.5 self-start text-[0.62rem] font-bold tracking-widest uppercase transition-all duration-150 group-hover:gap-3"
                  style={{ color: s.accent }}
                >
                  Explorar →
                </span>
              </TimelineAnimation>
            )
          })}
        </div>
      </div>
    </section>
  )
}

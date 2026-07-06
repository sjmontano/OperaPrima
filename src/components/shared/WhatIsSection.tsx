'use client'

import { EditableText } from '@/components/editor/EditableText'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight, CalendarDays, Compass, Globe, Users, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  CalendarDays,
  Compass,
  Globe,
}

export interface ServiceCard {
  num: string
  icon: string
  title: string
  desc: string
  accent: string
  href: string
}

const DEFAULT_CARDS: ServiceCard[] = [
  {
    num: '01',
    icon: 'Users',
    title: 'Mentorías 1:1',
    desc: 'Sesiones personalizadas con artistas y gestores culturales que ya han recorrido el camino. Aprende directo de quien lo vive.',
    accent: '#8ECAE6',
    href: '/mentorias',
  },
  {
    num: '02',
    icon: 'CalendarDays',
    title: 'Talleres y Eventos',
    desc: 'Workshops prácticos, encuentros de networking y residencias. Presenciales y online, pensados para impulsar tu carrera.',
    accent: '#023047',
    href: '/eventos',
  },
  {
    num: '03',
    icon: 'Compass',
    title: 'Tablero de Oportunidades',
    desc: 'Convocatorias, becas y proyectos que buscan artistas como tú. Actualizado constantemente por nuestro equipo editorial.',
    accent: '#4682B4',
    href: '/tablero',
  },
  {
    num: '04',
    icon: 'Globe',
    title: 'Comunidad',
    desc: 'Conecta con otros artistas emergentes, comparte tu trabajo y encuentra colaboraciones que impulsen tu carrera.',
    accent: '#E63946',
    href: '/comunidad',
  },
]

export function WhatIsSection({
  eyebrow = '¿Qué es Opera Prima?',
  heading = 'Bienvenido a Ópera Prima',
  description = 'Una plataforma digital que acompaña a artistas emergentes con herramientas reales para dar sus primeros pasos profesionales.',
  description2 = 'Aquí encuentras herramientas, oportunidades y una comunidad que te ayuda a construir tu camino profesional con estrategia, no con suerte.',
  serviceEyebrow = 'Nuestros servicios',
  serviceHeading = 'Todo lo que necesitas para crecer',
  cards = DEFAULT_CARDS,
  isEditMode,
  __onFieldChange,
}: {
  eyebrow?: string
  heading?: string
  description?: string
  description2?: string
  serviceEyebrow?: string
  serviceHeading?: string
  cards?: ServiceCard[]
  isEditMode?: boolean
  __onFieldChange?: (path: string, value: unknown) => void
}) {
  const ref = useRef<HTMLElement>(null)

  return (
    <section ref={ref} className="bg-background no-borders w-full border-b-2 border-zinc-200">
      <div className="no-borders mx-[100px] border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
        <div className="border-b border-zinc-200 px-8 pt-20 pb-16">
          <div className="grid items-end gap-12 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <TimelineAnimation
                as="p"
                animationNum={0}
                timelineRef={ref}
                className="mb-5 text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase"
              >
                <EditableText
                  value={eyebrow}
                  onSave={(v) => __onFieldChange?.('eyebrow', v)}
                  as="span"
                  singleLine
                  className=""
                />
              </TimelineAnimation>

              <TimelineAnimation
                as="h2"
                animationNum={1}
                timelineRef={ref}
                className="text-4xl leading-none font-semibold tracking-[-0.03em] text-zinc-900 lg:text-[3.4rem]"
              >
                <EditableText
                  value={heading}
                  onSave={(v) => __onFieldChange?.('heading', v)}
                  as="span"
                  className=""
                />
              </TimelineAnimation>
            </div>

            <div className="flex flex-col gap-6 lg:pb-1">
              <TimelineAnimation
                as="p"
                animationNum={2}
                timelineRef={ref}
                className="max-w-lg text-lg leading-relaxed text-zinc-500"
              >
                <EditableText
                  value={description}
                  onSave={(v) => __onFieldChange?.('description', v)}
                  as="span"
                  className=""
                />
              </TimelineAnimation>
              <TimelineAnimation
                as="p"
                animationNum={3}
                timelineRef={ref}
                className="max-w-lg text-base leading-relaxed text-zinc-400"
              >
                <EditableText
                  value={description2}
                  onSave={(v) => __onFieldChange?.('description2', v)}
                  as="span"
                  className=""
                />
              </TimelineAnimation>
              <TimelineAnimation as="div" animationNum={4} timelineRef={ref}>
                <Link
                  href="/sobre"
                  className="inline-flex items-center gap-2 border-2 border-[#023047] bg-[#023047] px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-transparent hover:text-[#023047] hover:shadow-[4px_4px_0_#023047]"
                >
                  Conoce más
                  <ArrowRight size={14} />
                </Link>
              </TimelineAnimation>
            </div>
          </div>
        </div>

        <div className="px-8 pt-16 pb-6">
          <TimelineAnimation
            as="p"
            animationNum={4}
            timelineRef={ref}
            className="mb-3 text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase"
          >
            <EditableText
              value={serviceEyebrow}
              onSave={(v) => __onFieldChange?.('serviceEyebrow', v)}
              as="span"
              singleLine
              className=""
            />
          </TimelineAnimation>
          <TimelineAnimation
            as="h2"
            animationNum={5}
            timelineRef={ref}
            className="text-4xl leading-none font-semibold tracking-[-0.03em] text-zinc-900 lg:text-[3.4rem]"
          >
            <EditableText
              value={serviceHeading}
              onSave={(v) => __onFieldChange?.('serviceHeading', v)}
              as="span"
              className=""
            />
          </TimelineAnimation>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-px md:bg-zinc-200">
          {cards.map((s, i) => {
            const Icon = ICON_MAP[s.icon]
            return (
              <TimelineAnimation
                key={s.num}
                as="a"
                href={s.href}
                animationNum={i + 6}
                timelineRef={ref}
                className={`group relative flex flex-col gap-6 bg-white px-8 py-12 transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:shadow-lg ${i % 2 === 0 ? 'md:border-r md:border-zinc-200' : ''} ${i < 2 ? 'border-b border-zinc-200 md:border-b-0' : ''}`}
                style={{
                  borderBottom: i >= 2 ? '1px solid' : undefined,
                  borderColor: i >= 2 ? '#e4e4e7' : undefined,
                }}
              >
                {/* Accent bar on hover */}
                <div
                  className="absolute top-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: s.accent }}
                />

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
                      boxShadow: `0 0 0 ${s.accent}00`,
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = `3px 3px 0 ${s.accent}`
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                    }}
                  >
                    {Icon && <Icon size={18} />}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-xl leading-snug font-bold tracking-tight text-zinc-900 transition-colors duration-200 group-hover:text-[#023047]">
                    <EditableText
                      value={s.title}
                      onSave={(v) => __onFieldChange?.(`cards.${i}.title`, v)}
                      as="span"
                      singleLine
                      className=""
                    />
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    <EditableText
                      value={s.desc}
                      onSave={(v) => __onFieldChange?.(`cards.${i}.desc`, v)}
                      as="span"
                      className=""
                    />
                  </p>
                </div>

                <span
                  className="mt-auto flex items-center gap-1.5 self-start text-[0.62rem] font-bold tracking-widest uppercase transition-all duration-300 group-hover:gap-3"
                  style={{ color: s.accent }}
                >
                  Explorar
                  <ArrowRight
                    size={12}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </TimelineAnimation>
            )
          })}
        </div>
      </div>
    </section>
  )
}

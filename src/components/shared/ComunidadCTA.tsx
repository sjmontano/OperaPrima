'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { EditableRichText } from '@/components/editor/EditableRichText'
import { EditableText } from '@/components/editor/EditableText'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight, Globe, Palette, Users, type LucideIcon } from 'lucide-react'
import { motion, useInView } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Palette,
  Globe,
}

export interface CTAStat {
  icon: string
  end: number
  thousands: boolean
  suffix: string
  label: string
}

const DEFAULT_STATS: CTAStat[] = [
  { icon: 'Users', end: 0, thousands: false, suffix: '', label: 'artistas registrados' },
  { icon: 'Palette', end: 0, thousands: false, suffix: '', label: 'eventos publicados' },
  { icon: 'Globe', end: 0, thousands: false, suffix: '', label: 'países alcanzados' },
]

function StatNumber({
  end,
  thousands,
  suffix,
}: {
  end: number
  thousands: boolean
  suffix: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const DURATION = 1600
    const startTime = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / DURATION, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(eased * end)
      setCount(current)
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(end)
    }
    requestAnimationFrame(tick)
  }, [inView, end])

  const display = thousands ? count.toLocaleString('es-CO') : String(count)
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

export function ComunidadCTA({
  eyebrow = 'Únete a la comunidad',
  headline = 'Tu obra merece más público, más oportunidades.',
  description = 'Opera Prima conecta artistas emergentes con mentores, talleres, convocatorias y una comunidad que entiende lo que significa construir una carrera artística desde cero.',
  stats = DEFAULT_STATS,
  primaryCta = { label: 'Comenzar gratis', href: '/registro' },
  secondaryCta = { label: 'Conocer más', href: '/sobre' },
  isEditMode,
  __onFieldChange,
}: {
  eyebrow?: string
  headline?: string
  description?: string
  stats?: CTAStat[]
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  isEditMode?: boolean
  __onFieldChange?: (path: string, value: unknown) => void
}) {
  const ref = useRef<HTMLElement>(null)
  const { currentUser } = useAuthModal()
  const [liveStats, setLiveStats] = useState<CTAStat[] | null>(null)

  useEffect(() => {
    fetch('/api/stats/public')
      .then((r) => r.json())
      .then((data) => {
        if (data.totalUsuarios !== undefined) {
          setLiveStats([
            {
              icon: 'Users',
              end: data.totalUsuarios,
              thousands: false,
              suffix: '',
              label: 'artistas registrados',
            },
            {
              icon: 'Palette',
              end: data.totalEventos,
              thousands: false,
              suffix: '',
              label: 'eventos publicados',
            },
            {
              icon: 'Globe',
              end: data.paises,
              thousands: false,
              suffix: '',
              label: 'países alcanzados',
            },
          ])
        }
      })
      .catch(() => {})
  }, [])

  const displayStats = liveStats ?? stats

  const effectivePrimaryCta = useMemo(() => {
    if (!isEditMode && currentUser) {
      return { label: 'Ir a la comunidad', href: '/comunidad' }
    }
    return primaryCta
  }, [isEditMode, currentUser, primaryCta])

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-[#0f0f0f]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(246,91,127,0.04),transparent_60%)]"
      />
      <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#F65B7F]" />

      <div className="relative z-10 mx-[100px] border-white/10 px-8 py-28 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 lg:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_auto] lg:gap-24">
          <div className="max-w-3xl">
            <TimelineAnimation
              as="p"
              animationNum={0}
              timelineRef={ref}
              className="mb-6 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
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
              className="mb-8 text-5xl leading-[1.0] font-semibold tracking-[-0.03em] text-white lg:text-[4.5rem]"
            >
              <EditableRichText
                value={headline}
                onSave={(v) => __onFieldChange?.('headline', v)}
                as="span"
              />
            </TimelineAnimation>

            <TimelineAnimation
              as="div"
              animationNum={2}
              timelineRef={ref}
              className="mb-12 max-w-xl text-lg leading-relaxed text-white/60"
            >
              <EditableRichText
                value={description}
                onSave={(v) => __onFieldChange?.('description', v)}
                as="span"
              />
            </TimelineAnimation>

            <TimelineAnimation
              as="div"
              animationNum={3}
              timelineRef={ref}
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href={effectivePrimaryCta.href}
                className="inline-flex items-center gap-3 border-2 border-[#F65B7F] bg-[#F65B7F] px-8 py-4 text-xs font-bold tracking-widest text-white uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_rgba(255,255,255,0.25)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <EditableText
                  value={effectivePrimaryCta.label}
                  onSave={(v) => __onFieldChange?.('primaryCta.label', v)}
                  as="span"
                  singleLine
                  className=""
                />
                <ArrowRight size={16} />
              </a>

              <a
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 border-2 border-white/25 px-8 py-4 text-xs font-bold tracking-widest text-white/70 uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-white/60 hover:text-white hover:shadow-[4px_4px_0_rgba(255,255,255,0.12)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <EditableText
                  value={secondaryCta.label}
                  onSave={(v) => __onFieldChange?.('secondaryCta.label', v)}
                  as="span"
                  singleLine
                  className=""
                />
              </a>
            </TimelineAnimation>
          </div>

          <div className="flex gap-4 lg:flex-col lg:gap-0 lg:divide-y lg:divide-white/10">
            {displayStats.map(({ icon, end, thousands, suffix, label }, i) => {
              const Icon = ICON_MAP[icon]
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex min-w-[120px] flex-col gap-1 lg:py-8"
                >
                  {Icon && <Icon size={18} className="mb-2 text-[#F65B7F]" />}
                  <span className="text-4xl leading-none font-bold tracking-tight text-white">
                    <StatNumber end={end} thousands={thousands} suffix={suffix} />
                  </span>
                  <span className="text-xs tracking-widest text-white/40 uppercase">
                    <EditableText
                      value={label}
                      onSave={(v) => __onFieldChange?.(`stats.${i}.label`, v)}
                      as="span"
                      singleLine
                      className=""
                    />
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 h-px bg-white/10" />
    </section>
  )
}

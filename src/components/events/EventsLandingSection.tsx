'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight, BookOpen, CalendarDays, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const TYPEWRITER_WORDS = [
  'presentarte a convocatorias',
  'vender tu trabajo',
  'construir tu carrera',
] as const

const HIGHLIGHTS = [
  'Herramientas reales, no teoría vacía',
  'Profesionales del sector en cada sesión',
  'Networking con intención y criterio',
] as const

function useRotatingTypewriter(words: readonly string[]) {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setReduceMotion(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    const currentWord = words[wordIndex] ?? ''
    const typeSpeed = 55
    const deleteSpeed = 28
    const pauseSpeed = 1500
    const resetSpeed = 220

    let timeoutId: number

    if (!isDeleting && charIndex < currentWord.length) {
      timeoutId = window.setTimeout(() => {
        setCharIndex((value) => value + 1)
      }, typeSpeed)
    } else if (!isDeleting && charIndex === currentWord.length) {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(true)
      }, pauseSpeed)
    } else if (isDeleting && charIndex > 0) {
      timeoutId = window.setTimeout(() => {
        setCharIndex((value) => value - 1)
      }, deleteSpeed)
    } else {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false)
        setWordIndex((value) => (value + 1) % words.length)
      }, resetSpeed)
    }

    return () => window.clearTimeout(timeoutId)
  }, [charIndex, isDeleting, reduceMotion, wordIndex, words])

  if (reduceMotion) {
    return words[0] ?? ''
  }

  return words[wordIndex]?.slice(0, charIndex) ?? ''
}

function InfoCard({
  eyebrow,
  title,
  body,
  accent,
  icon: Icon,
  animationNum,
  timelineRef,
}: {
  eyebrow: string
  title: string
  body: string
  accent: string
  icon: typeof BookOpen
  animationNum: number
  timelineRef: React.RefObject<HTMLElement | null>
}) {
  return (
    <TimelineAnimation
      as="article"
      animationNum={animationNum}
      timelineRef={timelineRef}
      className="group border-2 border-white/10 bg-white/5 p-7 shadow-[4px_4px_0_rgba(255,255,255,0.08)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#F65B7F]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-[0.62rem] font-bold tracking-[0.28em] uppercase"
            style={{ color: accent }}
          >
            {eyebrow}
          </p>
          <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-white">{title}</h3>
        </div>
        <div
          className="flex size-11 items-center justify-center border-2 border-white/12 text-white/80 transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
          style={{ boxShadow: `3px 3px 0 ${accent}` }}
        >
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-white/70">{body}</p>
    </TimelineAnimation>
  )
}

function RotatingCTA() {
  const visibleWord = useRotatingTypewriter(TYPEWRITER_WORDS)

  return (
    <div className="border-2 border-white/10 bg-black/30 p-8 sm:p-10 lg:p-12">
      <div className="flex flex-wrap items-baseline gap-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
        <span className="sr-only">Cómo {TYPEWRITER_WORDS.join('. Cómo ')}.</span>
        <span aria-hidden className="text-[#F65B7F]">
          Cómo
        </span>
        <span aria-hidden className="min-h-[1.2em] text-white">
          {visibleWord}
        </span>
        <span
          aria-hidden="true"
          className="inline-block h-[1em] w-0.5 animate-pulse bg-[#F65B7F] align-middle"
        />
      </div>
      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-white/65">
        Talleres pensados para darte herramientas aplicables, ayudarte a tomar decisiones
        estratégicas y mostrarte un camino profesional que sí puedas sostener.
      </p>
    </div>
  )
}

export function EventsLandingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const authModal = useAuthModal()

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden border-b border-white/10 bg-[#0f0f0f]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#F65B7F]" />

      <div className="relative z-10 mx-auto max-w-420 border-white/10 px-4 sm:border-x sm:px-6">
        <div className="grid gap-20 px-4 py-28 sm:px-2 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-30">
          <div className="max-w-3xl">
            <TimelineAnimation
              as="h1"
              animationNum={1}
              timelineRef={sectionRef}
              className="text-5xl leading-[1.2] font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-[4rem]"
            >
              Formación práctica y conexiones reales para artistas que quieren crecer con método.
            </TimelineAnimation>

            <TimelineAnimation
              as="p"
              animationNum={2}
              timelineRef={sectionRef}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-white/68"
            >
              Nuestros talleres son espacios de formación práctica diseñados para artistas que
              quieren dar el salto al mundo profesional. Aquí no se trata de teoría, sino de
              herramientas reales para postular, construir portafolio, gestionar proyectos y tomar
              decisiones estratégicas sobre tu carrera.
            </TimelineAnimation>

            <TimelineAnimation
              as="div"
              animationNum={3}
              timelineRef={sectionRef}
              className="mt-12 flex flex-wrap gap-4"
            >
              {HIGHLIGHTS.map((highlight, index) => {
                const colors = ['#F65B7F', '#1A4A3C', '#5E3A8A'] as const
                const accent = colors[index % colors.length]

                return (
                  <span
                    key={highlight}
                    className="border-2 border-white/10 px-4 py-2.5 text-[0.62rem] font-bold tracking-[0.24em] text-white/80 uppercase"
                    style={{ boxShadow: `3px 3px 0 ${accent}` }}
                  >
                    {highlight}
                  </span>
                )
              })}
            </TimelineAnimation>
          </div>

          <div className="grid gap-4 self-start">
            <InfoCard
              eyebrow="Talleres"
              title="Aprender haciendo"
              body="Cada taller está guiado por profesionales del sector y pensado para responder a lo que no te enseñaron en la universidad, pero necesitas para vivir del arte."
              accent="#F65B7F"
              icon={BookOpen}
              animationNum={4}
              timelineRef={sectionRef}
            />

            <InfoCard
              eyebrow="Eventos"
              title="Networking con intención"
              body="Nuestros eventos de networking son espacios para conectar, compartir y generar oportunidades reales. Las conexiones surgen desde intereses comunes y el deseo de crecer en comunidad."
              accent="#1A4A3C"
              icon={Users}
              animationNum={5}
              timelineRef={sectionRef}
            />

            <div className="border-2 border-white/10 bg-white/5 p-5 text-white/70 shadow-[4px_4px_0_rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                <CalendarDays size={14} />
                Próxima agenda
              </div>
              <p className="mt-3 text-sm leading-relaxed">
                Talleres presenciales y encuentros de networking diseñados para darte contexto,
                método y comunidad real.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-white/10 px-4 py-16 sm:px-2 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <TimelineAnimation
                as="div"
                animationNum={6}
                timelineRef={sectionRef}
                className="mt-0"
              >
                <RotatingCTA />
              </TimelineAnimation>
            </div>

            <TimelineAnimation
              as="div"
              animationNum={7}
              timelineRef={sectionRef}
              className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:gap-4"
            >
              <button
                type="button"
                onClick={() => authModal.open('registro')}
                className="inline-flex items-center justify-center gap-2 border-2 border-[#F65B7F] bg-[#F65B7F] px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-transparent hover:text-[#F65B7F] hover:shadow-[4px_4px_0_#111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Comenzar gratis
                <ArrowRight size={16} />
              </button>

              <a
                href="#proximos"
                className="inline-flex items-center justify-center border-2 border-white/20 px-6 py-3 text-xs font-bold tracking-widest text-white/80 uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-white/60 hover:text-white hover:shadow-[4px_4px_0_rgba(255,255,255,0.12)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Ver próximos talleres
              </a>
            </TimelineAnimation>
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 h-px bg-white/10" />
    </section>
  )
}

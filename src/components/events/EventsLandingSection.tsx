'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight, BookOpen, CalendarDays, Sparkles, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const TYPEWRITER_WORDS = [
  'presentarte a convocatorias',
  'vender tu trabajo',
  'construir tu carrera',
] as const

const HIGHLIGHTS = [
  'Herramientas reales',
  'Profesionales del sector',
  'Networking con criterio',
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
      className="group border-2 border-white/10 bg-white/5 p-7 shadow-[4px_4px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1"
      style={{ boxShadow: `4px 4px 0 rgba(255,255,255,0.06)` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-[0.62rem] font-bold tracking-[0.28em] uppercase"
            style={{ color: accent }}
          >
            {eyebrow}
          </p>
          <h3 className="mt-4 text-2xl leading-snug font-bold tracking-[-0.03em] text-white">
            {title}
          </h3>
        </div>
        <div
          className="flex size-10 shrink-0 items-center justify-center border-2 border-white/12 text-white transition-all duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
          style={{ boxShadow: `3px 3px 0 ${accent}` }}
        >
          <Icon size={17} />
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-white/65">{body}</p>
    </TimelineAnimation>
  )
}

function TypewriterBlock() {
  const visibleWord = useRotatingTypewriter(TYPEWRITER_WORDS)

  return (
    <div className="border-2 border-white/10 bg-white/[0.03] p-8 sm:p-10">
      <div className="mb-4 flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
        <Sparkles size={13} />
        Aprende a
      </div>
      <div className="flex flex-wrap items-baseline gap-3 text-3xl tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
        <span className="sr-only">Cómo {TYPEWRITER_WORDS.join('. Cómo ')}.</span>
        <span aria-hidden className="min-h-[1.2em] font-semibold text-white">
          {visibleWord}
        </span>
        <span
          aria-hidden="true"
          className="inline-block h-[1em] w-[3px] animate-pulse bg-[#F65B7F] align-middle"
        />
      </div>
    </div>
  )
}

export function EventsLandingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const authModal = useAuthModal()
  const { currentUser } = authModal
  const router = useRouter()

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden border-x-0 border-b border-white/10 bg-[#0f0f0f]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(246,91,127,0.04),transparent_70%)]"
      />
      <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#F65B7F]" />

      <div className="relative z-10 mx-[100px] border-white/10 px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
        <div className="grid gap-16 px-4 py-24 sm:px-2 lg:grid-cols-[1.3fr_0.9fr] lg:gap-20 lg:py-28">
          <div className="max-w-3xl">
            <TimelineAnimation
              as="h1"
              animationNum={1}
              timelineRef={sectionRef}
              className="text-4xl leading-[1.1] font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.5rem]"
            >
              Aprende, conecta y <span className="text-[#F65B7F]">crece con método.</span>
            </TimelineAnimation>

            <TimelineAnimation
              as="p"
              animationNum={2}
              timelineRef={sectionRef}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/60"
            >
              Talleres prácticos y encuentros de networking. Herramientas reales para tomar
              decisiones estratégicas sobre tu carrera.
            </TimelineAnimation>

            <TimelineAnimation
              as="div"
              animationNum={3}
              timelineRef={sectionRef}
              className="mt-10 flex flex-wrap gap-3"
            >
              {HIGHLIGHTS.map((highlight, index) => {
                const colors = ['#F65B7F', '#8ECAE6', '#1A4A3C'] as const
                const accent = colors[index % colors.length]

                return (
                  <span
                    key={highlight}
                    className="border-2 border-white/10 px-4 py-2 text-[0.6rem] font-bold tracking-[0.24em] text-white/80 uppercase"
                    style={{ boxShadow: `3px 3px 0 ${accent}` }}
                  >
                    {highlight}
                  </span>
                )
              })}
            </TimelineAnimation>

            <TimelineAnimation as="div" animationNum={4} timelineRef={sectionRef} className="mt-16">
              <TypewriterBlock />
            </TimelineAnimation>
          </div>

          <div className="flex flex-col gap-4 self-start">
            <InfoCard
              eyebrow="Talleres"
              title="Aprender haciendo"
              body="Cada sesión guiada por profesionales del sector. Lo que no te enseñaron en la universidad pero necesitas para vivir del arte."
              accent="#F65B7F"
              icon={BookOpen}
              animationNum={5}
              timelineRef={sectionRef}
            />
            <InfoCard
              eyebrow="Networking"
              title="Conectar con propósito"
              body="Encuentros con artistas, gestores y profesionales del sector cultural para construir relaciones que impulsan tu carrera."
              accent="#8ECAE6"
              icon={Users}
              animationNum={6}
              timelineRef={sectionRef}
            />
            <TimelineAnimation
              as="div"
              animationNum={7}
              timelineRef={sectionRef}
              className="flex items-center gap-3 border-2 border-white/10 bg-white/[0.03] px-5 py-4"
            >
              <CalendarDays size={16} className="shrink-0 text-[#8ECAE6]" />
              <span className="text-xs leading-relaxed text-white/60">
                Talleres presenciales y online. Próxima agenda disponible en el calendario.
              </span>
            </TimelineAnimation>
          </div>
        </div>

        <div className="border-t-2 border-white/10 px-4 py-16 sm:px-2 lg:py-20">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <TimelineAnimation
              as="p"
              animationNum={8}
              timelineRef={sectionRef}
              className="max-w-lg text-lg leading-relaxed text-white/60"
            >
              Todo los talleres están diseñados para darte contexto, método y comunidad real. No es
              solo formación, es el empujón que necesitabas.
            </TimelineAnimation>

            <TimelineAnimation
              as="div"
              animationNum={9}
              timelineRef={sectionRef}
              className="flex shrink-0 flex-col gap-3 sm:flex-row"
            >
              <button
                type="button"
                onClick={() => {
                  if (currentUser) router.push('/eventos')
                  else authModal.open('registro')
                }}
                className="inline-flex items-center justify-center gap-2 border-2 border-[#F65B7F] bg-[#F65B7F] px-7 py-3 text-xs font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-transparent hover:text-[#F65B7F] hover:shadow-[4px_4px_0_#353535] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                {currentUser ? 'Ver eventos' : 'Comenzar gratis'}
                <ArrowRight size={16} />
              </button>

              <a
                href="#proximos"
                className="inline-flex items-center justify-center border-2 border-white/20 px-7 py-3 text-xs font-bold tracking-widest text-white/70 uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-white/50 hover:text-white hover:shadow-[4px_4px_0_rgba(255,255,255,0.1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
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

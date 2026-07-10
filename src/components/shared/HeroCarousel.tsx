'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { EditableText } from '@/components/editor/EditableText'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export interface HeroSlide {
  id: number
  headline: string
  subtext: string
  cta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  bg: string
  accent: string
  tag: string
  bgImage?: string
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 1,
    headline: 'El arte emergente\nnecesita tu voz.',
    subtext:
      'Conecta con mentores que ya recorrieron el camino. Aprende, crece y haz que tu obra llegue más lejos.',
    cta: { label: 'Explorar mentores', href: '/mentorias' },
    secondaryCta: { label: 'Conocer más', href: '/sobre' },
    bg: 'from-[#1a1a1a] to-[#2d1a14]',
    accent: '#8ECAE6',
    tag: 'Mentorías 1:1',
  },
  {
    id: 2,
    headline: 'Comunidad que\nimpulsa tu obra.',
    subtext:
      'Talleres, eventos y networking con otros artistas emergentes. Tu próximo colaborador está aquí.',
    cta: { label: 'Ver eventos', href: '/eventos' },
    secondaryCta: { label: 'Unirte gratis', href: '/registro' },
    bg: 'from-[#0d2b24] to-[#023047]',
    accent: '#8ECAE6',
    tag: 'Talleres y Eventos',
  },
  {
    id: 3,
    headline: 'Oportunidades\nreales, ahora.',
    subtext:
      'Convocatorias, residencias y proyectos que buscan artistas como tú. El tablero que faltaba.',
    cta: { label: 'Ver tablero', href: '/tablero' },
    secondaryCta: { label: 'Registrarse', href: '/registro' },
    bg: 'from-[#1e1228] to-[#4682B4]',
    accent: '#8ECAE6',
    tag: 'Tablero de Oportunidades',
  },
  {
    id: 4,
    headline: 'Tu próximo paso\nempieza aquí.',
    subtext: 'Plataforma para artistas emergentes. Acceso a contenido exclusivo, mentores y más.',
    cta: { label: 'Comenzar ahora', href: '/registro' },
    secondaryCta: { label: 'Iniciar sesión', href: '/login' },
    bg: 'from-[#353535] to-[#1c1c1c]',
    accent: '#8ECAE6',
    tag: 'Ópera Prima',
  },
]

const DEFAULT_AUTO_PLAY_INTERVAL = 5000
const DEFAULT_TRANSITION_DURATION = 0.7

export function HeroCarousel({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = DEFAULT_AUTO_PLAY_INTERVAL,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
  isEditMode,
  __onFieldChange,
}: {
  slides?: HeroSlide[]
  autoPlayInterval?: number
  transitionDuration?: number
  isEditMode?: boolean
  __onFieldChange?: (path: string, value: unknown) => void
}) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [hovered, setHovered] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { currentUser } = useAuthModal()

  const OVERRIDE_LABELS = useMemo(
    () => ({
      '/registro': { label: 'Ir a la comunidad', href: '/comunidad' },
      '/login': {
        label: 'Mi perfil',
        href: currentUser ? `/perfil/${currentUser.username}` : '/login',
      },
    }),
    [currentUser]
  )

  const getEffectiveCta = useCallback(
    (cta: { label: string; href: string }) => {
      if (isEditMode || !currentUser) return cta
      const override = OVERRIDE_LABELS[cta.href as keyof typeof OVERRIDE_LABELS]
      return override ?? cta
    },
    [isEditMode, currentUser, OVERRIDE_LABELS]
  )

  const go = useCallback(
    (index: number, dir: 1 | -1) => {
      setDirection(dir)
      setCurrent((index + slides.length) % slides.length)
    },
    [slides.length]
  )

  const next = useCallback(() => go(current + 1, 1), [current, go])
  const prev = useCallback(() => go(current - 1, -1), [current, go])

  useEffect(() => {
    if (hovered || isEditMode) return
    intervalRef.current = setInterval(next, autoPlayInterval)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [hovered, isEditMode, next, autoPlayInterval])

  const slide = slides[current]
  const effectiveCta = getEffectiveCta(slide.cta)
  const effectiveSecondaryCta = getEffectiveCta(slide.secondaryCta)

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '3%' : '-3%', opacity: 0 }),
    center: { x: '0%', opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-3%' : '3%', opacity: 0 }),
  }

  const textVariants = {
    hidden: { filter: 'blur(12px)', opacity: 0, y: 16 },
    visible: (i: number) => ({
      filter: 'blur(0px)',
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12 + 0.15,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  }

  return (
    <section
      className="relative w-full overflow-hidden border-b border-zinc-200"
      style={{ height: 'clamp(540px, 90vh, 860px)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: transitionDuration,
            ease: [0.32, 0.72, 0, 1],
          }}
          className={
            slide.bgImage ? 'absolute inset-0' : `absolute inset-0 bg-linear-to-br ${slide.bg}`
          }
        >
          {slide.bgImage ? (
            <>
              <Image
                src={slide.bgImage}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/50 to-black/70" />
            </>
          ) : null}

          <div className="relative mx-[100px] flex h-full flex-col justify-end border-white/10 px-6 pb-25 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-40 sm:pb-25">
            <motion.span
              key={`tag-${current}`}
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="mb-6 inline-block self-start rounded-sm px-3 py-1 text-xs font-semibold tracking-widest uppercase"
              style={{ color: slide.accent, borderColor: `${slide.accent}40`, border: `1px solid` }}
            >
              <EditableText
                value={slide.tag}
                onSave={(v) => __onFieldChange?.(`slides.${current}.tag`, v)}
                as="span"
                singleLine
                className=""
              />
            </motion.span>

            <motion.h1
              key={`h1-${current}`}
              custom={1}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="mb-5 leading-[1.05] font-semibold whitespace-pre-line text-white"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              <EditableText
                value={slide.headline}
                onSave={(v) => __onFieldChange?.(`slides.${current}.headline`, v)}
                as="span"
                className=""
              />
            </motion.h1>

            <motion.p
              key={`sub-${current}`}
              custom={2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="mb-8 max-w-xl leading-relaxed text-white/70"
              style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.125rem)' }}
            >
              <EditableText
                value={slide.subtext}
                onSave={(v) => __onFieldChange?.(`slides.${current}.subtext`, v)}
                as="span"
                className=""
              />
            </motion.p>

            <motion.div
              key={`cta-${current}`}
              custom={3}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href={effectiveCta.href}
                className="inline-flex items-center border-2 border-white/30 px-6 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all duration-150 ease-out hover:border-white hover:shadow-[4px_4px_0_rgba(255,255,255,0.5)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                style={{ backgroundColor: slide.accent, borderColor: slide.accent }}
              >
                <EditableText
                  value={effectiveCta.label}
                  onSave={(v) => __onFieldChange?.(`slides.${current}.cta.label`, v)}
                  as="span"
                  singleLine
                  className=""
                />
              </Link>
              <Link
                href={effectiveSecondaryCta.href}
                className="inline-flex items-center border-2 border-white/20 px-6 py-3 text-sm font-bold tracking-widest text-white/80 uppercase transition-all duration-150 ease-out hover:border-white/50 hover:bg-white/10 hover:text-white hover:shadow-[4px_4px_0_rgba(255,255,255,0.25)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <EditableText
                  value={effectiveSecondaryCta.label}
                  onSave={(v) => __onFieldChange?.(`slides.${current}.secondaryCta.label`, v)}
                  as="span"
                  singleLine
                  className=""
                />
              </Link>
            </motion.div>

            <div className="pointer-events-none absolute right-8 bottom-16 hidden opacity-10 select-none sm:right-16 sm:bottom-20 md:block">
              <Image
                src="/OperaPrima_Isotipo.svg"
                alt=""
                width={120}
                height={120}
                unoptimized
                className="invert"
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={prev}
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all duration-150 hover:scale-105 hover:bg-white/20 active:scale-95"
        aria-label="Slide anterior"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all duration-150 hover:scale-105 hover:bg-white/20 active:scale-95"
        aria-label="Slide siguiente"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i, i > current ? 1 : -1)}
            aria-label={`Ir al slide ${i + 1}`}
            className="relative h-1.5 overflow-hidden rounded-full bg-white/30 transition-all duration-300"
            style={{ width: i === current ? 28 : 10 }}
          >
            {i === current && (
              <motion.span
                key={`dot-fill-${current}`}
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: slide.accent }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="absolute top-5 right-6 z-10 font-mono text-xs text-white/40 tabular-nums select-none">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  )
}

'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

// -- Config --
const HERO_CAROUSEL_CONFIG = {
  autoPlayInterval: 5000,
  transitionDuration: 0.7,
  slides: [
    {
      id: 1,
      headline: 'El arte colombiano\nnecesita tu voz.',
      subtext:
        'Conecta con mentores que ya recorrieron el camino. Aprende, crece y haz que tu obra llegue más lejos.',
      cta: { label: 'Explorar mentores', href: '/mentorias' },
      secondaryCta: { label: 'Conocer más', href: '/sobre' },
      bg: 'from-[#1a1a1a] to-[#2d1a14]',
      accent: '#F65B7F',
      tag: 'Mentorías 1:1',
    },
    {
      id: 2,
      headline: 'Comunidad que\nimpulsa tu obra.',
      subtext:
        'Talleres, eventos y networking con otros artistas emergentes. Tu próximo colaborador está aquí.',
      cta: { label: 'Ver eventos', href: '/eventos' },
      secondaryCta: { label: 'Unirte gratis', href: '/registro' },
      bg: 'from-[#0d2b24] to-[#1A4A3C]',
      accent: '#4ade80',
      tag: 'Talleres y Eventos',
    },
    {
      id: 3,
      headline: 'Oportunidades\nreales, ahora.',
      subtext:
        'Convocatorias, residencias y proyectos que buscan artistas como tú. El tablero que faltaba.',
      cta: { label: 'Ver tablero', href: '/tablero' },
      secondaryCta: { label: 'Registrarse', href: '/registro' },
      bg: 'from-[#1e1228] to-[#3d2660]',
      accent: '#a78bfa',
      tag: 'Tablero de Oportunidades',
    },
    {
      id: 4,
      headline: 'Tu próximo paso\nempieza aquí.',
      subtext:
        'Plataforma de membresía para artistas emergentes colombianos. Acceso a contenido exclusivo, mentores y más.',
      cta: { label: 'Comenzar ahora', href: '/registro' },
      secondaryCta: { label: 'Iniciar sesión', href: '/login' },
      bg: 'from-[#111111] to-[#1c1c1c]',
      accent: '#F65B7F',
      tag: 'Ópera Prima',
    },
  ],
}

// -- Component --
export function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [hovered, setHovered] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { slides, autoPlayInterval } = HERO_CAROUSEL_CONFIG

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
    if (hovered) return
    intervalRef.current = setInterval(next, autoPlayInterval)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [hovered, next, autoPlayInterval])

  const slide = slides[current]

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
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: HERO_CAROUSEL_CONFIG.transitionDuration,
            ease: [0.32, 0.72, 0, 1],
          }}
          className={`absolute inset-0 bg-linear-to-br ${slide.bg}`}
        >
          {/* Grid overlay — editorial texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />

          {/* Content */}
          <div className="relative mx-auto flex h-full max-w-420 flex-col justify-end border-white/10 px-6 pb-25 sm:border-x sm:px-40 sm:pb-25">
            {/* Tag */}
            <motion.span
              key={`tag-${current}`}
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="mb-6 inline-block self-start rounded-sm px-3 py-1 text-xs font-semibold tracking-widest uppercase"
              style={{ color: slide.accent, borderColor: `${slide.accent}40`, border: `1px solid` }}
            >
              {slide.tag}
            </motion.span>

            {/* Headline */}
            <motion.h1
              key={`h1-${current}`}
              custom={1}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="mb-5 leading-[1.05] font-bold whitespace-pre-line text-white"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              {slide.headline}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              key={`sub-${current}`}
              custom={2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="mb-8 max-w-xl leading-relaxed text-white/70"
              style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.125rem)' }}
            >
              {slide.subtext}
            </motion.p>

            {/* CTAs */}
            <motion.div
              key={`cta-${current}`}
              custom={3}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-3"
            >
              <Link
                href={slide.cta.href}
                className="inline-flex items-center border-2 border-white/30 px-6 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all duration-150 ease-out hover:border-white hover:shadow-[4px_4px_0_rgba(255,255,255,0.5)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                style={{ backgroundColor: slide.accent, borderColor: slide.accent }}
              >
                {slide.cta.label}
              </Link>
              <Link
                href={slide.secondaryCta.href}
                className="inline-flex items-center border-2 border-white/20 px-6 py-3 text-sm font-bold tracking-widest text-white/80 uppercase transition-all duration-150 ease-out hover:border-white/50 hover:bg-white/10 hover:text-white hover:shadow-[4px_4px_0_rgba(255,255,255,0.25)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                {slide.secondaryCta.label}
              </Link>
            </motion.div>

            {/* Logo watermark */}
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

      {/* Arrow controls */}
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

      {/* Dot indicators */}
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

      {/* Slide counter */}
      <div className="absolute top-5 right-6 z-10 font-mono text-xs text-white/40 tabular-nums select-none">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  )
}

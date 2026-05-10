'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight, Mic, Palette, Users } from 'lucide-react'
import { motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const STATS = [
  { icon: Users, end: 2400, thousands: true, suffix: '+', label: 'artistas activos' },
  { icon: Palette, end: 120, thousands: false, suffix: '+', label: 'eventos al año' },
  { icon: Mic, end: 85, thousands: false, suffix: '+', label: 'mentores expertos' },
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
      // ease-out cubic
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

export function ComunidadCTA() {
  const ref = useRef<HTMLElement>(null)

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-[#0f0f0f]">
      {/* Grid overlay — same as hero */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Pink accent strip — top border */}
      <div className="absolute top-0 right-0 left-0 h-[3px] bg-[#F65B7F]" />

      <div className="relative z-10 mx-auto max-w-420 border-white/10 px-8 py-28 sm:border-x lg:py-36">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_auto] lg:gap-24">
          {/* -- Left: main copy -- */}
          <div className="max-w-3xl">
            <TimelineAnimation
              as="p"
              animationNum={0}
              timelineRef={ref}
              className="mb-6 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
            >
              Únete a la comunidad
            </TimelineAnimation>

            <TimelineAnimation
              as="h2"
              animationNum={1}
              timelineRef={ref}
              className="mb-8 text-5xl leading-[1.0] font-bold tracking-[-0.03em] text-white lg:text-[4.5rem]"
            >
              Tu obra merece
              <br />
              <span className="text-[#F65B7F]">más público,</span>
              <br />
              más oportunidades.
            </TimelineAnimation>

            <TimelineAnimation
              as="p"
              animationNum={2}
              timelineRef={ref}
              className="mb-12 max-w-xl text-lg leading-relaxed text-white/60"
            >
              Opera Prima conecta artistas emergentes colombianos con mentores, talleres,
              convocatorias y una comunidad que entiende lo que significa construir una carrera
              artística desde cero.
            </TimelineAnimation>

            <TimelineAnimation
              as="div"
              animationNum={3}
              timelineRef={ref}
              className="flex flex-wrap items-center gap-4"
            >
              {/* Primary CTA */}
              <a
                href="/registro"
                className="inline-flex items-center gap-3 border-2 border-[#F65B7F] bg-[#F65B7F] px-8 py-4 text-xs font-bold tracking-widest text-white uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_rgba(255,255,255,0.25)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Comenzar gratis
                <ArrowRight size={16} />
              </a>

              {/* Secondary CTA */}
              <a
                href="/sobre"
                className="inline-flex items-center gap-2 border-2 border-white/25 px-8 py-4 text-xs font-bold tracking-widest text-white/70 uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-white/60 hover:text-white hover:shadow-[4px_4px_0_rgba(255,255,255,0.12)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Conocer más
              </a>
            </TimelineAnimation>
          </div>

          {/* -- Right: stats -- */}
          <div className="flex gap-4 lg:flex-col lg:gap-0 lg:divide-y lg:divide-white/10">
            {STATS.map(({ icon: Icon, end, thousands, suffix, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex min-w-[120px] flex-col gap-1 lg:py-8"
              >
                <Icon size={18} className="mb-2 text-[#F65B7F]" />
                <span className="text-4xl leading-none font-bold tracking-tight text-white">
                  <StatNumber end={end} thousands={thousands} suffix={suffix} />
                </span>
                <span className="text-xs tracking-widest text-white/40 uppercase">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="absolute right-0 bottom-0 left-0 h-px bg-white/10" />
    </section>
  )
}

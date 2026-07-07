'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight, ChevronRight, Sparkles, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useAuthModal } from '@/components/auth/AuthModalProvider'

export function ComunidadLandingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const authModal = useAuthModal()
  const { currentUser } = authModal
  const router = useRouter()

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#0f0f0f]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(246,91,127,0.04),transparent_70%)]"
      />
      <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#F65B7F]" />

      <div className="relative z-10 mx-[100px] border-white/10 px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
        <div className="grid gap-16 px-4 py-28 sm:px-2 lg:grid-cols-[1.2fr_1fr] lg:gap-20 lg:py-32">
          <div className="max-w-3xl">
            <TimelineAnimation
              as="div"
              animationNum={0}
              timelineRef={sectionRef}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                <Sparkles size={13} />
                Comunidad
              </div>

              <h1 className="text-5xl leading-[1.05] font-extrabold tracking-[-0.04em] text-white sm:text-6xl lg:text-[4rem]">
                Bienvenidx a <span className="text-[#F65B7F]">Ópera Prima</span>
              </h1>

              <p className="text-xl leading-relaxed font-semibold text-white/90 sm:text-2xl">
                Un espacio donde artistas emergentes se acompañan, crecen y construyen su camino
                profesional juntos.
              </p>

              <p className="text-base leading-relaxed text-white/60">
                Aquí encuentras una red activa de creadores, oportunidades de colaboración y un
                calendario lleno de eventos pensados para impulsar tu carrera.
              </p>

              <div className="border-2 border-white/10 bg-white/5 px-6 py-5">
                <p className="mb-3 flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                  <Sparkles size={12} />
                  Puedes encontrar
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    'Artistas con intereses afines',
                    'Colaboraciones y proyectos',
                    'Eventos y talleres exclusivos',
                    'Networking sin fronteras',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <ChevronRight size={14} className="shrink-0 text-[#F65B7F]" />
                      <span className="text-sm text-white/75">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser) router.push('/comunidad')
                    else authModal.open('registro')
                  }}
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#F65B7F] bg-[#F65B7F] px-7 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-transparent hover:text-[#F65B7F] hover:shadow-[4px_4px_0_#353535] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  {currentUser ? 'Ir a la comunidad' : 'Únete a la comunidad'}
                  <ArrowRight size={16} />
                </button>
                <a
                  href="#eventos"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/20 bg-white/5 px-7 py-3 text-sm font-bold tracking-widest text-white/85 uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#F65B7F] hover:text-white"
                >
                  Ver eventos
                  <ArrowRight size={16} />
                </a>
              </div>
            </TimelineAnimation>
          </div>

          <div className="flex flex-col gap-4 self-start">
            <TimelineAnimation
              as="div"
              animationNum={5}
              timelineRef={sectionRef}
              className="border-2 border-white/10 bg-white/5 p-8 shadow-[4px_4px_0_rgba(255,255,255,0.06)]"
            >
              <p className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                <Sparkles size={13} />
                La comunidad en cifras
              </p>
              <div className="mt-6 flex flex-col gap-6">
                {[
                  { number: '+200', label: 'artistas registrados', accent: '#F65B7F' },
                  { number: '+30', label: 'eventos realizados', accent: '#8ECAE6' },
                  { number: '+12', label: 'países alcanzados', accent: '#023047' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-white" style={{ color: stat.accent }}>
                      {stat.number}
                    </span>
                    <span className="text-sm text-white/50">{stat.label}</span>
                  </div>
                ))}
              </div>
            </TimelineAnimation>
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 h-px bg-white/10" />
    </section>
  )
}

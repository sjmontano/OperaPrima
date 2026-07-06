'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight, Users } from 'lucide-react'
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
      {/* Editorial grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)',
        }}
      />

      <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#8ECAE6]" />

      <div className="no-borders relative z-10 mx-[100px] border-white/10 px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
        <div className="grid gap-20 px-4 py-28 sm:px-2 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-30">
          <TimelineAnimation as="div" animationNum={0} timelineRef={sectionRef}>
            <div className="space-y-6">
              <TimelineAnimation as="p" animationNum={1} timelineRef={sectionRef}>
                <span className="inline-block border border-white/20 px-3 py-1 text-[0.6rem] font-bold tracking-[0.25em] text-white/50 uppercase">
                  Comunidad
                </span>
              </TimelineAnimation>

              <TimelineAnimation as="h1" animationNum={2} timelineRef={sectionRef}>
                <span className="text-5xl leading-[0.92] font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
                  Bienvenidx!
                </span>
              </TimelineAnimation>

              <TimelineAnimation as="p" animationNum={3} timelineRef={sectionRef}>
                <span className="block max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                  Ópera Prima no es solo una plataforma digital, es un espacio donde artistas
                  emergentes se acompañan, crecen y construyen su camino profesional juntos.
                </span>
              </TimelineAnimation>

              <TimelineAnimation as="div" animationNum={4} timelineRef={sectionRef}>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser) router.push('/comunidad')
                      else authModal.open('registro')
                    }}
                    className="flex items-center gap-2 border-2 border-[#E63946] bg-[#E63946] px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-white hover:text-[#E63946] hover:shadow-[4px_4px_0_#353535] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    <Users size={14} />
                    {currentUser ? 'Ir a la comunidad' : 'Únete a la comunidad'}
                  </button>
                  <a
                    href="#eventos"
                    className="flex items-center gap-2 border-2 border-white/20 px-6 py-3 text-xs font-bold tracking-widest text-white/70 uppercase transition-all duration-150 hover:border-white/40 hover:text-white"
                  >
                    Ver eventos
                    <ArrowRight size={14} />
                  </a>
                </div>
              </TimelineAnimation>
            </div>
          </TimelineAnimation>

          <TimelineAnimation
            as="div"
            animationNum={5}
            timelineRef={sectionRef}
            className="hidden lg:block"
          >
            <div className="flex h-full items-center justify-center">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="h-32 w-32 rounded-full bg-[#8ECAE6]/20 ring-2 ring-[#8ECAE6]/30" />
                  <div className="h-24 w-24 rounded-full bg-[#E63946]/20 ring-2 ring-[#E63946]/30" />
                </div>
                <div className="space-y-3 pt-8">
                  <div className="h-20 w-20 rounded-full bg-[#023047]/30 ring-2 ring-[#023047]/40" />
                  <div className="h-28 w-28 rounded-full bg-[#4682B4]/20 ring-2 ring-[#4682B4]/30" />
                </div>
              </div>
            </div>
          </TimelineAnimation>
        </div>
      </div>
    </section>
  )
}

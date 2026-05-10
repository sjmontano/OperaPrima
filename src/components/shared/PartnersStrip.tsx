'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
import Image from 'next/image'
import { useRef } from 'react'

// -- Configuración editable --
export const PARTNERS_STRIP_CONFIG = {
  logoSize: 120, // Altura en px de los logos (se escala manteniendo proporción)
  animationDuration: '40s',
  itemSpacing: '32px',
  repeatCount: 4,
}

// -- Tipos --
export interface Partner {
  name: string
  src: string
}

// -- Datos --
// Placeholder: Imagotipo de Opera Prima repetido.
// Reemplazar con los aliados reales cuando estén disponibles.
const PARTNERS: Partner[] = [
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
]

// Repetir para que el track sea lo suficientemente ancho y el scroll se vea fluido.
// El @keyframes desplaza -25% del total, así que con 4 copias se avanza exactamente 1 copia.
const REPEAT_COUNT = PARTNERS_STRIP_CONFIG.repeatCount

// -- Componente --
export function PartnersStrip() {
  const sectionRef = useRef<HTMLElement>(null)
  const items = Array.from({ length: REPEAT_COUNT }, () => PARTNERS).flat()

  return (
    <section ref={sectionRef} className="bg-background w-full border-b-2 border-zinc-200">
      <div className="mx-auto max-w-420 border-zinc-200 sm:border-x">
        {/* Headline */}
        <div className="px-8 pt-20 pb-14 text-center">
          <TimelineAnimation
            as="p"
            animationNum={0}
            timelineRef={sectionRef}
            className="mb-4 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
          >
            03 — Aliados y Red
          </TimelineAnimation>
          <TimelineAnimation
            as="h2"
            animationNum={1}
            timelineRef={sectionRef}
            className="text-4xl leading-[1.06] font-bold tracking-[-0.025em] text-zinc-900 lg:text-5xl"
          >
            Nuestros aliados
          </TimelineAnimation>
          <TimelineAnimation
            as="p"
            animationNum={2}
            timelineRef={sectionRef}
            className="mx-auto mt-3 max-w-md text-base text-zinc-500"
          >
            instituciones, proyectos y profesionales que creen en el talento emergente.
          </TimelineAnimation>
        </div>

        {/* Marquee */}
        <div className="relative overflow-hidden">
          {/* Degradado fade: cubre logos en los bordes del container */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 left-0 z-10"
            style={{
              background:
                'linear-gradient(to right, var(--background) 0%, transparent 25%, transparent 75%, var(--background) 100%)',
            }}
          />
          <div className="ticker-wrap">
            <div
              className="ticker-track"
              style={{ animationDuration: PARTNERS_STRIP_CONFIG.animationDuration }}
            >
              {items.map((partner, i) => (
                <PartnerItem key={i} partner={partner} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA colaboración */}
        <div className="px-8 pt-16 pb-24 text-center">
          <TimelineAnimation
            as="p"
            animationNum={3}
            timelineRef={sectionRef}
            className="text-sm text-zinc-500"
          >
            ¿Quieres colaborar con nosotros?{' '}
            <a
              href="mailto:direccion@operaprimacultura.com"
              className="font-semibold text-[#F65B7F] underline-offset-4 hover:underline"
            >
              direccion@operaprimacultura.com
            </a>
          </TimelineAnimation>
        </div>
      </div>
    </section>
  )
}

// -- Sub-componente item --
function PartnerItem({ partner }: { partner: Partner }) {
  return (
    <div
      className="ticker-item flex shrink-0 items-center justify-center px-8"
      style={{
        marginRight: PARTNERS_STRIP_CONFIG.itemSpacing,
        height: `${PARTNERS_STRIP_CONFIG.logoSize}px`,
      }}
    >
      <Image
        src={partner.src}
        alt={partner.name}
        width={PARTNERS_STRIP_CONFIG.logoSize * 4}
        height={PARTNERS_STRIP_CONFIG.logoSize}
        style={{ height: `${PARTNERS_STRIP_CONFIG.logoSize}px`, width: 'auto' }}
        className="opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
        unoptimized
      />
    </div>
  )
}

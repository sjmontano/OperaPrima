'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
import Image from 'next/image'
import { useRef } from 'react'

export interface Partner {
  name: string
  src: string
}

const DEFAULT_PARTNERS: Partner[] = [
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
]

export function PartnersStrip({
  eyebrow = 'Aliados y Red',
  heading = 'Nuestros aliados',
  description = 'instituciones, proyectos y profesionales que creen en el talento emergente.',
  partners = DEFAULT_PARTNERS,
  ctaText = '¿Quieres colaborar con nosotros?',
  ctaEmail = 'direccion@operaprimacultura.com',
}: {
  eyebrow?: string
  heading?: string
  description?: string
  partners?: Partner[]
  ctaText?: string
  ctaEmail?: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const REPEAT_COUNT = 4
  const items = Array.from({ length: REPEAT_COUNT }, () => partners).flat()

  return (
    <section ref={sectionRef} className="bg-background w-full border-b-2 border-zinc-200">
      <div className="mx-[100px] border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
        <div className="px-8 pt-20 pb-14 text-center">
          <TimelineAnimation
            as="p"
            animationNum={0}
            timelineRef={sectionRef}
            className="mb-4 text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase"
          >
            {eyebrow}
          </TimelineAnimation>
          <TimelineAnimation
            as="h2"
            animationNum={1}
            timelineRef={sectionRef}
            className="text-4xl leading-[1.06] font-bold tracking-[-0.025em] text-zinc-900 lg:text-5xl"
          >
            {heading}
          </TimelineAnimation>
          <TimelineAnimation
            as="p"
            animationNum={2}
            timelineRef={sectionRef}
            className="mx-auto mt-3 max-w-md text-base text-zinc-500"
          >
            {description}
          </TimelineAnimation>
        </div>

        <div className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 left-0 z-10"
            style={{
              background:
                'linear-gradient(to right, var(--background) 0%, transparent 25%, transparent 75%, var(--background) 100%)',
            }}
          />
          <div className="ticker-wrap">
            <div className="ticker-track" style={{ animationDuration: '40s' }}>
              {items.map((partner, i) => (
                <PartnerItem key={i} partner={partner} />
              ))}
            </div>
          </div>
        </div>

        <div className="px-8 pt-16 pb-24 text-center">
          <TimelineAnimation
            as="p"
            animationNum={3}
            timelineRef={sectionRef}
            className="text-sm text-zinc-500"
          >
            {ctaText}{' '}
            <a
              href={`mailto:${ctaEmail}`}
              className="font-semibold text-[#023047] underline-offset-4 hover:underline"
            >
              {ctaEmail}
            </a>
          </TimelineAnimation>
        </div>
      </div>
    </section>
  )
}

function PartnerItem({ partner }: { partner: Partner }) {
  return (
    <div
      className="ticker-item flex shrink-0 items-center justify-center px-8"
      style={{
        marginRight: '32px',
        height: '120px',
      }}
    >
      <Image
        src={partner.src}
        alt={partner.name}
        width={480}
        height={120}
        style={{ height: '120px', width: 'auto' }}
        className="opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
        unoptimized
      />
    </div>
  )
}

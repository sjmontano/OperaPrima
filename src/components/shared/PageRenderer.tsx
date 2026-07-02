'use client'

import { lazy, Suspense } from 'react'

const HeroCarousel = lazy(() =>
  import('@/components/shared/HeroCarousel').then((m) => ({ default: m.HeroCarousel }))
)
const WhatIsSection = lazy(() =>
  import('@/components/shared/WhatIsSection').then((m) => ({ default: m.WhatIsSection }))
)
const ComunidadCTA = lazy(() =>
  import('@/components/shared/ComunidadCTA').then((m) => ({ default: m.ComunidadCTA }))
)
const TestimonialsWall = lazy(() =>
  import('@/components/shared/TestimonialsWall').then((m) => ({ default: m.TestimonialsWall }))
)
const PartnersStrip = lazy(() =>
  import('@/components/shared/PartnersStrip').then((m) => ({ default: m.PartnersStrip }))
)
const ComunidadLandingSection = lazy(() =>
  import('@/components/comunidad/ComunidadLandingSection').then((m) => ({
    default: m.ComunidadLandingSection,
  }))
)
const ComunidadEventsSection = lazy(() =>
  import('@/components/comunidad/ComunidadEventsSection').then((m) => ({
    default: m.ComunidadEventsSection,
  }))
)
const ComunidadArtistsSection = lazy(() =>
  import('@/components/comunidad/ComunidadArtistsSection').then((m) => ({
    default: m.ComunidadArtistsSection,
  }))
)
const EventsLandingSection = lazy(() =>
  import('@/components/events/EventsLandingSection').then((m) => ({
    default: m.EventsLandingSection,
  }))
)
const MentorEventsSection = lazy(() =>
  import('@/components/events/MentorEventsSection').then((m) => ({
    default: m.MentorEventsSection,
  }))
)
const MentoriasLandingSection = lazy(() =>
  import('@/components/mentorias/MentoriasLandingSection').then((m) => ({
    default: m.MentoriasLandingSection,
  }))
)
const ProyectosLandingSection = lazy(() =>
  import('@/components/proyectos/ProyectosLandingSection').then((m) => ({
    default: m.ProyectosLandingSection,
  }))
)
const ProyectosSection = lazy(() =>
  import('@/components/proyectos/ProyectosSection').then((m) => ({ default: m.ProyectosSection }))
)
const ProyectosDestacados = lazy(() =>
  import('@/components/proyectos/ProyectosDestacados').then((m) => ({
    default: m.ProyectosDestacados,
  }))
)
const DisclaimerSection = lazy(() =>
  import('@/components/proyectos/DisclaimerSection').then((m) => ({ default: m.DisclaimerSection }))
)
const SobreLandingSection = lazy(() =>
  import('@/components/sobre/SobreLandingSection').then((m) => ({ default: m.SobreLandingSection }))
)
const EventsSection = lazy(() =>
  import('@/components/events/EventsSection').then((m) => ({ default: m.EventsSection }))
)

export interface Block {
  type: string
  props: Record<string, unknown>
}

const BLOCK_MAP: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>
> = {
  'hero-carousel': HeroCarousel,
  'what-is': WhatIsSection,
  'events-opera-prima': EventsSection,
  'comunidad-cta': ComunidadCTA,
  testimonials: TestimonialsWall,
  partners: PartnersStrip,
  'comunidad-landing': ComunidadLandingSection,
  'events-comunidad': ComunidadEventsSection,
  'community-artists': ComunidadArtistsSection,
  'events-landing': EventsLandingSection,
  'events-mentor': MentorEventsSection,
  'mentorias-landing': MentoriasLandingSection,
  'proyectos-landing': ProyectosLandingSection,
  'proyectos-section': ProyectosSection,
  'proyectos-destacados': ProyectosDestacados,
  disclaimer: DisclaimerSection,
  'sobre-landing': SobreLandingSection,
}

function FallbackBlock({ block }: { block: Block }) {
  const { content, align, src, alt, caption, title, description, buttonText, buttonUrl } =
    block.props as Record<string, string>

  if (block.type === 'text') {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div
          className="prose prose-sm max-w-none text-zinc-700"
          style={{ textAlign: (align as 'left' | 'center' | 'right') || 'left' }}
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </section>
    )
  }

  if (block.type === 'image') {
    return (
      <section className="mx-auto max-w-4xl px-6 py-8">
        <figure>
          <img src={src} alt={alt || ''} className="w-full object-cover" />
          {caption && (
            <figcaption className="mt-2 text-center text-xs text-zinc-500">{caption}</figcaption>
          )}
        </figure>
      </section>
    )
  }

  if (block.type === 'cta') {
    return (
      <section className="bg-[#023047] px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {description && <p className="mt-3 text-white/70">{description}</p>}
          <a
            href={buttonUrl || '#'}
            className="mt-6 inline-block border-2 border-white px-8 py-3 text-xs font-bold tracking-widest text-white uppercase transition-all hover:bg-white hover:text-[#023047]"
          >
            {buttonText || 'Ver más'}
          </a>
        </div>
      </section>
    )
  }

  if (block.type === 'separator') {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <hr className="border-zinc-200" />
      </div>
    )
  }

  return null
}

export function PageRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const Component = BLOCK_MAP[block.type]
        if (Component) {
          return (
            <Suspense
              key={`${block.type}-${i}`}
              fallback={<div className="h-32 animate-pulse bg-zinc-100" />}
            >
              <Component {...block.props} />
            </Suspense>
          )
        }
        return <FallbackBlock key={`${block.type}-${i}`} block={block} />
      })}
    </>
  )
}

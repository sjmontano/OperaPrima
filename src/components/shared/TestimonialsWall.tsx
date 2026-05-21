'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
import Image from 'next/image'
import { useRef, useState } from 'react'

/**
 * TestimonialsWall — Testimonial Wall para comentarios de artistas.
 *
 * Nombre técnico: Testimonial Wall.
 * Sección escalable, fácil de editar y lista para recibir estilos globales.
 */

export const TESTIMONIAL_WALL_CONFIG = {
  cardWidth: 320,
  cardGap: '1.5rem',
  animationDuration: '100s',
}

export interface Testimonial {
  name: string
  handle: string
  text: string
  avatar: string
}

export interface TestimonialsWallProps {
  className?: string
  headline?: string
  testimonialEyebrow?: string
  testimonials?: Testimonial[]
  animationDuration?: string
  cardWidth?: number
  cardGap?: string
  rows?: 1 | 2
  fadeColor?: string
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Camila Rojas',
    handle: '@camilarte',
    text: 'En Opera Prima encontré un espacio donde mi trabajo tiene visibilidad y comunidad. Las mentorías y eventos me han ayudado a conectar con nuevos públicos.',
    avatar: 'https://i.pravatar.cc/150?u=camila',
  },
  {
    name: 'Mateo Vargas',
    handle: '@mateovibes',
    text: 'La plataforma me permitió mostrar mis proyectos emergentes en un contexto profesional. Ahora participo en más convocatorias gracias al respaldo de la comunidad.',
    avatar: 'https://i.pravatar.cc/150?u=mateo',
  },
  {
    name: 'Mariana Cruz',
    handle: '@mariana.crea',
    text: 'Me gusta cómo Opera Prima pone el talento colombiano al frente. Los eventos y talleres son justo lo que necesitaba para avanzar con confianza.',
    avatar: 'https://i.pravatar.cc/150?u=mariana',
  },
  {
    name: 'Santiago Pérez',
    handle: '@santiagop',
    text: 'La experiencia de colaborar con otros artistas aquí ha sido real. Me ayudó a expandir mi red y presentar mi trabajo a aliados clave.',
    avatar: 'https://i.pravatar.cc/150?u=santiago',
  },
]

export function TestimonialsWall({
  className = '',
  headline = 'Esto dicen los artistas de nuestra comunidad',
  testimonialEyebrow = '02 — Comunidad Opera Prima',
  testimonials = DEFAULT_TESTIMONIALS,
  animationDuration = TESTIMONIAL_WALL_CONFIG.animationDuration,
  cardWidth = TESTIMONIAL_WALL_CONFIG.cardWidth,
  cardGap = TESTIMONIAL_WALL_CONFIG.cardGap,
  rows = 2,
  fadeColor = 'var(--background)',
}: TestimonialsWallProps) {
  const [isCardHovered, setIsCardHovered] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const duplicated = [...testimonials, ...testimonials]

  return (
    <section
      ref={sectionRef}
      className={`testimonial-wall border-b-2 border-zinc-200 ${className}`}
    >
      <div className="mx-auto max-w-420 border-zinc-200 px-8 py-24 sm:border-x">
        <div className="mb-12 text-center">
          <TimelineAnimation
            as="p"
            animationNum={0}
            timelineRef={sectionRef}
            className="mb-4 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
          >
            {testimonialEyebrow}
          </TimelineAnimation>
          <TimelineAnimation
            as="h2"
            animationNum={1}
            timelineRef={sectionRef}
            className="text-4xl leading-[1.06] font-bold tracking-[-0.025em] text-zinc-900 lg:text-5xl"
          >
            {headline}
          </TimelineAnimation>
        </div>

        <div className="relative overflow-hidden">
          {/* Degradado fade: tarjetas se desvanecen completamente al llegar al borde */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 left-0 z-10"
            style={{
              background: `linear-gradient(to right, ${fadeColor} 0%, transparent 25%, transparent 75%, ${fadeColor} 100%)`,
            }}
          />
          <div className="testimonial-scroll-group">
            <div
              className="scroll-row scroll-left"
              style={{
                animationDuration,
                animationPlayState: isCardHovered ? 'paused' : 'running',
              }}
            >
              <div className="scroll-content" style={{ gap: cardGap }}>
                {duplicated.map((testimonial, index) => (
                  <TestimonialCard
                    key={`left-${index}`}
                    testimonial={testimonial}
                    width={cardWidth}
                    onHoverChange={setIsCardHovered}
                  />
                ))}
              </div>
            </div>

            {rows === 2 && (
              <div
                className="scroll-row scroll-right"
                style={{
                  animationDuration,
                  animationPlayState: isCardHovered ? 'paused' : 'running',
                }}
              >
                <div className="scroll-content" style={{ gap: cardGap }}>
                  {duplicated.map((testimonial, index) => (
                    <TestimonialCard
                      key={`right-${index}`}
                      testimonial={testimonial}
                      width={cardWidth}
                      onHoverChange={setIsCardHovered}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  testimonial,
  width,
  onHoverChange,
}: {
  testimonial: Testimonial
  width: number
  onHoverChange: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <article
      className="testimonial-card"
      style={{ minWidth: `${width}px`, width: `${width}px` }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <div className="testimonial-header">
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          width={48}
          height={48}
          className="avatar"
          unoptimized
        />
        <div className="author-meta">
          <p className="author-name">{testimonial.name}</p>
          <p className="author-handle">{testimonial.handle}</p>
        </div>
      </div>
      <p className="testimonial-text">{testimonial.text}</p>
    </article>
  )
}

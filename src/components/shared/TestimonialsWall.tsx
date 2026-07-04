'use client'

import { EditableImage } from '@/components/editor/EditableImage'
import { EditableText } from '@/components/editor/EditableText'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { createClient } from '@/lib/supabaseClient'
import { MessageCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export const TESTIMONIAL_WALL_CONFIG = {
  cardWidth: 320,
  cardGap: '1.5rem',
  animationDuration: '100s',
}

export interface Testimonial {
  id?: string
  name: string
  handle: string
  text: string
  avatar: string
  username?: string
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

export function TestimonialsWall({
  className = '',
  headline = 'Esto dicen los artistas de nuestra comunidad',
  testimonialEyebrow = 'Comunidad Opera Prima',
  testimonials: propTestimonials,
  animationDuration = TESTIMONIAL_WALL_CONFIG.animationDuration,
  cardWidth = TESTIMONIAL_WALL_CONFIG.cardWidth,
  cardGap = TESTIMONIAL_WALL_CONFIG.cardGap,
  rows = 2,
  fadeColor = 'var(--background)',
  isEditMode,
  __onFieldChange,
}: TestimonialsWallProps & {
  isEditMode?: boolean
  __onFieldChange?: (path: string, value: unknown) => void
}) {
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [dbTestimonials, setDbTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newText, setNewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [session, setSession] = useState<{ user: { id: string } } | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session as unknown as { user: { id: string } } | null)
    })
  }, [])

  useEffect(() => {
    if (isEditMode) return

    fetch('/api/testimonios')
      .then((r) => r.json())
      .then((data) => {
        const mapped: Testimonial[] = (data.testimonials || []).map(
          (t: {
            id: string
            text: string
            usuario: {
              username: string
              firstName: string
              lastName?: string
              perfil?: { artisticName?: string; avatar?: string } | null
            }
          }) => ({
            id: t.id,
            name:
              t.usuario.perfil?.artisticName ||
              `${t.usuario.firstName} ${t.usuario.lastName || ''}`.trim(),
            handle: `@${t.usuario.username}`,
            text: t.text,
            avatar:
              t.usuario.perfil?.avatar ||
              `https://api.dicebear.com/9.x/lorelei/svg?seed=${t.usuario.username}`,
            username: t.usuario.username,
          })
        )
        setDbTestimonials(mapped)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isEditMode])

  const testimonials = isEditMode && propTestimonials ? propTestimonials : dbTestimonials
  const duplicated = [...testimonials, ...testimonials]

  async function handleSubmit() {
    if (!newText.trim() || submitting) return
    setSubmitting(true)

    const supabase = createClient()
    const {
      data: { session: s },
    } = await supabase.auth.getSession()
    if (!s) {
      router.push('/login')
      return
    }

    const res = await fetch('/api/testimonios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${s.access_token}`,
      },
      body: JSON.stringify({ text: newText.trim() }),
    })

    if (res.ok) {
      setNewText('')
      setShowModal(false)
      const data = await res.json()
      const t = data.testimonial
      const newTestimonial: Testimonial = {
        id: t.id,
        name:
          t.usuario.perfil?.artisticName ||
          `${t.usuario.firstName} ${t.usuario.lastName || ''}`.trim(),
        handle: `@${t.usuario.username}`,
        text: t.text,
        avatar:
          t.usuario.perfil?.avatar ||
          `https://api.dicebear.com/9.x/lorelei/svg?seed=${t.usuario.username}`,
        username: t.usuario.username,
      }
      setDbTestimonials((prev) => [newTestimonial, ...prev])
      router.refresh()
    }

    setSubmitting(false)
  }

  return (
    <section
      ref={sectionRef}
      className={`testimonial-wall border-b-2 border-zinc-200 ${className}`}
    >
      <div className="mx-[100px] border-zinc-200 px-8 py-24 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
        <div className="mb-12 text-center">
          <TimelineAnimation
            as="p"
            animationNum={0}
            timelineRef={sectionRef}
            className="mb-4 text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase"
          >
            <EditableText
              value={testimonialEyebrow}
              onSave={(v) => __onFieldChange?.('testimonialEyebrow', v)}
              as="span"
              singleLine
              className=""
            />
          </TimelineAnimation>
          <TimelineAnimation
            as="h2"
            animationNum={1}
            timelineRef={sectionRef}
            className="text-4xl leading-[1.06] font-bold tracking-[-0.025em] text-zinc-900 lg:text-5xl"
          >
            <EditableText
              value={headline}
              onSave={(v) => __onFieldChange?.('headline', v)}
              as="span"
              className=""
            />
          </TimelineAnimation>

          {!isEditMode && (
            <TimelineAnimation as="div" animationNum={2} timelineRef={sectionRef}>
              <button
                onClick={() => {
                  if (!session) {
                    router.push('/login')
                    return
                  }
                  setShowModal(true)
                }}
                className="mt-6 inline-flex cursor-pointer items-center gap-2 border-2 border-[#023047] px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#353535]"
                style={{ color: '#023047' }}
              >
                <MessageCircle size={14} />
                Deja tu testimonio
              </button>
            </TimelineAnimation>
          )}
        </div>

        {loading && !isEditMode ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#023047] border-t-transparent" />
          </div>
        ) : testimonials.length === 0 && !isEditMode ? (
          <p className="py-12 text-center text-sm" style={{ color: 'oklch(0.52 0.010 350)' }}>
            Aún no hay testimonios. Sé el primero en compartir tu experiencia.
          </p>
        ) : (
          <div className="relative overflow-hidden">
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
                      testimonialIndex={index % testimonials.length}
                      width={cardWidth}
                      onHoverChange={setIsCardHovered}
                      isEditMode={isEditMode}
                      __onFieldChange={__onFieldChange}
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
                        testimonialIndex={index % testimonials.length}
                        width={cardWidth}
                        onHoverChange={setIsCardHovered}
                        isEditMode={isEditMode}
                        __onFieldChange={__onFieldChange}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md border-2 border-zinc-200 bg-[#F0F8FF] p-6 shadow-[6px_6px_0_#353535]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3
                className="text-sm font-bold tracking-widest uppercase"
                style={{ color: '#023047' }}
              >
                Deja tu testimonio
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer"
                style={{ color: '#353535' }}
              >
                <X size={18} />
              </button>
            </div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Comparte tu experiencia en Opera Prima..."
              rows={4}
              className="w-full resize-none border-2 border-zinc-300 bg-white p-3 text-xs focus:border-[#023047] focus:outline-none"
              style={{ fontFamily: 'var(--font-poppins)', color: '#353535' }}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer border-2 border-zinc-300 px-4 py-2 text-xs font-bold tracking-widest uppercase"
                style={{ color: '#353535' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!newText.trim() || submitting}
                className="cursor-pointer border-2 border-[#023047] px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#353535] disabled:opacity-50"
                style={{ color: '#023047', background: '#F0F8FF' }}
              >
                {submitting ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function TestimonialCard({
  testimonial,
  testimonialIndex,
  width,
  onHoverChange,
  isEditMode,
  __onFieldChange,
}: {
  testimonial: Testimonial
  testimonialIndex: number
  width: number
  onHoverChange: React.Dispatch<React.SetStateAction<boolean>>
  isEditMode?: boolean
  __onFieldChange?: (path: string, value: unknown) => void
}) {
  const CardWrapper = testimonial.username && !isEditMode ? 'a' : 'div'
  const wrapperProps =
    testimonial.username && !isEditMode ? { href: `/perfil/${testimonial.username}` } : {}

  return (
    <CardWrapper
      {...wrapperProps}
      className="testimonial-card"
      style={{ minWidth: `${width}px`, width: `${width}px` }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <div className="testimonial-header">
        <EditableImage
          src={testimonial.avatar}
          alt={testimonial.name}
          onSave={(v) => __onFieldChange?.(`testimonials.${testimonialIndex}.avatar`, v)}
          className="avatar"
          width={48}
          height={48}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
        <div className="author-meta">
          <p className="author-name">
            <EditableText
              value={testimonial.name}
              onSave={(v) => __onFieldChange?.(`testimonials.${testimonialIndex}.name`, v)}
              as="span"
              singleLine
              className=""
            />
          </p>
          <p className="author-handle">
            <EditableText
              value={testimonial.handle}
              onSave={(v) => __onFieldChange?.(`testimonials.${testimonialIndex}.handle`, v)}
              as="span"
              singleLine
              className=""
            />
          </p>
        </div>
      </div>
      <p className="testimonial-text">
        <EditableText
          value={testimonial.text}
          onSave={(v) => __onFieldChange?.(`testimonials.${testimonialIndex}.text`, v)}
          as="span"
          className=""
        />
      </p>
    </CardWrapper>
  )
}

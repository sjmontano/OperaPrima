'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { RotatingText } from '@/components/shared/RotatingText'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { MentorEditModal } from '@/components/mentorias/MentorEditModal'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Compass,
  FileText,
  MessageCircle,
  Search,
  Sparkles,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ExpandingMentorsGallery } from './ExpandingMentorsGallery'
import type { MentorCard } from './ExpandingMentorsGallery'
import type { MentorDB, MentorFormData } from './MentorEditModal'

const ROTATING_TOPICS = [
  'No sabes cómo empezar tu proyecto.',
  'Quieres aplicar a una convocatoria.',
  'Necesitas mejorar tu portafolio.',
  'Tienes dudas sobre tu carrera artística.',
  'Quieres planear una gira o exposición.',
  'Necesitas estructurar un proyecto cultural.',
] as const

const STEPS = [
  {
    number: 1,
    title: 'Explora los perfiles',
    desc: 'Revisa los perfiles de nuestros mentores y elige a la persona que mejor se ajuste a lo que necesitas trabajar.',
    icon: Search,
  },
  {
    number: 2,
    title: 'Define tu tema',
    desc: 'Cada mentoría se enfoca en un tema concreto: tu portafolio, una convocatoria, un proyecto, una gira o cualquier reto específico.',
    icon: Compass,
  },
  {
    number: 3,
    title: 'Reserva tu sesión',
    desc: 'Completa el formulario y cuéntanos qué quieres trabajar. Mientras más claro seas, mejor podrá prepararse tu mentor.',
    icon: ClipboardList,
  },
  {
    number: 4,
    title: 'Adjunta material',
    desc: 'Documentos, enlaces, portafolios o cualquier archivo que ayude a entender tu caso.',
    icon: FileText,
  },
  {
    number: 5,
    title: 'Mentoría 1:1',
    desc: '60 minutos privados para conversar, recibir orientación y aterrizar acciones concretas.',
    icon: MessageCircle,
  },
  {
    number: 6,
    title: 'Resumen final',
    desc: 'Recibe los puntos clave trabajados y recomendaciones para seguir avanzando.',
    icon: CheckCircle2,
  },
]

export function MentoriasLandingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const authModal = useAuthModal()
  const { currentUser } = authModal
  const router = useRouter()
  const [mentores, setMentores] = useState<MentorCard[]>([])
  const [mentoresLoaded, setMentoresLoaded] = useState(false)
  const [editingMentor, setEditingMentor] = useState<MentorDB | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetch('/api/mentores')
      .then((res) => res.json())
      .then((data) => {
        if (data.mentores) {
          const mapped: MentorCard[] = data.mentores.map((m: MentorDB) => ({
            id: m.id,
            usuarioId: m.usuarioId,
            name: m.name,
            title: m.title,
            location: m.location,
            focus: m.focus,
            notes: m.notes,
            galleryImages: m.galleryImages,
            avatar: m.usuario?.perfil?.avatar || null,
          }))
          setMentores(mapped)
        }
        setMentoresLoaded(true)
      })
      .catch(() => setMentoresLoaded(true))
  }, [])

  function canEdit(mentor: MentorCard): boolean {
    if (!currentUser) return false
    if (currentUser.rol === 'ADMIN') return true
    return mentor.usuarioId === currentUser.id
  }

  function handleEdit(mentor: MentorCard) {
    const full: MentorDB = {
      id: mentor.id,
      usuarioId: mentor.usuarioId,
      name: mentor.name,
      title: mentor.title,
      location: mentor.location,
      focus: mentor.focus,
      notes: mentor.notes,
      galleryImages: mentor.galleryImages,
      active: true,
      orden: 0,
    }
    setEditingMentor(full)
    setShowEditModal(true)
  }

  async function handleSaveEdit(data: MentorFormData) {
    const supabase = (await import('@/lib/supabaseClient')).createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return
    const token = session.access_token
    const res = await fetch(`/api/mentores/${editingMentor!.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const result = await res.json()
      const m = result.mentor
      setMentores((prev) =>
        prev.map((p) =>
          p.id === m.id
            ? {
                ...p,
                name: m.name,
                title: m.title,
                location: m.location,
                focus: m.focus,
                notes: m.notes,
                galleryImages: m.galleryImages,
              }
            : p
        )
      )
    }
  }

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#0f0f0f]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(246,91,127,0.06),transparent_70%)]"
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
                  Mentorías a la medida
                </div>
                <h1 className="text-5xl leading-[1.05] font-extrabold tracking-[-0.04em] text-white sm:text-6xl lg:text-[4rem]">
                  NO ESTÁS <span className="text-[#F65B7F]">SOLO</span>
                </h1>
                <p className="text-xl leading-relaxed font-semibold text-white/90 sm:text-2xl">
                  Espacios de acompañamiento personalizados para que tu práctica artística sea más
                  clara, más estratégica y más efectiva.
                </p>
                <p className="text-base leading-relaxed text-white/60">
                  Conecta con un mentor que tiene las herramientas para ayudarte: portafolio, becas,
                  proyectos culturales, cartas de motivación, giras, presupuestos y más. Todo lo que
                  no enseñan en la universidad.
                </p>
                <div className="border-2 border-[#F65B7F]/30 bg-white/5 px-6 py-5">
                  <p className="mb-2 flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                    <Star size={12} />
                    ¿Te identificas con esto?
                  </p>
                  <p className="text-lg font-medium text-white italic">
                    &ldquo;
                    <RotatingText words={ROTATING_TOPICS} />
                    &rdquo;
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser) router.push('/mentorias')
                      else authModal.open('registro')
                    }}
                    className="inline-flex items-center justify-center gap-2 border-2 border-[#F65B7F] bg-[#F65B7F] px-7 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-transparent hover:text-[#F65B7F] hover:shadow-[4px_4px_0_#353535] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    {currentUser ? 'Ver mentores' : 'Reservar mentoría'}
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentUser) router.push('/comunidad')
                      else authModal.open('login')
                    }}
                    className="inline-flex items-center justify-center gap-2 border-2 border-white/20 bg-white/5 px-7 py-3 text-sm font-bold tracking-widest text-white/85 uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#F65B7F] hover:text-white"
                  >
                    Ver perfiles
                  </button>
                </div>
              </TimelineAnimation>
            </div>
            <div className="flex flex-col gap-4 self-start">
              <TimelineAnimation
                as="div"
                animationNum={1}
                timelineRef={sectionRef}
                className="border-2 border-white/10 bg-white/5 p-8 shadow-[4px_4px_0_rgba(255,255,255,0.06)]"
              >
                <p className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                  <Sparkles size={13} />
                  Puedes trabajar en
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {[
                    'Estructurar un proyecto cultural',
                    'Revisar el diseño de tu portafolio',
                    'Redactar cartas para becas',
                    'Planear una gira o exposición',
                    'Revisar un presupuesto',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <ChevronRight size={14} className="shrink-0 text-[#F65B7F]" />
                      <span className="text-sm text-white/75">{item}</span>
                    </div>
                  ))}
                </div>
              </TimelineAnimation>
              <TimelineAnimation
                as="div"
                animationNum={2}
                timelineRef={sectionRef}
                className="flex items-center gap-3 border-2 border-white/10 bg-white/[0.03] px-5 py-4"
              >
                <div className="flex size-9 items-center justify-center border-2 border-[#8ECAE6]/40 bg-[#8ECAE6]/10 text-xs font-bold text-[#8ECAE6]">
                  5
                </div>
                <span className="text-sm leading-relaxed text-white/60">
                  Mentores expertos en diferentes áreas listos para ayudarte.
                </span>
              </TimelineAnimation>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 left-0 h-px bg-white/10" />
      </section>

      {/* ═══════════════ CÓMO FUNCIONA ═══════════════ */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#F65B7F]" />
        <div className="mx-[100px] px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
          <div className="px-4 py-24 sm:px-2 lg:py-28">
            <TimelineAnimation as="div" animationNum={3} timelineRef={sectionRef} className="mb-16">
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                ¿Cómo funcionan?
              </p>
              <h2 className="mt-3 text-4xl leading-[1.1] font-extrabold tracking-[-0.04em] text-zinc-900 lg:text-[3rem]">
                Un proceso claro para que cada sesión{' '}
                <span className="text-[#F65B7F]">tenga foco y resultado.</span>
              </h2>
            </TimelineAnimation>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {STEPS.map((step, index) => {
                const Icon = step.icon
                const isPink = index % 2 === 0
                const accent = isPink ? '#F65B7F' : '#8ECAE6'
                return (
                  <TimelineAnimation
                    key={step.title}
                    as="article"
                    animationNum={index + 4}
                    timelineRef={sectionRef}
                    className="group border-2 border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1"
                    style={{ boxShadow: `4px 4px 0 ${accent}30`, borderColor: '#e4e4e7' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-10 shrink-0 items-center justify-center text-sm font-bold text-white"
                        style={{ background: accent }}
                      >
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold tracking-[-0.02em] text-zinc-900">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-zinc-600">{step.desc}</p>
                    <div className="mt-5 flex items-center gap-2">
                      <div className="h-px flex-1 bg-zinc-200" />
                      <Icon size={14} className="shrink-0 text-zinc-400" />
                    </div>
                  </TimelineAnimation>
                )
              })}
            </div>
            <TimelineAnimation
              as="div"
              animationNum={10}
              timelineRef={sectionRef}
              className="mt-12 text-center"
            >
              <button
                type="button"
                onClick={() => {
                  if (currentUser) router.push('/mentorias')
                  else authModal.open('registro')
                }}
                className="inline-flex items-center justify-center gap-2 border-2 border-[#F65B7F] bg-[#F65B7F] px-8 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-transparent hover:text-[#F65B7F] hover:shadow-[4px_4px_0_#353535] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                {currentUser ? 'Ver mentores' : 'Reservar mentoría'}
                <ArrowRight size={16} />
              </button>
            </TimelineAnimation>
          </div>
        </div>
      </section>

      {/* ═══════════════ SOLID BLUE CTA ═══════════════ */}
      <section className="relative w-full overflow-hidden bg-[#8ECAE6]">
        <div className="mx-[100px] border-white/10 px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
          <div className="px-4 py-20 text-center sm:px-2 lg:py-24">
            <TimelineAnimation
              as="div"
              animationNum={11}
              timelineRef={sectionRef}
              className="mx-auto max-w-2xl"
            >
              <Sparkles size={28} className="mx-auto text-white/60" />
              <h2 className="mt-6 text-3xl leading-[1.1] font-extrabold tracking-[-0.04em] text-white [text-shadow:2px_2px_0_#023047] sm:text-4xl lg:text-[2.8rem]">
                Tu práctica artística merece un acompañamiento real.
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-[#023047]">
                No dejes que la falta de orientación frene las metas por las que trabajas
                fuertemente.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (currentUser) router.push('/mentorias')
                  else authModal.open('registro')
                }}
                className="mt-8 inline-flex items-center justify-center gap-2 border-2 border-white bg-white px-8 py-3 text-sm font-bold tracking-widest text-[#023047] uppercase shadow-[4px_4px_0_rgba(0,0,0,0.12)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_rgba(0,0,0,0.2)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                {currentUser ? 'Ver mentores' : 'Reservar mentoría'}
                <ArrowRight size={16} />
              </button>
            </TimelineAnimation>
          </div>
        </div>
      </section>

      {/* ═══════════════ MENTORES ═══════════════ */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="mx-[100px] px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
          <div className="px-4 py-24 sm:px-2 lg:py-28">
            <TimelineAnimation
              as="div"
              animationNum={12}
              timelineRef={sectionRef}
              className="max-w-2xl"
            >
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                Nuestros mentores
              </p>
              <h2 className="mt-3 text-4xl leading-[1.1] font-extrabold tracking-[-0.04em] text-zinc-900 lg:text-[3rem]">
                Profesionales listos para{' '}
                <span className="text-[#F65B7F]">impulsar tu camino.</span>
              </h2>
            </TimelineAnimation>
            <div className="mt-12">
              {mentores.length > 0 ? (
                <ExpandingMentorsGallery mentors={mentores} canEdit={canEdit} onEdit={handleEdit} />
              ) : (
                <div className="border-2 border-zinc-200 p-12 text-center">
                  <p className="text-sm text-zinc-500">
                    {mentoresLoaded
                      ? 'Próximamente estaremos anunciando nuestros mentores.'
                      : 'Cargando mentores...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ DARK BLUE CTA ═══════════════ */}
      <section className="relative w-full overflow-hidden bg-[#023047]">
        <div className="mx-[100px] border-white/10 px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
          <div className="px-4 py-20 text-center sm:px-2 lg:py-24">
            <TimelineAnimation
              as="div"
              animationNum={13}
              timelineRef={sectionRef}
              className="mx-auto max-w-xl"
            >
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase">
                ¿Quieres ser mentor?
              </p>
              <p className="mt-4 text-xl leading-relaxed font-semibold tracking-[-0.02em] text-white">
                Si eres profesional del sector cultural y te gustaría compartir tu experiencia con
                artistas emergentes, escríbenos.
              </p>
              <Link
                href="mailto:direccion@operaprimacultura.com"
                className="mt-8 inline-flex items-center justify-center gap-2 border-2 border-[#023047] bg-[#8ECAE6] px-8 py-3 text-sm font-bold tracking-widest text-[#023047] uppercase shadow-[4px_4px_0_rgba(0,0,0,0.2)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#023047] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Escribir al equipo
                <ArrowRight size={16} />
              </Link>
            </TimelineAnimation>
          </div>
        </div>
      </section>

      {/* ═══════════════ LIGHT CTA ═══════════════ */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="mx-[100px] px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
          <div className="border-t-2 border-zinc-200 px-4 py-16 text-center sm:px-2 lg:py-20">
            <TimelineAnimation
              as="div"
              animationNum={14}
              timelineRef={sectionRef}
              className="mx-auto max-w-xl"
            >
              <p className="text-sm leading-relaxed text-zinc-600">
                ¿Tienes dudas? Escríbenos a{' '}
                <a
                  href="mailto:direccion@operaprimacultura.com"
                  className="font-semibold text-[#F65B7F] underline underline-offset-2 transition-colors hover:text-[#023047]"
                >
                  direccion@operaprimacultura.com
                </a>
              </p>
            </TimelineAnimation>
          </div>
        </div>
      </section>

      <MentorEditModal
        open={showEditModal}
        mentor={editingMentor}
        onClose={() => {
          setShowEditModal(false)
          setEditingMentor(null)
        }}
        onSave={handleSaveEdit}
      />
    </>
  )
}

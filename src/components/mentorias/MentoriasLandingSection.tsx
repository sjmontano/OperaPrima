'use client'

import { EditableRichText } from '@/components/editor/EditableRichText'
import { EditableText } from '@/components/editor/EditableText'
import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { RotatingText } from '@/components/shared/RotatingText'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { useEditMode } from '@/context/EditModeContext'
import { useInlineCrud } from '@/lib/useInlineCrud'
import { MentorEditModal } from '@/components/mentorias/MentorEditModal'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Compass,
  FileText,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
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

const STEP_ICONS = [Search, Compass, ClipboardList, FileText, MessageCircle, CheckCircle2]

const DEFAULT_STEPS = [
  {
    title: 'Explora los perfiles',
    desc: 'Revisa los perfiles de nuestros mentores y elige a la persona que mejor se ajuste a lo que necesitas trabajar.',
  },
  {
    title: 'Define tu tema',
    desc: 'Cada mentoría se enfoca en un tema concreto: tu portafolio, una convocatoria, un proyecto, una gira o cualquier reto específico.',
  },
  {
    title: 'Reserva tu sesión',
    desc: 'Completa el formulario y cuéntanos qué quieres trabajar. Mientras más claro seas, mejor podrá prepararse tu mentor.',
  },
  {
    title: 'Adjunta material',
    desc: 'Documentos, enlaces, portafolios o cualquier archivo que ayude a entender tu caso.',
  },
  {
    title: 'Mentoría 1:1',
    desc: '60 minutos privados para conversar, recibir orientación y aterrizar acciones concretas.',
  },
  {
    title: 'Resumen final',
    desc: 'Recibe los puntos clave trabajados y recomendaciones para seguir avanzando.',
  },
]

const DEFAULT_ASIDE_ITEMS = [
  'Estructurar un proyecto cultural',
  'Revisar el diseño de tu portafolio',
  'Redactar cartas para becas',
  'Planear una gira o exposición',
  'Revisar un presupuesto',
]

export function MentoriasLandingSection({
  eyebrow = 'Mentorías a la medida',
  heading = 'NO ESTÁS <span class="text-[#F65B7F]">SOLO</span>',
  description = 'Espacios de acompañamiento personalizados para que tu práctica artística sea más clara, más estratégica y más efectiva.',
  description2 = 'Conecta con un mentor que tiene las herramientas para ayudarte: portafolio, becas, proyectos culturales, cartas de motivación, giras, presupuestos y más. Todo lo que no enseñan en la universidad.',
  rotatingLabel = '¿Te identificas con esto?',
  ctaLoggedText = 'Ver mentores',
  ctaGuestText = 'Reservar mentoría',
  secondaryCtaText = 'Ver perfiles',
  asideEyebrow = 'Puedes trabajar en',
  asideItems = DEFAULT_ASIDE_ITEMS,
  bannerText = 'Mentores expertos en diferentes áreas listos para ayudarte.',
  stepsEyebrow = '¿Cómo funcionan?',
  stepsHeading = 'Un proceso claro para que cada sesión <span class="text-[#F65B7F]">tenga foco y resultado.</span>',
  steps = DEFAULT_STEPS,
  stepsCtaLoggedText = 'Ver mentores',
  stepsCtaGuestText = 'Reservar mentoría',
  ctaBlueHeading = 'Tu práctica artística merece un acompañamiento real.',
  ctaBlueDescription = 'No dejes que la falta de orientación frene las metas por las que trabajas fuertemente.',
  ctaBlueLoggedText = 'Ver mentores',
  ctaBlueGuestText = 'Reservar mentoría',
  mentoresEyebrow = 'Nuestros mentores',
  mentoresHeading = 'Profesionales listos para <span class="text-[#F65B7F]">impulsar tu camino.</span>',
  adminModeLabel = 'Modo edición — Mentores',
  addMentorText = 'Agregar mentor',
  emptyMentorText = 'Próximamente estaremos anunciando nuestros mentores.',
  ctaDarkEyebrow = '¿Quieres ser mentor?',
  ctaDarkDescription = 'Si eres profesional del sector cultural y te gustaría compartir tu experiencia con artistas emergentes, escríbenos.',
  ctaDarkButtonText = 'Escribir al equipo',
  __onFieldChange,
}: {
  eyebrow?: string
  heading?: string
  description?: string
  description2?: string
  rotatingLabel?: string
  ctaLoggedText?: string
  ctaGuestText?: string
  secondaryCtaText?: string
  asideEyebrow?: string
  asideItems?: string[]
  bannerText?: string
  stepsEyebrow?: string
  stepsHeading?: string
  steps?: Array<{ title: string; desc: string }>
  stepsCtaLoggedText?: string
  stepsCtaGuestText?: string
  ctaBlueHeading?: string
  ctaBlueDescription?: string
  ctaBlueLoggedText?: string
  ctaBlueGuestText?: string
  mentoresEyebrow?: string
  mentoresHeading?: string
  adminModeLabel?: string
  addMentorText?: string
  emptyMentorText?: string
  ctaDarkEyebrow?: string
  ctaDarkDescription?: string
  ctaDarkButtonText?: string
  __onFieldChange?: (path: string, value: unknown) => void
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const authModal = useAuthModal()
  const { currentUser } = authModal
  const { isEditMode } = useEditMode()
  const router = useRouter()
  const {
    items: mentorDBs,
    loading,
    addItem: addMentor,
    updateItem: updateMentor,
    deleteItem: deleteMentor,
  } = useInlineCrud<MentorDB>({ endpoint: '/api/mentores' })
  const mentoresLoaded = !loading
  const [editingMentor, setEditingMentor] = useState<MentorDB | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [localSteps, setLocalSteps] = useState(steps)

  useEffect(() => {
    setLocalSteps(steps)
  }, [steps])

  const handleAddStep = () => {
    const next = [...localSteps, { title: 'Nuevo paso', desc: 'Descripción del paso.' }]
    setLocalSteps(next)
    __onFieldChange?.('steps', next)
  }

  const handleDeleteStep = (i: number) => {
    const next = localSteps.filter((_, idx) => idx !== i)
    setLocalSteps(next)
    __onFieldChange?.('steps', next)
  }

  const mentores: MentorCard[] = mentorDBs.map((m) => ({
    id: m.id,
    usuarioId: m.usuarioId,
    username: m.usuario?.username || null,
    name: m.name,
    title: m.title,
    location: m.location,
    focus: m.focus,
    notes: m.notes,
    galleryImages: m.galleryImages,
    avatar: m.usuario?.perfil?.avatar || null,
  }))

  function canEdit(mentor: MentorCard): boolean {
    if (!currentUser) return false
    if (currentUser.rol === 'ADMIN') return true
    return mentor.usuarioId === currentUser.id
  }

  function handleEdit(mentor: MentorCard) {
    const full = mentorDBs.find((m) => m.id === mentor.id) || null
    setEditingMentor(full)
    setShowEditModal(true)
  }

  async function handleSaveEdit(data: MentorFormData) {
    if (!editingMentor) return
    await updateMentor(editingMentor.id, data as unknown as Record<string, unknown>)
  }

  async function handleCreate(data: MentorFormData) {
    await addMentor(data as unknown as Record<string, unknown>)
  }

  async function handleDelete(mentor: MentorCard) {
    if (!window.confirm(`¿Eliminar a ${mentor.name}? Esta acción no se puede deshacer.`)) return
    await deleteMentor(mentor.id)
  }

  const showInlineAdmin = isEditMode && currentUser?.rol === 'ADMIN'

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
                  <EditableText
                    value={eyebrow}
                    onSave={(v) => __onFieldChange?.('eyebrow', v)}
                    as="span"
                    singleLine
                  />
                </div>
                <h1 className="text-5xl leading-[1.05] font-extrabold tracking-[-0.04em] text-white sm:text-6xl lg:text-[4rem]">
                  <EditableRichText
                    value={heading}
                    onSave={(v) => __onFieldChange?.('heading', v)}
                    as="span"
                  />
                </h1>
                <p className="text-xl leading-relaxed font-semibold text-white/90 sm:text-2xl">
                  <EditableRichText
                    value={description}
                    onSave={(v) => __onFieldChange?.('description', v)}
                    as="span"
                  />
                </p>
                <p className="text-base leading-relaxed text-white/60">
                  <EditableRichText
                    value={description2}
                    onSave={(v) => __onFieldChange?.('description2', v)}
                    as="span"
                  />
                </p>
                <div className="border-2 border-[#F65B7F]/30 bg-white/5 px-6 py-5">
                  <p className="mb-2 flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                    <Star size={12} />
                    <EditableText
                      value={rotatingLabel}
                      onSave={(v) => __onFieldChange?.('rotatingLabel', v)}
                      as="span"
                      singleLine
                    />
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
                      if (isEditMode) return
                      if (currentUser) router.push('/mentorias')
                      else authModal.open('registro')
                    }}
                    className="inline-flex items-center justify-center gap-2 border-2 border-[#F65B7F] bg-[#F65B7F] px-7 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-transparent hover:text-[#F65B7F] hover:shadow-[4px_4px_0_#353535] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    <EditableText
                      value={currentUser ? ctaLoggedText : ctaGuestText}
                      onSave={(v) =>
                        __onFieldChange?.(currentUser ? 'ctaLoggedText' : 'ctaGuestText', v)
                      }
                      as="span"
                      singleLine
                    />
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditMode) return
                      if (currentUser) router.push('/comunidad')
                      else authModal.open('login')
                    }}
                    className="inline-flex items-center justify-center gap-2 border-2 border-white/20 bg-white/5 px-7 py-3 text-sm font-bold tracking-widest text-white/85 uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#F65B7F] hover:text-white"
                  >
                    <EditableText
                      value={secondaryCtaText}
                      onSave={(v) => __onFieldChange?.('secondaryCtaText', v)}
                      as="span"
                      singleLine
                    />
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
                  <EditableText
                    value={asideEyebrow}
                    onSave={(v) => __onFieldChange?.('asideEyebrow', v)}
                    as="span"
                    singleLine
                  />
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  {asideItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <ChevronRight size={14} className="shrink-0 text-[#F65B7F]" />
                      <span className="text-sm text-white/75">
                        <EditableText
                          value={item}
                          onSave={(v) => __onFieldChange?.(`asideItems.${i}`, v)}
                          as="span"
                          singleLine
                        />
                      </span>
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
                  <EditableRichText
                    value={bannerText}
                    onSave={(v) => __onFieldChange?.('bannerText', v)}
                    as="span"
                  />
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
              <EditableText
                value={stepsEyebrow}
                onSave={(v) => __onFieldChange?.('stepsEyebrow', v)}
                className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
                as="p"
              />
              <EditableRichText
                value={stepsHeading}
                onSave={(v) => __onFieldChange?.('stepsHeading', v)}
                className="mt-3 text-4xl leading-[1.1] font-extrabold tracking-[-0.04em] text-zinc-900 lg:text-[3rem]"
              />
            </TimelineAnimation>
            {isEditMode && (
              <div className="mb-6 flex items-center justify-between border-2 border-dashed border-[#8ECAE6] bg-[#8ECAE6]/10 px-6 py-4">
                <p className="text-xs font-bold tracking-widest text-[#023047] uppercase">Pasos</p>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="inline-flex items-center gap-2 border-2 border-[#023047] bg-[#023047] px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase transition hover:bg-transparent hover:text-[#023047]"
                >
                  <Plus size={14} />
                  Agregar paso
                </button>
              </div>
            )}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {localSteps.map((step, index) => {
                const Icon = STEP_ICONS[index] || Search
                const isPink = index % 2 === 0
                const accent = isPink ? '#F65B7F' : '#8ECAE6'
                return (
                  <div key={index} className="group relative">
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => handleDeleteStep(index)}
                        className="absolute -top-2 -right-2 z-20 flex size-7 items-center justify-center bg-white text-zinc-500 shadow-sm transition-all hover:bg-[#E63946] hover:text-white"
                        title="Eliminar paso"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                    <TimelineAnimation
                      as="article"
                      animationNum={index + 4}
                      timelineRef={sectionRef}
                      className="border-2 border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1"
                      style={{ boxShadow: `4px 4px 0 ${accent}30`, borderColor: '#e4e4e7' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-10 shrink-0 items-center justify-center text-sm font-bold text-white"
                          style={{ background: accent }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold tracking-[-0.02em] text-zinc-900">
                            <EditableText
                              value={step.title}
                              onSave={(v) => __onFieldChange?.(`steps.${index}.title`, v)}
                              as="span"
                              singleLine
                            />
                          </h3>
                        </div>
                      </div>
                      <EditableRichText
                        value={step.desc}
                        onSave={(v) => __onFieldChange?.(`steps.${index}.desc`, v)}
                        className="mt-4 text-sm leading-relaxed text-zinc-600"
                        as="p"
                      />
                      <div className="mt-5 flex items-center gap-2">
                        <div className="h-px flex-1 bg-zinc-200" />
                        <Icon size={14} className="shrink-0 text-zinc-400" />
                      </div>
                    </TimelineAnimation>
                  </div>
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
                  if (isEditMode) return
                  if (currentUser) router.push('/mentorias')
                  else authModal.open('registro')
                }}
                className="inline-flex items-center justify-center gap-2 border-2 border-[#F65B7F] bg-[#F65B7F] px-8 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-transparent hover:text-[#F65B7F] hover:shadow-[4px_4px_0_#353535] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <EditableText
                  value={currentUser ? stepsCtaLoggedText : stepsCtaGuestText}
                  onSave={(v) =>
                    __onFieldChange?.(currentUser ? 'stepsCtaLoggedText' : 'stepsCtaGuestText', v)
                  }
                  as="span"
                  singleLine
                />
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
              <EditableRichText
                value={ctaBlueHeading}
                onSave={(v) => __onFieldChange?.('ctaBlueHeading', v)}
                className="mt-6 text-3xl leading-[1.1] font-extrabold tracking-[-0.04em] text-white [text-shadow:2px_2px_0_#023047] sm:text-4xl lg:text-[2.8rem]"
              />
              <EditableRichText
                value={ctaBlueDescription}
                onSave={(v) => __onFieldChange?.('ctaBlueDescription', v)}
                className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-[#023047]"
                as="p"
              />
              <button
                type="button"
                onClick={() => {
                  if (isEditMode) return
                  if (currentUser) router.push('/mentorias')
                  else authModal.open('registro')
                }}
                className="mt-8 inline-flex items-center justify-center gap-2 border-2 border-white bg-white px-8 py-3 text-sm font-bold tracking-widest text-[#023047] uppercase shadow-[4px_4px_0_rgba(0,0,0,0.12)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_rgba(0,0,0,0.2)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <EditableText
                  value={currentUser ? ctaBlueLoggedText : ctaBlueGuestText}
                  onSave={(v) =>
                    __onFieldChange?.(currentUser ? 'ctaBlueLoggedText' : 'ctaBlueGuestText', v)
                  }
                  as="span"
                  singleLine
                />
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
              <EditableText
                value={mentoresEyebrow}
                onSave={(v) => __onFieldChange?.('mentoresEyebrow', v)}
                className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
                as="p"
              />
              <EditableRichText
                value={mentoresHeading}
                onSave={(v) => __onFieldChange?.('mentoresHeading', v)}
                className="mt-3 text-4xl leading-[1.1] font-extrabold tracking-[-0.04em] text-zinc-900 lg:text-[3rem]"
              />
            </TimelineAnimation>
            <div className="mt-12">
              {showInlineAdmin && (
                <div className="mb-6 flex items-center justify-between border-2 border-dashed border-[#8ECAE6] bg-[#8ECAE6]/10 px-6 py-4">
                  <p className="text-xs font-bold tracking-widest text-[#023047] uppercase">
                    <EditableText
                      value={adminModeLabel}
                      onSave={(v) => __onFieldChange?.('adminModeLabel', v)}
                      as="span"
                      singleLine
                    />
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMentor(null)
                      setShowEditModal(true)
                    }}
                    className="inline-flex items-center gap-2 border-2 border-[#023047] bg-[#023047] px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase transition hover:bg-transparent hover:text-[#023047]"
                  >
                    <Plus size={14} />
                    <EditableText
                      value={addMentorText}
                      onSave={(v) => __onFieldChange?.('addMentorText', v)}
                      as="span"
                      singleLine
                    />
                  </button>
                </div>
              )}
              {mentores.length > 0 ? (
                <ExpandingMentorsGallery
                  mentors={mentores}
                  canEdit={canEdit}
                  onEdit={handleEdit}
                  onDelete={showInlineAdmin ? handleDelete : undefined}
                />
              ) : (
                <div className="border-2 border-zinc-200 p-12 text-center">
                  <p className="text-sm text-zinc-500">
                    {mentoresLoaded ? (
                      <EditableText
                        value={emptyMentorText}
                        onSave={(v) => __onFieldChange?.('emptyMentorText', v)}
                        as="span"
                        singleLine
                      />
                    ) : (
                      'Cargando mentores...'
                    )}
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
              <EditableText
                value={ctaDarkEyebrow}
                onSave={(v) => __onFieldChange?.('ctaDarkEyebrow', v)}
                className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase"
                as="p"
              />
              <EditableRichText
                value={ctaDarkDescription}
                onSave={(v) => __onFieldChange?.('ctaDarkDescription', v)}
                className="mt-4 text-xl leading-relaxed font-semibold tracking-[-0.02em] text-white"
                as="p"
              />
              <Link
                href="mailto:direccion@operaprimacultura.com"
                onClick={(e) => isEditMode && e.preventDefault()}
                className="mt-8 inline-flex items-center justify-center gap-2 border-2 border-[#023047] bg-[#8ECAE6] px-8 py-3 text-sm font-bold tracking-widest text-[#023047] uppercase shadow-[4px_4px_0_rgba(0,0,0,0.2)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#023047] hover:shadow-[6px_6px_0_rgba(0,0,0,0.3)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <EditableText
                  value={ctaDarkButtonText}
                  onSave={(v) => __onFieldChange?.('ctaDarkButtonText', v)}
                  as="span"
                  singleLine
                />
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
                  onClick={(e) => isEditMode && e.preventDefault()}
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
        onSave={editingMentor ? handleSaveEdit : handleCreate}
      />
    </>
  )
}

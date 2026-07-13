'use client'

import { EditableRichText } from '@/components/editor/EditableRichText'
import { EditableText } from '@/components/editor/EditableText'
import { useEditMode } from '@/context/EditModeContext'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight, Briefcase, ChevronRight, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { useRouter } from 'next/navigation'

const DEFAULT_ITEMS = [
  'Convocatorias abiertas',
  'Proyectos colaborativos',
  'Prácticas profesionales',
  'Voluntariados culturales',
]

const DEFAULT_ASIDE_ITEMS = [
  'Estructurar un proyecto cultural',
  'Diseñar tu portafolio',
  'Redactar cartas para becas',
  'Planear una gira o exposición',
  'Revisar un presupuesto',
]

export function ProyectosLandingSection({
  eyebrow = 'Tablero de Oportunidades',
  heading = 'Encuentra tu <span class="text-[#8ECAE6]">próximo proyecto</span>',
  description = 'Participa en iniciativas gestionadas por Ópera Prima y gana experiencia profesional desde el inicio.',
  description2 = 'Explora proyectos de la comunidad, convocatorias de entidades culturales y oportunidades exclusivas para artistas emergentes.',
  listEyebrow = 'Tipos de oportunidades',
  listItems = DEFAULT_ITEMS,
  buttonText = 'Ver proyectos',
  loggedButtonText = 'Ir a proyectos',
  guestButtonText = 'Publica tu proyecto',
  asideEyebrow = 'Puedes trabajar en',
  asideItems = DEFAULT_ASIDE_ITEMS,
  __onFieldChange,
}: {
  eyebrow?: string
  heading?: string
  description?: string
  description2?: string
  listEyebrow?: string
  listItems?: string[]
  buttonText?: string
  loggedButtonText?: string
  guestButtonText?: string
  asideEyebrow?: string
  asideItems?: string[]
  __onFieldChange?: (path: string, value: unknown) => void
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const { isEditMode } = useEditMode()
  const { currentUser } = useAuthModal()
  const router = useRouter()

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#0f0f0f]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(246,91,127,0.04),transparent_70%)]"
      />
      <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#8ECAE6]" />

      <div className="relative z-10 mx-[100px] border-white/10 px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
        <div className="grid gap-16 px-4 py-28 sm:px-2 lg:grid-cols-[1.2fr_1fr] lg:gap-20 lg:py-32">
          <div className="max-w-3xl">
            <TimelineAnimation
              as="div"
              animationNum={0}
              timelineRef={sectionRef}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase">
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

              <div className="border-2 border-white/10 bg-white/5 px-6 py-5">
                <p className="mb-3 flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase">
                  <Sparkles size={12} />
                  <EditableText
                    value={listEyebrow}
                    onSave={(v) => __onFieldChange?.('listEyebrow', v)}
                    as="span"
                    singleLine
                  />
                </p>
                <div className="flex flex-col gap-2">
                  {listItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <ChevronRight size={14} className="shrink-0 text-[#8ECAE6]" />
                      <span className="text-sm text-white/75">
                        <EditableText
                          value={item}
                          onSave={(v) => __onFieldChange?.(`listItems.${i}`, v)}
                          as="span"
                          singleLine
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="#proyectos"
                  onClick={(e) => isEditMode && e.preventDefault()}
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#8ECAE6] bg-[#8ECAE6] px-7 py-3 text-sm font-bold tracking-widest text-[#023047] uppercase transition-all duration-150 hover:bg-transparent hover:text-[#8ECAE6] hover:shadow-[4px_4px_0_#353535] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <EditableText
                    value={buttonText}
                    onSave={(v) => __onFieldChange?.('buttonText', v)}
                    as="span"
                    singleLine
                  />
                  <ArrowRight size={16} />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    if (isEditMode) return
                    if (currentUser) router.push('/comunidad?tab=proyectos')
                    else router.push('/registro')
                  }}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/20 bg-white/5 px-7 py-3 text-sm font-bold tracking-widest text-white/85 uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#8ECAE6] hover:text-white"
                >
                  <Briefcase size={14} />
                  <EditableText
                    value={currentUser ? loggedButtonText : guestButtonText}
                    onSave={(v) =>
                      __onFieldChange?.(currentUser ? 'loggedButtonText' : 'guestButtonText', v)
                    }
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
              animationNum={5}
              timelineRef={sectionRef}
              className="border-2 border-white/10 bg-white/5 p-8 shadow-[4px_4px_0_rgba(255,255,255,0.06)]"
            >
              <p className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase">
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
                    <ChevronRight size={14} className="shrink-0 text-[#8ECAE6]" />
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
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 h-px bg-white/10" />
    </section>
  )
}

'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { RotatingText } from '@/components/shared/RotatingText'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileText,
  MessageCircle,
  Search,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { ExpandingMentorsGallery } from './ExpandingMentorsGallery'

const ROTATING_TOPICS = [
  'No sabes cómo empezar tu proyecto.',
  'Quieres aplicar a una convocatoria.',
  'Quieres estudiar un posgrado y no sabes cuál elegir.',
  'Necesitas mejorar tu portafolio.',
  'Tienes dudas sobre tu carrera artística.',
  'Tienes una idea pero no sabes aterrizarla.',
  'Quieres planear una gira o exposición.',
  'Necesitas ayuda con un presupuesto.',
  'Quieres estructurar un proyecto.',
  'Necesitas apoyo para tomar decisiones.',
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
    desc: 'Cada mentoría se enfoca en un tema concreto: tu portafolio, una convocatoria, una carta de motivación, un proyecto, una gira, un presupuesto o cualquier reto específico.',
    icon: Compass,
  },
  {
    number: 3,
    title: 'Reserva tu sesión',
    desc: 'Completa el formulario de reserva y cuéntanos qué quieres trabajar. Mientras más claro seas, mejor podrá prepararse tu mentor.',
    icon: ClipboardList,
  },
  {
    number: 4,
    title: 'Adjunta material de apoyo',
    desc: 'Puedes enviar documentos, enlaces, portafolios, convocatorias o cualquier archivo que ayude a entender mejor tu caso.',
    icon: FileText,
  },
  {
    number: 5,
    title: 'Ten tu mentoría 1:1',
    desc: 'Durante 60 minutos tendrás un espacio privado para conversar, hacer preguntas, recibir orientación y aterrizar acciones concretas.',
    icon: MessageCircle,
  },
  {
    number: 6,
    title: 'Recibe tu resumen final',
    desc: 'Después de la sesión recibirás un resumen con los puntos clave trabajados y recomendaciones para seguir avanzando.',
    icon: CheckCircle2,
  },
]

export const MENTORS = [
  {
    id: 'ana-restrepo',
    file: 'AN-R',
    name: 'Ana Restrepo',
    title: 'Portafolio, convocatorias y becas',
    location: 'Bogotá, presencial + online',
    focus: 'Portafolio editorial, cartas de motivación y convocatorias culturales.',
    notes: [
      'Revisa tu showcase y estructura la narrativa de tu trabajo.',
      'Prepara cartas claras para residencias y apoyos.',
      'Optimiza imágenes, hojas de vida y proyectos clave.',
    ],
  },
  {
    id: 'mateo-campos',
    file: 'MA-CA',
    name: 'Mateo Campos',
    title: 'Proyectos culturales y producciones',
    location: 'Medellín, online',
    focus: 'Estrategia, cronograma y presentación de proyectos culturales.',
    notes: [
      'Diseña pasos claros para lanzar tu proyecto.',
      'Define roles, entregables y fechas clave.',
      'Encuentra aliados y rutas de visibilidad.',
    ],
  },
  {
    id: 'laura-reyes',
    file: 'LA-RE',
    name: 'Laura Reyes',
    title: 'Cartas, aplicaciones y becas',
    location: 'Cali, online',
    focus: 'Texto persuasivo para convocatorias y presentación profesional.',
    notes: [
      'Escribe cartas de motivación que conecten con jurados.',
      'Ajusta tu perfil a los criterios de postulación.',
      'Haz que tu propuesta sea clara y memorable.',
    ],
  },
  {
    id: 'diego-salazar',
    file: 'DI-SA',
    name: 'Diego Salazar',
    title: 'Giras, producción y logística',
    location: 'Bucaramanga, online',
    focus: 'Plan de gira, producción de shows y administración de recursos.',
    notes: [
      'Estructura tu ruta y presupuesto de viaje.',
      'Revisa propuestas de escenario y riders.',
      'Diseña pasos para presentar tu proyecto a espacios.',
    ],
  },
  {
    id: 'lucia-gomez',
    file: 'LU-GO',
    name: 'Lucía Gómez',
    title: 'Finanzas artísticas y presupuestos',
    location: 'Barranquilla, online',
    focus: 'Presupuestos, facturación y decisiones financieras para artistas.',
    notes: [
      'Transforma tu idea en un presupuesto claro.',
      'Calcula costos reales y margen de sostenibilidad.',
      'Presenta tu plan con confianza frente a productores.',
    ],
  },
]

export function MentoriasLandingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const authModal = useAuthModal()
  const { currentUser } = authModal
  const router = useRouter()

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden border-b border-white/10 bg-[#0f0f0f]"
    >
      <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#8ECAE6]" />

      {/* ═══════════════ HERO ═══════════════ */}
      <div className="no-borders relative z-10 mx-[100px] border-white/10 px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
        <div className="grid gap-16 px-4 py-28 sm:px-2 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-32">
          {/* Left: hero text + rotating */}
          <div className="max-w-3xl">
            <TimelineAnimation
              as="div"
              animationNum={0}
              timelineRef={sectionRef}
              className="flex flex-col gap-5"
            >
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase">
                Mentorías a la medida
              </p>
              <h1 className="text-5xl leading-[1.05] font-extrabold tracking-[-0.04em] text-white sm:text-6xl lg:text-[4rem]">
                NO ESTÁS SOLO
              </h1>
              <p className="text-xl leading-relaxed font-semibold text-white/90 sm:text-2xl">
                Espacios de acompañamiento personalizados diseñados para que tu práctica artística
                sea más clara, más estratégica y más efectiva.
              </p>
              <div className="space-y-5 text-lg leading-relaxed text-white/75">
                <p>
                  Cuando eres un artista emergente es común sentirse perdido, por eso hemos creado
                  unos espacios de trabajo personalizados donde podrás conectarte con un mentor que
                  tiene las herramientas necesarias para ayudarte.
                </p>
                <p>
                  Ser profesional presenta muchos retos, es por esto que en nuestro equipo de
                  mentores hay expertos en diferentes temas, puedes trabajar desde cómo estructurar
                  un proyecto cultural, revisar el diseño de tu portafolio, redactar cartas de
                  motivación para presentarte a becas, planear una gira o revisar un presupuesto.
                </p>
                <p>
                  Todas esas cosas forman parte de ser artista y no las suelen enseñar en la
                  universidad, pero nosotros no queremos que eso sea un obstáculo para alcanzar esas
                  metas por las que trabajas fuertemente.
                </p>
              </div>

              {/* Rotating text */}
              <div className="mt-2 rounded-none border-2 border-[#8ECAE6]/30 bg-white/5 px-6 py-4 text-white/90">
                <p className="mb-1 text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase">
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
                  className="inline-flex items-center justify-center gap-2 rounded-none border-2 border-[#E63946] bg-[#E63946] px-6 py-3 text-sm font-bold tracking-widest text-white uppercase shadow-[4px_4px_0_#353535] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-transparent hover:text-[#E63946]"
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
                  className="inline-flex items-center justify-center gap-2 rounded-none border-2 border-white/20 bg-white/5 px-6 py-3 text-sm font-bold tracking-widest text-white/85 uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#8ECAE6] hover:text-white"
                >
                  {currentUser ? 'Ir a la comunidad' : 'Ver perfiles'}
                </button>
              </div>
            </TimelineAnimation>
          </div>

          {/* Right: 6 steps */}
          <div className="self-start">
            <div className="mb-4">
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase">
                ¿Cómo funcionan?
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white">
                Un proceso claro para que cada sesión tenga foco y resultado.
              </h2>
            </div>
            <div className="grid gap-3">
              {STEPS.map((step, index) => {
                const Icon = step.icon
                return (
                  <TimelineAnimation
                    key={step.title}
                    as="article"
                    animationNum={index + 1}
                    timelineRef={sectionRef}
                    className="group relative border-2 border-white/10 bg-white/5 p-5 text-white shadow-[4px_4px_0_rgba(255,255,255,0.08)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#8ECAE6]"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#8ECAE6]/40 bg-[#8ECAE6]/10 text-sm font-bold text-[#8ECAE6]">
                        {step.number}
                      </span>
                      <div>
                        <h3 className="text-base font-bold tracking-[-0.02em] text-white">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-white/65">{step.desc}</p>
                      </div>
                    </div>
                  </TimelineAnimation>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ MENTORES ═══════════════ */}
      <div className="border-t-2 border-white/10 bg-[#F0F8FF]">
        <div className="no-borders mx-[100px] border-zinc-200 px-4 py-24 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6 lg:py-32">
          <TimelineAnimation
            as="div"
            animationNum={7}
            timelineRef={sectionRef}
            className="max-w-2xl"
          >
            <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase">
              Nuestros mentores
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-zinc-900">
              Conoce a los profesionales que están listos para ayudarte a impulsar tu camino
              artístico.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-700">
              Contamos con mentores de diferentes áreas para que encuentres a la persona que mejor
              se adapte a lo que necesitas trabajar.
            </p>
          </TimelineAnimation>

          <div className="mt-12">
            <ExpandingMentorsGallery mentors={MENTORS} />
          </div>
        </div>
      </div>

      {/* ═══════════════ CTA SER MENTOR ═══════════════ */}
      <div className="border-t-2 border-white/10 bg-[#0f0f0f]">
        <div className="no-borders mx-[100px] border-white/10 px-4 py-20 text-center max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
          <TimelineAnimation
            as="div"
            animationNum={8}
            timelineRef={sectionRef}
            className="mx-auto max-w-xl"
          >
            <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase">
              ¿Quieres ser mentor?
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Si eres profesional del sector cultural y te gustaría compartir tu experiencia con
              artistas emergentes, escríbenos.
            </p>
            <Link
              href="mailto:direccion@operaprimacultura.com"
              className="mt-6 inline-flex items-center gap-2 rounded-none border-2 border-[#E63946] bg-[#E63946] px-6 py-3 text-sm font-bold tracking-widest text-white uppercase shadow-[4px_4px_0_#353535] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-transparent hover:text-[#E63946]"
            >
              Escribir a direccion@operaprimacultura.com
              <ArrowRight size={16} />
            </Link>
          </TimelineAnimation>
        </div>
      </div>
    </section>
  )
}

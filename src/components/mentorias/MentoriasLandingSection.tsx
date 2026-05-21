'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight, CheckCircle2, Clock3, Compass, FileText, User } from 'lucide-react'
import { useRef } from 'react'
import { ExpandingMentorsGallery } from './ExpandingMentorsGallery'

const INTRO_CARDS = [
  {
    eyebrow: 'Mentorías 1:1',
    title: 'Sesión privada de 60 minutos',
    body: 'Un espacio dedicado para que el mentor te escuche, revise tu caso y te entregue acciones concretas.',
    accent: '#F65B7F',
    icon: Clock3,
  },
  {
    eyebrow: 'Portafolio & becas',
    title: 'Revisión de presentación',
    body: 'Trabaja tu portafolio, cartas y convocatorias con un mentor que conoce el circuito cultural.',
    accent: '#1A4A3C',
    icon: FileText,
  },
  {
    eyebrow: 'Proyectos con criterio',
    title: 'Estrategia para tu carrera',
    body: 'Define un proyecto cultural sólido, planifica una gira o ajusta tu presupuesto con soporte experto.',
    accent: '#5E3A8A',
    icon: Compass,
  },
]

const HOW_IT_WORKS = [
  {
    title: 'Sesión 1:1 de 60 minutos',
    description:
      'Cada mentoría tiene una duración clara y espacio para preguntas, análisis y recomendaciones.',
    icon: Clock3,
  },
  {
    title: 'Elige el mentor adecuado',
    description:
      'Lee el perfil de cada mentor y selecciona a quien mejor se ajuste a tu desafío creativo.',
    icon: User,
  },
  {
    title: 'Prepara tu tema antes de reservar',
    description:
      'Detalla el tema en el formulario y adjunta documentos si crees que ayudarán al mentor.',
    icon: FileText,
  },
  {
    title: 'Resumen y feedback final',
    description:
      'Recibirás un resumen de la sesión y una encuesta para mejorar nuestro acompañamiento.',
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden border-b border-white/10 bg-[#0f0f0f]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#F65B7F]" />

      <div className="relative z-10 mx-auto max-w-420 border-white/10 px-4 sm:border-x sm:px-6">
        <div className="grid gap-20 px-4 py-28 sm:px-2 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-32">
          <div className="max-w-3xl">
            <TimelineAnimation
              as="div"
              animationNum={0}
              timelineRef={sectionRef}
              className="flex flex-col gap-5"
            >
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                Mentorías a la medida
              </p>
              <h1 className="text-5xl leading-[1.2] font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-[4rem]">
                Espacios de trabajo diseñados para que tu práctica artística sea más clara, más
                estratégica y más efectiva.
              </h1>
              <div className="space-y-6 text-lg leading-relaxed text-white/80">
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => authModal.open('registro')}
                  className="inline-flex items-center justify-center gap-2 rounded-none border-2 border-[#F65B7F] bg-[#F65B7F] px-6 py-3 text-sm font-bold tracking-widest text-white uppercase shadow-[4px_4px_0_#111] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-transparent hover:text-[#F65B7F]"
                >
                  Reservar mentoría
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => authModal.open('login')}
                  className="inline-flex items-center justify-center gap-2 rounded-none border-2 border-white/20 bg-white/5 px-6 py-3 text-sm font-bold tracking-widest text-white/85 uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#F65B7F] hover:text-white"
                >
                  Ver perfiles
                </button>
              </div>
            </TimelineAnimation>
          </div>

          <div className="grid gap-4 self-start">
            {INTRO_CARDS.map((card, index) => {
              const Icon = card.icon
              return (
                <TimelineAnimation
                  key={card.title}
                  as="article"
                  animationNum={index + 1}
                  timelineRef={sectionRef}
                  className="group relative border-2 border-white/10 bg-white/5 p-6 text-white shadow-[4px_4px_0_rgba(255,255,255,0.08)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#F65B7F]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className="text-[0.62rem] font-bold tracking-[0.28em] uppercase"
                        style={{ color: card.accent }}
                      >
                        {card.eyebrow}
                      </p>
                      <h2 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-white">
                        {card.title}
                      </h2>
                    </div>
                    <div
                      className="flex h-11 w-11 items-center justify-center border-2 border-white/12 text-white/90"
                      style={{ boxShadow: `3px 3px 0 ${card.accent}` }}
                    >
                      <Icon size={18} />
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/70">{card.body}</p>
                </TimelineAnimation>
              )
            })}
          </div>
        </div>
      </div>

      <div className="border-t-2 border-white/10 bg-[#FAFAF9]">
        <div className="mx-auto max-w-420 border-zinc-200 px-4 py-24 sm:border-x sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <TimelineAnimation
                as="div"
                animationNum={5}
                timelineRef={sectionRef}
                className="max-w-2xl"
              >
                <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                  ¿Cómo funcionan?
                </p>
                <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-zinc-900">
                  Un proceso claro para que cada sesión tenga foco y resultado.
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-zinc-700">
                  Lee atentamente el perfil de los diferentes mentores para que puedas elegir a
                  quien mejor pueda ayudarte. En cada mentoría se debe trabajar un tema en
                  específico, que debes detallar en el formulario de reserva para que el mentor
                  pueda prepararse con antelación. Allí puedes adjuntar documentos si crees que le
                  puede ayudar.
                </p>
                <p className="mt-6 text-lg leading-relaxed text-zinc-700">
                  Al final de la sesión recibirás un resumen de lo hablado y una encuesta de
                  satisfacción que nos permitirá ser cada vez mejores acompañantes en tu proceso al
                  éxito.
                </p>
              </TimelineAnimation>
            </div>

            <div className="grid gap-4">
              {HOW_IT_WORKS.map((item, index) => {
                const Icon = item.icon
                return (
                  <TimelineAnimation
                    key={item.title}
                    as="article"
                    animationNum={6 + index}
                    timelineRef={sectionRef}
                    className="group relative border-2 border-zinc-200 bg-white p-6 text-zinc-900 shadow-[4px_4px_0_rgba(17,17,17,0.08)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#111]"
                  >
                    <div className="flex items-center gap-3 text-[#0f0f0f]">
                      <span className="flex h-11 w-11 items-center justify-center border-2 border-zinc-200 text-[#F65B7F]">
                        <Icon size={18} />
                      </span>
                      <h3 className="text-xl font-bold tracking-[-0.02em]">{item.title}</h3>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-zinc-600">{item.description}</p>
                  </TimelineAnimation>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t-2 border-white/10 bg-[#0f0f0f]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#F65B7F]" />

        <div className="relative z-10 mx-auto max-w-420 border-white/10 px-4 py-24 sm:border-x sm:px-6">
          <TimelineAnimation
            as="div"
            animationNum={10}
            timelineRef={sectionRef}
            className="max-w-2xl"
          >
            <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
              Nuestros mentores
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-white">
              Elige tu mentor como si abrieras un archivo profesional.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Haz clic en cada carpeta para ver su experiencia, enfoque y los temas que pueden
              desarrollar contigo. Por ahora contamos con cinco mentores listos para acompañarte.
            </p>
          </TimelineAnimation>

          <div className="mt-12">
            <ExpandingMentorsGallery mentors={MENTORS} />
          </div>
        </div>
      </div>
    </section>
  )
}

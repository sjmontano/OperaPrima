'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { MENTORS } from '@/components/mentorias/MentoriasLandingSection'
import { ExpandingMentorsGallery } from '@/components/mentorias/ExpandingMentorsGallery'
import { TestimonialsWall, type Testimonial } from '@/components/shared/TestimonialsWall'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

const VALORES = [
  {
    name: 'Pasión',
    desc: 'Creemos en el arte como motor de transformación. Cada proyecto nace del deseo genuino de crear.',
    accent: '#8ECAE6',
  },
  {
    name: 'Colaboración',
    desc: 'Construimos en red. El talento crece cuando se comparte, no cuando compite.',
    accent: '#023047',
  },
  {
    name: 'Accesibilidad',
    desc: 'Democratizamos el acceso a herramientas profesionales. El contexto no debería limitar el potencial.',
    accent: '#4682B4',
  },
  {
    name: 'Autonomía',
    desc: 'Te damos herramientas, no recetas. Queremos artistas independientes, con criterio propio.',
    accent: '#8ECAE6',
  },
  {
    name: 'Diversidad',
    desc: 'Todas las disciplinas, regiones y voces tienen lugar. La riqueza está en la diferencia.',
    accent: '#023047',
  },
  {
    name: 'Internacionalización',
    desc: 'Conectamos el talento emergente con oportunidades globales. Pensamos local, actuamos sin fronteras.',
    accent: '#4682B4',
  },
]

const SERVICIOS = [
  {
    eyebrow: 'Calendario de la comunidad',
    title: 'Descubre lo que otros artistas están creando',
    desc: 'Un espacio para compartir y descubrir lo que otros artistas emergentes están creando cerca de ti: obras, exposiciones, estrenos, conciertos, muestras, procesos y mucho más.',
    href: '/comunidad',
    color: '#8ECAE6',
  },
  {
    eyebrow: 'Tablero de Oportunidades',
    title: 'Prácticas, convocatorias y proyectos',
    desc: 'Prácticas, voluntariados, convocatorias, proyectos colaborativos y experiencias para empezar a ganar recorrido en el sector cultural. También puedes publicar tus propios proyectos.',
    href: '/tablero',
    color: '#023047',
  },
  {
    eyebrow: 'Networking Sessions',
    title: 'Conecta con artistas de otros países',
    desc: 'Eventos online para conectar con artistas emergentes de diferentes países, compartir experiencias, crear redes y abrir nuevas posibilidades de colaboración.',
    href: '/eventos',
    color: '#4682B4',
  },
  {
    eyebrow: 'Mentorías Online',
    title: 'Sesiones personalizadas con profesionales',
    desc: 'Sesiones personalizadas con profesionales del sector que te ayudarán a resolver dudas, orientar tu camino y aterrizar tus ideas.',
    href: '/mentorias',
    color: '#8ECAE6',
  },
  {
    eyebrow: 'Talleres',
    title: 'Herramientas reales para vivir del arte',
    desc: 'Espacios formativos sobre herramientas reales para vivir del arte: convocatorias, portafolio, gestión cultural, visibilidad, proyectos, bienestar creativo y mucho más.',
    href: '/eventos',
    color: '#023047',
  },
  {
    eyebrow: 'Proyectos',
    title: 'Alianzas con entidades',
    desc: 'Nos aliamos con diferentes entidades para desarrollar proyectos con artistas de nuestra comunidad, creando oportunidades para que puedan ganar experiencia real.',
    href: '/tablero',
    color: '#4682B4',
  },
]

const COMUNIDAD_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Camila Rojas',
    handle: '@camilarte',
    text: 'Opera Prima cambió mi forma de ver mi carrera. Por primera vez sentí que no estaba sola en esto. Las mentorías me dieron claridad y la comunidad me dio impulso.',
    avatar: 'https://i.pravatar.cc/150?u=camila',
  },
  {
    name: 'Mateo Vargas',
    handle: '@mateovibes',
    text: 'Encontré en Opera Prima una comunidad real, de personas que entienden lo que significa apostarle al arte en Colombia. Cada taller suma y cada conexión abre puertas.',
    avatar: 'https://i.pravatar.cc/150?u=mateo',
  },
  {
    name: 'Mariana Cruz',
    handle: '@mariana.crea',
    text: 'Lo que más valoro es la calidez del equipo y la calidad de los mentores. Se nota que hay un propósito genuino detrás de cada iniciativa.',
    avatar: 'https://i.pravatar.cc/150?u=mariana',
  },
  {
    name: 'Santiago Pérez',
    handle: '@santiagop',
    text: 'Llegué sin saber cómo moverme en el mundo cultural y aquí encontré guía, contactos y, sobre todo, confianza para presentarme a convocatorias que antes ni consideraba.',
    avatar: 'https://i.pravatar.cc/150?u=santiago',
  },
]

const TEAM = [
  {
    id: 'angela-rodriguez',
    name: 'Ángela Rodríguez',
    role: 'Fundadora',
    bio: 'Gestora cultural con más de una década impulsando proyectos artísticos en Colombia y América Latina. Su visión: que ningún artista emergente camine solo en su desarrollo profesional.',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'catalina-cruz',
    name: 'Catalina Cruz',
    role: 'Coordinadora',
    bio: 'Artista visual y productora cultural. Coordina la agenda de mentorías, talleres y eventos, asegurando que cada experiencia tenga calidad, foco y calidez editorial.',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop&q=80',
  },
]

export function SobreLandingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const authModal = useAuthModal()
  const { currentUser } = authModal
  const router = useRouter()

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden border-b border-white/10 bg-[#0f0f0f]"
    >
      {/* ── Accent strip top ── */}
      <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#F65B7F]" />

      {/* ═══════════════ HERO ═══════════════ */}
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
                Sobre la plataforma
              </div>

              <h1 className="text-5xl leading-[1.05] font-extrabold tracking-[-0.04em] text-white sm:text-6xl lg:text-[4rem]">
                Ópera <span className="text-[#F65B7F]">Prima</span>
              </h1>

              <p className="text-xl leading-relaxed font-semibold text-white/90 sm:text-2xl">
                Una plataforma internacional que acompaña a artistas emergentes en sus primeros
                pasos hacia la vida profesional.
              </p>

              <p className="text-base leading-relaxed text-white/60">
                Aquí encontrarás herramientas, oportunidades y una comunidad que impulsa tu
                desarrollo artístico y profesional, para que construyas tu camino con estrategia,
                acompañamiento y propósito.
              </p>

              <div className="border-2 border-white/10 bg-white/5 px-6 py-5">
                <p className="mb-3 flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                  <Sparkles size={12} />
                  Nuestro enfoque
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    'Acompañamiento personalizado',
                    'Oportunidades reales',
                    'Comunidad activa',
                    'Sin costo para empezar',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <ChevronRight size={14} className="shrink-0 text-[#F65B7F]" />
                      <span className="text-sm text-white/75">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser) router.push('/comunidad')
                    else authModal.open('registro')
                  }}
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#F65B7F] bg-[#F65B7F] px-7 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-transparent hover:text-[#F65B7F] hover:shadow-[4px_4px_0_#353535] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  {currentUser ? 'Ir a la comunidad' : 'Únete a la comunidad'}
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser) router.push(`/perfil/${currentUser.username}`)
                    else authModal.open('login')
                  }}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/20 bg-white/5 px-7 py-3 text-sm font-bold tracking-widest text-white/85 uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#F65B7F] hover:text-white"
                >
                  {currentUser ? 'Mi perfil' : 'Iniciar sesión'}
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
              <p className="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                <Sparkles size={13} />
                Construido para
              </p>
              <div className="mt-5 flex flex-col gap-3">
                {[
                  'Artistas emergentes',
                  'Gestores culturales',
                  'Creadores multidisciplinarios',
                  'Comunidad hispanohablante',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <ChevronRight size={14} className="shrink-0 text-[#F65B7F]" />
                    <span className="text-sm text-white/75">{item}</span>
                  </div>
                ))}
              </div>
            </TimelineAnimation>
          </div>
        </div>
      </div>

      {/* ═══════════════ NUESTROS SERVICIOS ═══════════════ */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#F65B7F]" />
        <div className="mx-[100px] border-zinc-200 px-4 py-24 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6 lg:py-32">
          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
            <TimelineAnimation as="div" animationNum={6} timelineRef={sectionRef}>
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                La plataforma
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-zinc-900 lg:text-[2.8rem]">
                Un espacio para <span className="text-[#F65B7F]">artistas emergentes.</span>
              </h2>
            </TimelineAnimation>
            <TimelineAnimation
              as="p"
              animationNum={7}
              timelineRef={sectionRef}
              className="max-w-md text-base leading-relaxed text-zinc-500 lg:pb-2"
            >
              Aquí conectas con otros artistas, descubres oportunidades y empiezas a mover tus
              proyectos. Todo gratis.
            </TimelineAnimation>
          </div>

          <div className="mt-6 mb-6 h-0.75 w-16 bg-[#F65B7F]" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS.map((svc, i) => (
              <Link key={svc.eyebrow} href={svc.href}>
                <TimelineAnimation
                  as="article"
                  animationNum={8 + i}
                  timelineRef={sectionRef}
                  className="group flex h-full flex-col border-2 border-zinc-200 bg-white p-6 shadow-[4px_4px_0_rgba(17,17,17,0.08)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#353535]"
                >
                  <div
                    className="mb-4 flex size-10 items-center justify-center border-2 text-sm font-bold transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{
                      borderColor: `${svc.color}50`,
                      color: svc.color,
                      boxShadow: `3px 3px 0 ${svc.color}`,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <p
                    className="text-[0.62rem] font-bold tracking-[0.28em] uppercase"
                    style={{ color: svc.color }}
                  >
                    {svc.eyebrow}
                  </p>
                  <h3 className="mt-2 text-lg font-bold tracking-[-0.02em] text-zinc-900">
                    {svc.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{svc.desc}</p>
                  <div className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-1 text-[0.6rem] font-bold tracking-widest text-[#023047] uppercase transition-all group-hover:gap-2">
                      Explorar <ArrowRight size={12} />
                    </span>
                  </div>
                </TimelineAnimation>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ VALORES ═══════════════ */}
      <section className="relative w-full overflow-hidden bg-[#8ECAE6]">
        <div className="mx-[100px] border-white/10 px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
          <div className="px-4 py-24 text-center sm:px-2 lg:py-28">
            <TimelineAnimation
              as="div"
              animationNum={13}
              timelineRef={sectionRef}
              className="mb-12"
            >
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase">
                Nuestros valores
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-white [text-shadow:2px_2px_0_#023047] lg:text-5xl">
                Lo que nos mueve
              </h2>
            </TimelineAnimation>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VALORES.map((valor, i) => (
                <TimelineAnimation
                  key={valor.name}
                  as="article"
                  animationNum={14 + i}
                  timelineRef={sectionRef}
                  className="group border-2 border-white/60 bg-white/90 p-6 shadow-[4px_4px_0_rgba(2,48,71,0.2)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:border-white hover:bg-white hover:shadow-[6px_6px_0_rgba(2,48,71,0.35)]"
                >
                  <p
                    className="text-[0.62rem] font-bold tracking-[0.28em] uppercase"
                    style={{ color: valor.accent }}
                  >
                    {valor.name}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-700">{valor.desc}</p>
                </TimelineAnimation>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MISIÓN + VISIÓN ═══════════════ */}
      <div className="border-t-2 border-white/10 bg-white">
        <div className="mx-[100px] border-zinc-200 px-4 py-24 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6 lg:py-32">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <TimelineAnimation
              as="article"
              animationNum={20}
              timelineRef={sectionRef}
              className="group relative flex flex-col border-2 border-[#353535] bg-white p-8 shadow-[4px_4px_0_#353535] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#023047] lg:p-10"
            >
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase">
                Nuestra Misión
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[#353535] lg:text-3xl">
                Acortar la distancia entre la formación y la profesión.
              </h3>
              <p className="mt-5 text-base leading-relaxed text-zinc-600">
                Impulsar la transición profesional de artistas emergentes, facilitando el acceso a
                herramientas, oportunidades y redes que potencien su desarrollo.
              </p>
            </TimelineAnimation>

            <TimelineAnimation
              as="article"
              animationNum={21}
              timelineRef={sectionRef}
              className="group relative flex flex-col border-2 border-[#353535] bg-white p-8 shadow-[4px_4px_0_#353535] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#023047] lg:p-10"
            >
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase">
                Nuestra Visión
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[#353535] lg:text-3xl">
                Ser el puente que el talento hispanohablante necesita.
              </h3>
              <p className="mt-5 text-base leading-relaxed text-zinc-600">
                Convertirse en el principal puente entre la formación artística y la vida
                profesional en los países hispanohablantes, consolidando una comunidad activa y una
                red global de oportunidades.
              </p>
            </TimelineAnimation>
          </div>
        </div>
      </div>

      {/* ═══════════════ COMUNIDAD ═══════════════ */}
      <div className="bg-white">
        <TestimonialsWall
          headline="Esto dicen los artistas de nuestra comunidad"
          testimonialEyebrow="La comunidad"
          testimonials={COMUNIDAD_TESTIMONIALS}
          rows={1}
          fadeColor="#FFFFFF"
        />
      </div>

      {/* ═══════════════ EQUIPO ═══════════════ */}
      <div className="relative border-t-2 border-white/10 bg-[#0f0f0f]">
        <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#8ECAE6]" />

        <div className="relative z-10 mx-[100px] border-white/10 px-4 py-24 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6 lg:py-32">
          <div className="mb-14">
            <TimelineAnimation
              as="p"
              animationNum={22}
              timelineRef={sectionRef}
              className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase"
            >
              El equipo
            </TimelineAnimation>
            <TimelineAnimation
              as="h2"
              animationNum={23}
              timelineRef={sectionRef}
              className="mt-3 text-4xl font-bold tracking-[-0.03em] text-white lg:text-5xl"
            >
              Detrás de Ópera Prima
            </TimelineAnimation>
            <TimelineAnimation
              as="p"
              animationNum={24}
              timelineRef={sectionRef}
              className="mt-4 max-w-2xl text-lg leading-relaxed text-white/65"
            >
              Un equipo pequeño con una convicción grande: el talento emergente merece mejores
              condiciones para crecer.
            </TimelineAnimation>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {TEAM.map((member, i) => (
              <Link key={member.id} href={`/perfil/${member.id}`}>
                <TimelineAnimation
                  as="article"
                  animationNum={25 + i}
                  timelineRef={sectionRef}
                  className="group flex flex-col gap-6 border-2 border-white/10 bg-white/5 p-8 shadow-[4px_4px_0_rgba(255,255,255,0.08)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#8ECAE6] sm:flex-row lg:p-10"
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={120}
                    height={120}
                    unoptimized
                    className="h-28 w-28 shrink-0 rounded-full border-2 border-white/20 object-cover transition-colors duration-200 group-hover:border-[#8ECAE6]"
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase">
                      {member.role}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white">
                      {member.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">{member.bio}</p>
                  </div>
                </TimelineAnimation>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ MENTORES ═══════════════ */}
      <div className="relative border-t-2 border-white/10 bg-[#0f0f0f]">
        <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#8ECAE6]" />

        <div className="relative z-10 mx-[100px] border-white/10 px-4 py-24 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6 lg:py-32">
          <div className="mb-12 max-w-2xl">
            <TimelineAnimation
              as="p"
              animationNum={27}
              timelineRef={sectionRef}
              className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase"
            >
              Nuestros mentores
            </TimelineAnimation>
            <TimelineAnimation
              as="h2"
              animationNum={28}
              timelineRef={sectionRef}
              className="mt-3 text-4xl font-bold tracking-[-0.03em] text-white lg:text-5xl"
            >
              Profesionales que ya recorrieron el camino
            </TimelineAnimation>
            <TimelineAnimation
              as="p"
              animationNum={29}
              timelineRef={sectionRef}
              className="mt-4 text-lg leading-relaxed text-white/65"
            >
              Haz clic en cada carpeta para ver su experiencia, enfoque y los temas que pueden
              desarrollar contigo.
            </TimelineAnimation>
          </div>

          <TimelineAnimation as="div" animationNum={30} timelineRef={sectionRef}>
            <ExpandingMentorsGallery mentors={MENTORS} />
          </TimelineAnimation>
        </div>
      </div>
    </section>
  )
}

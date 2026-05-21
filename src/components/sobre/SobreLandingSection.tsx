'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { MENTORS } from '@/components/mentorias/MentoriasLandingSection'
import { ExpandingMentorsGallery } from '@/components/mentorias/ExpandingMentorsGallery'
import { TestimonialsWall, type Testimonial } from '@/components/shared/TestimonialsWall'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight, Heart, Target } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'

const VALORES = [
  {
    name: 'Pasión',
    desc: 'Creemos en el arte como motor de transformación. Cada proyecto nace del deseo genuino de crear.',
    accent: '#F65B7F',
  },
  {
    name: 'Colaboración',
    desc: 'Construimos en red. El talento crece cuando se comparte, no cuando compite.',
    accent: '#1A4A3C',
  },
  {
    name: 'Accesibilidad',
    desc: 'Democratizamos el acceso a herramientas profesionales. El contexto no debería limitar el potencial.',
    accent: '#5E3A8A',
  },
  {
    name: 'Autonomía',
    desc: 'Te damos herramientas, no recetas. Queremos artistas independientes, con criterio propio.',
    accent: '#F65B7F',
  },
  {
    name: 'Diversidad',
    desc: 'Todas las disciplinas, regiones y voces tienen lugar. La riqueza está en la diferencia.',
    accent: '#1A4A3C',
  },
  {
    name: 'Internacionalización',
    desc: 'Conectamos el talento colombiano con oportunidades globales. Pensamos local, actuamos sin fronteras.',
    accent: '#5E3A8A',
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
    name: 'Ángela Rodríguez',
    role: 'Fundadora',
    bio: 'Gestora cultural con más de una década impulsando proyectos artísticos en Colombia y América Latina. Su visión: que ningún artista emergente camine solo en su desarrollo profesional.',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop&q=80',
  },
  {
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden border-b border-white/10 bg-[#0f0f0f]"
    >
      {/* ── Grid overlay ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      {/* ── Pink accent strip top ── */}
      <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#F65B7F]" />

      {/* ═══════════════ HERO + VALORES ═══════════════ */}
      <div className="relative z-10 mx-auto max-w-420 border-white/10 px-4 sm:border-x sm:px-6">
        <div className="grid gap-16 px-4 py-28 sm:px-2 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-32">
          {/* Left: texto */}
          <div className="max-w-3xl">
            <TimelineAnimation
              as="div"
              animationNum={0}
              timelineRef={sectionRef}
              className="flex flex-col gap-5"
            >
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                Sobre la plataforma
              </p>
              <h1 className="text-5xl leading-[1.05] font-extrabold tracking-[-0.04em] text-white sm:text-6xl lg:text-[4rem]">
                Ópera Prima
              </h1>
              <p className="text-xl leading-relaxed font-semibold text-white/90 sm:text-2xl">
                La plataforma
              </p>
              <div className="space-y-5 text-lg leading-relaxed text-white/75">
                <p>
                  Una plataforma digital que acompaña a artistas emergentes con herramientas reales
                  para dar sus primeros pasos profesionales.
                </p>
                <p>
                  Aquí encuentras herramientas, oportunidades y una comunidad que te ayuda a
                  construir tu camino profesional con estrategia, no con suerte.
                </p>
                <p>
                  Ópera Prima es una plataforma digital creada para acompañar a estudiantes y
                  egresados de carreras artísticas en su transición al mundo profesional. Bienvenido
                  a Ópera Prima.
                </p>
              </div>
              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => authModal.open('registro')}
                  className="inline-flex items-center justify-center gap-2 rounded-none border-2 border-[#F65B7F] bg-[#F65B7F] px-6 py-3 text-sm font-bold tracking-widest text-white uppercase shadow-[4px_4px_0_#111] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-transparent hover:text-[#F65B7F]"
                >
                  Únete a la comunidad
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => authModal.open('login')}
                  className="inline-flex items-center justify-center gap-2 rounded-none border-2 border-white/20 bg-white/5 px-6 py-3 text-sm font-bold tracking-widest text-white/85 uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#F65B7F] hover:text-white"
                >
                  Iniciar sesión
                </button>
              </div>
            </TimelineAnimation>
          </div>

          {/* Right: espacio visual */}
          <div className="hidden items-start justify-end lg:flex">
            <div
              className="relative aspect-square w-full max-w-[320px] border-2 border-white/10 shadow-[6px_6px_0_rgba(246,91,127,0.35)]"
              style={{ background: 'oklch(0.30 0.07 165)' }}
            >
              <Image
                src="/OperaPrima_Imagotipo_Color.svg"
                alt="Ópera Prima"
                width={240}
                height={72}
                unoptimized
                className="absolute inset-0 m-auto w-3/4 opacity-90"
              />
            </div>
          </div>
        </div>

        {/* ── Valores grid ── */}
        <div className="border-t-2 border-white/10 px-4 pb-24 sm:px-2 lg:pb-28">
          <TimelineAnimation as="div" animationNum={6} timelineRef={sectionRef} className="mb-10">
            <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
              Nuestros valores
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-white lg:text-5xl">
              Lo que nos mueve
            </h2>
          </TimelineAnimation>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VALORES.map((valor, i) => (
              <TimelineAnimation
                key={valor.name}
                as="article"
                animationNum={7 + i}
                timelineRef={sectionRef}
                className="group border-2 border-white/10 bg-white/5 p-6 shadow-[4px_4px_0_rgba(255,255,255,0.08)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#F65B7F]"
              >
                <p
                  className="text-[0.62rem] font-bold tracking-[0.28em] uppercase"
                  style={{ color: valor.accent }}
                >
                  {valor.name}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{valor.desc}</p>
              </TimelineAnimation>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ MISIÓN + VISIÓN ═══════════════ */}
      <div className="border-t-2 border-white/10 bg-[#FAFAF9]">
        <div className="mx-auto max-w-420 border-zinc-200 px-4 py-24 sm:border-x sm:px-6 lg:py-32">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Misión */}
            <TimelineAnimation
              as="article"
              animationNum={13}
              timelineRef={sectionRef}
              className="group relative flex flex-col border-2 border-[#111111] bg-white p-8 shadow-[4px_4px_0_#111] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#F65B7F] lg:p-10"
            >
              <div
                className="mb-6 flex h-14 w-14 items-center justify-center border-2 border-[#111111]"
                style={{ boxShadow: '3px 3px 0 #F65B7F' }}
              >
                <Target size={22} style={{ color: '#F65B7F' }} />
              </div>
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                Nuestra Misión
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[#111111] lg:text-3xl">
                Acortar la distancia entre la formación y la profesión.
              </h3>
              <p className="mt-5 text-base leading-relaxed text-zinc-600">
                Impulsar la transición profesional de artistas emergentes, facilitando el acceso a
                herramientas, oportunidades y redes que potencien su desarrollo.
              </p>
            </TimelineAnimation>

            {/* Visión */}
            <TimelineAnimation
              as="article"
              animationNum={14}
              timelineRef={sectionRef}
              className="group relative flex flex-col border-2 border-[#111111] bg-white p-8 shadow-[4px_4px_0_#111] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#5E3A8A] lg:p-10"
            >
              <div
                className="mb-6 flex h-14 w-14 items-center justify-center border-2 border-[#111111]"
                style={{ boxShadow: '3px 3px 0 #5E3A8A' }}
              >
                <Heart size={22} style={{ color: '#5E3A8A' }} />
              </div>
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#5E3A8A] uppercase">
                Nuestra Visión
              </p>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-[#111111] lg:text-3xl">
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
      <div className="bg-[#FAFAF9]">
        <TestimonialsWall
          headline="Esto dicen los artistas de nuestra comunidad"
          testimonialEyebrow="La comunidad"
          testimonials={COMUNIDAD_TESTIMONIALS}
          rows={1}
          fadeColor="#FAFAF9"
        />
      </div>

      {/* ═══════════════ EQUIPO ═══════════════ */}
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

        <div className="relative z-10 mx-auto max-w-420 border-white/10 px-4 py-24 sm:border-x sm:px-6 lg:py-32">
          <div className="mb-14">
            <TimelineAnimation
              as="p"
              animationNum={15}
              timelineRef={sectionRef}
              className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
            >
              El equipo
            </TimelineAnimation>
            <TimelineAnimation
              as="h2"
              animationNum={16}
              timelineRef={sectionRef}
              className="mt-3 text-4xl font-bold tracking-[-0.03em] text-white lg:text-5xl"
            >
              Detrás de Ópera Prima
            </TimelineAnimation>
            <TimelineAnimation
              as="p"
              animationNum={17}
              timelineRef={sectionRef}
              className="mt-4 max-w-2xl text-lg leading-relaxed text-white/65"
            >
              Un equipo pequeño con una convicción grande: el talento colombiano merece mejores
              condiciones para crecer.
            </TimelineAnimation>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {TEAM.map((member, i) => (
              <TimelineAnimation
                key={member.name}
                as="article"
                animationNum={18 + i}
                timelineRef={sectionRef}
                className="group flex flex-col gap-6 border-2 border-white/10 bg-white/5 p-8 shadow-[4px_4px_0_rgba(255,255,255,0.08)] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#F65B7F] sm:flex-row lg:p-10"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={120}
                  height={120}
                  unoptimized
                  className="h-28 w-28 shrink-0 rounded-full border-2 border-white/20 object-cover transition-colors duration-200 group-hover:border-[#F65B7F]"
                />
                <div className="flex flex-col justify-center">
                  <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                    {member.role}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white">
                    {member.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{member.bio}</p>
                </div>
              </TimelineAnimation>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ MENTORES ═══════════════ */}
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

        <div className="relative z-10 mx-auto max-w-420 border-white/10 px-4 py-24 sm:border-x sm:px-6 lg:py-32">
          <div className="mb-12 max-w-2xl">
            <TimelineAnimation
              as="p"
              animationNum={20}
              timelineRef={sectionRef}
              className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
            >
              Nuestros mentores
            </TimelineAnimation>
            <TimelineAnimation
              as="h2"
              animationNum={21}
              timelineRef={sectionRef}
              className="mt-3 text-4xl font-bold tracking-[-0.03em] text-white lg:text-5xl"
            >
              Profesionales que ya recorrieron el camino
            </TimelineAnimation>
            <TimelineAnimation
              as="p"
              animationNum={22}
              timelineRef={sectionRef}
              className="mt-4 text-lg leading-relaxed text-white/65"
            >
              Haz clic en cada carpeta para ver su experiencia, enfoque y los temas que pueden
              desarrollar contigo.
            </TimelineAnimation>
          </div>

          <TimelineAnimation as="div" animationNum={23} timelineRef={sectionRef}>
            <ExpandingMentorsGallery mentors={MENTORS} />
          </TimelineAnimation>
        </div>
      </div>
    </section>
  )
}

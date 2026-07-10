'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { TestimonialsWall, type Testimonial } from '@/components/shared/TestimonialsWall'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight } from 'lucide-react'
import { motion, useInView } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const VALORES = [
  {
    number: '01',
    name: 'Pasión',
    desc: 'Creemos en el arte como motor de transformación. Cada proyecto nace del deseo genuino de crear.',
    accent: '#F65B7F',
  },
  {
    number: '02',
    name: 'Colaboración',
    desc: 'Construimos en red. El talento crece cuando se comparte, no cuando compite.',
    accent: '#8ECAE6',
  },
  {
    number: '03',
    name: 'Accesibilidad',
    desc: 'Democratizamos el acceso a herramientas profesionales. El contexto no debería limitar el potencial.',
    accent: '#023047',
  },
  {
    number: '04',
    name: 'Autonomía',
    desc: 'Te damos herramientas, no recetas. Queremos artistas independientes, con criterio propio.',
    accent: '#F65B7F',
  },
  {
    number: '05',
    name: 'Diversidad',
    desc: 'Todas las disciplinas, regiones y voces tienen lugar. La riqueza está en la diferencia.',
    accent: '#8ECAE6',
  },
  {
    number: '06',
    name: 'Internacionalización',
    desc: 'Conectamos el talento emergente con oportunidades globales. Sin fronteras.',
    accent: '#4682B4',
  },
]

const SERVICIOS = [
  {
    eyebrow: 'Calendario de la comunidad',
    title: 'Descubre lo que otros artistas están creando',
    desc: 'Un espacio para compartir y descubrir lo que otros artistas emergentes están creando cerca de ti: obras, exposiciones, estrenos, conciertos, muestras, procesos y mucho más.',
    href: '/comunidad',
  },
  {
    eyebrow: 'Tablero de Oportunidades',
    title: 'Prácticas, convocatorias y proyectos',
    desc: 'Prácticas, voluntariados, convocatorias, proyectos colaborativos y experiencias para empezar a ganar recorrido en el sector cultural.',
    href: '/tablero',
  },
  {
    eyebrow: 'Networking Sessions',
    title: 'Conecta con artistas de otros países',
    desc: 'Eventos online para conectar con artistas emergentes de diferentes países, compartir experiencias, crear redes y abrir nuevas posibilidades de colaboración.',
    href: '/eventos',
  },
  {
    eyebrow: 'Mentorías Online',
    title: 'Sesiones personalizadas con profesionales',
    desc: 'Sesiones personalizadas con profesionales del sector que te ayudarán a resolver dudas, orientar tu camino y aterrizar tus ideas.',
    href: '/mentorias',
  },
  {
    eyebrow: 'Talleres',
    title: 'Herramientas reales para vivir del arte',
    desc: 'Espacios formativos sobre herramientas reales para vivir del arte: convocatorias, portafolio, gestión cultural, visibilidad, proyectos, bienestar creativo y mucho más.',
    href: '/eventos',
  },
  {
    eyebrow: 'Proyectos',
    title: 'Alianzas con entidades',
    desc: 'Nos aliamos con diferentes entidades para desarrollar proyectos con artistas de nuestra comunidad, creando oportunidades para que puedan ganar experiencia real.',
    href: '/tablero',
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
    bio: 'Gestora cultural con más de una década impulsando proyectos artísticos en Colombia y América Latina.',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'catalina-cruz',
    name: 'Catalina Cruz',
    role: 'Coordinadora',
    bio: 'Artista visual y productora cultural. Coordina la agenda de mentorías, talleres y eventos.',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop&q=80',
  },
]

const FALLBACK_STATS = [
  { key: 'totalMentores', number: '14+', label: 'Mentores activos' },
  { key: 'totalEventos', number: '50+', label: 'Talleres y eventos' },
  { key: 'paises', number: '3', label: 'Países' },
  { key: 'totalUsuarios', number: '200+', label: 'Artistas en la comunidad' },
]

/* ── Valores carousel ── */
function ValoresCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const w = el.clientWidth
    const idx = Math.round(el.scrollLeft / w)
    setActiveIndex(idx)
  }

  const scrollTo = (idx: number) => {
    scrollRef.current?.children[idx]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    })
    setActiveIndex(idx)
  }

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {VALORES.map((valor) => (
          <article
            key={valor.name}
            className="flex w-[85vw] shrink-0 snap-center flex-col border-2 border-zinc-200 bg-white p-7 sm:w-[70vw] lg:w-[30%]"
          >
            <div
              className="flex size-10 items-center justify-center text-sm font-bold text-white"
              style={{ background: valor.accent }}
            >
              {valor.number}
            </div>
            <p
              className="mt-5 text-[0.62rem] font-bold tracking-[0.28em] uppercase"
              style={{ color: valor.accent }}
            >
              {valor.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{valor.desc}</p>
          </article>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {VALORES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            className="cursor-pointer"
            aria-label={`Ir a valor ${i + 1}`}
          >
            <div
              className={`rounded-full transition-all duration-200 ${
                i === activeIndex
                  ? 'h-2.5 w-6 bg-[#F65B7F]'
                  : 'h-2.5 w-2.5 bg-zinc-300 hover:bg-zinc-400'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Stat counter (same pattern as ComunidadCTA) ── */
function StatNumber({ end }: { end: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const DURATION = 1600
    const startTime = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / DURATION, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(eased * end)
      setCount(current)
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(end)
    }
    requestAnimationFrame(tick)
  }, [inView, end])

  return <span ref={ref}>{count}</span>
}

export function SobreLandingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const authModal = useAuthModal()
  const { currentUser } = authModal
  const router = useRouter()

  const [stats, setStats] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    fetch('/api/stats/public')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.totalUsuarios != null) setStats(data)
      })
      .catch(() => {})
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden border-b border-white/10 bg-[#0f0f0f]"
    >
      {/* ── Accent strip top ── */}
      <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#F65B7F]" />

      {/* ═══════════════ HERO ═══════════════ */}
      <div className="relative z-10 mx-[100px] border-white/10 px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
        <div className="relative px-4 py-28 sm:px-2 lg:py-36">
          <div className="max-w-4xl">
            <TimelineAnimation
              as="div"
              animationNum={0}
              timelineRef={sectionRef}
              className="flex flex-col gap-6"
            >
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                Sobre la plataforma
              </p>

              <h1 className="text-5xl leading-[1.05] font-extrabold tracking-[-0.04em] text-white sm:text-7xl lg:text-[5rem]">
                Ópera <span className="text-[#F65B7F]">Prima</span>
              </h1>

              <p className="max-w-3xl text-xl leading-relaxed font-semibold text-white/90 sm:text-2xl">
                Una plataforma internacional que acompaña a artistas emergentes en sus primeros
                pasos hacia la vida profesional.
              </p>

              <p className="max-w-2xl text-base leading-relaxed text-white/60">
                Herramientas, oportunidades y una comunidad que impulsa tu desarrollo artístico y
                profesional, para que construyas tu camino con estrategia y propósito.
              </p>

              <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
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
              </div>
            </TimelineAnimation>
          </div>
        </div>
      </div>

      {/* ═══════════════ STATS BAND ═══════════════ */}
      <section className="relative w-full overflow-hidden bg-[#F65B7F]">
        <div className="mx-[100px] border-white/20 px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
          <div className="grid grid-cols-2 gap-8 px-4 py-14 sm:grid-cols-4 sm:gap-0 sm:py-16">
            {FALLBACK_STATS.map((stat, i) => {
              const realValue = stats?.[stat.key]

              return (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center last:border-r-0 sm:border-r sm:border-white/20"
                >
                  <p className="text-4xl font-extrabold tracking-[-0.04em] text-white [text-shadow:2px_2px_0_#023047] sm:text-5xl">
                    {realValue != null ? (
                      <>
                        <StatNumber end={realValue} />
                        {realValue >= 100 ? '+' : ''}
                      </>
                    ) : (
                      stat.number
                    )}
                  </p>
                  <p className="mt-1 text-xs font-bold tracking-widest text-white/80 uppercase">
                    {stat.label}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ MISIÓN + VISIÓN ═══════════════ */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="mx-[100px] border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Misión */}
            <div className="border-zinc-200 px-4 py-24 sm:px-6 lg:border-r lg:py-32">
              <div className="max-w-lg">
                <TimelineAnimation as="div" animationNum={5} timelineRef={sectionRef}>
                  <p className="text-[8rem] leading-[0.8] font-extrabold tracking-[-0.08em] text-[#4682B4]/20 select-none sm:text-[10rem]">
                    01
                  </p>
                  <p className="mt-4 text-[0.62rem] font-bold tracking-[0.28em] text-[#4682B4] uppercase">
                    Nuestra Misión
                  </p>
                  <h2 className="mt-4 text-3xl leading-[1.1] font-extrabold tracking-[-0.04em] text-zinc-900 sm:text-4xl lg:text-[2.2rem]">
                    Acortar la distancia entre la formación y la profesión.
                  </h2>
                  <p className="mt-6 text-base leading-relaxed text-zinc-600">
                    Impulsar la transición profesional de artistas emergentes, facilitando el acceso
                    a herramientas, oportunidades y redes que potencien su desarrollo en el sector
                    cultural.
                  </p>
                </TimelineAnimation>
              </div>
            </div>

            {/* Visión */}
            <div className="px-4 py-24 sm:px-6 lg:py-32">
              <div className="max-w-lg">
                <TimelineAnimation as="div" animationNum={6} timelineRef={sectionRef}>
                  <p className="text-[8rem] leading-[0.8] font-extrabold tracking-[-0.08em] text-[#F65B7F]/15 select-none sm:text-[10rem]">
                    02
                  </p>
                  <p className="mt-4 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                    Nuestra Visión
                  </p>
                  <h2 className="mt-4 text-3xl leading-[1.1] font-extrabold tracking-[-0.04em] text-zinc-900 sm:text-4xl lg:text-[2.2rem]">
                    Ser el puente que el talento hispanohablante necesita.
                  </h2>
                  <p className="mt-6 text-base leading-relaxed text-zinc-600">
                    Consolidar una comunidad activa y una red global de oportunidades que conecte el
                    talento emergente con el sector cultural profesional.
                  </p>
                </TimelineAnimation>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ VALORES ═══════════════ */}
      <section className="relative w-full overflow-hidden border-t border-zinc-200 bg-white">
        <div className="mx-[100px] border-zinc-200 px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
          <div className="px-4 py-24 sm:px-2 lg:py-28">
            <TimelineAnimation as="div" animationNum={7} timelineRef={sectionRef} className="mb-12">
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                Nuestros valores
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-zinc-900 sm:text-4xl lg:text-5xl">
                Lo que nos mueve
              </h2>
            </TimelineAnimation>

            <TimelineAnimation as="div" animationNum={8} timelineRef={sectionRef}>
              <ValoresCarousel />
            </TimelineAnimation>
          </div>
        </div>
      </section>

      {/* ═══════════════ LA PLATAFORMA ═══════════════ */}
      <section className="relative w-full overflow-hidden border-t border-zinc-200 bg-white">
        <div className="absolute top-0 right-0 left-0 h-0.75 bg-[#F65B7F]" />
        <div className="mx-[100px] border-zinc-200 px-4 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2 sm:px-6">
          <div className="px-4 py-24 sm:px-2 lg:py-28">
            <TimelineAnimation as="div" animationNum={9} timelineRef={sectionRef} className="mb-16">
              <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase">
                La plataforma
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-zinc-900 sm:text-4xl lg:text-5xl">
                Un espacio para <span className="text-[#F65B7F]">artistas emergentes.</span>
              </h2>
            </TimelineAnimation>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {SERVICIOS.map((svc, i) => {
                const isPink = i % 2 === 0
                const accent = isPink ? '#F65B7F' : '#8ECAE6'

                return (
                  <Link key={svc.eyebrow} href={svc.href}>
                    <TimelineAnimation
                      as="article"
                      animationNum={10 + i}
                      timelineRef={sectionRef}
                      className="group border-2 border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1"
                      style={{
                        boxShadow: `4px 4px 0 ${accent}30`,
                        borderColor: '#e4e4e7',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-10 shrink-0 items-center justify-center text-sm font-bold text-white"
                          style={{ background: accent }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        <h3 className="text-sm font-bold tracking-[-0.02em] text-zinc-900">
                          {svc.title}
                        </h3>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-zinc-600">{svc.desc}</p>
                    </TimelineAnimation>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

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
              animationNum={16}
              timelineRef={sectionRef}
              className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase"
            >
              El equipo
            </TimelineAnimation>
            <TimelineAnimation
              as="h2"
              animationNum={17}
              timelineRef={sectionRef}
              className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-white lg:text-5xl"
            >
              Detrás de Ópera Prima
            </TimelineAnimation>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            {TEAM.map((member, i) => (
              <Link key={member.id} href={`/perfil/${member.id}`}>
                <TimelineAnimation
                  as="article"
                  animationNum={18 + i}
                  timelineRef={sectionRef}
                  className="group flex flex-col gap-6 transition-all duration-200 sm:flex-row"
                >
                  <div className="relative shrink-0 overflow-hidden border-2 border-white/10">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={200}
                      height={200}
                      unoptimized
                      className="h-48 w-full object-cover transition-all duration-300 group-hover:scale-105 sm:h-52 sm:w-52"
                    />
                    <div className="absolute inset-0 transition-all duration-300 group-hover:bg-white/5" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase">
                      {member.role}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white">
                      {member.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">{member.bio}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase transition-all duration-200 group-hover:translate-x-1">
                      Conocer más
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </TimelineAnimation>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { EditableImage } from '@/components/editor/EditableImage'
import { EditableRichText } from '@/components/editor/EditableRichText'
import { EditableText } from '@/components/editor/EditableText'
import { useEditMode } from '@/context/EditModeContext'
import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { TestimonialsWall, type Testimonial } from '@/components/shared/TestimonialsWall'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight, Plus, Search, Trash2, X } from 'lucide-react'
import { motion, useInView } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const VALORES_ACCENTS = ['#F65B7F', '#8ECAE6', '#023047', '#F65B7F', '#8ECAE6', '#4682B4']

const DEFAULT_VALORES = [
  {
    name: 'Pasión',
    desc: 'Creemos en el arte como motor de transformación. Cada proyecto nace del deseo genuino de crear.',
  },
  {
    name: 'Colaboración',
    desc: 'Construimos en red. El talento crece cuando se comparte, no cuando compite.',
  },
  {
    name: 'Accesibilidad',
    desc: 'Democratizamos el acceso a herramientas profesionales. El contexto no debería limitar el potencial.',
  },
  {
    name: 'Autonomía',
    desc: 'Te damos herramientas, no recetas. Queremos artistas independientes, con criterio propio.',
  },
  {
    name: 'Diversidad',
    desc: 'Todas las disciplinas, regiones y voces tienen lugar. La riqueza está en la diferencia.',
  },
  {
    name: 'Internacionalización',
    desc: 'Conectamos el talento emergente con oportunidades globales. Sin fronteras.',
  },
]

const SERVICIOS_HREFS = ['/comunidad', '/tablero', '/eventos', '/mentorias', '/eventos', '/tablero']

const DEFAULT_SERVICIOS = [
  {
    eyebrow: 'Calendario de la comunidad',
    title: 'Descubre lo que otros artistas están creando',
    desc: 'Un espacio para compartir y descubrir lo que otros artistas emergentes están creando cerca de ti: obras, exposiciones, estrenos, conciertos, muestras, procesos y mucho más.',
  },
  {
    eyebrow: 'Tablero de Oportunidades',
    title: 'Prácticas, convocatorias y proyectos',
    desc: 'Prácticas, voluntariados, convocatorias, proyectos colaborativos y experiencias para empezar a ganar recorrido en el sector cultural.',
  },
  {
    eyebrow: 'Networking Sessions',
    title: 'Conecta con artistas de otros países',
    desc: 'Eventos online para conectar con artistas emergentes de diferentes países, compartir experiencias, crear redes y abrir nuevas posibilidades de colaboración.',
  },
  {
    eyebrow: 'Mentorías Online',
    title: 'Sesiones personalizadas con profesionales',
    desc: 'Sesiones personalizadas con profesionales del sector que te ayudarán a resolver dudas, orientar tu camino y aterrizar tus ideas.',
  },
  {
    eyebrow: 'Talleres',
    title: 'Herramientas reales para vivir del arte',
    desc: 'Espacios formativos sobre herramientas reales para vivir del arte: convocatorias, portafolio, gestión cultural, visibilidad, proyectos, bienestar creativo y mucho más.',
  },
  {
    eyebrow: 'Proyectos',
    title: 'Alianzas con entidades',
    desc: 'Nos aliamos con diferentes entidades para desarrollar proyectos con artistas de nuestra comunidad, creando oportunidades para que puedan ganar experiencia real.',
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

const DEFAULT_TEAM = [
  {
    name: 'Ángela Rodríguez',
    role: 'Fundadora',
    bio: 'Gestora cultural con más de una década impulsando proyectos artísticos en Colombia y América Latina.',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop&q=80',
  },
  {
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
function ValoresCarousel({
  valores,
  isEditMode,
  __onFieldChange,
  onDelete,
}: {
  valores: Array<{ name: string; desc: string }>
  isEditMode: boolean
  __onFieldChange?: (path: string, value: unknown) => void
  onDelete?: (index: number) => void
}) {
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
        {valores.map((valor, i) => {
          const accent = VALORES_ACCENTS[i % VALORES_ACCENTS.length]
          return (
            <article
              key={i}
              className="group relative flex w-[85vw] shrink-0 snap-center flex-col border-2 border-zinc-200 bg-white p-7 sm:w-[70vw] lg:w-[30%]"
            >
              {isEditMode && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(i)}
                  className="absolute top-2 right-2 z-10 flex size-7 items-center justify-center bg-white/90 text-zinc-500 shadow-sm transition-all hover:bg-[#E63946] hover:text-white"
                  title="Eliminar valor"
                >
                  <Trash2 size={13} />
                </button>
              )}
              <div
                className="flex size-10 items-center justify-center text-sm font-bold text-white"
                style={{ background: accent }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <p
                className="mt-5 text-[0.62rem] font-bold tracking-[0.28em] uppercase"
                style={{ color: accent }}
              >
                <EditableText
                  value={valor.name}
                  onSave={(v) => __onFieldChange?.(`valores.${i}.name`, v)}
                  as="span"
                  singleLine
                />
              </p>
              <EditableRichText
                value={valor.desc}
                onSave={(v) => __onFieldChange?.(`valores.${i}.desc`, v)}
                className="mt-2 text-sm leading-relaxed text-zinc-600"
                as="p"
              />
            </article>
          )
        })}
      </div>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {valores.map((_, i) => (
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

/* ── User linker for team members ── */
function UserLinkEditor({
  profilePath,
  teamIndex,
  onFieldChange,
}: {
  profilePath?: string
  teamIndex: number
  onFieldChange: (path: string, value: unknown) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<
    Array<{
      id: string
      username: string
      firstName: string
      lastName: string
      perfil: { artisticName?: string; avatar?: string; bio?: string } | null
    }>
  >([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) return
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/usuarios?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.usuarios || [])
        }
      } catch {
        // ignore
      }
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (usuario: (typeof results)[number]) => {
    const name = usuario.perfil?.artisticName || `${usuario.firstName} ${usuario.lastName}`
    const bio = usuario.perfil?.bio || ''
    const image = usuario.perfil?.avatar || ''

    onFieldChange(`team.${teamIndex}.linkedUserId`, usuario.id)
    onFieldChange(`team.${teamIndex}.profilePath`, `/perfil/${usuario.username}`)
    onFieldChange(`team.${teamIndex}.name`, name)
    onFieldChange(`team.${teamIndex}.bio`, bio)
    if (image) onFieldChange(`team.${teamIndex}.image`, image)

    setOpen(false)
    setQuery('')
    setResults([])
  }

  const handleUnlink = () => {
    onFieldChange(`team.${teamIndex}.linkedUserId`, '')
    onFieldChange(`team.${teamIndex}.profilePath`, '')
  }

  if (profilePath) {
    return (
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[10px] text-[#8ECAE6]">Vinculado a {profilePath}</span>
        <button
          type="button"
          onClick={handleUnlink}
          className="rounded-sm border border-zinc-700 px-2 py-0.5 text-[9px] font-bold tracking-wider text-zinc-400 uppercase transition hover:border-[#E63946] hover:text-[#E63946]"
        >
          Desvincular
        </button>
      </div>
    )
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-sm border border-dashed border-zinc-600 px-3 py-1 text-[10px] font-bold tracking-wider text-zinc-400 uppercase transition hover:border-[#8ECAE6] hover:text-[#8ECAE6]"
      >
        <Search size={11} />
        Vincular perfil
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setOpen(false)
            setQuery('')
            setResults([])
          }}
        >
          <div
            className="w-96 rounded-sm bg-[#1a1a1a] p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                Vincular perfil
              </p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setQuery('')
                  setResults([])
                }}
                className="rounded-sm p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              >
                <X size={14} />
              </button>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o @username..."
              className="mb-3 w-full border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-[#8ECAE6]"
              autoFocus
            />
            {loading && (
              <div className="flex items-center gap-2 py-2 text-xs text-zinc-500">
                <div className="size-3 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
                Buscando…
              </div>
            )}
            <div className="max-h-60 space-y-1 overflow-y-auto">
              {results.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelect(u)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-zinc-800"
                >
                  <img
                    src={
                      u.perfil?.avatar ||
                      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop'
                    }
                    alt=""
                    className="size-8 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {u.perfil?.artisticName || `${u.firstName} ${u.lastName}`}
                    </p>
                    <p className="truncate text-xs text-zinc-500">@{u.username}</p>
                  </div>
                </button>
              ))}
              {!loading && query.length >= 2 && results.length === 0 && (
                <p className="py-4 text-center text-xs text-zinc-500">Sin resultados</p>
              )}
              {query.length < 2 && !loading && (
                <p className="py-4 text-center text-xs text-zinc-500">
                  Escribe al menos 2 caracteres
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function SobreLandingSection({
  heroEyebrow = 'Sobre la plataforma',
  heroHeading = 'Ópera <span class="text-[#F65B7F]">Prima</span>',
  heroDescription = 'Una plataforma internacional que acompaña a artistas emergentes en sus primeros pasos hacia la vida profesional.',
  heroDescription2 = 'Herramientas, oportunidades y una comunidad que impulsa tu desarrollo artístico y profesional, para que construyas tu camino con estrategia y propósito.',
  heroCtaLoggedText = 'Ir a la comunidad',
  heroCtaGuestText = 'Únete a la comunidad',
  misionEyebrow = 'Nuestra Misión',
  misionTitle = 'Acortar la distancia entre la formación y la profesión.',
  misionDescription = 'Impulsar la transición profesional de artistas emergentes, facilitando el acceso a herramientas, oportunidades y redes que potencien su desarrollo en el sector cultural.',
  visionEyebrow = 'Nuestra Visión',
  visionTitle = 'Ser el puente que el talento hispanohablante necesita.',
  visionDescription = 'Consolidar una comunidad activa y una red global de oportunidades que conecte el talento emergente con el sector cultural profesional.',
  valoresEyebrow = 'Nuestros valores',
  valoresTitle = 'Lo que nos mueve',
  plataformaEyebrow = 'La plataforma',
  plataformaTitle = 'Un espacio para <span class="text-[#F65B7F]">artistas emergentes.</span>',
  testimonioEyebrow = 'La comunidad',
  testimonioHeadline = 'Esto dicen los artistas de nuestra comunidad',
  equipoEyebrow = 'El equipo',
  equipoTitle = 'Detrás de Ópera Prima',
  servicios = DEFAULT_SERVICIOS,
  valores = DEFAULT_VALORES,
  team = DEFAULT_TEAM,
  __onFieldChange,
}: {
  heroEyebrow?: string
  heroHeading?: string
  heroDescription?: string
  heroDescription2?: string
  heroCtaLoggedText?: string
  heroCtaGuestText?: string
  misionEyebrow?: string
  misionTitle?: string
  misionDescription?: string
  visionEyebrow?: string
  visionTitle?: string
  visionDescription?: string
  valoresEyebrow?: string
  valoresTitle?: string
  plataformaEyebrow?: string
  plataformaTitle?: string
  testimonioEyebrow?: string
  testimonioHeadline?: string
  equipoEyebrow?: string
  equipoTitle?: string
  servicios?: Array<{ eyebrow: string; title: string; desc: string }>
  valores?: Array<{ name: string; desc: string }>
  team?: Array<{
    name: string
    role: string
    bio: string
    image: string
    linkedUserId?: string
    profilePath?: string
  }>
  __onFieldChange?: (path: string, value: unknown) => void
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const { isEditMode } = useEditMode()
  const authModal = useAuthModal()
  const { currentUser } = authModal
  const router = useRouter()

  const [stats, setStats] = useState<Record<string, number> | null>(null)
  const [localValores, setLocalValores] = useState(valores)
  const [localServicios, setLocalServicios] = useState(servicios)
  const [localTeam, setLocalTeam] = useState(team)

  useEffect(() => {
    setLocalValores(valores)
  }, [valores])
  useEffect(() => {
    setLocalServicios(servicios)
  }, [servicios])
  useEffect(() => {
    setLocalTeam(team)
  }, [team])

  const handleAddValor = () => {
    const next = [...localValores, { name: 'Nuevo valor', desc: 'Descripción del valor.' }]
    setLocalValores(next)
    __onFieldChange?.('valores', next)
  }

  const handleDeleteValor = (i: number) => {
    const next = localValores.filter((_, idx) => idx !== i)
    setLocalValores(next)
    __onFieldChange?.('valores', next)
  }

  const handleAddServicio = () => {
    const next = [
      ...localServicios,
      { eyebrow: 'Nuevo', title: 'Nuevo servicio', desc: 'Descripción del servicio.' },
    ]
    setLocalServicios(next)
    __onFieldChange?.('servicios', next)
  }

  const handleDeleteServicio = (i: number) => {
    const next = localServicios.filter((_, idx) => idx !== i)
    setLocalServicios(next)
    __onFieldChange?.('servicios', next)
  }

  const handleAddTeam = () => {
    const next = [
      ...localTeam,
      {
        name: 'Nuevo miembro',
        role: 'Rol',
        bio: 'Biografía del miembro.',
        image:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop&q=80',
        linkedUserId: '',
        profilePath: '',
      },
    ]
    setLocalTeam(next)
    __onFieldChange?.('team', next)
  }

  const handleDeleteTeam = (i: number) => {
    const next = localTeam.filter((_, idx) => idx !== i)
    setLocalTeam(next)
    __onFieldChange?.('team', next)
  }

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
              <EditableText
                value={heroEyebrow}
                onSave={(v) => __onFieldChange?.('heroEyebrow', v)}
                className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
                as="p"
              />

              <EditableRichText
                value={heroHeading}
                onSave={(v) => __onFieldChange?.('heroHeading', v)}
                className="text-5xl leading-[1.05] font-extrabold tracking-[-0.04em] text-white sm:text-7xl lg:text-[5rem]"
              />

              <EditableRichText
                value={heroDescription}
                onSave={(v) => __onFieldChange?.('heroDescription', v)}
                className="max-w-3xl text-xl leading-relaxed font-semibold text-white/90 sm:text-2xl"
                as="p"
              />

              <EditableRichText
                value={heroDescription2}
                onSave={(v) => __onFieldChange?.('heroDescription2', v)}
                className="max-w-2xl text-base leading-relaxed text-white/60"
                as="p"
              />

              <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (isEditMode) return
                    if (currentUser) router.push('/comunidad')
                    else authModal.open('registro')
                  }}
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#F65B7F] bg-[#F65B7F] px-7 py-3 text-sm font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-transparent hover:text-[#F65B7F] hover:shadow-[4px_4px_0_#353535] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  {currentUser ? heroCtaLoggedText : heroCtaGuestText}
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
                  <EditableText
                    value={misionEyebrow}
                    onSave={(v) => __onFieldChange?.('misionEyebrow', v)}
                    className="mt-4 text-[0.62rem] font-bold tracking-[0.28em] text-[#4682B4] uppercase"
                    as="p"
                  />
                  <EditableRichText
                    value={misionTitle}
                    onSave={(v) => __onFieldChange?.('misionTitle', v)}
                    className="mt-4 text-3xl leading-[1.1] font-extrabold tracking-[-0.04em] text-zinc-900 sm:text-4xl lg:text-[2.2rem]"
                  />
                  <EditableRichText
                    value={misionDescription}
                    onSave={(v) => __onFieldChange?.('misionDescription', v)}
                    className="mt-6 text-base leading-relaxed text-zinc-600"
                    as="p"
                  />
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
                  <EditableText
                    value={visionEyebrow}
                    onSave={(v) => __onFieldChange?.('visionEyebrow', v)}
                    className="mt-4 text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
                    as="p"
                  />
                  <EditableRichText
                    value={visionTitle}
                    onSave={(v) => __onFieldChange?.('visionTitle', v)}
                    className="mt-4 text-3xl leading-[1.1] font-extrabold tracking-[-0.04em] text-zinc-900 sm:text-4xl lg:text-[2.2rem]"
                  />
                  <EditableRichText
                    value={visionDescription}
                    onSave={(v) => __onFieldChange?.('visionDescription', v)}
                    className="mt-6 text-base leading-relaxed text-zinc-600"
                    as="p"
                  />
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
              <EditableText
                value={valoresEyebrow}
                onSave={(v) => __onFieldChange?.('valoresEyebrow', v)}
                className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
                as="p"
              />
              <EditableRichText
                value={valoresTitle}
                onSave={(v) => __onFieldChange?.('valoresTitle', v)}
                className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-zinc-900 sm:text-4xl lg:text-5xl"
              />
            </TimelineAnimation>

            {isEditMode && (
              <div className="mb-6 flex items-center justify-between border-2 border-dashed border-[#8ECAE6] bg-[#8ECAE6]/10 px-6 py-4">
                <p className="text-xs font-bold tracking-widest text-[#023047] uppercase">
                  Valores
                </p>
                <button
                  type="button"
                  onClick={handleAddValor}
                  className="inline-flex items-center gap-2 border-2 border-[#023047] bg-[#023047] px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase transition hover:bg-transparent hover:text-[#023047]"
                >
                  <Plus size={14} />
                  Agregar valor
                </button>
              </div>
            )}
            <TimelineAnimation as="div" animationNum={8} timelineRef={sectionRef}>
              <ValoresCarousel
                valores={localValores}
                isEditMode={isEditMode}
                __onFieldChange={__onFieldChange}
                onDelete={isEditMode ? handleDeleteValor : undefined}
              />
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
              <EditableText
                value={plataformaEyebrow}
                onSave={(v) => __onFieldChange?.('plataformaEyebrow', v)}
                className="text-[0.62rem] font-bold tracking-[0.28em] text-[#F65B7F] uppercase"
                as="p"
              />
              <EditableRichText
                value={plataformaTitle}
                onSave={(v) => __onFieldChange?.('plataformaTitle', v)}
                className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-zinc-900 sm:text-4xl lg:text-5xl"
              />
            </TimelineAnimation>

            {isEditMode && (
              <div className="mb-6 flex items-center justify-between border-2 border-dashed border-[#8ECAE6] bg-[#8ECAE6]/10 px-6 py-4">
                <p className="text-xs font-bold tracking-widest text-[#023047] uppercase">
                  Servicios
                </p>
                <button
                  type="button"
                  onClick={handleAddServicio}
                  className="inline-flex items-center gap-2 border-2 border-[#023047] bg-[#023047] px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase transition hover:bg-transparent hover:text-[#023047]"
                >
                  <Plus size={14} />
                  Agregar servicio
                </button>
              </div>
            )}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {localServicios.map((svc, i) => {
                const isPink = i % 2 === 0
                const accent = isPink ? '#F65B7F' : '#8ECAE6'
                const href = SERVICIOS_HREFS[i] || '/'

                return (
                  <div key={i} className="group relative">
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => handleDeleteServicio(i)}
                        className="absolute -top-2 -right-2 z-20 flex size-7 items-center justify-center bg-white text-zinc-500 shadow-sm transition-all hover:bg-[#E63946] hover:text-white"
                        title="Eliminar servicio"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                    <Link href={href} onClick={(e) => isEditMode && e.preventDefault()}>
                      <TimelineAnimation
                        as="article"
                        animationNum={10 + i}
                        timelineRef={sectionRef}
                        className="border-2 border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1"
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
                            <EditableText
                              value={svc.title}
                              onSave={(v) => __onFieldChange?.(`servicios.${i}.title`, v)}
                              as="span"
                              singleLine
                            />
                          </h3>
                        </div>
                        <EditableRichText
                          value={svc.desc}
                          onSave={(v) => __onFieldChange?.(`servicios.${i}.desc`, v)}
                          className="mt-4 text-sm leading-relaxed text-zinc-600"
                          as="p"
                        />
                      </TimelineAnimation>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ COMUNIDAD ═══════════════ */}
      <div className="relative bg-white">
        {isEditMode && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <span className="rounded-sm border border-zinc-300 bg-white px-4 py-2 text-xs font-bold tracking-widest text-zinc-500 uppercase shadow-sm">
              Testimonios cargados desde la base de datos — no editable en línea
            </span>
          </div>
        )}
        <TestimonialsWall
          headline={testimonioHeadline}
          testimonialEyebrow={testimonioEyebrow}
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
              <EditableText
                value={equipoEyebrow}
                onSave={(v) => __onFieldChange?.('equipoEyebrow', v)}
                className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase"
                as="span"
              />
            </TimelineAnimation>
            <TimelineAnimation
              as="h2"
              animationNum={17}
              timelineRef={sectionRef}
              className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-white lg:text-5xl"
            >
              <EditableRichText
                value={equipoTitle}
                onSave={(v) => __onFieldChange?.('equipoTitle', v)}
                className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-white lg:text-5xl"
              />
            </TimelineAnimation>
          </div>

          {isEditMode && (
            <div className="mb-6 flex items-center justify-between border-2 border-dashed border-[#8ECAE6] bg-[#8ECAE6]/10 px-6 py-4">
              <p className="text-xs font-bold tracking-widest text-[#023047] uppercase">Equipo</p>
              <button
                type="button"
                onClick={handleAddTeam}
                className="inline-flex items-center gap-2 border-2 border-[#023047] bg-[#023047] px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase transition hover:bg-transparent hover:text-[#023047]"
              >
                <Plus size={14} />
                Agregar miembro
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            {localTeam.map((member, i) => {
              const memberContent = (
                <>
                  <div className="relative shrink-0 overflow-hidden border-2 border-white/10">
                    <EditableImage
                      src={member.image}
                      alt={member.name}
                      onSave={(url) => __onFieldChange?.(`team.${i}.image`, url)}
                      className="h-48 w-full object-cover transition-all duration-300 group-hover:scale-105 sm:h-52 sm:w-52"
                      width={200}
                      height={200}
                    />
                    <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-white/5" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <EditableText
                      value={member.role}
                      onSave={(v) => __onFieldChange?.(`team.${i}.role`, v)}
                      className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase"
                      as="p"
                      singleLine
                    />
                    <EditableRichText
                      value={member.name}
                      onSave={(v) => __onFieldChange?.(`team.${i}.name`, v)}
                      className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white"
                    />
                    <EditableRichText
                      value={member.bio}
                      onSave={(v) => __onFieldChange?.(`team.${i}.bio`, v)}
                      className="mt-3 text-sm leading-relaxed text-white/65"
                      as="p"
                    />
                    {isEditMode && (
                      <UserLinkEditor
                        profilePath={member.profilePath}
                        teamIndex={i}
                        onFieldChange={(path, val) => __onFieldChange?.(path, val)}
                      />
                    )}
                  </div>
                </>
              )

              return (
                <div key={i} className="group relative">
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTeam(i)}
                      className="absolute -top-2 -right-2 z-20 flex size-7 items-center justify-center bg-white text-zinc-500 shadow-sm transition-all hover:bg-[#E63946] hover:text-white"
                      title="Eliminar miembro"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                  {member.profilePath && !isEditMode ? (
                    <Link href={member.profilePath} className="block">
                      <TimelineAnimation
                        as="article"
                        animationNum={18 + i}
                        timelineRef={sectionRef}
                        className="group flex flex-col gap-6 transition-all duration-200 sm:flex-row"
                      >
                        {memberContent}
                      </TimelineAnimation>
                    </Link>
                  ) : (
                    <TimelineAnimation
                      as="article"
                      animationNum={18 + i}
                      timelineRef={sectionRef}
                      className="group flex flex-col gap-6 transition-all duration-200 sm:flex-row"
                    >
                      {memberContent}
                    </TimelineAnimation>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

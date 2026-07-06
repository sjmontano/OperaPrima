'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { createClient } from '@/lib/supabaseClient'
import {
  CalendarDays,
  ChevronDown,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  X,
} from 'lucide-react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { type ElementType, useEffect, useMemo, useRef, useState } from 'react'
import { CreateEventModal, EventFormData } from './CreateEventModal'
import { Session } from '@supabase/supabase-js'
import { EventModal } from './EventModal'

// -- Types --
export interface CalendarEvent {
  id: string
  title: string
  artist: string
  category: string
  categoryVariant: 'terracota' | 'selva' | 'lavanda'
  date: string
  location: string
  image: string
  price: string
  soldOut?: boolean
  likes: number
  comments: number
  views: number
  eventDate: Date
  cuposTotales: number
  cuposDisponibles: number
  urlPago?: string | null
  description?: string
}

interface DbEvent {
  id: string
  titulo: string
  descripcion?: string
  categoria: string
  fecha: string
  ubicacion: string
  imagen?: string | null
  precio: string
  agotado?: boolean
  likes?: number
  comentarios?: number
  vistas?: number
  cuposTotales: number
  cuposDisponibles: number
  urlPago: string | null

  usuario: {
    username: string

    perfil?: {
      artisticName?: string | null
    } | null
  }
}

export interface CurrentUser {
  id: string
  rol: string
}

// -- Brand accent map --
const CAT_STYLES = {
  terracota: { fg: '#8ECAE6', bg: 'rgba(142,202,230,0.10)', border: 'rgba(142,202,230,0.40)' },
  selva: { fg: '#023047', bg: 'rgba(2,48,71,0.08)', border: 'rgba(2,48,71,0.35)' },
  lavanda: { fg: '#4682B4', bg: 'rgba(70,130,180,0.08)', border: 'rgba(70,130,180,0.35)' },
} as const

function mapEvent(evento: DbEvent): CalendarEvent {
  const categoryMap: Record<string, CalendarEvent['categoryVariant']> = {
    Taller: 'terracota',

    Workshop: 'lavanda',

    Networking: 'selva',

    Residencia: 'selva',

    Concierto: 'terracota',

    Exposición: 'lavanda',
  }

  return {
    id: evento.id,

    title: evento.titulo,

    artist: evento.usuario?.perfil?.artisticName ?? evento.usuario?.username ?? 'Usuario',

    category: evento.categoria,

    categoryVariant: categoryMap[evento.categoria] ?? 'terracota',

    date: new Date(evento.fecha).toLocaleDateString('es-CO'),

    eventDate: new Date(evento.fecha),

    cuposDisponibles: evento.cuposDisponibles ?? 0,
    cuposTotales: evento.cuposTotales ?? 0,

    location: evento.ubicacion,

    image: evento.imagen ?? '/default-event.jpg',

    price: evento.precio,

    soldOut: evento.agotado ?? false,

    likes: evento.likes ?? 0,

    comments: evento.comentarios ?? 0,

    views: evento.vistas ?? 0,
    description: evento.descripcion ?? '',
    urlPago: evento.urlPago ?? null,
  }
}

const INITIAL_VISIBLE = 6
const LOAD_MORE_STEP = 6

// -- StatChip --
function StatChip({ Icon, count, delayMs }: { Icon: ElementType; count: number; delayMs: number }) {
  const label = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count)
  return (
    <div
      className="flex translate-y-1.5 items-center gap-1 text-[0.68rem] font-medium text-white/90 opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100"
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <Icon size={11} className="shrink-0" />
      <span>{label}</span>
    </div>
  )
}

// -- CategoryDropdown --
function CategoryDropdown({
  categories,
  activeFilters,
  onToggle,
  onClear,
}: {
  categories: string[]
  activeFilters: string[]
  onToggle: (cat: string) => void
  onClear: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const hasActive = activeFilters.length > 0
  const label = !hasActive
    ? 'Tipo de evento'
    : activeFilters.length === 1
      ? activeFilters[0]
      : `${activeFilters[0]} +${activeFilters.length - 1}`

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 border-2 px-4 py-3 text-[0.62rem] font-bold tracking-widest whitespace-nowrap uppercase transition-all duration-150 ${
          open || hasActive
            ? '-translate-x-0.5 -translate-y-0.5 border-[#023047] text-[#023047] shadow-[4px_4px_0_#023047]'
            : 'border-zinc-200 text-zinc-600 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#023047] hover:text-[#023047] hover:shadow-[4px_4px_0_#023047]'
        }`}
      >
        {label}
        {hasActive && (
          <span className="bg-[#E63946] px-1.5 py-0.5 text-[0.55rem] leading-none font-bold text-white">
            {activeFilters.length}
          </span>
        )}
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
            className="absolute top-full right-0 z-50 mt-1.5 min-w-48 border-2 border-zinc-900 bg-white shadow-[4px_4px_0_#111]"
          >
            {categories.map((cat, i) => (
              <label
                key={cat}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 ${i < categories.length - 1 ? 'border-b border-zinc-100' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={activeFilters.includes(cat)}
                  onChange={() => onToggle(cat)}
                  className="h-3.5 w-3.5 shrink-0 accent-[#023047]"
                />
                <span className="text-[0.62rem] font-bold tracking-widest text-zinc-700 uppercase">
                  {cat}
                </span>
              </label>
            ))}
            {hasActive && (
              <button
                type="button"
                onClick={() => {
                  onClear()
                  setOpen(false)
                }}
                className="flex w-full items-center gap-1.5 border-t-2 border-zinc-100 px-4 py-2.5 text-[0.62rem] text-zinc-400 transition-colors hover:text-[#023047]"
              >
                <X size={11} />
                Limpiar filtros
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// -- EventCard --
function EventCard({
  event,
  animationIndex = 0,
  onClick,
}: {
  event: CalendarEvent
  animationIndex?: number
  onClick?: () => void
}) {
  console.log(event)
  const c = CAT_STYLES[event.categoryVariant]
  const delay = (animationIndex % LOAD_MORE_STEP) * 0.07

  return (
    <motion.article
      layout
      onClick={onClick}
      initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      exit={{ opacity: 0, filter: 'blur(4px)', y: -10, transition: { duration: 0.2 } }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      className="group relative flex flex-col bg-white ring-2 ring-transparent transition-all duration-200 ease-out hover:shadow-[4px_4px_0_#023047] hover:ring-[#023047]"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1680px) 33vw, 560px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          unoptimized
        />
        {event.soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-zinc-950/55">
            <span className="border border-white/70 px-3 py-1 text-[0.6rem] font-bold tracking-[0.22em] text-white uppercase">
              Agotado
            </span>
          </div>
        )}
        <div className="absolute right-0 bottom-0 left-0 flex items-center gap-3 bg-linear-to-t from-zinc-950/85 via-zinc-950/30 to-transparent px-4 py-3 opacity-0 transition-opacity duration-250 group-hover:opacity-100">
          <StatChip Icon={Heart} count={event.likes} delayMs={0} />
          <StatChip Icon={MessageCircle} count={event.comments} delayMs={60} />
          <StatChip Icon={Eye} count={event.views} delayMs={120} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 border-t border-zinc-200 px-6 pt-5 pb-4">
        <span
          className="self-start px-2 py-0.5 text-[0.62rem] font-bold tracking-[0.18em] uppercase"
          style={{ color: c.fg, backgroundColor: c.bg, outline: `1px solid ${c.border}` }}
        >
          {event.category}
        </span>
        <h3 className="text-base leading-snug font-semibold tracking-tight text-zinc-900">
          {event.title}
        </h3>
        <p className="-mt-1 text-xs text-zinc-400">{event.artist}</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <CalendarDays size={11} className="shrink-0 text-zinc-400" />
            <span className="text-xs text-zinc-500">{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={11} className="shrink-0 text-zinc-400" />
            <span className="text-xs text-zinc-500">{event.location}</span>
          </div>
        </div>
      </div>

      {/* Footer: price + CTA */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-zinc-200 px-6 py-4">
        <div>
          <span
            className={`block text-base leading-none font-bold ${event.soldOut ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}
          >
            {event.price}
          </span>
          {String(event.price).startsWith('$') && (
            <span className="mt-1 block text-[0.6rem] tracking-widest text-zinc-400 uppercase">
              COP
            </span>
          )}
        </div>
        {event.soldOut ? (
          <button
            type="button"
            disabled
            className="cursor-not-allowed border-2 border-zinc-300 bg-zinc-50 px-3 py-1.5 text-[0.6rem] font-bold tracking-widest text-zinc-400 uppercase"
          >
            Agotado
          </button>
        ) : (
          <button
            type="button"
            className="border-2 border-[#E63946] bg-[#E63946] px-3 py-1.5 text-[0.6rem] font-bold tracking-widest text-white uppercase transition-all duration-150 ease-out hover:bg-white hover:text-[#E63946] hover:shadow-[3px_3px_0_#353535] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            Inscribirse →
          </button>
        )}
      </div>
    </motion.article>
  )
}

// -- EmptyState --
function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <span className="text-5xl select-none" aria-hidden>
        🎨
      </span>
      <p className="text-sm font-semibold text-zinc-900">Sin resultados</p>
      <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
        No encontramos eventos con esos criterios. Prueba otras palabras o limpia los filtros.
      </p>
    </div>
  )
}

// -- EventsSection --
export function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const [formError, setFormError] = useState('')

  const [dbEvents, setDbEvents] = useState<DbEvent[]>([])

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const events = useMemo(() => dbEvents.map(mapEvent), [dbEvents])
  const categories = useMemo(
    () => [...new Set(events.map((e) => e.category))],

    [events]
  )

  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  // Parallax — columns drift in opposite directions
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const yLeft = useTransform(scrollYProgress, [0, 0.5, 1], [0, 30, 0])
  const yRight = useTransform(scrollYProgress, [0, 0.5, 1], [0, -30, 0])

  const filteredEvents = useMemo(() => {
    const q = query.toLowerCase().trim()

    return events.filter((e) => {
      const matchesQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.artist.toLowerCase().includes(q) ||
        e.date.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)

      const matchesFilter = activeFilters.length === 0 || activeFilters.includes(e.category)

      return matchesQuery && matchesFilter
    })
  }, [events, query, activeFilters])

  const isMentor = currentUser?.rol === 'MENTOR'

  const visibleEvents = filteredEvents.slice(0, visibleCount)
  const hasMore = filteredEvents.length > visibleCount
  const remaining = filteredEvents.length - visibleCount

  // Distribute into 3 columns for the parallax desktop layout
  const colLeft = visibleEvents.filter((_, i) => i % 3 === 0)
  const colCenter = visibleEvents.filter((_, i) => i % 3 === 1)
  const colRight = visibleEvents.filter((_, i) => i % 3 === 2)

  function toggleFilter(cat: string) {
    setActiveFilters((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
    setVisibleCount(INITIAL_VISIBLE)
  }

  function clearAll() {
    setActiveFilters([])
    setQuery('')
    setVisibleCount(INITIAL_VISIBLE)
  }

  function handleQuery(val: string) {
    setQuery(val)
    setVisibleCount(INITIAL_VISIBLE)
  }

  async function loadEvents() {
    try {
      const response = await fetch('/api/eventos?rol=MENTOR')

      if (!response.ok) return

      const data: {
        eventos: DbEvent[]
      } = await response.json()

      setDbEvents(data.eventos)
    } catch (error: unknown) {
      console.error(error)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEvents()
  }, [])

  useEffect(() => {
    const supabase = createClient()

    async function loadCurrentUser(session: Session | null) {
      if (!session) {
        setCurrentUser(null)

        return
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (!response.ok) {
          setCurrentUser(null)
          return
        }

        const data = await response.json()
        setCurrentUser(data.usuario)
      } catch (error: unknown) {
        console.error(error)
        setCurrentUser(null)
      }
    }

    // Cargar la sesión actual al entrar a la página
    supabase.auth.getSession().then(({ data }) => {
      loadCurrentUser(data.session)
    })

    // Escuchar cambios de autenticación
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadCurrentUser(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  async function createEvent(data: EventFormData) {
    try {
      setFormError('')

      const supabase = createClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setFormError('Debes iniciar sesión')
        return
      }

      // Validaciones frontend

      if (!data.titulo.trim()) {
        setFormError('El título es obligatorio')
        return
      }

      if (!data.descripcion.trim()) {
        setFormError('La descripción es obligatoria')
        return
      }

      if (!data.categoria.trim()) {
        setFormError('La categoría es obligatoria')
        return
      }

      if (!data.fecha) {
        setFormError('La fecha es obligatoria')
        return
      }

      if (!data.ubicacion.trim()) {
        setFormError('La ubicación es obligatoria')
        return
      }

      if (Number(data.precio) < 0) {
        setFormError('El precio no es válido')
        return
      }

      if (Number(data.cuposTotales) < 1) {
        setFormError('Debe haber al menos un cupo')
        return
      }

      if (data.urlPago) {
        try {
          new URL(data.urlPago)
        } catch {
          setFormError('La URL de pago no es válida')
          return
        }
      }

      if (!data.imagen) {
        setFormError('Debes seleccionar una imagen')
        return
      }

      // ===== Subir imagen =====

      const imageForm = new FormData()

      imageForm.append('file', data.imagen)

      const uploadResponse = await fetch('/api/upload/image', {
        method: 'POST',
        body: imageForm,
      })

      if (!uploadResponse.ok) {
        setFormError('No se pudo subir la imagen')
        return
      }

      const uploadData = await uploadResponse.json()

      // ===== Crear evento =====

      const response = await fetch('/api/eventos', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',

          Authorization: `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          titulo: data.titulo,

          descripcion: data.descripcion,

          categoria: data.categoria,

          tipo: 'OPEAR_PRIMA',

          fecha: data.fecha,

          ubicacion: data.ubicacion,

          precio: Number(data.precio),

          cuposTotales: Number(data.cuposTotales),

          urlPago: data.urlPago || null,

          imagen: uploadData.url,
        }),
      })

      if (!response.ok) {
        const error = await response.json()

        setFormError(error.error || 'No se pudo crear el evento')

        return
      }

      setFormError('')

      setShowCreateModal(false)

      await loadEvents()
    } catch (error) {
      console.error(error)

      setFormError('Error al crear el evento')
    }
  }

  return (
    <section
      ref={sectionRef}
      className="bg-background no-borders w-full border-b-2 border-zinc-200"
    >
      <div className="no-borders mx-[100px] border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            currentUser={currentUser}
            onClose={() => setSelectedEvent(null)}
          />
        )}

        {/* -- Header -- */}
        <div className="px-8 pt-20 pb-16">
          <div className="grid items-end gap-12 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <TimelineAnimation
                as="p"
                animationNum={0}
                timelineRef={sectionRef}
                className="mb-5 text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase"
              >
                Talleres y Eventos
              </TimelineAnimation>
              <TimelineAnimation
                as="h2"
                animationNum={1}
                timelineRef={sectionRef}
                className="text-4xl leading-none font-bold tracking-[-0.03em] text-zinc-900 lg:text-[3.4rem]"
              >
                Próximos eventos
              </TimelineAnimation>
            </div>
            <div className="lg:pb-1">
              <TimelineAnimation
                as="p"
                animationNum={2}
                timelineRef={sectionRef}
                className="max-w-lg text-lg leading-relaxed text-zinc-500"
              >
                Talleres, networking y encuentros diseñados para impulsar tu carrera artística.
              </TimelineAnimation>
            </div>
          </div>
        </div>

        {/* -- Search + Filters -- */}
        <div className="px-8 py-6">
          <div className="flex items-center gap-3">
            {/* Search bar */}
            <div className="relative flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => handleQuery(e.target.value)}
                placeholder="Buscar por nombre, artista o fecha…"
                className="w-full border-2 border-zinc-200 bg-white py-3 pr-10 pl-10 text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 focus:border-[#023047] focus:shadow-[4px_4px_0_#023047] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => handleQuery('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Category dropdown */}
            <CategoryDropdown
              categories={categories}
              activeFilters={activeFilters}
              onToggle={toggleFilter}
              onClear={clearAll}
            />
            {isMentor && (
              <div className="flex justify-center">
                <button
                  type="button"
                  className="border-2 border-[#E63946] bg-[#E63946] px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-white hover:text-[#E63946] hover:shadow-[4px_4px_0_#353535]"
                  onClick={() => setShowCreateModal(true)}
                >
                  + Crear evento
                </button>
              </div>
            )}
          </div>
        </div>

        {/*--- modal de crear evento ---*/}
        <CreateEventModal
          open={showCreateModal}
          onClose={() => {
            setFormError('')
            setShowCreateModal(false)
          }}
          onSubmit={createEvent}
          error={formError}
        />

        {/* -- Events -- */}
        {filteredEvents.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Grid wrapper — relative for gradient overlay */}
            <div className="relative">
              {/* Desktop: 3-column parallax with vertical dividers */}
              {/* overflow-clip clips visual overflow without breaking sticky */}
              <div
                ref={gridRef}
                className="hidden grid-cols-3 divide-x divide-zinc-200 overflow-clip lg:grid"
              >
                {/* Left — drifts down */}
                <motion.div
                  style={{ y: yLeft, willChange: 'transform' }}
                  className="flex flex-col gap-8 px-5 py-10"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {colLeft.map((event, i) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => setSelectedEvent(event)}
                        animationIndex={i * 3}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Center — no parallax */}
                <div className="flex flex-col gap-8 px-5 py-10">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {colCenter.map((event, i) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => setSelectedEvent(event)}
                        animationIndex={i * 3 + 1}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Right — drifts up */}
                <motion.div
                  style={{ y: yRight, willChange: 'transform' }}
                  className="flex flex-col gap-8 px-5 py-10"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {colRight.map((event, i) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => setSelectedEvent(event)}
                        animationIndex={i * 3 + 2}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Mobile: flat vertical list */}
              <div className="flex flex-col divide-y-2 divide-zinc-200 lg:hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  {visibleEvents.map((event, i) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => setSelectedEvent(event)}
                      animationIndex={i}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Translucent gradient — overlaps last row when events are hidden */}
              {hasMore && (
                <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-48 bg-linear-to-t from-white via-white/80 to-transparent" />
              )}
            </div>

            {/* -- Ver más -- */}
            {hasMore && (
              <div className="flex justify-center border-b-2 border-zinc-200 pt-4 pb-12">
                <button
                  type="button"
                  onClick={() => setVisibleCount((v) => v + LOAD_MORE_STEP)}
                  className="flex items-center gap-3 border-2 border-zinc-200 bg-white/70 px-8 py-3 text-[0.62rem] font-bold tracking-widest text-zinc-600 uppercase backdrop-blur-sm transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#023047] hover:text-[#023047] hover:shadow-[4px_4px_0_#023047] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  Ver más
                  <span className="bg-zinc-100 px-2 py-0.5 text-[0.55rem] font-bold tracking-widest text-zinc-500">
                    +{remaining}
                  </span>
                </button>
              </div>
            )}

            {/* Spacing when all events shown */}
            {!hasMore && <div className="h-12 border-b-2 border-zinc-200" />}
          </>
        )}

        {/* Mobile CTA */}
        <div className="px-8 py-8 lg:hidden">
          <a
            href="/eventos"
            className="flex items-center justify-center border-2 border-[#E63946] bg-[#E63946] py-3 text-xs font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-transparent hover:text-[#E63946] hover:shadow-[4px_4px_0_#353535]"
          >
            Ver todos los eventos →
          </a>
        </div>
      </div>
    </section>
  )
}

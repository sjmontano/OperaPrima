'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
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
}

// -- Brand accent map --
const CAT_STYLES = {
  terracota: { fg: '#F65B7F', bg: 'rgba(246,91,127,0.10)', border: 'rgba(246,91,127,0.40)' },
  selva: { fg: '#1A4A3C', bg: 'rgba(26,74,60,0.08)', border: 'rgba(26,74,60,0.35)' },
  lavanda: { fg: '#5E3A8A', bg: 'rgba(94,58,138,0.08)', border: 'rgba(94,58,138,0.35)' },
} as const

const INITIAL_VISIBLE = 6
const LOAD_MORE_STEP = 6

// -- Mock data — replace with Supabase query --
const ALL_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Fotografía editorial: construye tu portafolio',
    artist: 'Valentina Torres',
    category: 'Taller',
    categoryVariant: 'terracota',
    date: '10 May 2026',
    location: 'Bogotá, D.C.',
    image:
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=700&auto=format&fit=crop&q=80',
    price: '$120.000',
    likes: 84,
    comments: 12,
    views: 540,
  },
  {
    id: 'ev-2',
    title: 'Encuentro de músicos emergentes — Bogotá',
    artist: 'Colectivo Sonoro',
    category: 'Networking',
    categoryVariant: 'terracota',
    date: '17 May 2026',
    location: 'La Candelaria, Bogotá',
    image:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=700&auto=format&fit=crop&q=80',
    price: '$60.000',
    likes: 192,
    comments: 28,
    views: 930,
  },
  {
    id: 'ev-3',
    title: 'Actuación en escena: técnica y presencia',
    artist: 'Camilo Estrada',
    category: 'Workshop',
    categoryVariant: 'lavanda',
    date: '14 May 2026',
    location: 'Cali',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&auto=format&fit=crop&q=80',
    price: '$110.000',
    likes: 63,
    comments: 9,
    views: 280,
  },
  {
    id: 'ev-4',
    title: 'Residencia de escritura creativa — Eje Cafetero',
    artist: 'Paula Ríos & Juan Mora',
    category: 'Residencia',
    categoryVariant: 'selva',
    date: '22 May 2026',
    location: 'Armenia, Quindío',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=700&auto=format&fit=crop&q=80',
    price: '$350.000',
    soldOut: true,
    likes: 213,
    comments: 31,
    views: 1240,
  },
  {
    id: 'ev-5',
    title: 'Ilustración y narrativa visual latinoamericana',
    artist: 'Andrea Lozano',
    category: 'Taller',
    categoryVariant: 'selva',
    date: '30 May 2026',
    location: 'Medellín',
    image:
      'https://images.unsplash.com/photo-1579762593175-20226054cad0?w=700&auto=format&fit=crop&q=80',
    price: '$95.000',
    likes: 76,
    comments: 14,
    views: 445,
  },
  {
    id: 'ev-6',
    title: 'Diseño de marca para artistas independientes',
    artist: 'Diego Fuentes',
    category: 'Workshop',
    categoryVariant: 'lavanda',
    date: '5 Jun 2026',
    location: 'Online',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&auto=format&fit=crop&q=80',
    price: '$80.000',
    likes: 47,
    comments: 8,
    views: 312,
  },
  {
    id: 'ev-7',
    title: 'Concierto colectivo — artistas en red',
    artist: 'Varios artistas',
    category: 'Concierto',
    categoryVariant: 'terracota',
    date: '28 May 2026',
    location: 'Teatro Mayor, Bogotá',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&auto=format&fit=crop&q=80',
    price: '$45.000',
    soldOut: true,
    likes: 387,
    comments: 54,
    views: 2100,
  },
  {
    id: 'ev-8',
    title: 'Curaduría independiente: primera exposición',
    artist: 'Sara Gómez',
    category: 'Taller',
    categoryVariant: 'selva',
    date: '19 Jun 2026',
    location: 'Barranquilla',
    image:
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=700&auto=format&fit=crop&q=80',
    price: '$140.000',
    likes: 29,
    comments: 5,
    views: 198,
  },
  {
    id: 'ev-9',
    title: 'Danza contemporánea: cuerpo y espacio urbano',
    artist: 'Compañía Raíz',
    category: 'Workshop',
    categoryVariant: 'lavanda',
    date: '7 Jun 2026',
    location: 'Medellín',
    image:
      'https://images.unsplash.com/photo-1547153760-18fc86324498?w=700&auto=format&fit=crop&q=80',
    price: '$130.000',
    likes: 118,
    comments: 22,
    views: 720,
  },
  {
    id: 'ev-10',
    title: 'Feria de arte gráfico — Bogotá 2026',
    artist: 'Colectivo Impreso',
    category: 'Exposición',
    categoryVariant: 'terracota',
    date: '14 Jun 2026',
    location: 'Centro Cultural El Campin, Bogotá',
    image:
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=700&auto=format&fit=crop&q=80',
    price: 'Entrada libre',
    likes: 265,
    comments: 40,
    views: 1580,
  },
  {
    id: 'ev-11',
    title: 'Podcast en vivo: el negocio del arte',
    artist: 'Felipe Arango',
    category: 'Networking',
    categoryVariant: 'selva',
    date: '21 Jun 2026',
    location: 'Online',
    image:
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=700&auto=format&fit=crop&q=80',
    price: 'Gratis',
    likes: 95,
    comments: 17,
    views: 640,
  },
  {
    id: 'ev-12',
    title: 'Cerámica artística: moldes y texturas',
    artist: 'Nata Cerámicas',
    category: 'Taller',
    categoryVariant: 'terracota',
    date: '28 Jun 2026',
    location: 'Bogotá, D.C.',
    image:
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&auto=format&fit=crop&q=80',
    price: '$160.000',
    likes: 53,
    comments: 11,
    views: 390,
  },
]

const CATEGORIES = [...new Set(ALL_EVENTS.map((e) => e.category))]

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
  activeFilters,
  onToggle,
  onClear,
}: {
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
            ? '-translate-x-0.5 -translate-y-0.5 border-[#F65B7F] text-[#F65B7F] shadow-[4px_4px_0_#F65B7F]'
            : 'border-zinc-200 text-zinc-600 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#F65B7F] hover:text-[#F65B7F] hover:shadow-[4px_4px_0_#F65B7F]'
        }`}
      >
        {label}
        {hasActive && (
          <span className="bg-[#F65B7F] px-1.5 py-0.5 text-[0.55rem] leading-none font-bold text-white">
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
            {CATEGORIES.map((cat, i) => (
              <label
                key={cat}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-zinc-50 ${i < CATEGORIES.length - 1 ? 'border-b border-zinc-100' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={activeFilters.includes(cat)}
                  onChange={() => onToggle(cat)}
                  className="h-3.5 w-3.5 shrink-0 accent-[#F65B7F]"
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
                className="flex w-full items-center gap-1.5 border-t-2 border-zinc-100 px-4 py-2.5 text-[0.62rem] text-zinc-400 transition-colors hover:text-[#F65B7F]"
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
}: {
  event: CalendarEvent
  animationIndex?: number
}) {
  const c = CAT_STYLES[event.categoryVariant]
  const delay = (animationIndex % LOAD_MORE_STEP) * 0.07

  return (
    <motion.article
      layout
      initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      exit={{ opacity: 0, filter: 'blur(4px)', y: -10, transition: { duration: 0.2 } }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      className="group relative flex flex-col bg-white ring-2 ring-transparent transition-all duration-200 ease-out hover:shadow-[4px_4px_0_#F65B7F] hover:ring-[#F65B7F]"
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
          {event.price.startsWith('$') && (
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
            className="border-2 border-[#F65B7F] bg-[#F65B7F] px-3 py-1.5 text-[0.6rem] font-bold tracking-widest text-white uppercase transition-all duration-150 ease-out hover:bg-white hover:text-[#F65B7F] hover:shadow-[3px_3px_0_#111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
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
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE)

  // Parallax — columns drift in opposite directions
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ['start end', 'end start'],
  })
  const yLeft = useTransform(scrollYProgress, [0, 0.5, 1], [0, 30, 0])
  const yRight = useTransform(scrollYProgress, [0, 0.5, 1], [0, -30, 0])

  const filteredEvents = useMemo(() => {
    const q = query.toLowerCase().trim()
    return ALL_EVENTS.filter((e) => {
      const matchesQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.artist.toLowerCase().includes(q) ||
        e.date.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
      const matchesFilter = activeFilters.length === 0 || activeFilters.includes(e.category)
      return matchesQuery && matchesFilter
    })
  }, [query, activeFilters])

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

  return (
    <section ref={sectionRef} className="bg-background w-full border-b-2 border-zinc-200">
      <div className="mx-auto max-w-420 border-zinc-200 sm:border-x">
        {/* -- Header -- */}
        <div className="border-b-2 border-zinc-200 px-8 pt-20 pb-12 text-center">
          <TimelineAnimation
            as="div"
            animationNum={0}
            timelineRef={sectionRef}
            className="mb-8 flex items-center justify-between gap-4"
          >
            <p className="text-[0.62rem] font-bold tracking-[0.28em] text-white/50 uppercase">
              Explorar agenda
            </p>
          </TimelineAnimation>
        </div>

        {/* -- Search + Filters -- */}
        <div className="border-b-2 border-zinc-200 px-8 py-6">
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
                className="w-full border-2 border-zinc-200 bg-white py-3 pr-10 pl-10 text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 focus:border-[#F65B7F] focus:shadow-[4px_4px_0_#F65B7F] focus:outline-none"
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
              activeFilters={activeFilters}
              onToggle={toggleFilter}
              onClear={clearAll}
            />
          </div>
        </div>

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
                      <EventCard key={event.id} event={event} animationIndex={i * 3} />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Center — no parallax */}
                <div className="flex flex-col gap-8 px-5 py-10">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {colCenter.map((event, i) => (
                      <EventCard key={event.id} event={event} animationIndex={i * 3 + 1} />
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
                      <EventCard key={event.id} event={event} animationIndex={i * 3 + 2} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Mobile: flat vertical list */}
              <div className="flex flex-col divide-y-2 divide-zinc-200 lg:hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  {visibleEvents.map((event, i) => (
                    <EventCard key={event.id} event={event} animationIndex={i} />
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
                  className="flex items-center gap-3 border-2 border-zinc-200 bg-white/70 px-8 py-3 text-[0.62rem] font-bold tracking-widest text-zinc-600 uppercase backdrop-blur-sm transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#F65B7F] hover:text-[#F65B7F] hover:shadow-[4px_4px_0_#F65B7F] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
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
            className="flex items-center justify-center border-2 border-[#F65B7F] bg-[#F65B7F] py-3 text-xs font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-transparent hover:text-[#F65B7F] hover:shadow-[4px_4px_0_#111]"
          >
            Ver todos los eventos →
          </a>
        </div>
      </div>
    </section>
  )
}

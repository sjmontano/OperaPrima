'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { MonthCalendar } from '@/components/events/MonthCalendar'
import { createClient } from '@/lib/supabaseClient'
import { CalendarDays, Grid3X3, MapPin, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { ComunidadCreateEventModal, type EventFormData } from './ComunidadCreateEventModal'
import type { Session } from '@supabase/supabase-js'
import { EventModal } from '../events/EventModal'

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

  disciplinas?: string[]

  usuarioId: string
  usuario: {
    username: string

    perfil?: {
      artisticName?: string | null
    } | null
  }
}
interface CalendarEvent {
  id: string
  title: string
  artist: string
  category: string
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

interface CurrentUser {
  id: string
  rol: string
}

const CAT_STYLES: Record<string, { fg: string; bg: string; border: string }> = {
  terracota: { fg: '#8ECAE6', bg: 'rgba(142,202,230,0.10)', border: 'rgba(142,202,230,0.40)' },
  selva: { fg: '#023047', bg: 'rgba(2,48,71,0.08)', border: 'rgba(2,48,71,0.35)' },
  lavanda: { fg: '#4682B4', bg: 'rgba(70,130,180,0.08)', border: 'rgba(70,130,180,0.35)' },
}

function mapEvent(evento: DbEvent): CalendarEvent {
  const categoryMap: Record<string, string> = {
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
    date: new Date(evento.fecha).toLocaleDateString('es-CO'),
    eventDate: new Date(evento.fecha),
    location: evento.ubicacion,
    image: evento.imagen ?? '/default-event.jpg',
    price: evento.precio,
    soldOut: evento.agotado ?? false,
    likes: evento.likes ?? 0,
    comments: evento.comentarios ?? 0,
    views: evento.vistas ?? 0,

    cuposDisponibles: evento.cuposDisponibles ?? 0,
    cuposTotales: evento.cuposTotales ?? 0,
    description: evento.descripcion ?? '',
    urlPago: evento.urlPago ?? null,
  }
}

export function ComunidadEventsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const authModal = useAuthModal()
  const [dbEvents, setDbEvents] = useState<DbEvent[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<'cards' | 'calendar'>('cards')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<DbEvent | null>(null)
  const [editData, setEditData] = useState<Partial<EventFormData> | undefined>(undefined)

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const events = useMemo(() => dbEvents.map(mapEvent), [dbEvents])

  const filteredEvents = useMemo(() => {
    const q = query.toLowerCase().trim()
    return events.filter(
      (e) =>
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.artist.toLowerCase().includes(q) ||
        e.date.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    )
  }, [events, query])

  const loadEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/eventos?rol=USUARIO')
      if (!res.ok) return
      const data: { eventos: DbEvent[] } = await res.json()
      console.log(data.eventos)
      setDbEvents(data.eventos)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    fetch('/api/eventos?rol=USUARIO')
      .then((r) => r.ok && r.json())
      .then((d) => d && setDbEvents(d.eventos))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const supabase = createClient()
    async function loadUser(session: Session | null) {
      if (!session) {
        setCurrentUser(null)
        return
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (!res.ok) {
          setCurrentUser(null)
          return
        }
        const data = await res.json()
        setCurrentUser(data.usuario)
      } catch {
        setCurrentUser(null)
      }
    }
    supabase.auth.getSession().then(({ data }) => loadUser(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => loadUser(session))
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  async function createEvent(data: EventFormData) {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      authModal.open('login')
      return
    }
    console.log(data)

    let imageUrl = ''
    if (data.imagen) {
      const fd = new FormData()
      fd.append('file', data.imagen)
      const uploadRes = await fetch('/api/upload/image', { method: 'POST', body: fd })
      if (!uploadRes.ok) throw new Error('Error al subir imagen')
      const uploadData = await uploadRes.json()
      imageUrl = uploadData.url
    }

    const res = await fetch('/api/eventos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        titulo: data.titulo,
        descripcion: data.descripcion,
        categoria: data.categoria,
        tipo: 'COMUNIDAD',
        disciplinas: data.disciplinas,
        urlPago: data.urlPago,
        fecha: data.fecha,
        ubicacion: data.ubicacion,
        precio: data.precio,
        cuposTotales: data.cuposTotales,
        imagen: imageUrl,
      }),
    })

    if (!res.ok) throw new Error('No se pudo crear el evento')
    await loadEvents()
  }

  async function updateEvent(data: EventFormData) {
    if (!editingEvent) return
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return

    let imageUrl = editingEvent.imagen ?? ''
    if (data.imagen) {
      const fd = new FormData()
      fd.append('file', data.imagen)
      const uploadRes = await fetch('/api/upload/image', { method: 'POST', body: fd })
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
      }
    }

    const res = await fetch(`/api/eventos/${editingEvent.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        titulo: data.titulo,
        descripcion: data.descripcion,
        categoria: data.categoria,
        tipo: 'COMUNIDAD',
        disciplinas: data.disciplinas,
        urlPago: data.urlPago,
        fecha: data.fecha,
        ubicacion: data.ubicacion,
        precio: data.precio,
        imagen: imageUrl,
      }),
    })

    if (!res.ok) {
      throw new Error('No se pudo actualizar el evento')
    }
    setEditingEvent(null)
    setEditData(undefined)
    await loadEvents()
  }

  async function deleteEvent() {
    if (!editingEvent) return
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return

    const res = await fetch(`/api/eventos/${editingEvent.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })

    if (!res.ok) {
      throw new Error('No se pudo eliminar el evento')
    }

    setEditingEvent(null)
    setEditData(undefined)
    setShowCreateModal(false)
    await loadEvents()
  }

  function openEdit(event: DbEvent) {
    setEditingEvent(event)
    setEditData({
      titulo: event.titulo,
      descripcion: event.descripcion ?? '',
      categoria: event.categoria,
      disciplinas: event.disciplinas ?? [],
      urlPago: event.urlPago ?? '',
      fecha: event.fecha.slice(0, 10),
      ubicacion: event.ubicacion,
      precio: event.precio,
      imagen: null,
    })
    setShowCreateModal(true)
  }

  const ownEventIds = useMemo(
    () => new Set(dbEvents.filter((e) => e.usuarioId === currentUser?.id).map((e) => e.id)),
    [dbEvents, currentUser]
  )

  return (
    <section
      ref={sectionRef}
      id="eventos"
      className="bg-background w-full border-b-2 border-zinc-200"
    >
      <div className="no-borders mx-[100px] border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            tipo="COMUNIDAD"
            currentUser={currentUser}
          />
        )}

        {/* Header */}
        <div className="border-b-2 border-zinc-200 px-8 pt-16 pb-10 text-center">
          <TimelineAnimation as="div" animationNum={0} timelineRef={sectionRef}>
            <p className="text-[0.62rem] font-bold tracking-[0.28em] text-zinc-400 uppercase">
              Eventos de la comunidad
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              {currentUser ? '¿Qué está pasando?' : 'Explora la comunidad'}
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              {dbEvents.length} evento{dbEvents.length !== 1 ? 's' : ''} registrado
              {dbEvents.length !== 1 ? 's' : ''}
            </p>
          </TimelineAnimation>
        </div>

        {/* Search + Toggle + Create */}
        <div className="border-b-2 border-zinc-200 px-8 py-6">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                }}
                placeholder="Buscar eventos…"
                className="w-full border-2 border-zinc-200 bg-white py-3 pr-10 pl-10 text-sm text-zinc-900 transition-all duration-150 placeholder:text-zinc-400 focus:border-[#023047] focus:shadow-[4px_4px_0_#023047] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Limpiar"
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* View toggle */}
            <div className="flex border-2 border-zinc-200">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-3 transition ${
                  viewMode === 'cards'
                    ? 'bg-[#023047] text-[#F0F8FF]'
                    : 'bg-white text-zinc-500 hover:text-[#023047]'
                }`}
                aria-label="Vista tarjetas"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`border-l-2 border-zinc-200 px-3 py-3 transition ${
                  viewMode === 'calendar'
                    ? 'bg-[#023047] text-[#F0F8FF]'
                    : 'bg-white text-zinc-500 hover:text-[#023047]'
                }`}
                aria-label="Vista calendario"
              >
                <CalendarDays size={16} />
              </button>
            </div>

            {/* Create event */}
            {currentUser && (
              <button
                type="button"
                className="border-2 border-[#E63946] bg-[#E63946] px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-white hover:text-[#E63946] hover:shadow-[4px_4px_0_#353535]"
                onClick={() => {
                  setEditingEvent(null)
                  setEditData(undefined)
                  setShowCreateModal(true)
                }}
              >
                + Crear evento
              </button>
            )}
          </div>
        </div>

        {/* Modal */}
        <ComunidadCreateEventModal
          open={showCreateModal}
          editing={!!editingEvent}
          initial={editData}
          onClose={() => {
            setShowCreateModal(false)
            setEditingEvent(null)
            setEditData(undefined)
          }}
          onSubmit={editingEvent ? updateEvent : createEvent}
          onDelete={editingEvent ? deleteEvent : undefined}
        />

        {/* Events content */}
        <div className="relative">
          {/* Blur overlay for non-auth */}
          {!currentUser && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 px-6 py-20">
              <div className="absolute inset-0 backdrop-blur-md" />
              <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                <span className="text-4xl select-none">🔒</span>
                <p className="text-lg font-bold text-zinc-900">Para ver eventos, registrate</p>
                <p className="max-w-xs text-sm text-zinc-500">
                  Crea una cuenta o inicia sesión para ver el calendario y los eventos de la
                  comunidad.
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => authModal.open('registro')}
                    className="border-2 border-[#E63946] bg-[#E63946] px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition hover:bg-white hover:text-[#E63946]"
                  >
                    Crear cuenta
                  </button>
                  <button
                    type="button"
                    onClick={() => authModal.open('login')}
                    className="border-2 border-zinc-900 px-6 py-3 text-xs font-bold tracking-widest text-zinc-900 uppercase transition hover:bg-zinc-900 hover:text-white"
                  >
                    Iniciar sesión
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cards View */}
          {viewMode === 'cards' && (
            <div className={!currentUser ? 'pointer-events-none opacity-30 select-none' : ''}>
              {filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-24 text-center">
                  <span className="text-5xl select-none" aria-hidden>
                    🎨
                  </span>
                  <p className="text-sm font-semibold text-zinc-900">Sin resultados</p>
                  <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
                    No encontramos eventos con esos criterios.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 px-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {filteredEvents.map((event, i) => {
                      const c =
                        CAT_STYLES[
                          event.category in CAT_STYLES
                            ? (event.category as keyof typeof CAT_STYLES)
                            : 'terracota'
                        ]
                      const dbEvent = dbEvents.find((de) => de.id === event.id)
                      const isOwn = dbEvent ? ownEventIds.has(dbEvent.id) : false
                      return (
                        <motion.article
                          layout
                          key={event.id}
                          initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
                          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                          transition={{
                            duration: 0.55,
                            ease: [0.16, 1, 0.3, 1],
                            delay: (i % 6) * 0.07,
                          }}
                          className="group relative flex flex-col bg-white ring-2 ring-transparent transition-all duration-200 ease-out hover:shadow-[4px_4px_0_#023047] hover:ring-[#023047]"
                        >
                          <div onClick={() => setSelectedEvent(event)}>
                            <div className="relative h-48 overflow-hidden">
                              <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                unoptimized
                              />
                            </div>
                            <div className="flex flex-col gap-2 border-t border-zinc-200 px-5 pt-4 pb-3">
                              <span
                                className="self-start px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.18em] uppercase"
                                style={{
                                  color: c.fg,
                                  backgroundColor: c.bg,
                                  outline: `1px solid ${c.border}`,
                                }}
                              >
                                {event.category}
                              </span>
                              <h3 className="text-sm leading-snug font-semibold tracking-tight text-zinc-900">
                                {event.title}
                              </h3>
                              <p className="text-xs text-zinc-400">{event.artist}</p>
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

                          <div className="mt-auto flex items-center justify-between border-t border-zinc-200 px-5 py-3">
                            <span className="text-sm font-bold text-zinc-900">{event.price} €</span>
                            {isOwn && (
                              <button
                                type="button"
                                onClick={() => dbEvent && openEdit(dbEvent)}
                                className="text-[0.55rem] font-bold tracking-widest text-zinc-400 uppercase underline underline-offset-2 transition hover:text-[#023047]"
                              >
                                Editar
                              </button>
                            )}
                          </div>
                        </motion.article>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <div className={!currentUser ? 'pointer-events-none opacity-30 select-none' : ''}>
              <MonthCalendar events={filteredEvents} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { createClient } from '@/lib/supabaseClient'
import { CalendarDays, Clock, MapPin, Search, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ProyectosFormModal, type ProyectoFormData } from './ProyectosFormModal'
import type { Session } from '@supabase/supabase-js'

interface DbProyecto {
  id: string
  tipo: 'OPERA_PRIMA' | 'COMUNIDAD' | 'ENTIDAD'
  nombre: string
  representante: string
  descripcion: string
  queBuscan: string
  requisitos: string
  proceso: string
  imagen: string | null
  contacto: string
  disciplinas: string[]
  ubicacion: string
  destacado: boolean
  fechaLimite: string
  usuarioId: string | null
  createdAt: string
}

interface CurrentUser {
  id: string
  rol: string
}

const TIPO_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  OPERA_PRIMA: {
    label: 'Ópera Prima',
    color: '#023047',
    bg: 'rgba(2,48,71,0.10)',
    border: 'rgba(2,48,71,0.35)',
  },
  COMUNIDAD: {
    label: 'Comunidad',
    color: '#8ECAE6',
    bg: 'rgba(142,202,230,0.15)',
    border: 'rgba(142,202,230,0.40)',
  },
  ENTIDAD: {
    label: 'Entidad',
    color: '#4682B4',
    bg: 'rgba(70,130,180,0.10)',
    border: 'rgba(70,130,180,0.35)',
  },
}

const CARD_ACCENT: Record<string, string> = {
  OPERA_PRIMA: '#023047',
  COMUNIDAD: '#8ECAE6',
  ENTIDAD: '#4682B4',
}

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86400000))
}

export function ProyectosSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const auth = useAuthModal()
  const [proyectos, setProyectos] = useState<DbProyecto[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [query, setQuery] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('todas')
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return proyectos.filter((p) => {
      const matchQuery =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.queBuscan.toLowerCase().includes(q) ||
        p.disciplinas.some((d) => d.toLowerCase().includes(q))
      const matchTipo = tipoFilter === 'todas' || p.tipo === tipoFilter
      return matchQuery && matchTipo
    })
  }, [proyectos, query, tipoFilter])

  const loadProyectos = useCallback(async () => {
    try {
      const res = await fetch('/api/proyectos')
      if (!res.ok) return
      const data = await res.json()
      setProyectos(data.proyectos)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    fetch('/api/proyectos')
      .then((r) => r.ok && r.json())
      .then((d) => d && setProyectos(d.proyectos))
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

  const expandAfterAuthRef = useRef<string | null>(null)

  function handleExpandClick(id: string) {
    if (!currentUser) {
      expandAfterAuthRef.current = id
      auth.open('registro')
      return
    }
    setExpandedId((prev) => (prev === id ? null : id))
  }

  useEffect(() => {
    if (currentUser && expandAfterAuthRef.current) {
      const id = expandAfterAuthRef.current
      expandAfterAuthRef.current = null
      setExpandedId(id)
    }
  }, [currentUser])

  async function createProyecto(data: ProyectoFormData) {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    let imageUrl = ''
    if (data.imagen) {
      const fd = new FormData()
      fd.append('file', data.imagen)
      const uploadRes = await fetch('/api/upload/image', { method: 'POST', body: fd })
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
      }
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (session) headers['Authorization'] = `Bearer ${session.access_token}`

    const res = await fetch('/api/proyectos', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        nombre: data.nombre,
        representante: data.representante,
        disciplinas: data.disciplinas,
        ubicacion: data.ubicacion,
        descripcion: data.descripcion,
        queBuscan: data.queBuscan,
        requisitos: data.requisitos,
        proceso: data.proceso,
        imagen: imageUrl,
        contacto: data.contacto,
        fechaLimite: data.fechaLimite,
      }),
    })
    if (!res.ok) throw new Error('Error')
    await loadProyectos()
  }

  return (
    <section
      ref={sectionRef}
      id="proyectos"
      className="bg-background w-full border-b-2 border-zinc-200"
    >
      <div className="mx-[100px] border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
        {/* Header */}
        <div className="border-b-2 border-zinc-200 px-8 pt-16 pb-10 text-center">
          <p className="mb-2 text-[0.62rem] font-bold tracking-[0.28em] text-zinc-400 uppercase">
            Proyectos activos
          </p>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
            Explora oportunidades
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            {proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''} disponibles
          </p>
        </div>

        {/* Search + Filters + Create */}
        <div className="border-b-2 border-zinc-200 px-8 py-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar proyectos…"
                className="w-full border-2 border-zinc-200 bg-white py-3 pr-10 pl-10 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-[#023047] focus:shadow-[4px_4px_0_#023047] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Tipo filter pills */}
            <div className="flex gap-1.5">
              {[
                { key: 'todas', label: 'Todas' },
                { key: 'OPERA_PRIMA', label: 'OP' },
                { key: 'COMUNIDAD', label: 'Comunidad' },
                { key: 'ENTIDAD', label: 'Entidad' },
              ].map((t) => {
                const isActive = tipoFilter === t.key
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTipoFilter(t.key)}
                    className={`border-2 px-3 py-2 text-[0.55rem] font-bold tracking-widest uppercase transition-all ${
                      isActive
                        ? '-translate-x-0.5 -translate-y-0.5 border-[#023047] bg-[#023047] text-[#F0F8FF] shadow-[2px_2px_0_#111]'
                        : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                    }`}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="border-2 border-[#E63946] bg-[#E63946] px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition-all duration-150 hover:bg-white hover:text-[#E63946] hover:shadow-[4px_4px_0_#353535]"
            >
              + Publicar proyecto
            </button>
          </div>
        </div>

        {/* Form modal */}
        <ProyectosFormModal
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={createProyecto}
        />

        {/* Cards grid */}
        <div className="px-8 py-10">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <span className="text-5xl">📋</span>
              <p className="text-sm font-semibold text-zinc-900">Sin resultados</p>
              <p className="max-w-xs text-sm text-zinc-500">
                No encontramos proyectos con esos criterios.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((proyecto, idx) => {
                  const tStyle = TIPO_STYLES[proyecto.tipo]
                  const accent = CARD_ACCENT[proyecto.tipo]
                  const isExpanded = expandedId === proyecto.id
                  const daysLeft = daysUntil(proyecto.fechaLimite)
                  const isExpired = daysLeft === 0

                  return (
                    <motion.div
                      layout
                      key={proyecto.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (idx % 6) * 0.06 }}
                    >
                      {/* Card preview */}
                      {!isExpanded ? (
                        <div
                          className="group relative flex flex-col bg-white ring-2 ring-transparent transition-all duration-200 hover:shadow-[4px_4px_0_#111] hover:ring-[#023047]"
                          style={{ borderTop: `3px solid ${accent}` }}
                        >
                          {proyecto.imagen && (
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src={proyecto.imagen}
                                alt={proyecto.nombre}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              />
                            </div>
                          )}
                          <div className="flex flex-col gap-2 p-5">
                            <span
                              className="self-start px-2 py-0.5 text-[0.55rem] font-bold tracking-[0.18em] uppercase"
                              style={{
                                color: tStyle.color,
                                backgroundColor: tStyle.bg,
                                outline: `1px solid ${tStyle.border}`,
                              }}
                            >
                              {tStyle.label}
                            </span>
                            <h3 className="text-sm font-bold tracking-tight text-zinc-900">
                              {proyecto.nombre}
                            </h3>
                            <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
                              {proyecto.queBuscan}
                            </p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {proyecto.disciplinas.slice(0, 3).map((d) => (
                                <span
                                  key={d}
                                  className="text-[0.55rem] font-bold tracking-widest text-zinc-400 uppercase"
                                >
                                  #{d}
                                </span>
                              ))}
                              {proyecto.disciplinas.length > 3 && (
                                <span className="text-[0.55rem] text-zinc-400">
                                  +{proyecto.disciplinas.length - 3}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 pt-1 text-[0.65rem] text-zinc-500">
                              <span className="flex items-center gap-1">
                                <MapPin size={10} /> {proyecto.ubicacion}
                              </span>
                              <span
                                className={`flex items-center gap-1 ${isExpired ? 'text-[#E63946]' : ''}`}
                              >
                                <Clock size={10} /> {isExpired ? 'Vencido' : `${daysLeft} días`}
                              </span>
                            </div>
                          </div>
                          <div className="mt-auto border-t border-zinc-200 px-5 py-3">
                            <button
                              type="button"
                              onClick={() => handleExpandClick(proyecto.id)}
                              className="w-full border-2 border-zinc-200 py-2 text-[0.6rem] font-bold tracking-widest text-zinc-600 uppercase transition hover:border-[#023047] hover:text-[#023047]"
                            >
                              {!currentUser ? 'Ver más →' : 'Ver más'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Expanded full info */
                        <div className="col-span-full border-2 border-zinc-900 bg-white shadow-[6px_6px_0_#111]">
                          <div className="flex items-start justify-between border-b-2 border-zinc-200 p-6">
                            <div className="flex items-center gap-3">
                              <span
                                className="px-2 py-0.5 text-[0.55rem] font-bold tracking-[0.18em] uppercase"
                                style={{
                                  color: tStyle.color,
                                  backgroundColor: tStyle.bg,
                                  outline: `1px solid ${tStyle.border}`,
                                }}
                              >
                                {tStyle.label}
                              </span>
                              <span className="text-[0.6rem] text-zinc-400">
                                {proyecto.representante}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setExpandedId(null)}
                              className="text-zinc-400 hover:text-zinc-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_1fr]">
                            <div className="space-y-6">
                              {proyecto.imagen && (
                                <img
                                  src={proyecto.imagen}
                                  alt={proyecto.nombre}
                                  className="max-h-64 w-full border-2 border-zinc-200 object-cover"
                                />
                              )}
                              <div>
                                <h3 className="text-2xl font-black text-zinc-900">
                                  {proyecto.nombre}
                                </h3>
                                <p className="mt-1 text-sm text-zinc-500">
                                  por {proyecto.representante}
                                </p>
                              </div>
                              <div>
                                <p className="mb-1 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                                  Descripción
                                </p>
                                <p className="text-sm leading-relaxed text-zinc-700">
                                  {proyecto.descripcion}
                                </p>
                              </div>
                              <div>
                                <p className="mb-1 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                                  ¿Qué buscan?
                                </p>
                                <p className="text-sm leading-relaxed text-zinc-700">
                                  {proyecto.queBuscan}
                                </p>
                              </div>
                              {proyecto.requisitos && (
                                <div>
                                  <p className="mb-1 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                                    Requisitos
                                  </p>
                                  <p className="text-sm leading-relaxed whitespace-pre-line text-zinc-700">
                                    {proyecto.requisitos}
                                  </p>
                                </div>
                              )}
                              {proyecto.proceso && (
                                <div>
                                  <p className="mb-1 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                                    Proceso de postulación
                                  </p>
                                  <p className="text-sm leading-relaxed whitespace-pre-line text-zinc-700">
                                    {proyecto.proceso}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="space-y-4 lg:border-l-2 lg:border-zinc-200 lg:pl-6">
                              <div className="space-y-3 border-2 border-zinc-200 p-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <CalendarDays size={14} className="text-zinc-400" />
                                  <span className="text-zinc-700">
                                    <span className="font-bold">Límite:</span>{' '}
                                    {new Date(proyecto.fechaLimite).toLocaleDateString('es-CO')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin size={14} className="text-zinc-400" />
                                  <span className="text-zinc-700">{proyecto.ubicacion}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {proyecto.disciplinas.map((d) => (
                                    <span
                                      key={d}
                                      className="border border-zinc-200 px-2 py-0.5 text-[0.55rem] font-bold tracking-widest text-zinc-500 uppercase"
                                    >
                                      {d}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <a
                                href={
                                  proyecto.contacto.startsWith('http')
                                    ? proyecto.contacto
                                    : `mailto:${proyecto.contacto}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 border-2 border-[#E63946] bg-[#E63946] px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition hover:bg-white hover:text-[#E63946]"
                              >
                                Contactar
                              </a>
                              <p className="text-center text-[0.55rem] leading-relaxed text-zinc-400">
                                Al contactar, aceptas los términos de uso de Ópera Prima.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

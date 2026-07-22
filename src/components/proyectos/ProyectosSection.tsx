'use client'

import { EditableRichText } from '@/components/editor/EditableRichText'
import { EditableText } from '@/components/editor/EditableText'
import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { useEditMode } from '@/context/EditModeContext'
import { useInlineCrud } from '@/lib/useInlineCrud'
import { Clock, MapPin, Plus, Search, Trash2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ProyectosFormModal, type ProyectoFormData } from './ProyectosFormModal'
import ProyectoExpandido from './ProyectoExpandido'

export interface DbProyecto {
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

export function ProyectosSection({
  eyebrow = 'Proyectos activos',
  heading = 'Explora oportunidades',
  searchPlaceholder = 'Buscar proyectos…',
  createButtonText = '+ Publicar proyecto',
  emptyTitle = 'Sin resultados',
  emptyDescription = 'No encontramos proyectos con esos criterios.',
  viewMoreText = 'Ver más',
  viewMoreGuestText = 'Ver más →',
  contactTermsText = 'Al contactar, aceptas los términos de uso de Ópera Prima.',
  __onFieldChange,
}: {
  eyebrow?: string
  heading?: string
  searchPlaceholder?: string
  createButtonText?: string
  emptyTitle?: string
  emptyDescription?: string
  viewMoreText?: string
  viewMoreGuestText?: string
  contactTermsText?: string
  __onFieldChange?: (path: string, value: unknown) => void
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const auth = useAuthModal()
  const { isEditMode } = useEditMode()
  const {
    items: proyectos,
    addItem: addProyecto,
    deleteItem: deleteProyecto,
  } = useInlineCrud<DbProyecto>({ endpoint: '/api/proyectos' })
  const currentUser = auth.currentUser as CurrentUser | null
  const [query, setQuery] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('todas')
  const [showForm, setShowForm] = useState(false)
  const [selectedProyecto, setSelectedProyecto] = useState<DbProyecto | null>(null)

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

  const expandAfterAuthRef = useRef<string | null>(null)

  function handleExpandClick(proyecto: DbProyecto) {
    if (isEditMode) return

    if (!currentUser) {
      expandAfterAuthRef.current = proyecto.id
      auth.open('registro')
      return
    }

    setSelectedProyecto(proyecto)
  }

  useEffect(() => {
    if (currentUser && expandAfterAuthRef.current) {
      const proyecto = proyectos.find((p) => p.id === expandAfterAuthRef.current)

      expandAfterAuthRef.current = null

      if (proyecto) {
        setSelectedProyecto(proyecto)
      }
    }
  }, [currentUser, proyectos])

  async function createProyecto(data: ProyectoFormData) {
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
    await addProyecto({
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
    })
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
          <EditableText
            value={eyebrow}
            onSave={(v) => __onFieldChange?.('eyebrow', v)}
            className="mb-2 text-[0.62rem] font-bold tracking-[0.28em] text-zinc-400 uppercase"
            as="p"
          />
          <EditableRichText
            value={heading}
            onSave={(v) => __onFieldChange?.('heading', v)}
            className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl"
          />
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
                placeholder={searchPlaceholder}
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
              <EditableText
                value={createButtonText}
                onSave={(v) => __onFieldChange?.('createButtonText', v)}
                as="span"
                singleLine
              />
            </button>
          </div>
        </div>

        {/* Form modal */}
        <ProyectosFormModal
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={createProyecto}
        />

        {/* Admin inline controls */}
        {isEditMode && currentUser?.rol === 'ADMIN' && (
          <div className="mx-8 mb-6 flex items-center justify-between border-2 border-dashed border-[#E63946] bg-[#E63946]/10 px-6 py-4">
            <p className="text-xs font-bold tracking-widest text-[#E63946] uppercase">
              Modo edición — Proyectos
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 border-2 border-[#E63946] bg-[#E63946] px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase transition hover:bg-transparent hover:text-[#E63946]"
            >
              <Plus size={14} />
              {createButtonText}
            </button>
          </div>
        )}

        {/* Cards grid */}
        <div className="px-8 py-10">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <span className="text-5xl">📋</span>
              <EditableText
                value={emptyTitle}
                onSave={(v) => __onFieldChange?.('emptyTitle', v)}
                className="text-sm font-semibold text-zinc-900"
                as="p"
              />
              <EditableRichText
                value={emptyDescription}
                onSave={(v) => __onFieldChange?.('emptyDescription', v)}
                className="max-w-xs text-sm text-zinc-500"
                as="p"
              />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((proyecto, idx) => {
                  const tStyle = TIPO_STYLES[proyecto.tipo]
                  const accent = CARD_ACCENT[proyecto.tipo]
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
                      <div
                        className="group relative flex flex-col bg-white ring-2 ring-transparent transition-all duration-200 hover:shadow-[4px_4px_0_#111] hover:ring-[#023047]"
                        style={{ borderTop: `3px solid ${accent}` }}
                      >
                        {isEditMode && currentUser?.rol === 'ADMIN' && (
                          <button
                            type="button"
                            onClick={async () => {
                              if (
                                !window.confirm(
                                  `¿Eliminar "${proyecto.nombre}"? Esta acción no se puede deshacer.`
                                )
                              )
                                return
                              await deleteProyecto(proyecto.id)
                            }}
                            className="absolute top-2 right-2 z-10 flex size-7 items-center justify-center bg-white/90 text-zinc-500 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:bg-[#E63946] hover:text-white"
                            title="Eliminar proyecto"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
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
                            onClick={() => handleExpandClick(proyecto)}
                            className="w-full border-2 border-zinc-200 py-2 text-[0.6rem] font-bold tracking-widest text-zinc-600 uppercase transition hover:border-[#023047] hover:text-[#023047]"
                          >
                            {!currentUser ? viewMoreGuestText : viewMoreText}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      {/* Proyecto expandido modal */}
      <ProyectoExpandido
        proyecto={selectedProyecto}
        open={!!selectedProyecto}
        onClose={() => setSelectedProyecto(null)}
        contactTermsText={contactTermsText}
      />
    </section>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import {
  Trash2,
  ArrowLeft,
  Search,
  Pencil,
  X,
  AlertTriangle,
  Loader2,
  Star,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'

interface ProyectoAdmin {
  id: string
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
  tipo: string
  destacado: boolean
  fechaLimite: string
  createdAt: string
  usuario: {
    id: string
    username: string
    email: string
    firstName: string
    lastName: string
  } | null
}

interface CreadorInfo {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  perfil: { avatar: string | null } | null
}

type TabType = 'info' | 'creador'

export default function AdminProyectosPage() {
  const [proyectos, setProyectos] = useState<ProyectoAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [selectedProyecto, setSelectedProyecto] = useState<ProyectoAdmin | null>(null)
  const [tab, setTab] = useState<TabType>('info')
  const [creador, setCreador] = useState<CreadorInfo | null>(null)
  const [creadorLoading, setCreadorLoading] = useState(false)
  const [deleteStep, setDeleteStep] = useState<'idle' | 'warning' | 'countdown' | 'deleting'>(
    'idle'
  )
  const [countdown, setCountdown] = useState(10)
  const [deleteError, setDeleteError] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [editForm, setEditForm] = useState({
    nombre: '',
    representante: '',
    descripcion: '',
    queBuscan: '',
    requisitos: '',
    proceso: '',
    contacto: '',
    disciplinas: '',
    ubicacion: '',
    tipo: 'COMUNIDAD',
    imagen: '',
    fechaLimite: '',
    destacado: false,
  })
  const router = useRouter()
  const countdownRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  async function getToken() {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      router.replace('/admin/login')
      return null
    }
    return session.access_token
  }

  async function loadProyectos() {
    const token = await getToken()
    if (!token) return

    const res = await fetch('/api/proyectos')
    if (!res.ok) return

    const data = await res.json()
    setProyectos(data.proyectos || [])
    setLoading(false)
  }

  useEffect(() => {
    loadProyectos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadCreador(usuarioId: string) {
    setCreadorLoading(true)
    try {
      const token = await getToken()
      const res = await fetch(`/api/usuarios?id=${usuarioId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) {
        const data = await res.json()
        setCreador(data.usuario)
      }
    } catch {
      // silent
    }
    setCreadorLoading(false)
  }

  function openDetail(p: ProyectoAdmin) {
    setSelectedProyecto(p)
    setTab('info')
    setEditing(false)
    setDeleteStep('idle')
    setDeleteError('')
    setSaveError('')
    setCreador(null)
    if (p.usuario) {
      loadCreador(p.usuario.id)
    }
  }

  function closeDetail() {
    setSelectedProyecto(null)
    setEditing(false)
    setDeleteStep('idle')
    setDeleteError('')
    setSaveError('')
    setCreador(null)
    if (countdownRef.current) clearInterval(countdownRef.current)
  }

  function startEdit() {
    if (!selectedProyecto) return
    setEditForm({
      nombre: selectedProyecto.nombre,
      representante: selectedProyecto.representante,
      descripcion: selectedProyecto.descripcion,
      queBuscan: selectedProyecto.queBuscan,
      requisitos: selectedProyecto.requisitos,
      proceso: selectedProyecto.proceso,
      contacto: selectedProyecto.contacto,
      disciplinas: selectedProyecto.disciplinas.join(', '),
      ubicacion: selectedProyecto.ubicacion,
      tipo: selectedProyecto.tipo,
      imagen: selectedProyecto.imagen || '',
      fechaLimite: selectedProyecto.fechaLimite
        ? new Date(selectedProyecto.fechaLimite).toISOString().slice(0, 10)
        : '',
      destacado: selectedProyecto.destacado,
    })
    setEditing(true)
  }

  async function handleSaveEdit() {
    if (!selectedProyecto) return
    setSaving(true)
    setSaveError('')

    const token = await getToken()
    if (!token) {
      setSaving(false)
      return
    }

    const disciplinasArray = editForm.disciplinas
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean)

    const res = await fetch(`/api/proyectos/${selectedProyecto.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: editForm.nombre,
        representante: editForm.representante,
        descripcion: editForm.descripcion,
        queBuscan: editForm.queBuscan,
        requisitos: editForm.requisitos,
        proceso: editForm.proceso,
        contacto: editForm.contacto,
        disciplinas: disciplinasArray,
        ubicacion: editForm.ubicacion,
        tipo: editForm.tipo,
        imagen: editForm.imagen || null,
        fechaLimite: editForm.fechaLimite
          ? new Date(editForm.fechaLimite).toISOString()
          : undefined,
        destacado: editForm.destacado,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      setSaveError(err.error || 'Error al guardar')
      setSaving(false)
      return
    }

    const { proyecto } = await res.json()
    setProyectos((prev) => prev.map((p) => (p.id === proyecto.id ? proyecto : p)))
    setSelectedProyecto(proyecto)
    setEditing(false)
    setSaving(false)
  }

  function initDelete() {
    setDeleteStep('warning')
    setDeleteError('')
  }

  function startCountdown() {
    setDeleteStep('countdown')
    setCountdown(10)
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  async function confirmDelete() {
    if (!selectedProyecto) return
    setDeleteStep('deleting')
    setDeleteError('')

    const token = await getToken()
    if (!token) {
      setDeleteStep('warning')
      return
    }

    const res = await fetch(`/api/proyectos/${selectedProyecto.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const err = await res.json()
      setDeleteError(err.error || 'Error al eliminar')
      setDeleteStep('warning')
      return
    }

    setProyectos((prev) => prev.filter((p) => p.id !== selectedProyecto.id))
    closeDetail()
  }

  const filteredProyectos = proyectos.filter((p) => {
    if (search) {
      const q = search.toLowerCase()
      if (!p.nombre.toLowerCase().includes(q)) return false
    }
    if (filterTipo && p.tipo !== filterTipo) return false
    return true
  })

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F0F8FF]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#023047] border-t-transparent" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F0F8FF]">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex size-9 items-center justify-center border-2 border-zinc-200 text-zinc-600 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#023047] hover:text-[#023047] hover:shadow-[3px_3px_0_#353535]"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[#353535]">Proyectos</h1>
              <p className="text-[10px] text-zinc-500">{proyectos.length} proyectos registrados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Search & Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full border-2 border-zinc-200 bg-white py-2 pr-3 pl-9 text-sm text-[#353535] placeholder:text-zinc-400 focus:border-[#023047] focus:outline-none"
            />
          </div>

          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="border-2 border-zinc-200 bg-white px-3 py-2 text-xs font-bold tracking-wider text-[#353535] uppercase focus:border-[#023047] focus:outline-none"
          >
            <option value="">Todos los tipos</option>
            <option value="OPEAR_PRIMA">Ópera Prima</option>
            <option value="COMUNIDAD">Comunidad</option>
            <option value="ENTIDAD">Entidad</option>
          </select>

          <span className="text-xs text-zinc-400">
            {filteredProyectos.length} de {proyectos.length}
          </span>
        </div>

        {/* Proyectos List */}
        <div className="space-y-3">
          {filteredProyectos.map((p) => (
            <div
              key={p.id}
              className="flex cursor-pointer items-center justify-between border-2 border-zinc-200 bg-white px-6 py-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#353535]"
              onClick={() => openDetail(p)}
            >
              <div className="flex min-w-0 items-center gap-4">
                {p.imagen ? (
                  <div className="size-12 shrink-0 overflow-hidden border-2 border-zinc-200 bg-zinc-100">
                    <img src={p.imagen} alt="" className="size-full object-cover" />
                  </div>
                ) : (
                  <div className="flex size-12 shrink-0 items-center justify-center border-2 border-zinc-200 bg-zinc-100 text-xs font-bold text-zinc-300 uppercase">
                    ?
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-[#353535]">{p.nombre}</p>
                    {p.destacado && (
                      <Star size={12} className="shrink-0 fill-[#FFB703] text-[#FFB703]" />
                    )}
                  </div>
                  <p className="truncate text-[10px] text-zinc-400">
                    {p.representante} &middot; {p.ubicacion} &middot; {formatDate(p.fechaLimite)}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`rounded px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                    p.tipo === 'OPEAR_PRIMA'
                      ? 'bg-[#023047] text-white'
                      : p.tipo === 'COMUNIDAD'
                        ? 'bg-[#8ECAE6] text-[#023047]'
                        : 'bg-[#FB6F92] text-white'
                  }`}
                >
                  {p.tipo === 'OPEAR_PRIMA'
                    ? 'Ópera Prima'
                    : p.tipo === 'COMUNIDAD'
                      ? 'Comunidad'
                      : 'Entidad'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openDetail(p)
                  }}
                  className="flex size-8 items-center justify-center border-2 border-zinc-200 text-zinc-400 transition-colors hover:border-[#023047] hover:text-[#023047]"
                  aria-label="Ver detalle"
                >
                  <Pencil size={14} />
                </button>
              </div>
            </div>
          ))}
          {filteredProyectos.length === 0 && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 bg-white px-6 py-16">
              <p className="text-sm text-zinc-400">No se encontraron proyectos</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedProyecto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeDetail}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col border-2 border-zinc-200 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-[#353535]">{selectedProyecto.nombre}</h2>
                {selectedProyecto.destacado && (
                  <Star size={14} className="fill-[#FFB703] text-[#FFB703]" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTab('info')
                    setEditing(!editing)
                    if (!editing) startEdit()
                  }}
                  className={`flex items-center gap-1.5 border-2 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                    editing
                      ? 'border-zinc-200 text-zinc-400 hover:border-[#023047] hover:text-[#023047]'
                      : 'border-[#023047] bg-[#023047] text-white hover:bg-white hover:text-[#023047]'
                  }`}
                >
                  <Pencil size={12} /> {editing ? 'Cancelar' : 'Editar'}
                </button>
                <button
                  onClick={closeDetail}
                  className="flex size-8 items-center justify-center border-2 border-zinc-200 text-zinc-400 transition-colors hover:border-[#E63946] hover:text-[#E63946]"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-200">
              <button
                onClick={() => setTab('info')}
                className={`px-6 py-3 text-[10px] font-bold tracking-widest uppercase transition-colors ${
                  tab === 'info'
                    ? 'border-b-2 border-[#023047] text-[#023047]'
                    : 'text-zinc-400 hover:text-[#023047]'
                }`}
              >
                Info / Editar
              </button>
              <button
                onClick={() => setTab('creador')}
                className={`px-6 py-3 text-[10px] font-bold tracking-widest uppercase transition-colors ${
                  tab === 'creador'
                    ? 'border-b-2 border-[#023047] text-[#023047]'
                    : 'text-zinc-400 hover:text-[#023047]'
                }`}
              >
                Creador
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {tab === 'info' && !editing && (
                <div className="space-y-6">
                  {/* View Mode */}
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Nombre" value={selectedProyecto.nombre} />
                    <Field label="Tipo" value={selectedProyecto.tipo} />
                    <Field label="Representante" value={selectedProyecto.representante} />
                    <Field label="Contacto" value={selectedProyecto.contacto} />
                    <Field label="Ubicación" value={selectedProyecto.ubicacion} />
                    <Field label="Fecha límite" value={formatDate(selectedProyecto.fechaLimite)} />
                    <Field label="Destacado" value={selectedProyecto.destacado ? 'Sí' : 'No'} />
                    {selectedProyecto.imagen && (
                      <div className="col-span-2">
                        <p className="mb-1 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                          Imagen
                        </p>
                        <img
                          src={selectedProyecto.imagen}
                          alt=""
                          className="max-h-40 rounded border border-zinc-200"
                        />
                      </div>
                    )}
                  </div>
                  <TextField label="Descripción" value={selectedProyecto.descripcion} />
                  <TextField label="Qué buscan" value={selectedProyecto.queBuscan} />
                  <TextField label="Requisitos" value={selectedProyecto.requisitos} />
                  <TextField label="Proceso" value={selectedProyecto.proceso} />
                  {selectedProyecto.disciplinas.length > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        Disciplinas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProyecto.disciplinas.map((d) => (
                          <span
                            key={d}
                            className="rounded border border-[#8ECAE6] px-2 py-0.5 text-[10px] font-bold text-[#023047] uppercase"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delete Section */}
                  <div className="border-t border-zinc-200 pt-6">
                    {deleteStep === 'idle' && (
                      <button
                        onClick={initDelete}
                        className="flex items-center gap-2 border-2 border-[#E63946] px-4 py-2 text-[10px] font-bold tracking-widest text-[#E63946] uppercase transition-all hover:bg-[#E63946] hover:text-white"
                      >
                        <Trash2 size={14} /> Eliminar proyecto
                      </button>
                    )}

                    {deleteStep === 'warning' && (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 border-2 border-[#E63946] bg-[#E63946]/5 px-4 py-3">
                          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#E63946]" />
                          <div>
                            <p className="text-xs font-bold text-[#E63946]">
                              ¿Estás seguro de eliminar este proyecto?
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                              Esta acción no se puede deshacer. El proyecto se eliminará
                              permanentemente.
                            </p>
                          </div>
                        </div>
                        {deleteError && (
                          <p className="text-xs font-bold text-[#E63946]">{deleteError}</p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={startCountdown}
                            className="border-2 border-[#E63946] px-4 py-2 text-[10px] font-bold tracking-widest text-[#E63946] uppercase transition-all hover:bg-[#E63946] hover:text-white"
                          >
                            Entendido, quiero eliminarlo
                          </button>
                          <button
                            onClick={() => setDeleteStep('idle')}
                            className="border-2 border-zinc-200 px-4 py-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-all hover:border-[#023047] hover:text-[#023047]"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    {deleteStep === 'countdown' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 border-2 border-[#E63946] bg-[#E63946]/5 px-4 py-3">
                          <AlertTriangle size={16} className="shrink-0 text-[#E63946]" />
                          <p className="text-xs text-zinc-600">
                            Eliminación en{' '}
                            <span className="font-bold text-[#E63946]">{countdown}</span>{' '}
                            segundos...
                          </p>
                        </div>
                        <button
                          disabled={countdown > 0}
                          onClick={confirmDelete}
                          className={`flex items-center gap-2 border-2 px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                            countdown === 0
                              ? 'border-[#E63946] bg-[#E63946] text-white hover:bg-white hover:text-[#E63946]'
                              : 'cursor-not-allowed border-zinc-200 text-zinc-300'
                          }`}
                        >
                          {countdown === 0 ? (
                            <>Sí, eliminar definitivamente</>
                          ) : (
                            <>Espera {countdown}s...</>
                          )}
                        </button>
                      </div>
                    )}

                    {deleteStep === 'deleting' && (
                      <div className="flex items-center gap-3 border-2 border-[#E63946] bg-[#E63946]/5 px-4 py-3">
                        <Loader2 size={16} className="animate-spin text-[#E63946]" />
                        <p className="text-xs font-bold text-[#E63946]">Eliminando proyecto...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab === 'info' && editing && (
                <div className="space-y-4">
                  {saveError && (
                    <div className="border-2 border-[#E63946] bg-[#E63946]/5 px-4 py-3">
                      <p className="text-xs font-bold text-[#E63946]">{saveError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Nombre"
                      value={editForm.nombre}
                      onChange={(v) => setEditForm((prev) => ({ ...prev, nombre: v }))}
                    />
                    <Select
                      label="Tipo"
                      value={editForm.tipo}
                      onChange={(v) => setEditForm((prev) => ({ ...prev, tipo: v }))}
                      options={[
                        { value: 'OPEAR_PRIMA', label: 'Ópera Prima' },
                        { value: 'COMUNIDAD', label: 'Comunidad' },
                        { value: 'ENTIDAD', label: 'Entidad' },
                      ]}
                    />
                    <Input
                      label="Representante"
                      value={editForm.representante}
                      onChange={(v) => setEditForm((prev) => ({ ...prev, representante: v }))}
                    />
                    <Input
                      label="Contacto"
                      value={editForm.contacto}
                      onChange={(v) => setEditForm((prev) => ({ ...prev, contacto: v }))}
                    />
                    <Input
                      label="Ubicación"
                      value={editForm.ubicacion}
                      onChange={(v) => setEditForm((prev) => ({ ...prev, ubicacion: v }))}
                    />
                    <Input
                      label="Fecha límite"
                      type="date"
                      value={editForm.fechaLimite}
                      onChange={(v) => setEditForm((prev) => ({ ...prev, fechaLimite: v }))}
                    />
                  </div>
                  <Textarea
                    label="Descripción"
                    value={editForm.descripcion}
                    onChange={(v) => setEditForm((prev) => ({ ...prev, descripcion: v }))}
                    rows={3}
                  />
                  <Textarea
                    label="Qué buscan"
                    value={editForm.queBuscan}
                    onChange={(v) => setEditForm((prev) => ({ ...prev, queBuscan: v }))}
                    rows={3}
                  />
                  <Textarea
                    label="Requisitos"
                    value={editForm.requisitos}
                    onChange={(v) => setEditForm((prev) => ({ ...prev, requisitos: v }))}
                    rows={3}
                  />
                  <Textarea
                    label="Proceso"
                    value={editForm.proceso}
                    onChange={(v) => setEditForm((prev) => ({ ...prev, proceso: v }))}
                    rows={3}
                  />
                  <Input
                    label="Disciplinas (separadas por coma)"
                    value={editForm.disciplinas}
                    onChange={(v) => setEditForm((prev) => ({ ...prev, disciplinas: v }))}
                  />
                  <Input
                    label="URL de imagen"
                    value={editForm.imagen}
                    onChange={(v) => setEditForm((prev) => ({ ...prev, imagen: v }))}
                    placeholder="https://..."
                  />

                  <label className="flex cursor-pointer items-center gap-3 border-2 border-zinc-200 px-4 py-3 hover:border-[#023047]">
                    <input
                      type="checkbox"
                      checked={editForm.destacado}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, destacado: e.target.checked }))
                      }
                      className="size-4 accent-[#023047]"
                    />
                    <span className="text-xs font-bold tracking-wider text-[#353535] uppercase">
                      Destacado
                    </span>
                  </label>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="flex items-center gap-2 border-2 border-[#023047] bg-[#023047] px-6 py-2.5 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:bg-white hover:text-[#023047] disabled:opacity-50"
                    >
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="border-2 border-zinc-200 px-6 py-2.5 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-all hover:border-[#023047] hover:text-[#023047]"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {tab === 'creador' && (
                <div className="space-y-4">
                  {creadorLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={20} className="animate-spin text-zinc-300" />
                    </div>
                  ) : selectedProyecto.usuario ? (
                    creador ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="size-16 overflow-hidden border-2 border-zinc-200 bg-zinc-100">
                            {creador.perfil?.avatar ? (
                              <img
                                src={creador.perfil.avatar}
                                alt=""
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-xs font-bold text-zinc-300 uppercase">
                                ?
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#353535]">
                              {creador.firstName} {creador.lastName}
                            </p>
                            <p className="text-xs text-zinc-500">@{creador.username}</p>
                            <p className="text-xs text-zinc-400">{creador.email}</p>
                          </div>
                        </div>
                        <a
                          href={`/perfil/${creador.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 border-2 border-[#023047] px-4 py-2 text-[10px] font-bold tracking-widest text-[#023047] uppercase transition-all hover:bg-[#023047] hover:text-white"
                        >
                          <ExternalLink size={12} /> Ver perfil público
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-xs text-zinc-400">
                          No se pudo cargar la información del usuario
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-xs text-zinc-400">Proyecto sin usuario asignado</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

/* ── Helpers ── */

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-0.5 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
        {label}
      </p>
      <p className="text-xs text-[#353535]">{value}</p>
    </div>
  )
}

function TextField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-bold tracking-widest text-zinc-400 uppercase">{label}</p>
      <p className="text-xs leading-relaxed whitespace-pre-wrap text-[#353535]">{value}</p>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-2 border-zinc-200 px-3 py-2 text-xs text-[#353535] placeholder:text-zinc-300 focus:border-[#023047] focus:outline-none"
      />
    </div>
  )
}

function Textarea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full resize-none border-2 border-zinc-200 px-3 py-2 text-xs text-[#353535] placeholder:text-zinc-300 focus:border-[#023047] focus:outline-none"
      />
    </div>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 border-zinc-200 px-3 py-2 text-xs text-[#353535] focus:border-[#023047] focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

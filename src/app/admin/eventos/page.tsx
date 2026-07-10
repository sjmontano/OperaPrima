'use client'

import { startTransition, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import {
  Trash2,
  ArrowLeft,
  Search,
  Pencil,
  X,
  Ticket,
  AlertTriangle,
  Loader2,
  Eye,
  UserCheck,
  Users,
} from 'lucide-react'
import Link from 'next/link'

interface EventoAdmin {
  id: string
  titulo: string
  descripcion: string
  tipo: string
  categoria: string
  fecha: string
  ubicacion: string
  precio: number
  cuposDisponibles: number
  cuposTotales: number
  imagen: string | null
  urlPago: string | null
  disciplinas: string[]
  agotado: boolean
  usuario: { id: string; username: string; email: string; rol: string }
}

interface EntradaEntry {
  id: string
  usuarioId: string
  createdAt: string
  usada: boolean
  qrCode: string | null
  usuario: { id: string; email: string; firstName: string; lastName: string; username: string }
}

type TabType = 'info' | 'entradas'

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<EventoAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [selectedEvento, setSelectedEvento] = useState<EventoAdmin | null>(null)
  const [tab, setTab] = useState<TabType>('info')
  const [entradas, setEntradas] = useState<EntradaEntry[]>([])
  const [entradasLoading, setEntradasLoading] = useState(false)
  const [deleteStep, setDeleteStep] = useState<
    'idle' | 'warning' | 'countdown' | 'backingup' | 'deleting'
  >('idle')
  const [countdown, setCountdown] = useState(10)
  const [deleteEntriesCount, setDeleteEntriesCount] = useState(0)
  const [deleteError, setDeleteError] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [editForm, setEditForm] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    tipo: '',
    disciplinas: '',
    fecha: '',
    ubicacion: '',
    precio: '',
    imagen: '',
    urlPago: '',
    cuposTotales: 0,
    cuposDisponibles: 0,
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

  async function loadEventos() {
    const token = await getToken()
    if (!token) return
    const res = await fetch('/api/eventos', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return
    const data = await res.json()
    startTransition(() => {
      setEventos(data.eventos)
      setLoading(false)
    })
  }

  useEffect(() => {
    loadEventos()
  }, [])

  async function loadEntradas(eventoId: string) {
    setEntradasLoading(true)
    const token = await getToken()
    if (!token) {
      setEntradasLoading(false)
      return
    }
    const res = await fetch(`/api/eventos/${eventoId}/entradas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      setEntradas(data.entradas)
    }
    setEntradasLoading(false)
  }

  function openDetail(evento: EventoAdmin) {
    setSelectedEvento(evento)
    setTab('info')
    setDeleteStep('idle')
    setEditing(false)
    setSaveError('')
    setDeleteError('')
    setEntradas([])
    if (countdownRef.current) clearInterval(countdownRef.current)
    loadEntradas(evento.id)
  }

  function closeDetail() {
    setSelectedEvento(null)
    if (countdownRef.current) clearInterval(countdownRef.current)
    setDeleteStep('idle')
    setEditing(false)
  }

  function startEdit() {
    if (!selectedEvento) return
    setEditForm({
      titulo: selectedEvento.titulo,
      descripcion: selectedEvento.descripcion,
      categoria: selectedEvento.categoria,
      tipo: selectedEvento.tipo,
      disciplinas: selectedEvento.disciplinas?.join(', ') || '',
      fecha: selectedEvento.fecha ? new Date(selectedEvento.fecha).toISOString().slice(0, 16) : '',
      ubicacion: selectedEvento.ubicacion,
      precio: String(selectedEvento.precio),
      imagen: selectedEvento.imagen || '',
      urlPago: selectedEvento.urlPago || '',
      cuposTotales: selectedEvento.cuposTotales,
      cuposDisponibles: selectedEvento.cuposDisponibles,
    })
    setEditing(true)
    setSaveError('')
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedEvento) return
    setSaving(true)
    setSaveError('')

    const token = await getToken()
    if (!token) {
      setSaving(false)
      return
    }

    const res = await fetch(`/api/eventos/${selectedEvento.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        titulo: editForm.titulo,
        descripcion: editForm.descripcion,
        categoria: editForm.categoria,
        tipo: editForm.tipo,
        disciplinas: editForm.disciplinas
          .split(',')
          .map((d: string) => d.trim())
          .filter(Boolean),
        fecha: editForm.fecha,
        ubicacion: editForm.ubicacion,
        precio: Number(editForm.precio),
        imagen: editForm.imagen || null,
        urlPago: editForm.urlPago || null,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      setSelectedEvento(data.evento)
      setEditing(false)
      await loadEventos()
    } else {
      const err = await res.json()
      setSaveError(err.error || 'Error al guardar')
    }
    setSaving(false)
  }

  function initDelete() {
    setDeleteStep('warning')
    setDeleteError('')
  }

  function startCountdown(count: number) {
    setDeleteEntriesCount(count)
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
    if (!selectedEvento) return
    setDeleteStep(deleteEntriesCount > 0 ? 'backingup' : 'deleting')
    setDeleteError('')

    const token = await getToken()
    if (!token) {
      setDeleteStep('countdown')
      return
    }

    let url = `/api/eventos/${selectedEvento.id}`
    if (deleteEntriesCount > 0) url += '?force=true&confirm=true'

    const res = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      setEventos((prev) => prev.filter((e) => e.id !== selectedEvento.id))
      closeDetail()
    } else {
      const err = await res.json()
      setDeleteError(err.error || 'Error al eliminar')
      setDeleteStep('idle')
    }
  }

  const filtered = eventos.filter((e) => {
    const matchesSearch =
      e.titulo.toLowerCase().includes(search.toLowerCase()) ||
      e.usuario.username.toLowerCase().includes(search.toLowerCase())
    const matchesTipo = !filterTipo || e.tipo === filterTipo
    return matchesSearch && matchesTipo
  })

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F0F8FF]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#023047] border-t-transparent" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F0F8FF]">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <Link
            href="/admin"
            className="flex size-9 items-center justify-center border-2 border-zinc-200 text-zinc-600 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#023047] hover:text-[#023047] hover:shadow-[3px_3px_0_#353535]"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-[#353535]">Eventos</h1>
            <p className="text-[10px] text-zinc-500">
              {eventos.length} eventos — CRUD completo como administrador
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título o usuario..."
              className="w-full border-2 border-zinc-200 bg-white py-2.5 pr-3 pl-9 text-sm transition-colors outline-none focus:border-[#023047]"
            />
          </div>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="border-2 border-zinc-200 bg-white px-3 py-2.5 text-sm transition-colors outline-none focus:border-[#023047]"
          >
            <option value="">Todos los tipos</option>
            <option value="COMUNIDAD">Comunidad</option>
            <option value="OPEAR_PRIMA">Opera Prima</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="border-2 border-zinc-200 bg-white p-10 text-center">
            <p className="text-sm text-zinc-500">No se encontraron eventos</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((evento) => (
              <div
                key={evento.id}
                onClick={() => openDetail(evento)}
                className="flex cursor-pointer items-center justify-between border-2 border-zinc-200 bg-white px-6 py-4 transition-all hover:border-[#8ECAE6]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="truncate text-sm font-bold text-[#353535]">{evento.titulo}</h3>
                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase ${
                        evento.tipo === 'OPEAR_PRIMA'
                          ? 'border-2 border-[#023047] bg-[#023047] text-white'
                          : 'border-2 border-[#8ECAE6] bg-[#8ECAE6] text-[#353535]'
                      }`}
                    >
                      {evento.tipo === 'OPEAR_PRIMA' ? 'Opera Prima' : 'Comunidad'}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500">
                    <span>Por @{evento.usuario.username}</span>
                    <span>{new Date(evento.fecha).toLocaleDateString('es-CO')}</span>
                    <span>{evento.ubicacion}</span>
                    <span>${evento.precio.toLocaleString('es-CO')}</span>
                    <span>
                      {evento.cuposDisponibles}/{evento.cuposTotales} cupos
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 pl-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openDetail(evento)
                    }}
                    className="flex size-8 items-center justify-center border-2 border-zinc-200 text-zinc-500 transition-all hover:border-[#023047] hover:text-[#023047]"
                    title="Ver detalle"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedEvento && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 pt-10 pb-10">
          <div className="relative w-full max-w-3xl bg-white shadow-2xl">
            {/* header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-bold text-[#353535]">
                  {selectedEvento.titulo}
                </h2>
                <p className="text-[10px] text-zinc-500">
                  Por @{selectedEvento.usuario.username} — ID: {selectedEvento.id.slice(0, 8)}...
                </p>
              </div>
              <div className="flex items-center gap-2 pl-4">
                {!editing && (
                  <button
                    onClick={startEdit}
                    className="flex size-8 items-center justify-center border-2 border-zinc-200 text-zinc-500 transition-all hover:border-[#023047] hover:text-[#023047]"
                    title="Editar evento"
                  >
                    <Pencil size={14} />
                  </button>
                )}
                <button
                  onClick={closeDetail}
                  className="flex size-8 items-center justify-center border-2 border-zinc-200 text-zinc-500 transition-all hover:border-zinc-400 hover:text-zinc-700"
                  title="Cerrar"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* tabs */}
            <div className="flex border-b border-zinc-200 px-6">
              <button
                onClick={() => setTab('info')}
                className={`flex items-center gap-2 px-4 py-3 text-[11px] font-bold tracking-wider uppercase transition-colors ${
                  tab === 'info'
                    ? 'border-b-2 border-[#023047] text-[#023047]'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                <Pencil size={13} />
                Información
              </button>
              <button
                onClick={() => setTab('entradas')}
                className={`flex items-center gap-2 px-4 py-3 text-[11px] font-bold tracking-wider uppercase transition-colors ${
                  tab === 'entradas'
                    ? 'border-b-2 border-[#023047] text-[#023047]'
                    : 'text-zinc-400 hover:text-zinc-700'
                }`}
              >
                <Ticket size={13} />
                Entradas ({entradas.length})
              </button>
            </div>

            {/* body */}
            <div className="px-6 py-5">
              {tab === 'info' &&
                (editing ? (
                  <form onSubmit={handleSaveEdit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                          Título
                        </label>
                        <input
                          type="text"
                          value={editForm.titulo}
                          onChange={(e) => setEditForm((f) => ({ ...f, titulo: e.target.value }))}
                          required
                          className="w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                          Categoría
                        </label>
                        <input
                          type="text"
                          value={editForm.categoria}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, categoria: e.target.value }))
                          }
                          className="w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                          Descripción
                        </label>
                        <textarea
                          value={editForm.descripcion}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, descripcion: e.target.value }))
                          }
                          rows={3}
                          className="w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                          Tipo
                        </label>
                        <select
                          value={editForm.tipo}
                          onChange={(e) => setEditForm((f) => ({ ...f, tipo: e.target.value }))}
                          className="w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
                        >
                          <option value="COMUNIDAD">Comunidad</option>
                          <option value="OPEAR_PRIMA">Opera Prima</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                          Disciplinas (separadas por coma)
                        </label>
                        <input
                          type="text"
                          value={editForm.disciplinas}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, disciplinas: e.target.value }))
                          }
                          className="w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                          Fecha
                        </label>
                        <input
                          type="datetime-local"
                          value={editForm.fecha}
                          onChange={(e) => setEditForm((f) => ({ ...f, fecha: e.target.value }))}
                          required
                          className="w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                          Ubicación
                        </label>
                        <input
                          type="text"
                          value={editForm.ubicacion}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, ubicacion: e.target.value }))
                          }
                          className="w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                          Precio
                        </label>
                        <input
                          type="number"
                          value={editForm.precio}
                          onChange={(e) => setEditForm((f) => ({ ...f, precio: e.target.value }))}
                          className="w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                          URL de pago
                        </label>
                        <input
                          type="text"
                          value={editForm.urlPago}
                          onChange={(e) => setEditForm((f) => ({ ...f, urlPago: e.target.value }))}
                          className="w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="mb-1 block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                          URL de imagen
                        </label>
                        <input
                          type="text"
                          value={editForm.imagen}
                          onChange={(e) => setEditForm((f) => ({ ...f, imagen: e.target.value }))}
                          className="w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
                        />
                      </div>
                    </div>

                    {saveError && (
                      <div className="border-2 border-[#E63946] bg-red-50 px-4 py-2 text-[11px] text-[#E63946]">
                        {saveError}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="border-2 border-zinc-200 px-4 py-2 text-[11px] font-bold tracking-wider text-zinc-600 transition-all hover:border-zinc-400"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 border-2 border-[#023047] bg-[#023047] px-4 py-2 text-[11px] font-bold tracking-wider text-white transition-all hover:bg-transparent hover:text-[#023047]"
                      >
                        {saving && <Loader2 size={13} className="animate-spin" />}
                        {saving ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {/* info display */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                          Título
                        </p>
                        <p className="text-sm text-[#353535]">{selectedEvento.titulo}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                          Categoría
                        </p>
                        <p className="text-sm text-[#353535]">{selectedEvento.categoria || '—'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                          Descripción
                        </p>
                        <p className="text-sm text-[#353535]">
                          {selectedEvento.descripcion || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                          Tipo
                        </p>
                        <p className="text-sm text-[#353535]">
                          {selectedEvento.tipo === 'OPEAR_PRIMA' ? 'Opera Prima' : 'Comunidad'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                          Disciplinas
                        </p>
                        <p className="text-sm text-[#353535]">
                          {selectedEvento.disciplinas?.join(', ') || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                          Fecha
                        </p>
                        <p className="text-sm text-[#353535]">
                          {new Date(selectedEvento.fecha).toLocaleString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                          Ubicación
                        </p>
                        <p className="text-sm text-[#353535]">{selectedEvento.ubicacion || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                          Precio
                        </p>
                        <p className="text-sm text-[#353535]">
                          ${selectedEvento.precio.toLocaleString('es-CO')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                          Cupos
                        </p>
                        <p className="text-sm text-[#353535]">
                          {selectedEvento.cuposDisponibles} / {selectedEvento.cuposTotales}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                          Creado por
                        </p>
                        <p className="text-sm text-[#353535]">
                          @{selectedEvento.usuario.username} ({selectedEvento.usuario.email})
                        </p>
                      </div>
                      {selectedEvento.urlPago && (
                        <div className="col-span-2">
                          <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                            URL de pago
                          </p>
                          <a
                            href={selectedEvento.urlPago}
                            target="_blank"
                            className="text-sm text-[#8ECAE6] underline"
                          >
                            {selectedEvento.urlPago}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* delete section */}
                    <div className="border-t border-zinc-200 pt-5">
                      {deleteStep === 'idle' && (
                        <button
                          onClick={initDelete}
                          className="flex items-center gap-2 border-2 border-[#E63946] px-4 py-2 text-[11px] font-bold tracking-wider text-[#E63946] transition-all hover:bg-[#E63946] hover:text-white"
                        >
                          <Trash2 size={13} />
                          Eliminar evento
                        </button>
                      )}

                      {deleteStep === 'warning' && entradas.length > 0 && (
                        <div className="space-y-4 border-2 border-amber-400 bg-amber-50 p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-500" />
                            <div>
                              <p className="text-sm font-bold text-amber-800">
                                Este evento tiene {entradas.length} entrada(s) registrada(s)
                              </p>
                              <p className="mt-1 text-[11px] text-amber-700">
                                Si eliminas este evento,{' '}
                                <strong>todas las entradas se perderán permanentemente</strong>. Se
                                creará una copia de seguridad antes de eliminar.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => startCountdown(entradas.length)}
                              className="border-2 border-amber-500 bg-amber-500 px-4 py-2 text-[11px] font-bold tracking-wider text-white transition-all hover:bg-amber-600"
                            >
                              Entendido, quiero eliminarlo
                            </button>
                            <button
                              onClick={() => setDeleteStep('idle')}
                              className="border-2 border-zinc-200 px-4 py-2 text-[11px] font-bold tracking-wider text-zinc-600"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}

                      {deleteStep === 'warning' && entradas.length === 0 && (
                        <div className="space-y-4 border-2 border-red-400 bg-red-50 p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-500" />
                            <div>
                              <p className="text-sm font-bold text-red-800">
                                ¿Seguro que quieres eliminar este evento?
                              </p>
                              <p className="mt-1 text-[11px] text-red-700">
                                Esta acción no se puede deshacer.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => startCountdown(0)}
                              className="border-2 border-red-500 bg-red-500 px-4 py-2 text-[11px] font-bold tracking-wider text-white transition-all hover:bg-red-600"
                            >
                              Entendido, quiero eliminarlo
                            </button>
                            <button
                              onClick={() => setDeleteStep('idle')}
                              className="border-2 border-zinc-200 px-4 py-2 text-[11px] font-bold tracking-wider text-zinc-600"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}

                      {deleteStep === 'countdown' && (
                        <div className="space-y-4 border-2 border-red-400 bg-red-50 p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-500" />
                            <div>
                              <p className="text-sm font-bold text-red-800">
                                {deleteEntriesCount > 0
                                  ? `Se eliminarán ${deleteEntriesCount} entrada(s) — ¡esto no se puede deshacer!`
                                  : '¿Seguro que quieres eliminar este evento?'}
                              </p>
                              <p className="mt-1 text-[11px] text-red-700">
                                {deleteEntriesCount > 0
                                  ? 'Se hará una copia de seguridad automática antes de eliminar.'
                                  : 'Esta acción no se puede deshacer.'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={confirmDelete}
                              disabled={countdown > 0}
                              className={`flex items-center gap-2 border-2 px-4 py-2 text-[11px] font-bold tracking-wider text-white transition-all ${
                                countdown > 0
                                  ? 'cursor-not-allowed border-zinc-300 bg-zinc-300'
                                  : 'border-[#E63946] bg-[#E63946] hover:bg-red-700'
                              }`}
                            >
                              {countdown > 0 ? (
                                <>Espera {countdown}s...</>
                              ) : (
                                <>Sí, eliminar definitivamente</>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setDeleteStep('idle')
                                if (countdownRef.current) clearInterval(countdownRef.current)
                              }}
                              className="border-2 border-zinc-200 px-4 py-2 text-[11px] font-bold tracking-wider text-zinc-600"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}

                      {(deleteStep === 'backingup' || deleteStep === 'deleting') && (
                        <div className="flex items-center gap-3 border-2 border-[#023047] bg-blue-50 p-4">
                          <Loader2 size={20} className="animate-spin text-[#023047]" />
                          <div>
                            <p className="text-sm font-bold text-[#023047]">
                              {deleteStep === 'backingup'
                                ? 'Creando copia de seguridad...'
                                : 'Eliminando evento...'}
                            </p>
                          </div>
                        </div>
                      )}

                      {deleteError && (
                        <div className="mt-3 border-2 border-[#E63946] bg-red-50 px-4 py-2 text-[11px] text-[#E63946]">
                          {deleteError}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              {tab === 'entradas' && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                      <Users size={13} className="mr-1.5 inline" />
                      {entradas.length} entrada(s)
                    </h3>
                  </div>
                  {entradasLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 size={20} className="animate-spin text-[#023047]" />
                    </div>
                  ) : entradas.length === 0 ? (
                    <div className="border-2 border-zinc-200 p-8 text-center">
                      <Ticket size={24} className="mx-auto mb-2 text-zinc-300" />
                      <p className="text-sm text-zinc-500">
                        No hay entradas registradas para este evento
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b-2 border-zinc-200 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                            <th className="px-3 py-2">#</th>
                            <th className="px-3 py-2">Usuario</th>
                            <th className="px-3 py-2">Email</th>
                            <th className="px-3 py-2">Fecha de compra</th>
                            <th className="px-3 py-2">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entradas.map((entry, i) => (
                            <tr
                              key={entry.id}
                              className="border-b border-zinc-100 text-[11px] text-zinc-700 hover:bg-zinc-50"
                            >
                              <td className="px-3 py-2.5 font-mono text-[10px] text-zinc-400">
                                {i + 1}
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-2">
                                  <UserCheck size={12} className="text-zinc-400" />
                                  <span className="font-medium">@{entry.usuario.username}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2.5 text-zinc-500">{entry.usuario.email}</td>
                              <td className="px-3 py-2.5">
                                {new Date(entry.createdAt).toLocaleString('es-CO')}
                              </td>
                              <td className="px-3 py-2.5">
                                <span
                                  className={`inline-block px-2 py-0.5 text-[9px] font-bold tracking-wider ${
                                    entry.usada
                                      ? 'bg-zinc-100 text-zinc-500'
                                      : 'bg-green-100 text-green-700'
                                  }`}
                                >
                                  {entry.usada ? 'Usada' : 'Activa'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import { Trash2, ArrowLeft, Search } from 'lucide-react'
import Link from 'next/link'

interface EventoAdmin {
  id: string
  titulo: string
  tipo: string
  categoria: string
  fecha: string
  ubicacion: string
  precio: number
  cuposDisponibles: number
  cuposTotales: number
  usuario: { id: string; username: string; email: string; rol: string }
}

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<EventoAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const router = useRouter()

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

  useEffect(() => {
    async function init() {
      const token = await getToken()
      if (!token) return

      const res = await fetch('/api/eventos', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setEventos(data.eventos)
      setLoading(false)
    }
    init()
  }, [])

  async function handleDelete(id: string, titulo: string) {
    if (!confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)) return

    const token = await getToken()
    if (!token) return

    const res = await fetch(`/api/eventos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      setEventos((prev) => prev.filter((e) => e.id !== id))
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
          <div className="space-y-3">
            {filtered.map((evento) => (
              <div
                key={evento.id}
                className="flex items-center justify-between border-2 border-zinc-200 bg-white px-6 py-4 transition-all hover:border-zinc-300"
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
                    onClick={() => handleDelete(evento.id, evento.titulo)}
                    className="flex size-8 items-center justify-center border-2 border-zinc-200 text-zinc-500 transition-all hover:border-[#E63946] hover:text-[#E63946]"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

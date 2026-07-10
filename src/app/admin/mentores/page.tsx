'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import { Search, Pencil, Trash2, Eye, EyeOff, Loader2, Users } from 'lucide-react'
import {
  MentorEditModal,
  type MentorDB,
  type MentorFormData,
} from '@/components/mentorias/MentorEditModal'

interface AdminUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  rol: string
}

export default function AdminMentores() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [mentores, setMentores] = useState<MentorDB[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingMentor, setEditingMentor] = useState<MentorDB | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const router = useRouter()
  const searchRef = useRef<HTMLInputElement>(null)

  async function loadMentores(token: string) {
    const res = await fetch('/api/mentores?admin=true', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      setMentores(data.mentores)
    }
  }

  async function reloadMentores() {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.access_token) {
      await loadMentores(session.access_token)
    }
  }

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/admin/login')
        return
      }

      const meRes = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!meRes.ok) {
        router.replace('/admin/login')
        return
      }
      const meData = await meRes.json()
      if (meData.usuario?.rol !== 'ADMIN') {
        router.replace('/')
        return
      }
      setUser(meData.usuario)

      await loadMentores(session.access_token)
      setLoading(false)
    }
    init()
  }, [router])

  async function getToken() {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token
  }

  function openCreate() {
    setEditingMentor(null)
    setShowModal(true)
  }

  function openEdit(mentor: MentorDB) {
    setEditingMentor(mentor)
    setShowModal(true)
  }

  async function handleSave(data: MentorFormData) {
    const token = await getToken()
    if (!token) return

    if (editingMentor) {
      const res = await fetch(`/api/mentores/${editingMentor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Error al actualizar')
    } else {
      const res = await fetch('/api/mentores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Error al crear')
    }
    await reloadMentores()
  }

  async function toggleActive(mentor: MentorDB) {
    const token = await getToken()
    if (!token) return
    await fetch(`/api/mentores/${mentor.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ active: !mentor.active }),
    })
    await reloadMentores()
  }

  async function handleDelete(id: string) {
    const token = await getToken()
    if (!token) return
    const res = await fetch(`/api/mentores/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      setMentores((prev) => prev.filter((m) => m.id !== id))
      setDeleteConfirm(null)
    }
  }

  const filtered = mentores.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F0F8FF]">
        <Loader2 size={24} className="animate-spin text-[#023047]" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F0F8FF]">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center border-2 border-[#023047] bg-[#023047]">
              <Users size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[#353535]">Mentores</h1>
              <p className="text-[10px] text-zinc-500">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin')}
              className="border-2 border-zinc-200 px-3 py-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition hover:border-[#023047] hover:text-[#023047]"
            >
              Volver al panel
            </button>
            <button
              onClick={openCreate}
              className="border-2 border-[#023047] bg-[#023047] px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase transition hover:bg-[#023047]/90"
            >
              + Nuevo mentor
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute top-1/2 left-4 -translate-y-1/2 text-zinc-400" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar mentores..."
              className="w-full border-2 border-zinc-200 bg-white py-3 pr-4 pl-10 text-sm focus:border-[#023047] focus:outline-none"
            />
          </div>
          <p className="text-xs text-zinc-500">
            {filtered.length} de {mentores.length}
          </p>
        </div>

        {filtered.length === 0 && (
          <div className="border-2 border-zinc-200 bg-white p-12 text-center">
            <Users size={32} className="mx-auto mb-3 text-zinc-300" />
            <p className="text-sm font-bold text-zinc-500">
              {search ? 'No se encontraron mentores' : 'No hay mentores aún'}
            </p>
            {!search && (
              <button
                onClick={openCreate}
                className="mt-4 border-2 border-[#023047] px-4 py-2 text-xs font-bold tracking-widest text-[#023047] uppercase transition hover:bg-[#023047] hover:text-white"
              >
                Crear primer mentor
              </button>
            )}
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((mentor) => (
            <div
              key={mentor.id}
              className="flex items-center gap-4 border-2 border-zinc-200 bg-white p-4 transition hover:border-zinc-300"
            >
              {/* Avatar */}
              <div className="size-14 shrink-0 overflow-hidden border-2 border-zinc-200">
                {mentor.galleryImages && mentor.galleryImages.length > 0 ? (
                  <img
                    src={mentor.galleryImages[0].url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : mentor.usuario?.perfil?.avatar ? (
                  <img
                    src={mentor.usuario.perfil.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-lg font-bold text-zinc-400">
                    {mentor.name[0]}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#353535]">{mentor.name}</h3>
                  <span className="rounded border border-zinc-200 px-2 py-0.5 text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                    Ord. {mentor.orden}
                  </span>
                  {mentor.usuarioId && (
                    <span className="rounded border border-[#8ECAE6] px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#023047] uppercase">
                      Vinculado
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-zinc-500">{mentor.title}</p>
                <p className="text-xs text-zinc-400">{mentor.location}</p>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => toggleActive(mentor)}
                  className={`border-2 px-3 py-2 transition ${
                    mentor.active
                      ? 'border-zinc-200 text-zinc-400 hover:border-green-500 hover:text-green-500'
                      : 'border-zinc-200 text-zinc-300 hover:border-green-500 hover:text-green-500'
                  }`}
                  title={mentor.active ? 'Ocultar' : 'Mostrar'}
                >
                  {mentor.active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => openEdit(mentor)}
                  className="border-2 border-zinc-200 px-3 py-2 text-zinc-500 transition hover:border-[#023047] hover:text-[#023047]"
                >
                  <Pencil size={14} />
                </button>
                {deleteConfirm === mentor.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(mentor.id)}
                      className="border-2 border-[#E63946] bg-[#E63946] px-3 py-2 text-[10px] font-bold text-white transition hover:bg-[#E63946]/90"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="border-2 border-zinc-200 px-3 py-2 text-[10px] font-bold text-zinc-500 transition hover:border-zinc-400"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(mentor.id)}
                    className="border-2 border-zinc-200 px-3 py-2 text-zinc-400 transition hover:border-[#E63946] hover:text-[#E63946]"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <MentorEditModal
        open={showModal}
        mentor={editingMentor}
        onClose={() => {
          setShowModal(false)
          setEditingMentor(null)
        }}
        onSave={handleSave}
      />
    </main>
  )
}

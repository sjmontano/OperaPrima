'use client'

import { createClient } from '@/lib/supabaseClient'
import { ArrowLeft, Trash2, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AdminTestimonial {
  id: string
  text: string
  active: boolean
  createdAt: string
  usuario: {
    username: string
    firstName: string
    lastName: string
    perfil: { artisticName?: string; avatar?: string } | null
  }
}

export default function AdminTestimoniosPage() {
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [filter, setFilter] = useState<'todos' | 'activos' | 'inactivos'>('todos')
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function init() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }

      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json()
      if (!data.usuario || data.usuario.rol !== 'ADMIN') {
        router.push('/admin/login')
        return
      }

      if (cancelled) return
      setAuthorized(true)

      const res2 = await fetch('/api/testimonios/admin', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data2 = await res2.json()
      if (cancelled) return
      if (data2.testimonials) setTestimonials(data2.testimonials)
      setLoading(false)
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  async function toggleActive(id: string, current: boolean) {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return

    const res = await fetch(`/api/testimonios/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ active: !current }),
    })

    if (res.ok) {
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, active: !current } : t)))
    }
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return

    const res = await fetch(`/api/testimonios/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })

    if (res.ok) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
      setDeleteConfirm(null)
    }
  }

  if (!authorized) return null

  const filtered = testimonials.filter((t) => {
    if (filter === 'activos') return t.active
    if (filter === 'inactivos') return !t.active
    return true
  })

  return (
    <div className="min-h-screen bg-[#F0F8FF] p-6 font-[family-name:var(--font-poppins)]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-1 text-xs font-bold tracking-widest text-zinc-500 uppercase transition-colors hover:text-[#023047]"
          >
            <ArrowLeft size={14} />
            Volver
          </Link>
          <h1 className="text-lg font-black tracking-tight text-[#023047]">Testimonios</h1>
        </div>

        <div className="mb-6 flex gap-2">
          {(['todos', 'activos', 'inactivos'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`cursor-pointer border-2 px-3 py-1.5 text-[0.55rem] font-bold tracking-widest uppercase transition-all ${
                filter === f
                  ? 'border-[#023047] bg-[#023047] text-[#F0F8FF]'
                  : 'border-zinc-300 text-zinc-500 hover:border-zinc-500'
              }`}
            >
              {f === 'todos' ? 'Todos' : f === 'activos' ? 'Activos' : 'Inactivos'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#023047] border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            No hay testimonios que coincidan con el filtro.
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="flex items-start gap-4 border-2 border-zinc-200 bg-white p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-bold text-[#023047]">
                      {t.usuario.perfil?.artisticName ||
                        `${t.usuario.firstName} ${t.usuario.lastName}`}
                    </span>
                    <span className="text-[0.55rem] text-zinc-400">@{t.usuario.username}</span>
                    <span
                      className={`ml-auto text-[0.5rem] font-bold tracking-widest uppercase ${t.active ? 'text-green-600' : 'text-red-500'}`}
                    >
                      {t.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-600">&ldquo;{t.text}&rdquo;</p>
                  <p className="mt-1 text-[0.5rem] text-zinc-400">
                    {new Date(t.createdAt).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => toggleActive(t.id, t.active)}
                    className="cursor-pointer border-2 border-zinc-200 p-2 transition-colors hover:border-[#023047]"
                    title={t.active ? 'Desactivar' : 'Activar'}
                  >
                    {t.active ? (
                      <XCircle size={14} className="text-red-400" />
                    ) : (
                      <CheckCircle size={14} className="text-green-500" />
                    )}
                  </button>
                  {deleteConfirm === t.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="cursor-pointer border-2 border-red-500 bg-red-50 px-2 py-1 text-[0.5rem] font-bold text-red-600 uppercase"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="cursor-pointer border-2 border-zinc-200 px-2 py-1 text-[0.5rem] font-bold text-zinc-500 uppercase"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(t.id)}
                      className="cursor-pointer border-2 border-zinc-200 p-2 transition-colors hover:border-red-400"
                      title="Eliminar"
                    >
                      <Trash2 size={14} className="text-zinc-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

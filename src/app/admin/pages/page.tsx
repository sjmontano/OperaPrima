'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'

interface PageEntry {
  id: string
  slug: string
  title: string
  published: boolean
  updatedAt: string
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageEntry[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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

      const res = await fetch('/api/pages', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setPages(data.pages)
      setLoading(false)
    }
    init()
  }, [])

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
            <h1 className="text-sm font-bold tracking-tight text-[#353535]">Páginas</h1>
            <p className="text-[10px] text-zinc-500">
              {pages.length} páginas — editar contenido estático
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {pages.length === 0 ? (
          <div className="border-2 border-zinc-200 bg-white p-10 text-center">
            <FileText size={32} className="mx-auto mb-3 text-zinc-300" />
            <p className="text-sm text-zinc-500">No hay páginas. Ejecuta el seed para crearlas.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/admin/pages/${page.slug}`}
                className="group border-2 border-zinc-200 bg-white p-6 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#023047] hover:shadow-[4px_4px_0_#353535]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center border-2 border-zinc-200 bg-zinc-50 transition-colors group-hover:border-[#023047] group-hover:bg-[#023047]">
                    <FileText
                      size={18}
                      className="text-zinc-500 transition-colors group-hover:text-white"
                    />
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase ${
                      page.published
                        ? 'border-2 border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-2 border-zinc-200 bg-zinc-50 text-zinc-400'
                    }`}
                  >
                    {page.published ? 'Publicado' : 'Borrador'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#353535]">{page.title}</h3>
                <p className="mt-1 text-[11px] text-zinc-500">/{page.slug}</p>
                <p className="mt-2 text-[10px] text-zinc-400">
                  Actualizado: {new Date(page.updatedAt).toLocaleDateString('es-CO')}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { useEditMode } from '@/context/EditModeContext'
import { MemberGrid, type Member } from '@/components/profile/MemberGrid'
import { createClient } from '@/lib/supabaseClient'
import { useEffect, useRef, useState } from 'react'

const DISCIPLINES = [
  'Música',
  'Artes Visuales',
  'Danza',
  'Teatro',
  'Performance',
  'Circo',
  'Literatura',
  'Multimedia',
]

function mapDiscipline(tags: string[]): string {
  if (tags.length === 0) return 'Artes'
  const tag = tags[0].toLowerCase()
  if (tag.includes('músic') || tag.includes('canto') || tag.includes('compos')) return 'Música'
  if (
    tag.includes('visual') ||
    tag.includes('pintur') ||
    tag.includes('acuarel') ||
    tag.includes('mural') ||
    tag.includes('fotogr') ||
    tag.includes('street')
  )
    return 'Artes Visuales'
  if (tag.includes('danza') || tag.includes('coreogr')) return 'Danza'
  if (tag.includes('teatro') || tag.includes('dramat') || tag.includes('actuac')) return 'Teatro'
  if (tag.includes('perform') || tag.includes('video arte')) return 'Performance'
  if (tag.includes('circo') || tag.includes('acrobac') || tag.includes('malabar')) return 'Circo'
  if (tag.includes('literat') || tag.includes('poesía') || tag.includes('narrat'))
    return 'Literatura'
  if (tag.includes('multimedia') || tag.includes('instalac')) return 'Multimedia'
  return 'Artes'
}

export function ComunidadArtistsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const auth = useAuthModal()
  const { isEditMode } = useEditMode()
  const currentUser = auth.currentUser as { id: string; rol: string } | null

  useEffect(() => {
    fetch('/api/usuarios')
      .then(async (r) => {
        if (!r.ok) throw new Error('Error ' + r.status)
        const data = await r.json()
        const mapped: Member[] = (data.usuarios || []).map(
          (u: {
            id: string
            username: string
            firstName: string
            lastName?: string
            destacado: boolean
            perfil?: {
              artisticName?: string
              avatar?: string
              tags?: string[]
              bio?: string
            } | null
          }) => ({
            id: u.id,
            name: u.perfil?.artisticName || `${u.firstName} ${u.lastName || ''}`.trim(),
            discipline: mapDiscipline(u.perfil?.tags || []),
            location: 'Colombia',
            image:
              u.perfil?.avatar || `https://api.dicebear.com/10.x/lorelei/svg?seed=${u.username}`,
            href: `/perfil/${u.username}`,
            destacado: u.destacado,
          })
        )
        setMembers(mapped)
      })
      .catch((err) => {
        console.error('Error fetching usuarios:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleToggleDestacado = async (id: string, current: boolean) => {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.access_token) return

    const res = await fetch(`/api/usuarios/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ destacado: !current }),
    })

    if (res.ok) {
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, destacado: !current } : m)))
    }
  }

  if (loading) {
    return (
      <section
        ref={sectionRef}
        id="artistas"
        className="bg-background w-full border-b-2 border-zinc-200"
      >
        <div className="mx-[100px] max-lg:mx-[48px] max-md:mx-[18px]">
          <div className="flex justify-center py-24">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#023047] border-t-transparent" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      id="artistas"
      className="bg-background w-full border-b-2 border-zinc-200"
    >
      <div className="mx-[100px] border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
        <div className="px-8 py-14">
          <div className="mb-6">
            <h2 className="text-lg font-bold tracking-wide text-zinc-800 uppercase">
              Descubre a otros miembros
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Artistas de tu comunidad — filtra por disciplina
            </p>
          </div>

          {isEditMode && currentUser?.rol === 'ADMIN' && (
            <div className="mb-6 flex items-center justify-between border-2 border-dashed border-[#E63946] bg-[#E63946]/10 px-6 py-4">
              <p className="text-xs font-bold tracking-widest text-[#E63946] uppercase">
                Modo edición — Miembros
              </p>
            </div>
          )}

          <MemberGrid
            members={members}
            disciplines={DISCIPLINES}
            isEditMode={isEditMode && currentUser?.rol === 'ADMIN'}
            onToggleDestacado={handleToggleDestacado}
          />
        </div>
      </div>
    </section>
  )
}

'use client'

import { MemberGrid, type Member } from '@/components/profile/MemberGrid'
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

export function CommunityMembersSection() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetch('/api/usuarios')
      .then(async (r) => {
        if (!r.ok) throw new Error('Error ' + r.status)
        const data = await r.json()
        const mapped: Member[] = (data.usuarios || []).map(
          (u: {
            username: string
            firstName: string
            lastName?: string
            perfil?: {
              artisticName?: string
              avatar?: string
              tags?: string[]
            } | null
          }) => ({
            name: u.perfil?.artisticName || `${u.firstName} ${u.lastName || ''}`.trim(),
            discipline: mapDiscipline(u.perfil?.tags || []),
            location: 'Colombia',
            image:
              u.perfil?.avatar || `https://api.dicebear.com/10.x/lorelei/svg?seed=${u.username}`,
            href: `/perfil/${u.username}`,
          })
        )
        setMembers(mapped)
      })
      .catch((err) => console.error('Error fetching usuarios:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section ref={sectionRef} className="w-full border-t-2 border-zinc-200 pt-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold tracking-wide text-zinc-800 uppercase">
          Descubre a otros miembros
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Artistas de la comunidad — filtra por disciplina
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#023047] border-t-transparent" />
        </div>
      ) : (
        <MemberGrid members={members} disciplines={DISCIPLINES} />
      )}
    </section>
  )
}

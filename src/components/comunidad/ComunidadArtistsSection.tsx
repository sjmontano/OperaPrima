'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { EditableText } from '@/components/editor/EditableText'
import { useEditMode } from '@/context/EditModeContext'
import { MemberGrid, type Member } from '@/components/profile/MemberGrid'
import { createClient } from '@/lib/supabaseClient'
import { Award } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
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

interface CommunityUser {
  id: string
  username: string
  name: string
  discipline: string
  avatar: string
  href: string
  destacado: boolean
}

function UsuarioDelMesBanner({
  user,
  label,
  bgColor,
  onLabelChange,
}: {
  user: CommunityUser
  label: string
  bgColor: string
  onLabelChange?: (value: string) => void
}) {
  return (
    <div
      className="mb-10 border-2 shadow-[4px_4px_0_#353535] transition-colors duration-150"
      style={{ backgroundColor: bgColor, borderColor: bgColor }}
    >
      <div className="flex flex-wrap items-center gap-4 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3.5">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-[#8ECAE6]">
            <Image
              src={user.avatar}
              alt={user.name}
              width={56}
              height={56}
              unoptimized
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.25em] text-[#F65B7F] uppercase">
            <Award size={11} />
            <EditableText value={label} onSave={(v) => onLabelChange?.(v)} as="span" singleLine />
          </p>
          <Link
            href={user.href}
            className="mt-0.5 block truncate text-lg font-bold tracking-tight text-white uppercase transition-colors hover:text-[#8ECAE6]"
          >
            {user.name}
          </Link>
          <p className="truncate text-xs text-white/55">@{user.username}</p>
        </div>
        <Link
          href={user.href}
          className="border-2 border-white/70 px-3.5 py-2 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:bg-white hover:text-[#023047]"
        >
          Ver perfil
        </Link>
      </div>
    </div>
  )
}

export function ComunidadArtistsSection({
  usuarioDelMes,
  bannerLabel = 'Usuario del mes',
  bannerBgColor = '#023047',
  __onFieldChange,
}: {
  usuarioDelMes?: string
  bannerLabel?: string
  bannerBgColor?: string
  __onFieldChange?: (path: string, value: unknown) => void
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [users, setUsers] = useState<CommunityUser[]>([])
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
        const mapped: CommunityUser[] = (data.usuarios || []).map(
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
            } | null
          }) => ({
            id: u.id,
            username: u.username,
            name: u.perfil?.artisticName || `${u.firstName} ${u.lastName || ''}`.trim(),
            discipline: mapDiscipline(u.perfil?.tags || []),
            avatar:
              u.perfil?.avatar || `https://api.dicebear.com/10.x/lorelei/svg?seed=${u.username}`,
            href: `/perfil/${u.username}`,
            destacado: u.destacado,
          })
        )
        setUsers(mapped)
        setMembers(
          mapped.map((u) => ({
            id: u.id,
            name: u.name,
            discipline: u.discipline,
            location: 'Colombia',
            image: u.avatar,
            href: u.href,
            destacado: u.destacado,
          }))
        )
      })
      .catch((err) => {
        console.error('Error fetching usuarios:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  const selectedUser = users.find(
    (u) => u.username.toLowerCase() === (usuarioDelMes || '').trim().toLowerCase()
  )

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
          {selectedUser && (
            <UsuarioDelMesBanner
              user={selectedUser}
              label={bannerLabel}
              bgColor={bannerBgColor}
              onLabelChange={(v) => __onFieldChange?.('bannerLabel', v)}
            />
          )}

          <div className="mb-6">
            <h2 className="text-lg font-bold tracking-wide text-zinc-800 uppercase">
              Descubre a otros miembros
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Artistas de tu comunidad — filtra por disciplina
            </p>
          </div>

          {isEditMode && currentUser?.rol === 'ADMIN' && (
            <div className="mb-6 flex flex-col gap-4 border-2 border-dashed border-[#E63946] bg-[#E63946]/10 px-6 py-4 lg:flex-row lg:items-start lg:justify-between">
              <p className="text-xs font-bold tracking-widest text-[#E63946] uppercase">
                Modo edición — Miembros
              </p>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-6">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold tracking-widest text-[#E63946] uppercase">
                    Usuario del mes
                  </span>
                  <select
                    value={usuarioDelMes || ''}
                    onChange={(e) => __onFieldChange?.('usuarioDelMes', e.target.value)}
                    className="w-full border-2 border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-700 outline-none focus:border-[#023047] lg:w-64"
                  >
                    <option value="">— Sin seleccionar —</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.username}>
                        {u.name} (@{u.username})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold tracking-widest text-[#E63946] uppercase">
                    Color de fondo del banner
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bannerBgColor || '#023047'}
                      onChange={(e) => __onFieldChange?.('bannerBgColor', e.target.value)}
                      className="h-8 w-8 cursor-pointer border border-zinc-300"
                      title="Color de fondo del banner"
                    />
                    <input
                      type="text"
                      value={bannerBgColor || ''}
                      onChange={(e) => __onFieldChange?.('bannerBgColor', e.target.value)}
                      placeholder="#HEX"
                      className="w-28 border-2 border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-700 outline-none focus:border-[#023047]"
                    />
                  </div>
                </label>
              </div>
              <p className="max-w-48 text-[10px] leading-snug text-[#E63946]/80">
                El título del banner se edita haciendo clic sobre él (texto, color y tamaño de
                letra).
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

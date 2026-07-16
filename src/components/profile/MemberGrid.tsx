'use client'

import { Search, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export interface Member {
  name: string
  discipline: string
  location: string
  image: string
  href?: string
}

interface MemberGridProps {
  members: Member[]
  disciplines: string[]
}

const ITEMS_PER_PAGE = 12

export function MemberGrid({ members, disciplines }: MemberGridProps) {
  const [active, setActive] = useState('Todos')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const filtered = members.filter((m) => {
    const matchDiscipline = active === 'Todos' || m.discipline === active
    const q = query.toLowerCase().trim()
    const matchSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.discipline.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q)
    return matchDiscipline && matchSearch
  })

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  function handleLoadMore() {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }

  return (
    <div>
      <div className="relative mb-5">
        <Search
          size={14}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          style={{ color: 'oklch(0.55 0.010 350)' }}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setVisibleCount(ITEMS_PER_PAGE)
          }}
          placeholder="Buscar artistas por nombre, disciplina o ciudad..."
          className="w-full border-2 border-zinc-200 bg-transparent py-2.5 pr-4 pl-9 text-xs font-medium transition-colors duration-150 focus:border-[#353535] focus:outline-none"
          style={{ fontFamily: 'var(--font-poppins)', color: '#353535' }}
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {['Todos', ...disciplines].map((d) => {
          const isActive = active === d
          return (
            <button
              key={d}
              onClick={() => {
                setActive(d)
                setVisibleCount(ITEMS_PER_PAGE)
              }}
              className="cursor-pointer border-2 px-3 py-1.5 text-xs font-bold tracking-widest uppercase transition-all duration-150"
              style={{
                borderColor: '#353535',
                background: isActive ? '#023047' : 'transparent',
                color: isActive ? '#F0F8FF' : '#353535',
                boxShadow: isActive ? '3px 3px 0 #353535' : 'none',
                transform: isActive ? 'translate(-1px, -1px)' : 'none',
              }}
            >
              {d}
            </button>
          )
        })}
      </div>

      {filtered.length > 0 && (
        <p className="mb-4 text-[0.6rem] font-bold tracking-[0.2em] text-zinc-400 uppercase">
          Mostrando {visible.length} de {filtered.length} artistas
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5">
        {visible.map((member, idx) => (
          <MemberCard key={`${member.name}-${idx}`} member={member} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="group inline-flex cursor-pointer items-center gap-2 border-2 border-zinc-200 px-6 py-3 text-[0.55rem] font-bold tracking-[0.25em] uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#023047] hover:shadow-[3px_3px_0_#353535]"
            style={{ color: '#353535' }}
          >
            <ChevronDown size={12} className="transition-transform group-hover:translate-y-0.5" />
            Cargar más artistas
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm" style={{ color: 'oklch(0.52 0.010 350)' }}>
          {query
            ? `Sin resultados para "${query}" en esta categoría.`
            : 'No hay miembros con este filtro aún.'}
        </p>
      )}
    </div>
  )
}

function MemberCard({ member }: { member: Member }) {
  const [hovered, setHovered] = useState(false)
  const initial = member.name.charAt(0).toUpperCase()

  return (
    <a
      href={member.href ?? '#'}
      className="group relative flex flex-col overflow-hidden border-2 border-zinc-200 bg-white transition-all hover:-translate-y-0.5 hover:border-[#023047] hover:shadow-[3px_3px_0_#353535]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="h-full w-full object-cover"
            loading="lazy"
            style={{
              transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
            }}
            onError={(e) => {
              const target = e.currentTarget
              target.style.display = 'none'
              const fallback = target.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className="absolute inset-0 hidden items-center justify-center bg-[#8ECAE6]/20 text-2xl font-black"
          style={{ color: '#023047' }}
        >
          {initial}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-center px-3 py-2.5">
        <p
          className="truncate text-xs leading-tight font-bold transition-colors group-hover:text-[#023047]"
          style={{ color: '#353535' }}
        >
          {member.name}
        </p>
        <p
          className="mt-0.5 truncate text-[0.55rem] font-medium tracking-wide uppercase"
          style={{ color: 'oklch(0.55 0.010 350)' }}
        >
          {member.discipline}
        </p>
        <p
          className="mt-0.5 text-[0.5rem] font-semibold tracking-wider uppercase"
          style={{ color: '#8ECAE6' }}
        >
          {member.location}
        </p>
      </div>

      {/* Coral accent line on hover */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-[#023047] transition-all duration-300"
        style={{ width: hovered ? '100%' : '0%' }}
      />
    </a>
  )
}

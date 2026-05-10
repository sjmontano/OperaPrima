'use client'

import { Search } from 'lucide-react'
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

export function MemberGrid({ members, disciplines }: MemberGridProps) {
  const [active, setActive] = useState('Todos')
  const [query, setQuery] = useState('')

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

  return (
    <div>
      {/* â”€â”€ Search bar â”€â”€ */}
      <div className="relative mb-5">
        <Search
          size={14}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          style={{ color: 'oklch(0.55 0.010 350)' }}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar artistas por nombre, disciplina o ciudad..."
          className="w-full border-2 border-zinc-200 bg-transparent py-2.5 pr-4 pl-9 text-xs font-medium transition-colors duration-150 focus:border-[#111111] focus:outline-none"
          style={{ fontFamily: 'var(--font-poppins)', color: '#111111' }}
        />
      </div>

      {/* â”€â”€ Discipline filter pills â”€â”€ */}
      <div className="mb-8 flex flex-wrap gap-2">
        {['Todos', ...disciplines].map((d) => {
          const isActive = active === d
          return (
            <button
              key={d}
              onClick={() => setActive(d)}
              className="cursor-pointer border-2 px-3 py-1.5 text-xs font-bold tracking-widest uppercase transition-all duration-150"
              style={{
                borderColor: '#111111',
                background: isActive ? '#F65B7F' : 'transparent',
                color: isActive ? '#FAFAF9' : '#111111',
                boxShadow: isActive ? '3px 3px 0 #111111' : 'none',
                transform: isActive ? 'translate(-1px, -1px)' : 'none',
              }}
            >
              {d}
            </button>
          )
        })}
      </div>

      {/* â”€â”€ Grid â”€â”€ */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {filtered.map((member, idx) => (
          <MemberCard key={`${member.name}-${idx}`} member={member} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm" style={{ color: 'oklch(0.52 0.010 350)' }}>
          {query ? `Sin resultados para "${query}"` : 'No hay miembros con este filtro aÃºn.'}
        </p>
      )}
    </div>
  )
}

function MemberCard({ member }: { member: Member }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={member.href ?? '#'}
      className="relative block overflow-hidden"
      style={{ aspectRatio: '1 / 1' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img
        src={member.image}
        alt={member.name}
        className="h-full w-full object-cover"
        loading="lazy"
        style={{
          transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
        }}
      />

      {/* Always-visible name gradient */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-3"
        style={{
          background: 'linear-gradient(to top, rgba(17,17,17,0.85) 0%, transparent 55%)',
        }}
      >
        <p className="text-xs leading-tight font-bold" style={{ color: '#FAFAF9' }}>
          {member.name}
        </p>
        <p className="text-[10px]" style={{ color: 'rgba(250,250,249,0.65)' }}>
          {member.discipline}
        </p>
      </div>

      {/* Coral inset border on hover */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          outline: '2px solid #F65B7F',
          outlineOffset: '-2px',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Location badge â€” appears on hover */}
      <div
        className="absolute top-2 left-2 px-2 py-0.5"
        style={{
          background: '#1A4A3C',
          color: '#FAFAF9',
          fontSize: '0.6rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        {member.location}
      </div>
    </a>
  )
}

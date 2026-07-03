'use client'

import { useEditMode } from '@/context/EditModeContext'
import { Edit3, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface EditBlockWrapperProps {
  blockType: string
  blockIndex: number
  children: React.ReactNode
  slug?: string
  isPrimitive: boolean
  slug?: string
  onStartEdit?: () => void
}

const TYPE_LABELS: Record<string, string> = {
  'hero-carousel': 'Carrusel Hero',
  'what-is': '¿Qué es?',
  'events-opera-prima': 'Eventos OP',
  'comunidad-cta': 'CTA Comunidad',
  testimonials: 'Testimonios',
  partners: 'Aliados',
  'comunidad-landing': 'Landing Comunidad',
  'events-comunidad': 'Eventos Comunidad',
  'community-artists': 'Artistas',
  'events-landing': 'Landing Eventos',
  'events-mentor': 'Eventos Mentor',
  'mentorias-landing': 'Landing Mentorías',
  'proyectos-landing': 'Landing Proyectos',
  'proyectos-section': 'Sección Proyectos',
  'proyectos-destacados': 'Proyectos Destacados',
  disclaimer: 'Disclaimer',
  'sobre-landing': 'Landing Sobre',
  text: 'Texto',
  image: 'Imagen',
  cta: 'CTA',
  separator: 'Separador',
}

export function EditBlockWrapper({
  blockType,
  blockIndex,
  children,
  isPrimitive,
  slug,
  onStartEdit,
}: EditBlockWrapperProps) {
  const { isEditMode } = useEditMode()
  const [hovered, setHovered] = useState(false)

  if (!isEditMode) return <>{children}</>

  const label = `${TYPE_LABELS[blockType] || blockType.replace(/-/g, ' ')} #${blockIndex + 1}`

  const handleEdit = () => {
    if (isPrimitive && onStartEdit) {
      onStartEdit()
    } else if (slug) {
      window.open(`/admin/pages/${slug}`, '_blank')
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`pointer-events-none absolute inset-0 z-10 border-2 border-dashed transition-all duration-200 ${
          hovered ? 'border-[#8ECAE6] bg-[#8ECAE6]/[0.04]' : 'border-transparent'
        }`}
      />

      <div
        className={`pointer-events-none absolute top-0 left-0 z-20 rounded-br-md px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase transition-all duration-200 ${
          hovered ? 'bg-[#023047] text-white' : 'bg-zinc-100 text-zinc-400'
        }`}
      >
        {label}
      </div>

      <button
        type="button"
        onClick={handleEdit}
        className={`absolute top-0 right-0 z-20 flex items-center gap-1 rounded-bl-md px-2 py-1 text-[9px] font-bold tracking-wider uppercase transition-all duration-200 ${
          hovered ? 'bg-[#8ECAE6] text-[#023047]' : 'bg-zinc-100 text-zinc-400 opacity-0'
        }`}
      >
        {isPrimitive ? (
          <>
            <Edit3 size={10} /> Editar
          </>
        ) : (
          <>
            <ExternalLink size={10} /> Panel
          </>
        )}
      </button>

      {children}
    </div>
  )
}

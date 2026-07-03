'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'

interface BlockTypeOption {
  type: string
  label: string
  category: string
  defaultProps: Record<string, unknown>
}

const BLOCK_TYPES: BlockTypeOption[] = [
  // Content
  {
    type: 'text',
    label: 'Texto',
    category: 'Contenido',
    defaultProps: { content: '', align: 'left' },
  },
  {
    type: 'image',
    label: 'Imagen',
    category: 'Contenido',
    defaultProps: { src: '', alt: '', caption: '' },
  },
  {
    type: 'cta',
    label: 'CTA',
    category: 'Contenido',
    defaultProps: { title: '', description: '', buttonText: 'Ver más', buttonUrl: '#' },
  },
  { type: 'separator', label: 'Separador', category: 'Contenido', defaultProps: {} },
  // Sections
  {
    type: 'hero-carousel',
    label: 'Carrusel Hero',
    category: 'Secciones',
    defaultProps: { slides: [] },
  },
  { type: 'what-is', label: '¿Qué es?', category: 'Secciones', defaultProps: {} },
  { type: 'testimonials', label: 'Testimonios', category: 'Secciones', defaultProps: {} },
  { type: 'partners', label: 'Aliados', category: 'Secciones', defaultProps: {} },
  { type: 'comunidad-cta', label: 'CTA Comunidad', category: 'Secciones', defaultProps: {} },
  { type: 'events-opera-prima', label: 'Eventos OP', category: 'Secciones', defaultProps: {} },
  {
    type: 'comunidad-landing',
    label: 'Landing Comunidad',
    category: 'Secciones',
    defaultProps: {},
  },
  { type: 'events-landing', label: 'Landing Eventos', category: 'Secciones', defaultProps: {} },
  { type: 'events-mentor', label: 'Eventos Mentor', category: 'Secciones', defaultProps: {} },
  {
    type: 'mentorias-landing',
    label: 'Landing Mentorías',
    category: 'Secciones',
    defaultProps: {},
  },
  {
    type: 'proyectos-landing',
    label: 'Landing Proyectos',
    category: 'Secciones',
    defaultProps: {},
  },
  {
    type: 'proyectos-section',
    label: 'Sección Proyectos',
    category: 'Secciones',
    defaultProps: {},
  },
  {
    type: 'proyectos-destacados',
    label: 'Proyectos Destacados',
    category: 'Secciones',
    defaultProps: {},
  },
  { type: 'disclaimer', label: 'Disclaimer', category: 'Secciones', defaultProps: {} },
  { type: 'sobre-landing', label: 'Landing Sobre', category: 'Secciones', defaultProps: {} },
]

export function BlockInsertPopover({ onSelect }: { onSelect: (option: BlockTypeOption) => void }) {
  const [open, setOpen] = useState(false)

  const categories = [...new Set(BLOCK_TYPES.map((t) => t.category))]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex size-7 items-center justify-center rounded-full border-2 border-dashed border-zinc-300 bg-white text-zinc-400 transition-all hover:border-[#8ECAE6] hover:text-[#8ECAE6]"
        title="Añadir bloque"
      >
        <Plus size={14} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-1/2 z-40 mt-2 w-56 -translate-x-1/2 border-2 border-zinc-900 bg-[#F0F8FF] shadow-[4px_4px_0_#111]">
            {categories.map((cat) => (
              <div key={cat}>
                <div className="border-b border-zinc-200 px-3 py-1.5 text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                  {cat}
                </div>
                {BLOCK_TYPES.filter((t) => t.category === cat).map((option) => (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => {
                      onSelect(option)
                      setOpen(false)
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-zinc-700 transition-colors hover:bg-[#8ECAE6]/20 hover:text-[#023047]"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export type { BlockTypeOption }

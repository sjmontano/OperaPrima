'use client'

import { EditBlockWrapper } from '@/components/editor/EditBlockWrapper'
import { FloatingSaveBar } from '@/components/editor/FloatingSaveBar'
import { useEditMode } from '@/context/EditModeContext'
import { lazy, Suspense, useCallback, useState } from 'react'

const HeroCarousel = lazy(() =>
  import('@/components/shared/HeroCarousel').then((m) => ({ default: m.HeroCarousel }))
)
const WhatIsSection = lazy(() =>
  import('@/components/shared/WhatIsSection').then((m) => ({ default: m.WhatIsSection }))
)
const ComunidadCTA = lazy(() =>
  import('@/components/shared/ComunidadCTA').then((m) => ({ default: m.ComunidadCTA }))
)
const TestimonialsWall = lazy(() =>
  import('@/components/shared/TestimonialsWall').then((m) => ({ default: m.TestimonialsWall }))
)
const PartnersStrip = lazy(() =>
  import('@/components/shared/PartnersStrip').then((m) => ({ default: m.PartnersStrip }))
)
const ComunidadLandingSection = lazy(() =>
  import('@/components/comunidad/ComunidadLandingSection').then((m) => ({
    default: m.ComunidadLandingSection,
  }))
)
const ComunidadEventsSection = lazy(() =>
  import('@/components/comunidad/ComunidadEventsSection').then((m) => ({
    default: m.ComunidadEventsSection,
  }))
)
const ComunidadArtistsSection = lazy(() =>
  import('@/components/comunidad/ComunidadArtistsSection').then((m) => ({
    default: m.ComunidadArtistsSection,
  }))
)
const EventsLandingSection = lazy(() =>
  import('@/components/events/EventsLandingSection').then((m) => ({
    default: m.EventsLandingSection,
  }))
)
const MentorEventsSection = lazy(() =>
  import('@/components/events/MentorEventsSection').then((m) => ({
    default: m.MentorEventsSection,
  }))
)
const MentoriasLandingSection = lazy(() =>
  import('@/components/mentorias/MentoriasLandingSection').then((m) => ({
    default: m.MentoriasLandingSection,
  }))
)
const ProyectosLandingSection = lazy(() =>
  import('@/components/proyectos/ProyectosLandingSection').then((m) => ({
    default: m.ProyectosLandingSection,
  }))
)
const ProyectosSection = lazy(() =>
  import('@/components/proyectos/ProyectosSection').then((m) => ({ default: m.ProyectosSection }))
)
const ProyectosDestacados = lazy(() =>
  import('@/components/proyectos/ProyectosDestacados').then((m) => ({
    default: m.ProyectosDestacados,
  }))
)
const DisclaimerSection = lazy(() =>
  import('@/components/proyectos/DisclaimerSection').then((m) => ({ default: m.DisclaimerSection }))
)
const SobreLandingSection = lazy(() =>
  import('@/components/sobre/SobreLandingSection').then((m) => ({ default: m.SobreLandingSection }))
)
const EventsSection = lazy(() =>
  import('@/components/events/EventsSection').then((m) => ({ default: m.EventsSection }))
)

export interface Block {
  type: string
  props: Record<string, unknown>
}

const BLOCK_MAP: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>>
> = {
  'hero-carousel': HeroCarousel,
  'what-is': WhatIsSection,
  'events-opera-prima': EventsSection,
  'comunidad-cta': ComunidadCTA,
  testimonials: TestimonialsWall,
  partners: PartnersStrip,
  'comunidad-landing': ComunidadLandingSection,
  'events-comunidad': ComunidadEventsSection,
  'community-artists': ComunidadArtistsSection,
  'events-landing': EventsLandingSection,
  'events-mentor': MentorEventsSection,
  'mentorias-landing': MentoriasLandingSection,
  'proyectos-landing': ProyectosLandingSection,
  'proyectos-section': ProyectosSection,
  'proyectos-destacados': ProyectosDestacados,
  disclaimer: DisclaimerSection,
  'sobre-landing': SobreLandingSection,
}

const PRIMITIVE_TYPES = ['text', 'image', 'cta', 'separator']

// ── Inline editors for primitive blocks ──

function TextEditor({
  content,
  onSave,
  onCancel,
}: {
  content: string
  onSave: (html: string) => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.focus()
  }, [])

  return (
    <div className="mx-auto max-w-4xl border-2 border-[#8ECAE6] bg-white p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            document.execCommand('bold')
          }}
          className="rounded px-2 py-1 text-xs font-bold hover:bg-zinc-100"
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            document.execCommand('italic')
          }}
          className="rounded px-2 py-1 text-xs italic hover:bg-zinc-100"
        >
          I
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            document.execCommand('formatBlock', false, 'h2')
          }}
          className="rounded px-2 py-1 text-xs font-bold hover:bg-zinc-100"
        >
          H2
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            document.execCommand('insertUnorderedList')
          }}
          className="rounded px-2 py-1 text-xs hover:bg-zinc-100"
        >
          • Lista
        </button>
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-sm border border-zinc-300 px-3 py-1 text-[10px] font-bold tracking-wider text-zinc-600 uppercase hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSave(ref.current?.innerHTML || '')}
            className="rounded-sm border border-[#023047] bg-[#023047] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase hover:bg-[#023047]/90"
          >
            Guardar
          </button>
        </div>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="prose prose-sm max-w-none rounded-sm border border-zinc-200 p-3 text-zinc-700 outline-none focus:border-[#8ECAE6]"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

function ImageEditor({
  src,
  alt,
  caption,
  onSave,
  onCancel,
}: {
  src: string
  alt: string
  caption: string
  onSave: (data: { src: string; alt: string; caption: string }) => void
  onCancel: () => void
}) {
  const [url, setUrl] = useState(src)
  const [altText, setAltText] = useState(alt)
  const [capText, setCapText] = useState(caption)

  return (
    <div className="mx-auto max-w-4xl border-2 border-[#8ECAE6] bg-white p-4">
      <p className="mb-3 text-[10px] font-bold tracking-widest text-[#023047] uppercase">
        Editar imagen
      </p>
      <div className="mb-3 space-y-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL de la imagen"
          className="w-full border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-[#8ECAE6]"
        />
        <input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Texto alternativo"
          className="w-full border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-[#8ECAE6]"
        />
        <input
          type="text"
          value={capText}
          onChange={(e) => setCapText(e.target.value)}
          placeholder="Pie de foto"
          className="w-full border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-[#8ECAE6]"
        />
      </div>
      <div className="flex justify-end gap-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-sm border border-zinc-300 px-3 py-1 text-[10px] font-bold tracking-wider text-zinc-600 uppercase hover:bg-zinc-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onSave({ src: url, alt: altText, caption: capText })}
          className="rounded-sm border border-[#023047] bg-[#023047] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase hover:bg-[#023047]/90"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}

function CtaEditor({
  title,
  description,
  buttonText,
  buttonUrl,
  onSave,
  onCancel,
}: {
  title: string
  description: string
  buttonText: string
  buttonUrl: string
  onSave: (data: {
    title: string
    description: string
    buttonText: string
    buttonUrl: string
  }) => void
  onCancel: () => void
}) {
  const [t, setT] = useState(title)
  const [d, setD] = useState(description)
  const [bt, setBt] = useState(buttonText)
  const [bu, setBu] = useState(buttonUrl)

  return (
    <div className="mx-auto max-w-4xl border-2 border-[#8ECAE6] bg-white p-4">
      <p className="mb-3 text-[10px] font-bold tracking-widest text-[#023047] uppercase">
        Editar CTA
      </p>
      <div className="mb-3 space-y-2">
        <input
          type="text"
          value={t}
          onChange={(e) => setT(e.target.value)}
          placeholder="Título"
          className="w-full border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-[#8ECAE6]"
        />
        <textarea
          value={d}
          onChange={(e) => setD(e.target.value)}
          placeholder="Descripción"
          rows={3}
          className="w-full border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-[#8ECAE6]"
        />
        <input
          type="text"
          value={bt}
          onChange={(e) => setBt(e.target.value)}
          placeholder="Texto del botón"
          className="w-full border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-[#8ECAE6]"
        />
        <input
          type="text"
          value={bu}
          onChange={(e) => setBu(e.target.value)}
          placeholder="URL del botón"
          className="w-full border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-[#8ECAE6]"
        />
      </div>
      <div className="flex justify-end gap-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-sm border border-zinc-300 px-3 py-1 text-[10px] font-bold tracking-wider text-zinc-600 uppercase hover:bg-zinc-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onSave({ title: t, description: d, buttonText: bt, buttonUrl: bu })}
          className="rounded-sm border border-[#023047] bg-[#023047] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase hover:bg-[#023047]/90"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}

// ── FallbackBlock ──

function FallbackBlock({
  block,
  editing,
  onEditSave,
  onEditCancel,
}: {
  block: Block
  editing: boolean
  onEditSave: (props: Record<string, unknown>) => void
  onEditCancel: () => void
}) {
  const { content, align, src, alt, caption, title, description, buttonText, buttonUrl } =
    block.props as Record<string, string>

  if (block.type === 'text') {
    if (editing) {
      return (
        <TextEditor
          content={content || ''}
          onSave={(html) => onEditSave({ content: html, align })}
          onCancel={onEditCancel}
        />
      )
    }
    return (
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div
          className="prose prose-sm max-w-none text-zinc-700"
          style={{ textAlign: (align as 'left' | 'center' | 'right') || 'left' }}
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </section>
    )
  }

  if (block.type === 'image') {
    if (editing) {
      return (
        <ImageEditor
          src={src || ''}
          alt={alt || ''}
          caption={caption || ''}
          onSave={(data) => onEditSave(data)}
          onCancel={onEditCancel}
        />
      )
    }
    return (
      <section className="mx-auto max-w-4xl px-6 py-8">
        <figure>
          <img src={src} alt={alt || ''} className="w-full object-cover" />
          {caption && (
            <figcaption className="mt-2 text-center text-xs text-zinc-500">{caption}</figcaption>
          )}
        </figure>
      </section>
    )
  }

  if (block.type === 'cta') {
    if (editing) {
      return (
        <CtaEditor
          title={title || ''}
          description={description || ''}
          buttonText={buttonText || ''}
          buttonUrl={buttonUrl || ''}
          onSave={(data) => onEditSave(data)}
          onCancel={onEditCancel}
        />
      )
    }
    return (
      <section className="bg-[#023047] px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {description && <p className="mt-3 text-white/70">{description}</p>}
          <a
            href={buttonUrl || '#'}
            className="mt-6 inline-block border-2 border-white px-8 py-3 text-xs font-bold tracking-widest text-white uppercase transition-all hover:bg-white hover:text-[#023047]"
          >
            {buttonText || 'Ver más'}
          </a>
        </div>
      </section>
    )
  }

  if (block.type === 'separator') {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <hr className="border-zinc-200" />
      </div>
    )
  }

  return null
}

// ── Main PageRenderer ──

export function PageRenderer({ blocks: initialBlocks, slug }: { blocks: Block[]; slug?: string }) {
  const { isEditMode } = useEditMode()
  const [blocks, setBlocks] = useState(initialBlocks)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [lastSavedBlocks, setLastSavedBlocks] = useState(initialBlocks)
  const [historyMeta, setHistoryMeta] = useState<{ stack: Block[][]; index: number }>({
    stack: [initialBlocks],
    index: 0,
  })

  const pushHistory = useCallback((newBlocks: Block[]) => {
    setHistoryMeta((prev) => {
      const sliced = prev.stack.slice(0, prev.index + 1)
      const next = [...sliced, newBlocks]
      if (next.length > 50) next.shift()
      return { stack: next, index: next.length - 1 }
    })
  }, [])

  const handleEditSave = useCallback(
    (index: number, props: Record<string, unknown>) => {
      const updated = blocks.map((b, i) => (i === index ? { ...b, props } : b))
      setBlocks(updated)
      pushHistory(updated)
      setEditingIndex(null)
    },
    [blocks, pushHistory]
  )

  const handleUndo = useCallback(() => {
    setHistoryMeta((prev) => {
      if (prev.index <= 0) return prev
      const newIdx = prev.index - 1
      setBlocks(prev.stack[newIdx])
      return { ...prev, index: newIdx }
    })
  }, [])

  const handleRedo = useCallback(() => {
    setHistoryMeta((prev) => {
      if (prev.index >= prev.stack.length - 1) return prev
      const newIdx = prev.index + 1
      setBlocks(prev.stack[newIdx])
      return { ...prev, index: newIdx }
    })
  }, [])

  const handleDiscard = useCallback(() => {
    setHistoryMeta((prev) => {
      const first = prev.stack[0]
      setBlocks(first)
      return { stack: [first], index: 0 }
    })
    setEditingIndex(null)
  }, [])

  const handleSave = useCallback(async () => {
    if (!slug) return
    const res = await fetch(`/api/pages/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    })
    if (!res.ok) throw new Error('Error al guardar')
    setLastSavedBlocks(blocks)
    setHistoryMeta({ stack: [blocks], index: 0 })
  }, [slug, blocks])

  const hasChanges = JSON.stringify(blocks) !== JSON.stringify(lastSavedBlocks)
  const canUndo = historyMeta.index > 0
  const canRedo = historyMeta.index < historyMeta.stack.length - 1
  const isPrimitive = (type: string) => PRIMITIVE_TYPES.includes(type)

  return (
    <>
      {blocks.map((block, i) => {
        const Component = BLOCK_MAP[block.type]
        if (Component) {
          return (
            <Suspense
              key={`${block.type}-${i}`}
              fallback={<div className="h-32 animate-pulse bg-zinc-100" />}
            >
              <EditBlockWrapper
                blockType={block.type}
                blockIndex={i}
                isPrimitive={false}
                slug={slug}
              >
                <Component {...block.props} />
              </EditBlockWrapper>
            </Suspense>
          )
        }
        return (
          <EditBlockWrapper
            key={`${block.type}-${i}`}
            blockType={block.type}
            blockIndex={i}
            isPrimitive={isPrimitive(block.type)}
            slug={slug}
            onStartEdit={() => setEditingIndex(i)}
          >
            <FallbackBlock
              block={block}
              editing={editingIndex === i}
              onEditSave={(props) => handleEditSave(i, props)}
              onEditCancel={() => setEditingIndex(null)}
            />
          </EditBlockWrapper>
        )
      })}

      {isEditMode && (
        <FloatingSaveBar
          onSave={handleSave}
          onDiscard={handleDiscard}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          hasChanges={hasChanges}
        />
      )}
    </>
  )
}

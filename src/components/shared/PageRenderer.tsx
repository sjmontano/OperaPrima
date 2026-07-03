'use client'

import { BlockInsertPopover, type BlockTypeOption } from '@/components/editor/BlockInsertPopover'
import { ComplexBlockEditor } from '@/components/editor/ComplexBlockEditor'
import { EditBlockWrapper } from '@/components/editor/EditBlockWrapper'
import { FloatingSaveBar } from '@/components/editor/FloatingSaveBar'
import { useEditMode } from '@/context/EditModeContext'
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { lazy, Suspense, useCallback, useState } from 'react'

// ── Lazy block components ──

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

// ── Types ──

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
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  const handleSave = () => {
    onSave(ref?.innerHTML || '')
  }

  return (
    <div className="mx-auto max-w-4xl border-2 border-[#8ECAE6] bg-white p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            document.execCommand('bold')
            ref?.focus()
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
            ref?.focus()
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
            ref?.focus()
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
            ref?.focus()
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
            onClick={handleSave}
            className="rounded-sm border border-[#023047] bg-[#023047] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase hover:bg-[#023047]/90"
          >
            Guardar
          </button>
        </div>
      </div>
      <div
        ref={(el) => {
          if (el && !ref) setRef(el)
        }}
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

// ── FallbackBlock for primitives ──

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

// ── Sortable block wrapper ──

function SortableBlock({
  id,
  block,
  blockIndex,
  children,
  slug,
  onStartEdit,
}: {
  id: number
  block: Block
  blockIndex: number
  children: React.ReactNode
  slug?: string
  onStartEdit: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })
  const { isEditMode } = useEditMode()
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    position: 'relative',
    zIndex: isDragging ? 50 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {isEditMode && (
        <button
          type="button"
          {...listeners}
          className="absolute top-1/2 -left-8 z-20 -translate-y-1/2 rounded-sm p-1 text-zinc-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-zinc-200 hover:text-zinc-700"
          title="Arrastrar para reordenar"
          style={{ opacity: isDragging ? 1 : undefined }}
        >
          <GripVertical size={14} />
        </button>
      )}
      <EditBlockWrapper
        blockType={block.type}
        blockIndex={blockIndex}
        slug={slug}
        onStartEdit={onStartEdit}
      >
        {children}
      </EditBlockWrapper>
    </div>
  )
}

function deepSet(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const parts = path.split('.')
  const result: Record<string, unknown> = Array.isArray(obj) ? [...obj] : { ...obj }
  let current: Record<string, unknown> | unknown[] = result
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]
    const idx = Number(key)
    const k = String(idx) !== key ? key : idx
    const next = (current as Record<string, unknown>)[k]
    current[k] = Array.isArray(next) ? [...next] : { ...(next as Record<string, unknown>) }
    current = current[k] as Record<string, unknown> | unknown[]
  }
  const lastKey = parts[parts.length - 1]
  const lastIdx = Number(lastKey)
  ;(current as Record<string, unknown>)[String(lastIdx) !== lastKey ? lastKey : lastIdx] = value
  return result
}

// ── Insert button between blocks ──

function InsertBetween({
  _index,
  onInsert,
}: {
  _index: number
  onInsert: (option: BlockTypeOption) => void
}) {
  const { isEditMode } = useEditMode()
  if (!isEditMode) return null

  return (
    <div className="flex justify-center py-1">
      <BlockInsertPopover onSelect={(option) => onInsert(option)} />
    </div>
  )
}

// ── Main PageRenderer ──

export function PageRenderer({ blocks: initialBlocks, slug }: { blocks: Block[]; slug?: string }) {
  const { isEditMode } = useEditMode()
  const [blocks, setBlocks] = useState(initialBlocks)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [complexEditIndex, setComplexEditIndex] = useState<number | null>(null)
  const [lastSavedBlocks, setLastSavedBlocks] = useState(initialBlocks)
  const [historyMeta, setHistoryMeta] = useState<{ stack: Block[][]; index: number }>({
    stack: [initialBlocks],
    index: 0,
  })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const pushHistory = useCallback((newBlocks: Block[]) => {
    setHistoryMeta((prev) => {
      const sliced = prev.stack.slice(0, prev.index + 1)
      const next = [...sliced, newBlocks]
      if (next.length > 50) next.shift()
      return { stack: next, index: next.length - 1 }
    })
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      const oldIdx = Number(active.id)
      const newIdx = Number(over.id)
      const updated = arrayMove(blocks, oldIdx, newIdx)
      setBlocks(updated)
      pushHistory(updated)
    },
    [blocks, pushHistory]
  )

  const handleInsert = useCallback(
    (index: number, option: BlockTypeOption) => {
      const newBlock: Block = { type: option.type, props: option.defaultProps }
      const updated = [...blocks.slice(0, index), newBlock, ...blocks.slice(index)]
      setBlocks(updated)
      pushHistory(updated)
    },
    [blocks, pushHistory]
  )

  const handleEditSave = useCallback(
    (index: number, props: Record<string, unknown>) => {
      const updated = blocks.map((b, i) => (i === index ? { ...b, props } : b))
      setBlocks(updated)
      pushHistory(updated)
      setEditingIndex(null)
      setComplexEditIndex(null)
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
    setComplexEditIndex(null)
  }, [])

  const handleFieldChange = useCallback(
    (blockIndex: number, fieldPath: string, value: unknown) => {
      const updated = blocks.map((b, i) => {
        if (i !== blockIndex) return b
        return { ...b, props: deepSet(b.props, fieldPath, value) }
      })
      setBlocks(updated)
      pushHistory(updated)
    },
    [blocks, pushHistory]
  )

  const handleSave = useCallback(async () => {
    if (!slug) return
    const res = await fetch(`/api/pages/${slug}`, {
      method: 'PUT',
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

  const handleStartEdit = (i: number) => {
    if (isPrimitive(blocks[i].type)) {
      setEditingIndex(i)
    } else {
      setComplexEditIndex(i)
    }
  }

  // ── Render ──

  if (!isEditMode) {
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
                <Component {...block.props} isEditMode={false} __onFieldChange={() => {}} />
              </Suspense>
            )
          }
          return (
            <FallbackBlock
              key={`${block.type}-${i}`}
              block={block}
              editing={false}
              onEditSave={() => {}}
              onEditCancel={() => {}}
            />
          )
        })}
      </>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blocks.map((_, i) => i)} strategy={verticalListSortingStrategy}>
        {/* Only block wrappers, not InsertBetween or FloatingSaveBar */}
        {blocks.map((block, i) => {
          const Component = BLOCK_MAP[block.type]
          const content = Component ? (
            <Suspense fallback={<div className="h-32 animate-pulse bg-zinc-100" />}>
              <Component
                {...block.props}
                isEditMode={true}
                __onFieldChange={(path: string, val: unknown) => handleFieldChange(i, path, val)}
              />
            </Suspense>
          ) : (
            <FallbackBlock
              block={block}
              editing={editingIndex === i}
              onEditSave={(props) => handleEditSave(i, props)}
              onEditCancel={() => setEditingIndex(null)}
            />
          )

          return (
            <div key={`${block.type}-${i}`} className="group">
              <SortableBlock
                id={i}
                block={block}
                blockIndex={i}
                slug={slug}
                onStartEdit={() => handleStartEdit(i)}
              >
                {content}
              </SortableBlock>
            </div>
          )
        })}
      </SortableContext>

      {/* Insert between buttons — outside SortableContext */}
      {blocks.map((_, i) => (
        <InsertBetween key={`insert-${i}`} _index={i} onInsert={(opt) => handleInsert(i, opt)} />
      ))}
      <InsertBetween
        key={`insert-${blocks.length}`}
        _index={blocks.length}
        onInsert={(opt) => handleInsert(blocks.length, opt)}
      />

      <FloatingSaveBar
        onSave={handleSave}
        onDiscard={handleDiscard}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        hasChanges={hasChanges}
      />

      {complexEditIndex !== null && blocks[complexEditIndex] && (
        <ComplexBlockEditor
          block={blocks[complexEditIndex]}
          onSave={(props) => handleEditSave(complexEditIndex, props)}
          onClose={() => setComplexEditIndex(null)}
        />
      )}
    </DndContext>
  )
}

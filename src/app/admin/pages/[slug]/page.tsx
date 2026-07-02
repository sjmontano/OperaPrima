'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ArrowLeft,
  GripVertical,
  Plus,
  Trash2,
  Save,
  Eye,
  ChevronDown,
  ChevronUp,
  Type,
  Image,
  Layout,
  Star,
  Users,
  Calendar,
  MessageSquare,
  Link2,
  Minimize2,
  Globe,
  BookOpen,
  RefreshCw,
  Upload,
  Loader,
} from 'lucide-react'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { PageRenderer } from '@/components/shared/PageRenderer'
import Link from 'next/link'

interface Block {
  id: string
  type: string
  props: Record<string, unknown>
}

const BLOCK_TYPES: Record<
  string,
  { label: string; icon: typeof Type; defaultProps: Record<string, unknown> }
> = {
  'hero-carousel': { label: 'Hero Carrusel', icon: Layout, defaultProps: {} },
  'what-is': { label: '¿Qué es?', icon: BookOpen, defaultProps: {} },
  'events-opera-prima': { label: 'Eventos Opera Prima', icon: Calendar, defaultProps: {} },
  'comunidad-cta': { label: 'CTA Comunidad', icon: Users, defaultProps: {} },
  testimonials: { label: 'Testimonios', icon: Star, defaultProps: {} },
  partners: { label: 'Aliados', icon: Globe, defaultProps: {} },
  'comunidad-landing': { label: 'Landing Comunidad', icon: Users, defaultProps: {} },
  'events-comunidad': { label: 'Eventos Comunidad', icon: Calendar, defaultProps: {} },
  'community-artists': { label: 'Artistas Comunidad', icon: Users, defaultProps: {} },
  'events-landing': { label: 'Landing Eventos', icon: Calendar, defaultProps: {} },
  'events-mentor': { label: 'Eventos Mentores', icon: Calendar, defaultProps: {} },
  'mentorias-landing': { label: 'Landing Mentorías', icon: BookOpen, defaultProps: {} },
  'proyectos-landing': { label: 'Landing Proyectos', icon: Layout, defaultProps: {} },
  'proyectos-section': { label: 'Sección Proyectos', icon: Layout, defaultProps: {} },
  'proyectos-destacados': { label: 'Proyectos Destacados', icon: Star, defaultProps: {} },
  disclaimer: { label: 'Disclaimer', icon: MessageSquare, defaultProps: {} },
  'sobre-landing': { label: 'Landing Sobre', icon: BookOpen, defaultProps: {} },
  text: {
    label: 'Texto',
    icon: Type,
    defaultProps: { content: 'Escribe aquí…', align: 'left' },
  },
  image: {
    label: 'Imagen',
    icon: Image,
    defaultProps: { src: '', alt: '', caption: '' },
  },
  cta: {
    label: 'Call to Action',
    icon: Link2,
    defaultProps: { title: 'Título', description: '', buttonText: 'Ver más', buttonUrl: '#' },
  },
  separator: {
    label: 'Separador',
    icon: Minimize2,
    defaultProps: {},
  },
}

function SortableBlock({
  block,
  index,
  onUpdate,
  onDelete,
}: {
  block: Block
  index: number
  onUpdate: (id: string, props: Record<string, unknown>) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const info = BLOCK_TYPES[block.type]
  const Icon = info?.icon || Layout

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-2 border-zinc-200 bg-white transition-all hover:border-zinc-300"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-zinc-400 active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </button>
        <div className="flex size-8 items-center justify-center border-2 border-zinc-200 bg-zinc-50">
          <Icon size={14} className="text-zinc-500" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-bold text-[#353535]">{info?.label || block.type}</span>
          <span className="ml-2 text-[10px] text-zinc-400">#{index + 1}</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex size-7 items-center justify-center text-zinc-400 hover:text-[#023047]"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button
          onClick={() => onDelete(block.id)}
          className="flex size-7 items-center justify-center text-zinc-400 hover:text-[#E63946]"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-zinc-100 px-4 py-4">
          <BlockEditor block={block} onUpdate={(props) => onUpdate(block.id, props)} />
        </div>
      )}
    </div>
  )
}

function BlockEditor({
  block,
  onUpdate,
}: {
  block: Block
  onUpdate: (props: Record<string, unknown>) => void
}) {
  const props = block.props
  const [uploading, setUploading] = useState(false)

  if (block.type === 'text') {
    return (
      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            Contenido
          </label>
          <RichTextEditor
            content={(props.content as string) || ''}
            onChange={(html) => onUpdate({ ...props, content: html })}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            Alineación
          </label>
          <select
            value={(props.align as string) || 'left'}
            onChange={(e) => onUpdate({ ...props, align: e.target.value })}
            className="mt-1 block w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
          >
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
          </select>
        </div>
      </div>
    )
  }

  if (block.type === 'image') {
    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]
      if (!file) return
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      try {
        const res = await fetch('/api/upload/image', { method: 'POST', body: formData })
        if (res.ok) {
          const data = await res.json()
          onUpdate({ ...props, src: data.url })
        }
      } catch {
        // ignore
      }
      setUploading(false)
    }

    return (
      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            URL de la imagen
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={(props.src as string) || ''}
              onChange={(e) => onUpdate({ ...props, src: e.target.value })}
              className="flex-1 border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
              placeholder="https://..."
            />
            <label className="flex cursor-pointer items-center gap-1.5 border-2 border-zinc-200 px-3 py-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-all hover:border-[#023047] hover:text-[#023047]">
              {uploading ? <Loader size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Subiendo...' : 'Subir'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
        {(props.src as string) && (
          <div className="border-2 border-zinc-200 bg-zinc-50 p-2">
            <img src={props.src as string} alt="" className="max-h-48 w-full object-contain" />
          </div>
        )}
        <div>
          <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            Texto alternativo
          </label>
          <input
            type="text"
            value={(props.alt as string) || ''}
            onChange={(e) => onUpdate({ ...props, alt: e.target.value })}
            className="mt-1 block w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            Pie de foto
          </label>
          <input
            type="text"
            value={(props.caption as string) || ''}
            onChange={(e) => onUpdate({ ...props, caption: e.target.value })}
            className="mt-1 block w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
          />
        </div>
      </div>
    )
  }

  if (block.type === 'cta') {
    return (
      <div className="space-y-3">
        {(['title', 'description', 'buttonText', 'buttonUrl'] as const).map((field) => (
          <div key={field}>
            <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              {field === 'title'
                ? 'Título'
                : field === 'description'
                  ? 'Descripción'
                  : field === 'buttonText'
                    ? 'Texto del botón'
                    : 'URL del botón'}
            </label>
            <input
              type="text"
              value={(props[field] as string) || ''}
              onChange={(e) => onUpdate({ ...props, [field]: e.target.value })}
              className="mt-1 block w-full border-2 border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#023047]"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <p className="text-xs text-zinc-400">
      Este bloque se renderiza automáticamente desde sus componentes. No tiene campos editables.
    </p>
  )
}

export default function PageEditorPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [title, setTitle] = useState('')
  const [blocks, setBlocks] = useState<Block[]>([])
  const [published, setPublished] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddPalette, setShowAddPalette] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

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

      const res = await fetch(`/api/pages/${slug}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setTitle(data.page.title)
        setPublished(data.page.published)
        setBlocks(
          data.page.blocks.map((b: Block, i: number) => ({ ...b, id: b.id || `block-${i}` }))
        )
      }
      setLoading(false)
    }
    init()
  }, [slug])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === active.id)
      const newIndex = prev.findIndex((b) => b.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }, [])

  const handleUpdate = useCallback((id: string, props: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, props } : b)))
  }, [])

  const handleDelete = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const handleAddBlock = useCallback((type: string) => {
    const info = BLOCK_TYPES[type]
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      props: { ...info?.defaultProps },
    }
    setBlocks((prev) => [...prev, newBlock])
    setShowAddPalette(false)
  }, [])

  async function handleSave(publish: boolean) {
    setSaving(true)
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return

    await fetch(`/api/pages/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ title, blocks, published: publish }),
    })

    setPublished(publish)
    setSaving(false)
  }

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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/pages"
              className="flex size-9 items-center justify-center border-2 border-zinc-200 text-zinc-600 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#023047] hover:text-[#023047] hover:shadow-[3px_3px_0_#353535]"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-b-2 border-transparent bg-transparent text-sm font-bold text-[#353535] outline-none focus:border-[#023047]"
              />
              <p className="text-[10px] text-zinc-500">/{slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1.5 border-2 border-zinc-200 px-3 py-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-all hover:border-[#023047] hover:text-[#023047]"
            >
              <Eye size={14} />
              Vista previa
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-1.5 border-2 border-zinc-200 px-3 py-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-all hover:border-[#023047] hover:text-[#023047] disabled:opacity-50"
            >
              <Save size={14} />
              Guardar borrador
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-1.5 border-2 border-[#023047] bg-[#023047] px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase transition-all hover:bg-[#023047]/90 disabled:opacity-50"
            >
              <RefreshCw size={14} className={saving ? 'animate-spin' : ''} />
              {published ? 'Actualizar' : 'Publicar'}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-6">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {blocks.map((block, index) => (
                <SortableBlock
                  key={block.id}
                  block={block}
                  index={index}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="relative mt-6">
          {showAddPalette ? (
            <div className="border-2 border-zinc-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                  Agregar bloque
                </p>
                <button
                  onClick={() => setShowAddPalette(false)}
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {Object.entries(BLOCK_TYPES).map(([type, info]) => {
                  const Icon = info.icon
                  return (
                    <button
                      key={type}
                      onClick={() => handleAddBlock(type)}
                      className="flex items-center gap-2 border-2 border-zinc-200 px-3 py-2.5 text-left text-xs text-zinc-600 transition-all hover:border-[#023047] hover:text-[#023047]"
                    >
                      <Icon size={14} />
                      {info.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddPalette(true)}
              className="flex w-full items-center justify-center gap-2 border-2 border-dashed border-zinc-300 px-6 py-4 text-xs font-bold tracking-widest text-zinc-400 uppercase transition-all hover:border-[#023047] hover:text-[#023047]"
            >
              <Plus size={16} />
              Agregar bloque
            </button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-3">
            <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Vista previa — {title}
            </p>
            <div className="flex items-center gap-3">
              <Link
                href={`/${slug === 'inicio' ? '' : slug}`}
                target="_blank"
                className="flex items-center gap-1.5 border-2 border-zinc-200 px-3 py-1.5 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-all hover:border-[#023047] hover:text-[#023047]"
              >
                <Eye size={12} />
                Abrir en nueva pestaña
              </Link>
              <button
                onClick={() => setShowPreview(false)}
                className="flex size-8 items-center justify-center border-2 border-zinc-200 text-zinc-500 transition-all hover:border-[#E63946] hover:text-[#E63946]"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <PageRenderer blocks={blocks} />
          </div>
        </div>
      )}
    </main>
  )
}

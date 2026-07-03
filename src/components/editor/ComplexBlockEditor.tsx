'use client'

import { useEditMode } from '@/context/EditModeContext'
import { X } from 'lucide-react'
import { useState } from 'react'
import type { Block } from '@/components/shared/PageRenderer'

interface Props {
  block: Block
  onSave: (props: Record<string, unknown>) => void
  onClose: () => void
}

// ── Generic helpers ──

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#8ECAE6]"
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#8ECAE6]"
      />
    </label>
  )
}

function ArrayEditor<T>({
  label,
  items,
  defaultItem,
  renderItem,
  onChange,
}: {
  label: string
  items: T[]
  defaultItem: T
  renderItem: (item: T, index: number, update: (v: T) => void) => React.ReactNode
  onChange: (items: T[]) => void
}) {
  const update = (i: number, v: T) => {
    const next = [...items]
    next[i] = v
    onChange(next)
  }
  const add = () => onChange([...items, { ...defaultItem }])
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
          {label}
        </span>
        <button
          type="button"
          onClick={add}
          className="rounded-sm border border-[#8ECAE6] px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#023047] uppercase hover:bg-[#8ECAE6]/20"
        >
          + Añadir
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="relative rounded-sm border border-zinc-200 bg-zinc-50 p-3">
          <button
            type="button"
            onClick={() => remove(i)}
            className="absolute top-1 right-1 rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700"
          >
            <X size={12} />
          </button>
          <div className="space-y-2 pr-5">{renderItem(item, i, (v) => update(i, v))}</div>
        </div>
      ))}
    </div>
  )
}

// ── Hero Carousel Editor ──

function HeroCarouselEditor({
  props: p,
  onChange,
}: {
  props: Record<string, unknown>
  onChange: (p: Record<string, unknown>) => void
}) {
  const slides = (p.slides as Array<Record<string, unknown>>) || []
  return (
    <ArrayEditor
      label="Slides"
      items={slides}
      defaultItem={{
        id: 'new',
        headline: '',
        subtext: '',
        cta: { label: '', href: '' },
        secondaryCta: { label: '', href: '' },
        bg: '',
        accent: '',
        tag: '',
      }}
      onChange={(v) => onChange({ ...p, slides: v })}
      renderItem={(s, _, update) => (
        <>
          <Input
            label="Tag"
            value={String(s.tag || '')}
            onChange={(v) => update({ ...s, tag: v })}
          />
          <TextArea
            label="Headline"
            value={String(s.headline || '')}
            onChange={(v) => update({ ...s, headline: v })}
            rows={2}
          />
          <TextArea
            label="Subtexto"
            value={String(s.subtext || '')}
            onChange={(v) => update({ ...s, subtext: v })}
            rows={2}
          />
          <Input
            label="CTA Label"
            value={String((s.cta as Record<string, string>)?.label || '')}
            onChange={(v) => update({ ...s, cta: { ...(s.cta as object), label: v } })}
          />
          <Input
            label="CTA URL"
            value={String((s.cta as Record<string, string>)?.href || '')}
            onChange={(v) => update({ ...s, cta: { ...(s.cta as object), href: v } })}
          />
          <Input
            label="Sec. CTA Label"
            value={String((s.secondaryCta as Record<string, string>)?.label || '')}
            onChange={(v) =>
              update({ ...s, secondaryCta: { ...(s.secondaryCta as object), label: v } })
            }
          />
          <Input
            label="Sec. CTA URL"
            value={String((s.secondaryCta as Record<string, string>)?.href || '')}
            onChange={(v) =>
              update({ ...s, secondaryCta: { ...(s.secondaryCta as object), href: v } })
            }
          />
          <Input
            label="Bg gradient"
            value={String(s.bg || '')}
            onChange={(v) => update({ ...s, bg: v })}
          />
          <Input
            label="Color acento"
            value={String(s.accent || '')}
            onChange={(v) => update({ ...s, accent: v })}
          />
        </>
      )}
    />
  )
}

// ── What Is Editor ──

function WhatIsEditor({
  props: p,
  onChange,
}: {
  props: Record<string, unknown>
  onChange: (p: Record<string, unknown>) => void
}) {
  const cards = (p.cards as Array<Record<string, unknown>>) || []
  return (
    <div className="space-y-4">
      <Input
        label="Eyebrow"
        value={String(p.eyebrow || '')}
        onChange={(v) => onChange({ ...p, eyebrow: v })}
      />
      <Input
        label="Heading"
        value={String(p.heading || '')}
        onChange={(v) => onChange({ ...p, heading: v })}
      />
      <TextArea
        label="Descripción 1"
        value={String(p.description || '')}
        onChange={(v) => onChange({ ...p, description: v })}
      />
      <TextArea
        label="Descripción 2"
        value={String(p.description2 || '')}
        onChange={(v) => onChange({ ...p, description2: v })}
      />
      <Input
        label="Service Eyebrow"
        value={String(p.serviceEyebrow || '')}
        onChange={(v) => onChange({ ...p, serviceEyebrow: v })}
      />
      <Input
        label="Service Heading"
        value={String(p.serviceHeading || '')}
        onChange={(v) => onChange({ ...p, serviceHeading: v })}
      />
      <ArrayEditor
        label="Cards"
        items={cards}
        defaultItem={{ num: '', icon: 'Users', title: '', desc: '', accent: '', href: '' }}
        onChange={(v) => onChange({ ...p, cards: v })}
        renderItem={(c, _, update) => (
          <>
            <Input
              label="Número"
              value={String(c.num || '')}
              onChange={(v) => update({ ...c, num: v })}
            />
            <Input
              label="Icono (Users, CalendarDays, Compass, Layers)"
              value={String(c.icon || '')}
              onChange={(v) => update({ ...c, icon: v })}
            />
            <Input
              label="Título"
              value={String(c.title || '')}
              onChange={(v) => update({ ...c, title: v })}
            />
            <TextArea
              label="Descripción"
              value={String(c.desc || '')}
              onChange={(v) => update({ ...c, desc: v })}
              rows={2}
            />
            <Input
              label="Color acento"
              value={String(c.accent || '')}
              onChange={(v) => update({ ...c, accent: v })}
            />
            <Input
              label="URL"
              value={String(c.href || '')}
              onChange={(v) => update({ ...c, href: v })}
            />
          </>
        )}
      />
    </div>
  )
}

// ── Testimonials Editor ──

function TestimonialsEditor({
  props: p,
  onChange,
}: {
  props: Record<string, unknown>
  onChange: (p: Record<string, unknown>) => void
}) {
  const items = (p.testimonials as Array<Record<string, unknown>>) || []
  return (
    <div className="space-y-4">
      <Input
        label="Headline"
        value={String(p.headline || '')}
        onChange={(v) => onChange({ ...p, headline: v })}
      />
      <Input
        label="Eyebrow"
        value={String(p.testimonialEyebrow || '')}
        onChange={(v) => onChange({ ...p, testimonialEyebrow: v })}
      />
      <ArrayEditor
        label="Testimonios"
        items={items}
        defaultItem={{ name: '', handle: '', text: '', avatar: '' }}
        onChange={(v) => onChange({ ...p, testimonials: v })}
        renderItem={(t, _, update) => (
          <>
            <Input
              label="Nombre"
              value={String(t.name || '')}
              onChange={(v) => update({ ...t, name: v })}
            />
            <Input
              label="Handle"
              value={String(t.handle || '')}
              onChange={(v) => update({ ...t, handle: v })}
            />
            <TextArea
              label="Texto"
              value={String(t.text || '')}
              onChange={(v) => update({ ...t, text: v })}
              rows={2}
            />
            <Input
              label="Avatar URL"
              value={String(t.avatar || '')}
              onChange={(v) => update({ ...t, avatar: v })}
            />
          </>
        )}
      />
    </div>
  )
}

// ── Partners Editor ──

function PartnersEditor({
  props: p,
  onChange,
}: {
  props: Record<string, unknown>
  onChange: (p: Record<string, unknown>) => void
}) {
  const items = (p.partners as Array<Record<string, unknown>>) || []
  return (
    <div className="space-y-4">
      <Input
        label="Eyebrow"
        value={String(p.eyebrow || '')}
        onChange={(v) => onChange({ ...p, eyebrow: v })}
      />
      <Input
        label="Heading"
        value={String(p.heading || '')}
        onChange={(v) => onChange({ ...p, heading: v })}
      />
      <TextArea
        label="Descripción"
        value={String(p.description || '')}
        onChange={(v) => onChange({ ...p, description: v })}
      />
      <Input
        label="CTA Texto"
        value={String(p.ctaText || '')}
        onChange={(v) => onChange({ ...p, ctaText: v })}
      />
      <Input
        label="CTA Email"
        value={String(p.ctaEmail || '')}
        onChange={(v) => onChange({ ...p, ctaEmail: v })}
      />
      <ArrayEditor
        label="Aliados"
        items={items}
        defaultItem={{ name: '', src: '' }}
        onChange={(v) => onChange({ ...p, partners: v })}
        renderItem={(t, _, update) => (
          <>
            <Input
              label="Nombre"
              value={String(t.name || '')}
              onChange={(v) => update({ ...t, name: v })}
            />
            <Input
              label="Logo URL"
              value={String(t.src || '')}
              onChange={(v) => update({ ...t, src: v })}
            />
          </>
        )}
      />
    </div>
  )
}

// ── Comunidad CTA Editor ──

function ComunidadCtaEditor({
  props: p,
  onChange,
}: {
  props: Record<string, unknown>
  onChange: (p: Record<string, unknown>) => void
}) {
  const stats = (p.stats as Array<Record<string, unknown>>) || []
  const primary = (p.primaryCta as Record<string, string>) || {}
  const secondary = (p.secondaryCta as Record<string, string>) || {}
  return (
    <div className="space-y-4">
      <Input
        label="Eyebrow"
        value={String(p.eyebrow || '')}
        onChange={(v) => onChange({ ...p, eyebrow: v })}
      />
      <TextArea
        label="Headline"
        value={String(p.headline || '')}
        onChange={(v) => onChange({ ...p, headline: v })}
        rows={2}
      />
      <TextArea
        label="Descripción"
        value={String(p.description || '')}
        onChange={(v) => onChange({ ...p, description: v })}
        rows={3}
      />
      <div className="space-y-2 rounded-sm border border-zinc-200 bg-zinc-50 p-3">
        <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
          CTA Primario
        </span>
        <Input
          label="Label"
          value={primary.label || ''}
          onChange={(v) => onChange({ ...p, primaryCta: { ...primary, label: v } })}
        />
        <Input
          label="URL"
          value={primary.href || ''}
          onChange={(v) => onChange({ ...p, primaryCta: { ...primary, href: v } })}
        />
      </div>
      <div className="space-y-2 rounded-sm border border-zinc-200 bg-zinc-50 p-3">
        <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
          CTA Secundario
        </span>
        <Input
          label="Label"
          value={secondary.label || ''}
          onChange={(v) => onChange({ ...p, secondaryCta: { ...secondary, label: v } })}
        />
        <Input
          label="URL"
          value={secondary.href || ''}
          onChange={(v) => onChange({ ...p, secondaryCta: { ...secondary, href: v } })}
        />
      </div>
      <ArrayEditor
        label="Estadísticas"
        items={stats}
        defaultItem={{ icon: 'Users', end: 0, thousands: false, suffix: '+', label: '' }}
        onChange={(v) => onChange({ ...p, stats: v })}
        renderItem={(s, _, update) => (
          <>
            <Input
              label="Icono (Users, Palette, Mic)"
              value={String(s.icon || '')}
              onChange={(v) => update({ ...s, icon: v })}
            />
            <Input
              label="Valor final"
              value={String(s.end || '0')}
              onChange={(v) => update({ ...s, end: Number(v) || 0 })}
            />
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={!!s.thousands}
                onChange={(e) => update({ ...s, thousands: e.target.checked })}
              />
              Usar separador de miles
            </label>
            <Input
              label="Sufijo"
              value={String(s.suffix || '')}
              onChange={(v) => update({ ...s, suffix: v })}
            />
            <Input
              label="Label"
              value={String(s.label || '')}
              onChange={(v) => update({ ...s, label: v })}
            />
          </>
        )}
      />
    </div>
  )
}

// ── Fallback: edit raw JSON ──

function RawJsonEditor({
  props: p,
  onChange,
}: {
  props: Record<string, unknown>
  onChange: (p: Record<string, unknown>) => void
}) {
  const [json, setJson] = useState(JSON.stringify(p, null, 2))
  const [error, setError] = useState('')
  const handleApply = () => {
    try {
      const parsed = JSON.parse(json)
      onChange(parsed)
      setError('')
    } catch {
      setError('JSON inválido')
    }
  }
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Props (JSON)</p>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        rows={15}
        className="w-full border border-zinc-200 px-3 py-2 font-mono text-xs outline-none focus:border-[#8ECAE6]"
      />
      {error && <p className="text-xs text-[#E63946]">{error}</p>}
      <button
        type="button"
        onClick={handleApply}
        className="self-start border-2 border-[#023047] bg-[#023047] px-4 py-2 text-[10px] font-bold tracking-wider text-white uppercase hover:bg-[#023047]/90"
      >
        Aplicar JSON
      </button>
    </div>
  )
}

// ── Main Component ──

const COMPLEX_EDITORS: Record<
  string,
  React.FC<{ props: Record<string, unknown>; onChange: (p: Record<string, unknown>) => void }>
> = {
  'hero-carousel': HeroCarouselEditor,
  'what-is': WhatIsEditor,
  testimonials: TestimonialsEditor,
  partners: PartnersEditor,
  'comunidad-cta': ComunidadCtaEditor,
}

export function ComplexBlockEditor({ block, onSave, onClose }: Props) {
  const { isEditMode } = useEditMode()
  const [draft, setDraft] = useState(block.props)

  if (!isEditMode) return null

  const EditorComponent = COMPLEX_EDITORS[block.type]

  const displayName = block.type.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div className="fixed inset-y-0 right-0 z-[100] flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto flex w-full max-w-md flex-col border-l-2 border-zinc-900 bg-[#F0F8FF] shadow-[-8px_0_0_#111]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-zinc-200 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Editando
            </p>
            <h3 className="text-sm font-bold tracking-tight text-zinc-900">{displayName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {EditorComponent ? (
            <EditorComponent props={draft} onChange={setDraft} />
          ) : (
            <RawJsonEditor props={draft} onChange={setDraft} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t-2 border-zinc-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="border-2 border-zinc-300 px-4 py-2 text-[10px] font-bold tracking-widest text-zinc-600 uppercase hover:bg-zinc-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="border-2 border-[#023047] bg-[#023047] px-5 py-2 text-[10px] font-bold tracking-widest text-white uppercase hover:bg-[#023047]/90"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { getBlockSchema, type FieldSchema, type FieldType } from '@/lib/block-schema'
import { useEditMode } from '@/context/EditModeContext'
import { X } from 'lucide-react'
import { useState } from 'react'
import type { Block } from '@/components/shared/PageRenderer'

interface Props {
  block: Block
  onSave: (props: Record<string, unknown>) => void
  onClose: () => void
}

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

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#8ECAE6]"
      />
    </label>
  )
}

function Checkbox({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 border border-zinc-200 px-3 py-2 text-sm">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-[#023047]"
      />
      <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{label}</span>
    </label>
  )
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 cursor-pointer border border-zinc-200"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#HEX"
          className="flex-1 border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#8ECAE6]"
        />
      </div>
    </label>
  )
}

function ArrayFieldEditor({
  schema,
  values,
  onChange,
}: {
  schema: FieldSchema
  values: Record<string, unknown>[]
  onChange: (v: Record<string, unknown>[]) => void
}) {
  const add = () => {
    const defaultItem: Record<string, unknown> = {}
    if (schema.fields) {
      for (const f of schema.fields) {
        defaultItem[f.key] = f.default ?? ''
      }
    }
    onChange([...values, defaultItem])
  }

  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i))

  const updateItem = (i: number, v: Record<string, unknown>) => {
    const next = [...values]
    next[i] = v
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
          {schema.label} ({values.length})
        </span>
        <button
          type="button"
          onClick={add}
          disabled={schema.maxItems ? values.length >= schema.maxItems : false}
          className="rounded-sm border border-[#8ECAE6] px-2 py-0.5 text-[9px] font-bold tracking-wider text-[#023047] uppercase hover:bg-[#8ECAE6]/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Añadir
        </button>
      </div>
      {values.map((item, i) => (
        <div key={i} className="relative rounded-sm border border-zinc-200 bg-zinc-50 p-3">
          <button
            type="button"
            onClick={() => remove(i)}
            className="absolute top-1 right-1 rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700"
          >
            <X size={12} />
          </button>
          <div className="space-y-2 pr-5">
            {schema.fields?.map((field) => (
              <FieldRenderer
                key={field.key}
                schema={field}
                value={item[field.key]}
                onChange={(v) => updateItem(i, { ...item, [field.key]: v })}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ObjectFieldEditor({
  schema,
  values,
  onChange,
}: {
  schema: FieldSchema
  values: Record<string, unknown>
  onChange: (v: Record<string, unknown>) => void
}) {
  return (
    <div className="space-y-2 rounded-sm border border-zinc-200 bg-zinc-50 p-3">
      <span className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
        {schema.label}
      </span>
      <div className="space-y-2">
        {schema.fields?.map((field) => (
          <FieldRenderer
            key={field.key}
            schema={field}
            value={values[field.key]}
            onChange={(v) => onChange({ ...values, [field.key]: v })}
          />
        ))}
      </div>
    </div>
  )
}

function FieldRenderer({
  schema,
  value,
  onChange,
}: {
  schema: FieldSchema
  value: unknown
  onChange: (v: unknown) => void
}) {
  const type: FieldType = schema.type

  if (type === 'array') {
    return (
      <ArrayFieldEditor
        schema={schema}
        values={(value as Record<string, unknown>[]) || []}
        onChange={onChange as (v: Record<string, unknown>[]) => void}
      />
    )
  }

  if (type === 'object') {
    return (
      <ObjectFieldEditor
        schema={schema}
        values={(value as Record<string, unknown>) || {}}
        onChange={onChange as (v: Record<string, unknown>) => void}
      />
    )
  }

  if (type === 'richtext') {
    return (
      <TextArea
        label={schema.label}
        value={String(value ?? schema.default ?? '')}
        onChange={onChange as (v: string) => void}
      />
    )
  }

  if (type === 'number') {
    return (
      <NumberInput
        label={schema.label}
        value={Number(value ?? schema.default ?? 0)}
        onChange={onChange as (v: number) => void}
      />
    )
  }

  if (type === 'boolean') {
    return (
      <Checkbox
        label={schema.label}
        value={Boolean(value ?? schema.default ?? false)}
        onChange={onChange as (v: boolean) => void}
      />
    )
  }

  if (type === 'color') {
    return (
      <ColorInput
        label={schema.label}
        value={String(value ?? schema.default ?? '')}
        onChange={onChange as (v: string) => void}
      />
    )
  }

  // text, image, cta → default to Input
  return (
    <Input
      label={schema.label}
      value={String(value ?? schema.default ?? '')}
      onChange={onChange as (v: string) => void}
      placeholder={schema.placeholder}
    />
  )
}

function GenericBlockEditor({
  blockType,
  props: p,
  onChange,
}: {
  blockType: string
  props: Record<string, unknown>
  onChange: (p: Record<string, unknown>) => void
}) {
  const schema = getBlockSchema(blockType)
  if (!schema || schema.fields.length === 0) {
    return <RawJsonEditor props={p} onChange={onChange} />
  }

  return (
    <div className="space-y-4">
      {schema.fields.map((field) => (
        <FieldRenderer
          key={field.key}
          schema={field}
          value={p[field.key] ?? field.default}
          onChange={(v) => onChange({ ...p, [field.key]: v })}
        />
      ))}
    </div>
  )
}

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

export function ComplexBlockEditor({ block, onSave, onClose }: Props) {
  const { isEditMode } = useEditMode()
  const [draft, setDraft] = useState(block.props)

  if (!isEditMode) return null

  const schema = getBlockSchema(block.type)
  const hasFields = schema && schema.fields.length > 0
  const displayName =
    schema?.label || block.type.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div className="fixed inset-y-0 right-0 z-[100] flex">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      <div className="relative ml-auto flex w-full max-w-md flex-col border-l-2 border-zinc-900 bg-[#F0F8FF] shadow-[-8px_0_0_#111]">
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

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {hasFields ? (
            <GenericBlockEditor blockType={block.type} props={draft} onChange={setDraft} />
          ) : (
            <RawJsonEditor props={draft} onChange={setDraft} />
          )}
        </div>

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

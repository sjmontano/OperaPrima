'use client'

import { useEditMode } from '@/context/EditModeContext'
import { Check, RotateCcw, RotateCw, X } from 'lucide-react'
import { useState } from 'react'

interface FloatingSaveBarProps {
  onSave: () => Promise<void>
  onDiscard: () => void
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
  hasChanges: boolean
}

export function FloatingSaveBar({
  onSave,
  onDiscard,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  hasChanges,
}: FloatingSaveBarProps) {
  const { isEditMode } = useEditMode()
  const [saving, setSaving] = useState(false)

  if (!isEditMode) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 flex items-center gap-2 border-2 border-zinc-900 bg-[#F0F8FF] px-4 py-3 shadow-[6px_6px_0_#111]">
      {/* Undo / Redo */}
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className="flex items-center gap-1 rounded-sm px-2 py-1.5 text-[10px] font-bold tracking-wider text-zinc-600 uppercase transition-all hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <RotateCcw size={12} />
      </button>
      <button
        type="button"
        onClick={onRedo}
        disabled={!canRedo}
        className="flex items-center gap-1 rounded-sm px-2 py-1.5 text-[10px] font-bold tracking-wider text-zinc-600 uppercase transition-all hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <RotateCw size={12} />
      </button>

      <div className="mx-1 h-6 w-px bg-zinc-200" />

      {/* Status */}
      <span
        className={`text-[10px] font-bold tracking-wider uppercase ${
          hasChanges ? 'text-[#023047]' : 'text-zinc-400'
        }`}
      >
        {hasChanges ? 'Cambios sin guardar' : 'Sin cambios'}
      </span>

      <div className="mx-1 h-6 w-px bg-zinc-200" />

      {/* Discard */}
      {hasChanges && (
        <button
          type="button"
          onClick={onDiscard}
          disabled={saving}
          className="flex items-center gap-1 rounded-sm border-2 border-zinc-300 px-3 py-1.5 text-[10px] font-bold tracking-wider text-zinc-600 uppercase transition-all hover:border-[#E63946] hover:text-[#E63946] disabled:opacity-50"
        >
          <X size={12} />
          Descartar
        </button>
      )}

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        disabled={!hasChanges || saving}
        className="flex items-center gap-1.5 border-2 border-[#023047] bg-[#023047] px-4 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#111] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {saving ? (
          <span className="inline-block size-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          <Check size={13} />
        )}
        {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  )
}

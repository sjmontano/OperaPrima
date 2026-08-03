'use client'

import { useEditMode } from '@/context/EditModeContext'
import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { useApi } from '@/lib/useApi'
import { useQueryClient } from '@tanstack/react-query'
import { EditableText } from '@/components/editor/EditableText'
import { Check, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const ICON_OPTIONS = ['✦', '★', '◆', '●', '▸', '✧', '⬟', '♦']

interface AdConfig {
  icon: string
  text: string
  href: string
  bgColor: string
}

const DEFAULT_CONFIG: AdConfig = {
  icon: '✦',
  text: 'Convocatoria abierta — Residencia artística Mayo 2026',
  href: '/eventos',
  bgColor: '#E63946',
}

export function AdBar() {
  const { isEditMode } = useEditMode()
  const { currentUser } = useAuthModal()
  const [dismissed, setDismissed] = useState(false)
  const [saving, setSaving] = useState(false)
  const queryClient = useQueryClient()
  const { data: adConfig, isLoading } = useApi<AdConfig>('adbar', '/api/config/adbar')
  const [draft, setDraft] = useState<AdConfig>(DEFAULT_CONFIG)

  const config = { ...DEFAULT_CONFIG, ...adConfig }
  const loaded = !isLoading

  useEffect(() => {
    if (loaded) setDraft({ ...DEFAULT_CONFIG, ...adConfig })
  }, [loaded, adConfig])

  if (dismissed) return null
  if (!loaded) return null

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = (await import('@/lib/supabaseClient')).createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const token = session?.access_token
      const res = await fetch('/api/config/adbar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(draft),
      })
      if (!res.ok) throw new Error('Error al guardar')
      queryClient.setQueryData(['adbar', '/api/config/adbar'], draft)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative z-50 w-full" style={{ background: config.bgColor }}>
      <div className="mx-[100px] flex items-center justify-center gap-3 px-8 py-2.5 max-lg:mx-[48px] max-md:mx-[18px]">
        {isEditMode ? (
          <select
            value={draft.icon}
            onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
            className="border border-white/30 bg-white/10 px-1 py-0.5 text-[0.6rem] font-bold tracking-widest text-white uppercase"
          >
            {ICON_OPTIONS.map((ic) => (
              <option key={ic} value={ic} className="text-black">
                {ic}
              </option>
            ))}
          </select>
        ) : (
          <span className="hidden text-[0.6rem] font-bold tracking-widest text-white/60 uppercase sm:inline">
            {config.icon}
          </span>
        )}

        {isEditMode ? (
          <EditableText
            value={draft.text}
            onSave={(v) => setDraft({ ...draft, text: v })}
            className="text-center text-[0.62rem] font-bold tracking-widest text-white uppercase"
            as="p"
            singleLine
          />
        ) : (
          <p className="text-center text-[0.62rem] font-bold tracking-widest text-white uppercase">
            {config.text}
          </p>
        )}

        {isEditMode ? (
          <div className="flex items-center gap-1">
            <span className="text-[0.55rem] font-bold tracking-widest text-white/60 uppercase">
              Link:
            </span>
            <EditableText
              value={draft.href}
              onSave={(v) => setDraft({ ...draft, href: v.toLowerCase() })}
              className="text-[0.62rem] font-bold tracking-widest text-white/80 underline underline-offset-2"
              as="span"
              singleLine
            />
          </div>
        ) : (
          <Link
            href={config.href}
            className="hidden items-center gap-1 text-[0.62rem] font-bold tracking-widest whitespace-nowrap text-white/80 uppercase underline underline-offset-2 transition-colors hover:text-white sm:inline-flex"
          >
            Ver detalles →
          </Link>
        )}

        {isEditMode && currentUser?.rol === 'ADMIN' && (
          <>
            <label className="flex items-center gap-1">
              <span className="text-[0.55rem] font-bold tracking-widest text-white/60 uppercase">
                Fondo
              </span>
              <input
                type="color"
                value={draft.bgColor}
                onChange={(e) => setDraft({ ...draft, bgColor: e.target.value })}
                className="size-5 cursor-pointer border-0 bg-transparent"
              />
            </label>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1 border border-white/40 px-2 py-1 text-[0.5rem] font-bold tracking-widest text-white uppercase transition hover:bg-white/20 disabled:opacity-40"
            >
              <Check size={10} />
              {saving ? '...' : 'Guardar'}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Cerrar anuncio"
          className="absolute top-1/2 right-4 -translate-y-1/2 text-white/70 transition-colors hover:text-white"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

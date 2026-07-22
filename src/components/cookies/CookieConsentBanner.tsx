'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import type { CookiePreferences } from './cookieConsent'
import { DEFAULT_PREFERENCES, getStoredConsent, saveConsent } from './cookieConsent'

const CATEGORIES: {
  key: keyof CookiePreferences
  title: string
  desc: string
  locked?: boolean
}[] = [
  {
    key: 'essential',
    title: 'Esenciales',
    desc: 'Necesarias para el funcionamiento de la plataforma: autenticación, seguridad y sesión.',
    locked: true,
  },
  {
    key: 'functional',
    title: 'Funcionales',
    desc: 'Recuerdan tus preferencias (idioma, tema visual) para una experiencia personalizada.',
  },
  {
    key: 'analytics',
    title: 'Analíticas',
    desc: 'Recogen información anónima sobre el uso del sitio para ayudarnos a mejorar.',
  },
  {
    key: 'marketing',
    title: 'Marketing / Publicidad',
    desc: 'Permiten mostrar anuncios personalizados y medir su rendimiento. Sin esta categoría solo verás anuncios no personalizados.',
  },
]

export function CookieConsentBanner() {
  const [prefs, setPrefs] = useState<CookiePreferences>(
    () => getStoredConsent() ?? DEFAULT_PREFERENCES
  )
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!getStoredConsent()) {
      const timer = setTimeout(() => setVisible(true), 600)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = useCallback(() => {
    const all: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    saveConsent(all)
    setPrefs(all)
    setVisible(false)
  }, [])

  const acceptEssential = useCallback(() => {
    saveConsent(DEFAULT_PREFERENCES)
    setPrefs(DEFAULT_PREFERENCES)
    setVisible(false)
  }, [])

  const saveCustom = useCallback(() => {
    saveConsent(prefs)
    setVisible(false)
  }, [prefs])

  const toggle = useCallback((key: keyof CookiePreferences) => {
    if (key === 'essential') return
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  if (!visible) return null

  return (
    <div
      className="animate-slide-up fixed inset-x-0 bottom-0 z-50 border-t-2 border-[#111] bg-[#F0F8FF]"
      role="dialog"
      aria-label="Configuración de cookies"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-5 md:px-10">
        {!expanded ? (
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-[0.2em] text-[#F65B7F] uppercase">
                🍪 Este sitio usa cookies
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#52525B]">
                Utilizamos cookies propias y de terceros para mejorar tu experiencia en la
                plataforma.{' '}
                <Link
                  href="/cookies"
                  className="font-semibold text-[#111] underline-offset-2 hover:underline"
                >
                  Más información
                </Link>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={acceptEssential}
                className="border-2 border-[#111] bg-[#111] px-5 py-2.5 text-[10px] font-bold tracking-[0.2em] text-white uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#F65B7F] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Solo esenciales
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="border-2 border-[#F65B7F] bg-[#F65B7F] px-5 py-2.5 text-[10px] font-bold tracking-[0.2em] text-white uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Aceptar todas
              </button>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="border-2 border-[#111] px-5 py-2.5 text-[10px] font-bold tracking-[0.2em] text-[#111] uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#111] hover:text-white hover:shadow-[3px_3px_0_#F65B7F] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Configurar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-[#F65B7F] uppercase">
                  Preferencias de cookies
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#52525B]">
                  Gestiona qué cookies permites. Las esenciales siempre están activas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="rounded-sm border-2 border-[#111] px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-[#111] uppercase transition-all hover:bg-[#111] hover:text-white"
              >
                Volver
              </button>
            </div>
            <div className="mb-6 space-y-3">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.key}
                  className="flex items-start justify-between border-b border-[#E4E4E7] pb-3"
                >
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-[#111]">{cat.title}</p>
                    <p className="text-xs leading-relaxed text-[#52525B]">{cat.desc}</p>
                  </div>
                  <label className="relative flex shrink-0 cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={prefs[cat.key]}
                      disabled={cat.locked}
                      onChange={() => toggle(cat.key)}
                      className="peer sr-only"
                    />
                    <span className="block h-6 w-10 rounded-full border-2 border-[#111] bg-white transition-all peer-checked:border-[#F65B7F] peer-checked:bg-[#F65B7F] peer-disabled:opacity-50" />
                    <span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-[#111] transition-all peer-checked:translate-x-4 peer-checked:bg-white" />
                  </label>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={saveCustom}
                className="border-2 border-[#F65B7F] bg-[#F65B7F] px-5 py-2.5 text-[10px] font-bold tracking-[0.2em] text-white uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Guardar preferencias
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="border-2 border-[#111] px-5 py-2.5 text-[10px] font-bold tracking-[0.2em] text-[#111] uppercase transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#111] hover:text-white hover:shadow-[3px_3px_0_#F65B7F] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Aceptar todas
              </button>
              <Link
                href="/cookies"
                className="text-xs font-semibold text-[#52525B] underline-offset-2 hover:underline"
              >
                Política de cookies →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function AdBar() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="relative z-50 w-full bg-[#F65B7F]">
      <div className="mx-auto flex max-w-420 items-center justify-center gap-3 px-8 py-2.5">
        <span className="hidden text-[0.6rem] font-bold tracking-widest text-white/60 uppercase sm:inline">
          ✦
        </span>
        <p className="text-center text-[0.62rem] font-bold tracking-widest text-white uppercase">
          Convocatoria abierta — Residencia artística Mayo 2026
        </p>
        <Link
          href="/eventos"
          className="hidden items-center gap-1 text-[0.62rem] font-bold tracking-widest whitespace-nowrap text-white/80 uppercase underline underline-offset-2 transition-colors hover:text-white sm:inline-flex"
        >
          Ver detalles →
        </Link>
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

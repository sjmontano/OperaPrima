'use client'

import { FlipAuthCard } from '@/components/auth/FlipAuthCard'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function FlipCardWithMode() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') === 'registro' ? 'registro' : 'login'
  return <FlipAuthCard initialMode={mode} />
}

export default function AuthPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Fondo: captura difuminada del sitio simulada con gradiente editorial */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            'linear-gradient(135deg, oklch(0.97 0.004 340) 0%, oklch(0.93 0.008 340) 40%, oklch(0.88 0.012 165) 100%)',
        }}
      />
      {/* Grid overlay -- igual al hero */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
      {/* Fondo frosted con blur editorial */}
      <div className="absolute inset-0 -z-10 backdrop-blur-[6px]" aria-hidden />

      <Suspense fallback={null}>
        <FlipCardWithMode />
      </Suspense>
    </main>
  )
}

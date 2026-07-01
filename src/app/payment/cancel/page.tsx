'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentCancelPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">Pago cancelado</h1>

        <p className="mt-4">No se realizó ningún cargo.</p>
      </div>
    </main>
  )
}

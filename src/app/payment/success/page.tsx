'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1>¡Pago realizado con éxito!</h1>
      <p>Serás redirigido en unos segundos...</p>
    </main>
  )
}

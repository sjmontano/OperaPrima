import { useState } from 'react'
import { CalendarEvent } from './MentorEventsSection'

interface PurchaseModalProps {
  event: CalendarEvent
  onClose: () => void
}

export function PurchaseModal({ event, onClose }: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const max = event.cuposDisponibles && event.cuposDisponibles > 0 ? event.cuposDisponibles : 1

  const unitPrice = Number(event.price)
  const total = unitPrice * quantity

  async function handleCheckout() {
    try {
      setLoading(true)

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventoId: event.id,
          cantidad: quantity,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      window.location.href = data.url
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al iniciar el pago.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md border-2 border-zinc-900 bg-white p-6 shadow-[8px_8px_0_#111]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">{event.title}</h2>

        <p className="mt-2 text-sm text-zinc-600">{event.artist}</p>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold">Cantidad</label>

          <input
            type="number"
            min={1}
            max={max}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(max, Number(e.target.value))))}
            className="w-full border p-2"
          />
        </div>

        <div className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Precio</span>
            <span>${unitPrice.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Total</span>
            <span className="font-bold">${total.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-6 w-full border-2 border-[#E63946] bg-[#E63946] py-3 font-bold text-white uppercase hover:bg-white hover:text-[#E63946]"
        >
          {loading ? 'Redirigiendo...' : 'Pagar con Stripe'}
        </button>
      </div>
    </div>
  )
}

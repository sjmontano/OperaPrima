'use client'

import { CalendarEvent } from './MentorEventsSection'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'

interface Props {
  open: boolean
  event: CalendarEvent
  onClose: () => void
}

export function PurchaseModal({
  open,
  event,
  onClose,
}: Props) {
  const [quantity, setQuantity] = useState(1)

  if (!open) return null

  const max = event.cuposDisponibles ?? 1

  const total = Number(event.price) * quantity

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md border-2 border-zinc-900 bg-white shadow-[8px_8px_0_#111]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b-2 border-zinc-900 p-6">
          <h2 className="text-xl font-bold">
            Comprar entradas
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            {event.title}
          </p>
        </div>

        <div className="space-y-6 p-6">

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Precio por entrada
            </p>

            <p className="mt-1 text-lg font-bold">
              ${Number(event.price).toLocaleString('es-CO')}
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
              Cantidad
            </p>

            <div className="flex items-center justify-center gap-5">

              <button
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
                className="border-2 border-zinc-900 p-2"
              >
                <Minus size={16} />
              </button>

              <span className="text-2xl font-bold">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity((q) => Math.min(max, q + 1))
                }
                className="border-2 border-zinc-900 p-2"
              >
                <Plus size={16} />
              </button>

            </div>

            <p className="mt-3 text-center text-xs text-zinc-500">
              Cupos disponibles: {max}
            </p>

          </div>

          <div className="border-t pt-5">

            <div className="flex justify-between text-sm">
              <span>Total</span>

              <span className="text-lg font-bold">
                ${total.toLocaleString('es-CO')}
              </span>
            </div>

          </div>

          <button
            className="w-full border-2 border-[#E63946] bg-[#E63946] py-3 text-xs font-bold uppercase text-white transition hover:bg-white hover:text-[#E63946]"
          >
            Continuar
          </button>

        </div>
      </div>
    </div>
  )
}
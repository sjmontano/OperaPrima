'use client'

import { createClient } from '@/lib/supabaseClient'
import { CalendarEvent } from './EventsSection'
import { useState } from 'react'

export function EventModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isSoldOut = event.cuposDisponibles <= 0

  async function handlePurchase() {
    try {
      setLoading(true)
      setError('')

      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setError('Debes iniciar sesión para comprar entradas')
        return
      }

      const res = await fetch('/api/pagos/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventoId: event.id }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al procesar el pago')
        return
      }

      window.location.href = data.url
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-auto my-8 w-full max-w-2xl overflow-hidden border-2 border-zinc-900 bg-white shadow-[8px_8px_0_#111]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* IMAGEN */}
        <div className="relative h-64">
          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
        </div>

        {/* CONTENIDO */}
        <div className="space-y-5 p-6">
          {/* Título */}
          <div>
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{event.artist}</p>
          </div>

          {/* Stats */}
          <div className="flex gap-6 border-y py-3 text-sm text-zinc-600">
            <div>
              <span className="font-bold text-zinc-900">{event.likes}</span> likes
            </div>
            <div>
              <span className="font-bold text-zinc-900">{event.views}</span> vistas
            </div>
            <div>
              <span className="font-bold text-zinc-900">{event.comments}</span> comentarios
            </div>
          </div>

          {/* Información */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Ubicación</p>
              <p className="mt-1 text-sm text-zinc-800">{event.location}</p>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Fecha</p>
              <p className="mt-1 text-sm text-zinc-800">{event.date}</p>
            </div>

            {event.description && (
              <div>
                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                  Descripción
                </p>
                <p className="mt-1 text-sm leading-relaxed text-zinc-700">{event.description}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Cupos disponibles
              </p>
              <p className="mt-1 text-sm text-zinc-800">
                {event.cuposDisponibles} / {event.cuposTotales}
              </p>
            </div>
          </div>

          {error && (
            <div className="border-2 border-[#E63946] bg-[#E63946]/10 px-4 py-3 text-[0.65rem] font-bold tracking-widest text-[#E63946] uppercase">
              {error}
            </div>
          )}

          {/* Botón de compra */}
          {isSoldOut ? (
            <div className="pt-2">
              <button
                disabled
                className="w-full cursor-not-allowed border-2 border-zinc-300 bg-zinc-100 py-3 text-xs font-bold text-zinc-400 uppercase"
              >
                Agotado
              </button>
              <p className="mt-2 text-center text-xs font-bold text-red-500">
                Ya no hay cupos disponibles
              </p>
            </div>
          ) : (
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full border-2 border-[#E63946] bg-[#E63946] py-3 text-xs font-bold text-white uppercase transition hover:bg-white hover:text-[#E63946] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Redirigiendo a Wompi...'
                : `Comprar entradas — $${Number(event.price).toLocaleString('es-CO')}`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

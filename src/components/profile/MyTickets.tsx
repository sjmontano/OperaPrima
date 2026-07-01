'use client'

import { useEffect, useState } from 'react'
import TicketQrModal from './TicketQrModal'

interface Ticket {
  id: string
  qrCode: string | null
  usada: boolean
  usadaEn: string | null
  createdAt: string

  evento: {
    id: string
    titulo: string
    fecha: string
    ubicacion: string
    imagen: string | null
    precio: number
  }
}

export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)

  const [selected, setSelected] = useState<{
    qr: string
    evento: string
    usada: boolean
    usadaEn: string | null
  } | null>(null)

  useEffect(() => {
    loadTickets()
  }, [])

  async function loadTickets() {
    try {
      const res = await fetch('/api/perfil/entradas')

      if (!res.ok) {
        throw new Error('Error cargando entradas')
      }

      const data = await res.json()

      setTickets(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function showQr(id: string) {
    const res = await fetch(`/api/perfil/entradas/${id}/qr`)

    if (!res.ok) return

    const data = await res.json()

    setSelected(data)
    setOpen(true)
  }

  if (loading) {
    return (
      <div className="border-2 border-[#353535] bg-white p-8 shadow-[6px_6px_0_#111111]">
        <p className="text-center text-sm font-semibold text-[#353535]">Cargando entradas...</p>
      </div>
    )
  }

  return (
    <>
      <section className="border-2 border-[#353535] bg-white shadow-[6px_6px_0_#111111]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#353535] px-6 py-5">
          <h2 className="text-lg font-bold tracking-[0.18em] text-[#353535] uppercase">
            Mis entradas
          </h2>

          <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
            {tickets.length} {tickets.length === 1 ? 'entrada' : 'entradas'}
          </span>
        </div>

        {tickets.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-lg font-semibold text-[#353535]">
              Todavía no has comprado entradas.
            </p>

            <p className="mt-2 text-sm text-zinc-500">Cuando compres una entrada aparecerá aquí.</p>
          </div>
        ) : (
          <div>
            {tickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className={`grid gap-6 px-6 py-6 md:grid-cols-[2.5fr_1fr_1fr_auto] md:items-center ${
                  index !== tickets.length - 1 ? 'border-b border-zinc-200' : ''
                }`}
              >
                {/* Evento */}
                <div>
                  <h3 className="text-lg font-bold text-[#353535]">{ticket.evento.titulo}</h3>

                  <p className="mt-1 text-sm text-zinc-500">{ticket.evento.ubicacion}</p>
                </div>

                {/* Fecha */}
                <div>
                  <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Fecha</p>

                  <p className="mt-1 font-semibold text-[#353535]">
                    {new Date(ticket.evento.fecha).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Estado */}
                <div>
                  <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                    Estado
                  </p>

                  {ticket.usada ? (
                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                      <span className="h-2 w-2 rounded-full bg-red-600" />
                      Utilizada
                    </span>
                  ) : (
                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-green-600">
                      <span className="h-2 w-2 rounded-full bg-green-600" />
                      Disponible
                    </span>
                  )}
                </div>

                {/* Botón */}
                <div>
                  <button
                    onClick={() => showQr(ticket.id)}
                    className="border-2 border-[#111111] bg-[#E63946] px-5 py-2 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-white hover:text-[#E63946]"
                  >
                    Ver QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <TicketQrModal
        open={open}
        onClose={() => setOpen(false)}
        qr={selected?.qr ?? null}
        evento={selected?.evento ?? ''}
        usada={selected?.usada ?? false}
        usadaEn={selected?.usadaEn ?? null}
      />
    </>
  )
}

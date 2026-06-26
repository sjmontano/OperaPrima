import { CalendarEvent } from './MentorEventsSection'
import { useState } from 'react'
import { PurchaseModal } from './PurchaseModal'

export function EventModal({
  event,
  onClose,
  tipo
}: {
  event: CalendarEvent
  onClose: () => void
  tipo?: string
}) {
  const isSoldOut = (event.cuposDisponibles ? event.cuposDisponibles :0)  <= 0
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

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
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* CONTENIDO */}
        <div className="space-y-5 p-6">

          {/* Título */}
          <div>
            <h2 className="text-2xl font-bold">
              {event.title}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {event.artist}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6 border-y py-3 text-sm text-zinc-600">
            <div>
              <span className="font-bold text-zinc-900">
                {event.likes}
              </span>{' '}
              likes
            </div>

            <div>
              <span className="font-bold text-zinc-900">
                {event.views}
              </span>{' '}
              vistas
            </div>

            <div>
              <span className="font-bold text-zinc-900">
                {event.comments}
              </span>{' '}
              comentarios
            </div>
          </div>

          {/* Información */}
          <div className="space-y-4">

            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                Ubicación
              </p>

              <p className="mt-1 text-sm text-zinc-800">
                {event.location}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                Fecha
              </p>

              <p className="mt-1 text-sm text-zinc-800">
                {event.date}
              </p>
            </div>

            {event.description && (
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                  Descripción
                </p>

                <p className="mt-1 text-sm leading-relaxed text-zinc-700">
                  {event.description}
                </p>
              </div>
            )}

            {/** CUPOS DISPONIBLES */}
            {tipo=="MENTOR" && (
              <div>
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                Cupos disponibles
              </p>

              <p className="mt-1 text-sm text-zinc-800">
                {event.cuposDisponibles} / {event.cuposTotales}
              </p>
            </div>
            )}
            

            {/* URL */}

            {tipo=="COMUNIDAD" && (
              <>
                {event.urlPago && (
              <div className="pt-2">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                  Enlace de pago
                </p>

                <a
                  href={event.urlPago}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-blue-600 underline hover:text-blue-800"
                >
                  Ir al enlace de pago
                </a>
              </div>
            )}
              </>
            )}
            
          </div>

          {/* Botón */}
          
            {tipo=="MENTOR" && (<>
              {isSoldOut ? (
            <div className="pt-2">
              <button
                disabled
                className="w-full cursor-not-allowed border-2 border-zinc-300 bg-zinc-100 py-3 text-xs font-bold uppercase text-zinc-400"
              >
                Agotado
              </button>

              <p className="mt-2 text-center text-xs font-bold text-red-500">
                Ya no hay cupos disponibles
              </p>
            </div>
          ) : (
            <button className="w-full border-2 border-[#E63946] bg-[#E63946] py-3 text-xs font-bold uppercase text-white transition hover:bg-white hover:text-[#E63946]">
              Comprar entradas
            </button>
          )}</>

            )}

          
        </div>
      </div>
    </div>
  )
}
'use client'

interface Props {
  open: boolean
  onClose: () => void
  qr: string | null
  usada: boolean
  usadaEn: string | null
  createdAt: string
  evento: {
    titulo: string
    descripcion: string
    fecha: string
    ubicacion: string
    precio: number
    categoria: string
    disciplinas: string[]
    imagen: string | null
    cuposTotales: number
    cuposDisponibles: number
  }
}

export default function TicketQrModal({
  open,
  onClose,
  qr,
  usada,
  usadaEn,
  createdAt,
  evento,
}: Props) {
  if (!open) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border-2 border-zinc-900 bg-white shadow-[8px_8px_0_#111]"
      >
        {/* Imagen del evento */}
        {evento.imagen ? (
          <div className="flex w-full items-center justify-center border-b-2 border-zinc-900 bg-zinc-50 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={evento.imagen}
              alt={evento.titulo}
              className="max-h-72 w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center border-b-2 border-zinc-900 bg-zinc-100">
            <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
              {evento.categoria}
            </p>
          </div>
        )}

        {/* Header */}
        <div className="border-b-2 border-zinc-900 p-5">
          <h2 className="text-center text-xl leading-tight font-bold tracking-wide uppercase">
            {evento.titulo}
          </h2>
          <p className="mt-1 text-center text-xs font-semibold tracking-widest text-zinc-400 uppercase">
            {evento.categoria}
          </p>
        </div>

        <div className="p-5">
          {/* Descripción */}
          {evento.descripcion && (
            <div className="mb-4 border-2 border-zinc-900 bg-zinc-50 p-4">
              <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                Sobre el evento
              </p>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-[#353535]">
                {evento.descripcion}
              </p>
            </div>
          )}

          {/* Info del evento */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-sm">📅</span>
              <div>
                <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Fecha</p>
                <p className="mt-0.5 font-semibold text-[#353535]">
                  {new Date(evento.fecha).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-sm">📍</span>
              <div>
                <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                  Ubicación
                </p>
                <p className="mt-0.5 font-semibold text-[#353535]">{evento.ubicacion}</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t-2 border-dashed border-zinc-300" />

          {/* Info de la entrada */}
          <div className="flex items-center justify-between">
            {usada ? (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-red-600">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                Utilizada
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                Disponible
              </span>
            )}

            {usada && usadaEn && (
              <p className="text-xs text-zinc-400">
                {new Date(usadaEn).toLocaleDateString('es-ES')}
              </p>
            )}
          </div>

          {/* QR */}
          <div className="mt-4 flex flex-col items-center">
            {qr && (
              <img
                src={qr}
                alt="Código QR de la entrada"
                className="h-24 w-24 border-2 border-zinc-900"
              />
            )}
          </div>

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="mt-5 w-full border-2 border-zinc-900 bg-zinc-900 py-3 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-white hover:text-zinc-900"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

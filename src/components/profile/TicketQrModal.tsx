'use client'

interface Props {
  open: boolean
  onClose: () => void
  qr: string | null
  evento: string
  usada: boolean
  usadaEn: string | null
}

export default function TicketQrModal({ open, onClose, qr, evento, usada, usadaEn }: Props) {
  if (!open) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md border-2 border-zinc-900 bg-white shadow-[8px_8px_0_#111]"
      >
        <div className="border-b-2 border-zinc-900 p-6">
          <h2 className="text-center text-2xl font-bold">{evento}</h2>
        </div>

        <div className="p-6">
          {qr && <img src={qr} alt="Código QR" className="mx-auto w-72" />}

          <div className="mt-6 text-center">
            {usada ? (
              <>
                <p className="font-bold text-red-600">Entrada utilizada</p>

                {usadaEn && (
                  <p className="mt-2 text-sm text-zinc-500">{new Date(usadaEn).toLocaleString()}</p>
                )}
              </>
            ) : (
              <p className="font-bold text-green-600">Entrada disponible</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="mt-8 w-full border-2 border-zinc-900 bg-zinc-900 py-3 font-bold text-white transition hover:bg-white hover:text-zinc-900"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
import { DbProyecto } from './ProyectosSection'
import { CalendarDays, MapPin, X } from 'lucide-react'

interface ProyectoDetalleModalProps {
  proyecto: DbProyecto | null
  open: boolean
  onClose: () => void
  contactTermsText: string
}

export default function ProyectoDetalleModal({
  proyecto,
  open,
  onClose,
  contactTermsText,
}: ProyectoDetalleModalProps) {
  if (!proyecto) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto border-2 border-zinc-900 bg-white shadow-[6px_6px_0_#111]"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b-2 border-zinc-200 p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
                    Entidad
                  </p>

                  <h2 className="mt-1 text-3xl font-extrabold text-zinc-900">{proyecto.nombre}</h2>

                  <p className="mt-2 text-sm text-zinc-500">{proyecto.representante}</p>
                </div>

                <button
                  onClick={onClose}
                  className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-zinc-200 transition hover:border-zinc-900 hover:bg-zinc-100"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="grid gap-8 p-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-6">
                {proyecto.imagen && (
                  <img
                    src={proyecto.imagen}
                    alt={proyecto.nombre}
                    className="max-h-72 w-full border-2 border-zinc-200 object-cover"
                  />
                )}

                <div>
                  <h3 className="mb-2 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                    Descripción
                  </h3>

                  <p className="text-sm leading-relaxed text-zinc-700">{proyecto.descripcion}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                    ¿Qué buscan?
                  </h3>

                  <p className="text-sm leading-relaxed text-zinc-700">{proyecto.queBuscan}</p>
                </div>

                {proyecto.requisitos && (
                  <div>
                    <h3 className="mb-2 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                      Requisitos
                    </h3>

                    <p className="text-sm leading-relaxed whitespace-pre-line text-zinc-700">
                      {proyecto.requisitos}
                    </p>
                  </div>
                )}

                {proyecto.proceso && (
                  <div>
                    <h3 className="mb-2 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                      Proceso de postulación
                    </h3>

                    <p className="text-sm leading-relaxed whitespace-pre-line text-zinc-700">
                      {proyecto.proceso}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-5 border-l-2 border-zinc-200 pl-6">
                <div className="space-y-4 border-2 border-zinc-200 p-5">
                  <div className="flex items-center gap-2 text-sm text-zinc-700">
                    <CalendarDays size={15} className="text-zinc-400" />
                    <span>{new Date(proyecto.fechaLimite).toLocaleDateString('es-CO')}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-zinc-700">
                    <MapPin size={15} className="text-zinc-400" />
                    <span>{proyecto.ubicacion}</span>
                  </div>

                  <div>
                    <h3 className="mb-2 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                      Disciplinas
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {proyecto.disciplinas.map((disciplina: string) => (
                        <span
                          key={disciplina}
                          className="border border-zinc-200 px-2 py-1 text-[11px] font-bold tracking-wider text-zinc-500 uppercase"
                        >
                          {disciplina}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <a
                  href={
                    proyecto.contacto.startsWith('http')
                      ? proyecto.contacto
                      : `mailto:${proyecto.contacto}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center border-2 border-[#E63946] bg-[#E63946] px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition hover:bg-white hover:text-[#E63946]"
                >
                  Contactar
                </a>

                <p className="text-center text-[11px] leading-relaxed text-zinc-400">
                  {contactTermsText}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

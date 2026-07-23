'use client'

import { useApi } from '@/lib/useApi'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import ProyectoDetalleModal from './ProyectoExpandido'
import { ArrowUpRight, Quote } from 'lucide-react'
import { useRef, useState } from 'react'
import type { DbProyecto } from './ProyectosSection'

const TIPO_LABELS: Record<string, string> = {
  COMUNIDAD: 'Comunidad',
  ENTIDAD: 'Entidad',
  OPERA_PRIMA: 'Ópera Prima',
}

const TIPO_COLORS: Record<string, string> = {
  COMUNIDAD: '#8ECAE6',
  ENTIDAD: '#4682B4',
  OPERA_PRIMA: '#023047',
}

export function ProyectosDestacados() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState<DbProyecto | null>(null)

  const { data, isLoading } = useApi<{ proyectos: DbProyecto[] }>(
    'proyectos-destacados',
    '/api/proyectos?destacado=true'
  )

  const proyectos = data?.proyectos ?? []

  if (!isLoading && proyectos.length === 0) return null

  return (
    <>
      <section ref={sectionRef} className="w-full border-b-2 border-zinc-200 bg-[#F0F8FF]">
        <div className="mx-[100px] border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
          <div className="px-8 py-20">
            <TimelineAnimation as="div" animationNum={0} timelineRef={sectionRef}>
              <div className="mb-2 flex items-center gap-2">
                <Quote size={14} className="text-[#E63946]" />
                <p className="text-[0.6rem] font-bold tracking-[0.25em] text-zinc-400 uppercase">
                  Proyectos destacados de la comunidad
                </p>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
                Historias de proyectos exitosos que se han desarrollado a través de Ópera Prima.
                Iniciativas que empezaron como una idea en el tablero y hoy son una realidad.
              </p>
            </TimelineAnimation>

            {isLoading ? (
              <div className="mt-10 grid gap-8 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 animate-pulse rounded-lg border-2 border-zinc-200 bg-zinc-100"
                  />
                ))}
              </div>
            ) : (
              <div className="mt-10 grid gap-8 md:grid-cols-3">
                {proyectos.map((p, i) => (
                  <TimelineAnimation
                    key={p.id}
                    as="article"
                    animationNum={i + 1}
                    timelineRef={sectionRef}
                  >
                    <button
                      onClick={() => setSelected(p)}
                      className="group relative flex w-full flex-col border-2 border-zinc-200 bg-white text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_#023047]"
                    >
                      <div className="relative h-44 overflow-hidden">
                        {p.imagen ? (
                          <img
                            src={p.imagen}
                            alt={p.nombre}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#023047] to-[#219EBC]">
                            <span className="text-3xl font-bold text-white/60">
                              {p.nombre.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span
                          className="absolute top-3 left-3 rounded px-2 py-0.5 text-[0.55rem] font-bold tracking-wider text-white uppercase"
                          style={{ backgroundColor: TIPO_COLORS[p.tipo] ?? '#888' }}
                        >
                          {TIPO_LABELS[p.tipo] ?? p.tipo}
                        </span>
                      </div>
                      <div className="flex flex-col gap-3 p-5">
                        <h3 className="text-sm leading-snug font-bold text-zinc-900">{p.nombre}</h3>
                        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
                          {p.queBuscan}
                        </p>
                        <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-2">
                          <div>
                            <p className="text-[0.6rem] font-bold text-zinc-700">
                              {p.representante}
                            </p>
                            <p className="text-[0.55rem] text-zinc-400">{p.ubicacion}</p>
                          </div>
                          <ArrowUpRight
                            size={14}
                            className="text-zinc-300 transition-colors group-hover:text-[#023047]"
                          />
                        </div>
                      </div>
                    </button>
                  </TimelineAnimation>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <ProyectoDetalleModal
        proyecto={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        contactTermsText="Al contactar, aceptas los términos de uso de Ópera Prima."
      />
    </>
  )
}

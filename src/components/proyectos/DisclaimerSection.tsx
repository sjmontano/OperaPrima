'use client'

import { AlertTriangle } from 'lucide-react'

export function DisclaimerSection() {
  return (
    <section className="w-full border-b-2 border-zinc-200 bg-white">
      <div className="no-borders mx-[100px] border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
        <div className="px-8 py-12">
          <div className="mx-auto max-w-3xl border-2 border-zinc-100 bg-zinc-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-zinc-400" />
              <div>
                <p className="mb-1 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                  Aviso de responsabilidad
                </p>
                <p className="text-xs leading-relaxed text-zinc-500">
                  Ópera Prima actúa únicamente como plataforma de difusión de proyectos y
                  oportunidades. No nos hacemos responsables por el contenido, la veracidad, la
                  legalidad ni el desarrollo de los proyectos publicados por terceros (comunidad o
                  entidades). Recomendamos a los usuarios verificar la información de cada proyecto
                  antes de participar y tomar las precauciones necesarias al establecer contacto con
                  los responsables. Los proyectos marcados como &quot;Ópera Prima&quot; son
                  gestionados directamente por nuestro equipo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowUpRight, Quote } from 'lucide-react'
import { useRef } from 'react'

const SUCCESS_STORIES = [
  {
    title: 'Galería Itinerante: del aula a la exposición',
    excerpt:
      'Un grupo de 12 artistas visuales lanzó su primera exposición colectiva gracias a un proyecto colaborativo gestionado en Ópera Prima. La muestra recorrió 5 ciudades del país.',
    author: 'Laura Jiménez',
    role: 'Artes Visuales',
    image:
      'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=600&h=400&auto=format&fit=crop&q=70',
  },
  {
    title: 'Residencia Artística "Río Creativo"',
    excerpt:
      'Una convocatoria abierta por una entidad cultural que encontró en nuestro tablero a 5 jóvenes talentos para una residencia de creación en el Pacífico colombiano.',
    author: 'Fundación Río Abierto',
    role: 'Entidad',
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&auto=format&fit=crop&q=70',
  },
  {
    title: 'Encuentro de Música Experimental',
    excerpt:
      'De una idea publicada en el tablero nació un festival autogestionado por la comunidad. Más de 200 asistentes y 15 bandas emergentes en escena.',
    author: 'Andrés Ospina',
    role: 'Música',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&auto=format&fit=crop&q=70',
  },
]

export function ProyectosDestacados() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
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

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {SUCCESS_STORIES.map((story, i) => (
              <TimelineAnimation
                key={story.title}
                as="article"
                animationNum={i + 1}
                timelineRef={sectionRef}
              >
                <div className="group relative flex flex-col border-2 border-zinc-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_#023047]">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-col gap-3 p-5">
                    <h3 className="text-sm leading-snug font-bold text-zinc-900">{story.title}</h3>
                    <p className="text-xs leading-relaxed text-zinc-500">{story.excerpt}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-2">
                      <div>
                        <p className="text-[0.6rem] font-bold text-zinc-700">{story.author}</p>
                        <p className="text-[0.55rem] text-zinc-400">{story.role}</p>
                      </div>
                      <ArrowUpRight
                        size={14}
                        className="text-zinc-300 transition-colors group-hover:text-[#023047]"
                      />
                    </div>
                  </div>
                </div>
              </TimelineAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

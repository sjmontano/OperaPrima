'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

export interface ProyectoFormData {
  nombre: string
  representante: string
  disciplinas: string[]
  ubicacion: string
  descripcion: string
  queBuscan: string
  requisitos: string
  proceso: string
  imagen: File | null
  contacto: string
  fechaLimite: string
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: ProyectoFormData) => Promise<void>
}

const INITIAL: ProyectoFormData = {
  nombre: '',
  representante: '',
  disciplinas: [],
  ubicacion: '',
  descripcion: '',
  queBuscan: '',
  requisitos: '',
  proceso: '',
  imagen: null,
  contacto: '',
  fechaLimite: '',
}

const DISCIPLINES = [
  'Música',
  'Artes Visuales',
  'Danza',
  'Teatro',
  'Performance',
  'Circo',
  'Audiovisual',
  'Literatura',
]

export function ProyectosFormModal({ open, onClose, onSubmit }: Props) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ProyectoFormData>({ ...INITIAL })
  const [isEntity, setIsEntity] = useState(false)

  if (!open) return null

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setForm((prev) => ({ ...prev, imagen: file }))
  }

  function toggleDisciplina(d: string) {
    setForm((prev) => ({
      ...prev,
      disciplinas: prev.disciplinas.includes(d)
        ? prev.disciplinas.filter((x) => x !== d)
        : [...prev.disciplinas, d],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      await onSubmit(form)
      handleClose()
    } catch {
      console.error('Error')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setForm({ ...INITIAL })
    setIsEntity(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-200 flex items-start justify-center overflow-y-auto bg-black/40 p-6 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-2xl border-2 border-zinc-900 bg-white shadow-[8px_8px_0_#111]"
      >
        <div className="flex items-center justify-between border-b-2 border-zinc-200 px-8 py-6">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase">
              Publicar proyecto
            </p>
            <h2 className="mt-1 text-2xl font-bold">Nuevo proyecto</h2>
          </div>
          <button type="button" onClick={handleClose} className="transition hover:text-[#E63946]">
            <X />
          </button>
        </div>

        {/* Entity toggle */}
        <div className="border-b-2 border-zinc-100 px-8 py-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isEntity}
              onChange={(e) => setIsEntity(e.target.checked)}
              className="h-4 w-4 accent-[#023047]"
            />
            <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Soy una entidad / empresa (no tengo cuenta)
            </span>
          </label>
          {isEntity && (
            <p className="mt-2 text-xs text-zinc-400">
              Puedes publicar sin registrarte. Tu proyecto aparecerá como &quot;Entidad&quot; en el
              tablero.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-8">
          {/* Imagen */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Imagen del proyecto
            </label>
            <label className="flex cursor-pointer items-center justify-center border-2 border-zinc-200 px-4 py-3 text-sm font-medium transition hover:border-[#023047]">
              {form.imagen ? form.imagen.name : 'Seleccionar imagen'}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Nombre del proyecto
              </label>
              <input
                required
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Nombre del representante
              </label>
              <input
                required
                name="representante"
                value={form.representante}
                onChange={handleChange}
                className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Ubicación
              </label>
              <input
                required
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                placeholder="Bogotá"
                className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Fecha límite
              </label>
              <input
                required
                type="date"
                name="fechaLimite"
                value={form.fechaLimite}
                onChange={handleChange}
                className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
              />
            </div>
          </div>

          {/* Disciplinas */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Disciplinas relacionadas
            </label>
            <div className="flex flex-wrap gap-2">
              {DISCIPLINES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDisciplina(d)}
                  className={`border-2 px-3 py-1 text-xs font-bold tracking-widest uppercase transition-all ${
                    form.disciplinas.includes(d)
                      ? 'border-[#023047] bg-[#023047] text-[#F0F8FF]'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Descripción del proyecto
            </label>
            <textarea
              required
              rows={4}
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />
          </div>

          {/* Que buscan */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              ¿Qué buscan?
            </label>
            <textarea
              required
              rows={3}
              name="queBuscan"
              value={form.queBuscan}
              onChange={handleChange}
              placeholder="Una frase clara sobre lo que necesitan…"
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />
          </div>

          {/* Requisitos */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Requisitos
            </label>
            <textarea
              rows={3}
              name="requisitos"
              value={form.requisitos}
              onChange={handleChange}
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />
          </div>

          {/* Proceso */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Proceso de postulación
            </label>
            <textarea
              rows={3}
              name="proceso"
              value={form.proceso}
              onChange={handleChange}
              placeholder="Pasos para postularse…"
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />
          </div>

          {/* Contacto */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Correo o red social de contacto
            </label>
            <input
              required
              name="contacto"
              value={form.contacto}
              onChange={handleChange}
              placeholder="correo@ejemplo.com / @usuario"
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="border-2 border-zinc-300 px-6 py-3 text-xs font-bold tracking-widest uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="border-2 border-[#E63946] bg-[#E63946] px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition hover:bg-white hover:text-[#E63946]"
            >
              {loading ? 'Publicando...' : 'Publicar proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export interface EventFormData {
  titulo: string
  descripcion: string
  categoria: string
  disciplinas: string[]
  fecha: string
  ubicacion: string
  precio: string
  cuposTotales: string
  urlPago: string
  imagen: File | null
}

interface Props {
  open: boolean
  editing?: boolean
  initial?: Partial<EventFormData>
  onClose: () => void
  onSubmit: (data: EventFormData) => Promise<void>
  onDelete?: () => Promise<void>
}

const INITIAL_FORM: EventFormData = {
  titulo: '',
  descripcion: '',
  categoria: '',
  disciplinas: [],
  fecha: '',
  ubicacion: '',
  precio: '',
  cuposTotales: '',
  urlPago: '',
  imagen: null,
}

const DISCIPLINES = ['Música', 'Artes Visuales', 'Danza', 'Teatro', 'Performance', 'Circo']

export function ComunidadCreateEventModal({
  open,
  editing,
  initial,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<EventFormData>({ ...INITIAL_FORM, ...initial })

  useEffect(() => {
    if (open) {
      setForm({ ...INITIAL_FORM, ...initial })
      setErrors({})
    }
  }, [open, initial])

  if (!open) return null

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setForm((prev) => ({ ...prev, imagen: file }))
  }

  function addDisciplina(d: string) {
    if (!form.disciplinas.includes(d)) {
      setForm((prev) => ({ ...prev, disciplinas: [...prev.disciplinas, d] }))
    }
  }

  function removeDisciplina(d: string) {
    setForm((prev) => ({ ...prev, disciplinas: prev.disciplinas.filter((x) => x !== d) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      await onSubmit(form)
      handleClose()
    } catch {
      console.error('Error al guardar evento')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setForm(INITIAL_FORM)
    onClose()
  }

  function validate() {
    const newErrors: Record<string, string> = {}

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const eventDate = form.fecha ? new Date(form.fecha) : null

    const price = Number(form.precio)
    const cupos = Number(form.cuposTotales)

    if (!form.titulo.trim()) newErrors.titulo = 'El título es obligatorio'

    if (!form.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria'

    if (!form.categoria.trim()) newErrors.categoria = 'La categoría es obligatoria'

    if (!form.fecha) {
      newErrors.fecha = 'La fecha es obligatoria'
    } else if (eventDate && eventDate < today) {
      newErrors.fecha = 'La fecha no puede ser menor a hoy'
    }

    if (!form.ubicacion.trim()) newErrors.ubicacion = 'La ubicación es obligatoria'

    if (form.precio === '') {
      newErrors.precio = 'El precio es obligatorio'
    } else if (isNaN(price)) {
      newErrors.precio = 'El precio debe ser un número'
    } else if (price < 0) {
      newErrors.precio = 'El precio no puede ser negativo'
    }

    if (form.cuposTotales === '') {
      newErrors.cuposTotales = 'Los cupos son obligatorios'
    } else if (isNaN(cupos)) {
      newErrors.cuposTotales = 'Los cupos deben ser un número'
    } else if (cupos < 1) {
      newErrors.cuposTotales = 'Debe haber al menos 1 cupo'
    }

    if (!form.imagen && !editing) {
      newErrors.imagen = 'Debes seleccionar una imagen'
    }

    if (form.urlPago) {
      try {
        new URL(form.urlPago)
      } catch {
        newErrors.urlPago = 'La URL no es válida'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
            <p className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase">Comunidad</p>
            <h2 className="mt-1 text-2xl font-bold">
              {editing ? 'Editar evento' : 'Crear evento'}
            </h2>
          </div>
          <button type="button" onClick={handleClose} className="transition hover:text-[#E63946]">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          {/* Imagen */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Imagen del evento
            </label>
            <label className="flex cursor-pointer items-center justify-center border-2 border-zinc-200 px-4 py-3 text-sm font-medium transition hover:border-[#023047]">
              {form.imagen ? form.imagen.name : 'Seleccionar imagen'}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
            {errors.imagen && (
              <p className="mt-1 text-[0.6rem] font-bold tracking-widest text-[#E63946] uppercase">
                {errors.imagen}
              </p>
            )}
          </div>

          {/* Titulo */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Nombre del evento
            </label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />
            {errors.titulo && (
              <p className="mt-1 text-[0.6rem] font-bold tracking-widest text-[#E63946] uppercase">
                {errors.titulo}
              </p>
            )}
          </div>

          {/* Descripcion */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Descripción
            </label>
            <textarea
              rows={5}
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />
            {errors.descripcion && (
              <p className="mt-1 text-[0.6rem] font-bold tracking-widest text-[#E63946] uppercase">
                {errors.descripcion}
              </p>
            )}
          </div>

          {/* Categoria / Tipo de evento */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Tipo de evento
            </label>
            <input
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              placeholder="Taller, Concierto, Exposición…"
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />

            {errors.categoria && (
              <p className="mt-1 text-[0.6rem] font-bold tracking-widest text-[#E63946] uppercase">
                {errors.categoria}
              </p>
            )}
          </div>

          {/* Disciplinas asociadas */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Disciplinas asociadas
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              {DISCIPLINES.map((d) => {
                const isSelected = form.disciplinas.includes(d)
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => (isSelected ? removeDisciplina(d) : addDisciplina(d))}
                    className={`border-2 px-3 py-1 text-xs font-bold tracking-widest uppercase transition-all ${
                      isSelected
                        ? 'border-[#023047] bg-[#023047] text-[#F0F8FF]'
                        : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                    }`}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
            {form.disciplinas.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.disciplinas.map((d) => (
                  <span
                    key={d}
                    className="bg-[#8ECAE6]/20 px-2 py-0.5 text-[0.6rem] font-bold tracking-widest text-[#023047] uppercase"
                  >
                    {d}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />

            {errors.fecha && (
              <p className="mt-1 text-[0.6rem] font-bold tracking-widest text-[#E63946] uppercase">
                {errors.fecha}
              </p>
            )}
          </div>

          {/* Ubicacion */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Ubicación
            </label>
            <input
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="Bogotá"
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />
            {errors.ubicacion && (
              <p className="mt-1 text-[0.6rem] font-bold tracking-widest text-[#E63946] uppercase">
                {errors.ubicacion}
              </p>
            )}
          </div>

          {/* CUPOS */}
          <div>
            <label className="mb-2 block text-xs font-bold text-zinc-500 uppercase">
              Cupos totales
            </label>

            <input
              type="number"
              name="cuposTotales"
              value={form.cuposTotales}
              onChange={handleChange}
              className="w-full border-2 border-zinc-200 px-4 py-3"
            />

            {errors.cuposTotales && (
              <p className="mt-1 text-[0.6rem] font-bold tracking-widest text-[#E63946] uppercase">
                {errors.cuposTotales}
              </p>
            )}
          </div>

          {/* Precio */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Precio
            </label>
            <input
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="$120.000"
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />

            {errors.precio && (
              <p className="mt-1 text-[0.6rem] font-bold tracking-widest text-[#E63946] uppercase">
                {errors.precio}
              </p>
            )}
          </div>

          {/* Link */}
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Link
            </label>
            <input
              name="urlPago"
              value={form.urlPago}
              onChange={handleChange}
              placeholder="https://"
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />

            {errors.urlPago && (
              <p className="mt-1 text-[0.6rem] font-bold tracking-widest text-[#E63946] uppercase">
                {errors.urlPago}
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-between gap-4 pt-4">
            <div>
              {editing && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="border-2 border-[#E63946] px-6 py-3 text-xs font-bold tracking-widest text-[#E63946] uppercase transition hover:bg-[#E63946] hover:text-white"
                >
                  Eliminar
                </button>
              )}
            </div>
            <div className="flex gap-4">
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
                {loading ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear evento'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

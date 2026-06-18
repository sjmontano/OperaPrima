'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

export interface EventFormData {
  titulo: string

  descripcion: string

  categoria: string

  fecha: string

  ubicacion: string

  precio: string

  imagen: File | null
}

interface Props {
  open: boolean

  onClose: () => void

  onSubmit: (data: EventFormData) => Promise<void>
}

const INITIAL_FORM: EventFormData = {
  titulo: '',

  descripcion: '',

  categoria: '',

  fecha: '',

  ubicacion: '',

  precio: '',

  imagen: null,
}

export function CreateEventModal({
  open,

  onClose,

  onSubmit,
}: Props) {
  const [loading, setLoading] = useState(false)

  const [form, setForm] =
    useState<EventFormData>(INITIAL_FORM)

  if (!open)
    return null

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target

    setForm(prev => ({

      ...prev,

      [name]: value

    }))
  }

  function handleImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0]

    if (!file)
      return

    setForm(prev => ({

      ...prev,

      imagen: file

    }))
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    try {

      setLoading(true)

      await onSubmit(form)

      handleClose();

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)

    }
  }

  function handleClose() {

  setForm(INITIAL_FORM)

  onClose()

}

  return (
    <div

      className='fixed inset-0 z-200 flex items-start justify-center overflow-y-auto bg-black/40 p-6 backdrop-blur-sm'

      onClick={handleClose}

    >

      <div

        onClick={e => e.stopPropagation()}

        className='my-8 w-full max-w-2xl border-2 border-zinc-900 bg-white shadow-[8px_8px_0_#111]'

      >

        {/* Header */}

        <div className='flex items-center justify-between border-b-2 border-zinc-200 px-8 py-6'>

          <div>

            <p className='text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase'>

              Mentor

            </p>

            <h2 className='mt-1 text-2xl font-bold'>

              Crear evento

            </h2>

          </div>

          <button

            type='button'

            onClick={handleClose}

            className='transition hover:text-[#E63946]'

          >

            <X />

          </button>

        </div>

        {/* Formulario */}

        <form

          onSubmit={handleSubmit}

          className='space-y-6 p-8'

        >

          {/* Titulo */}

          <div>

            <label className='mb-2 block text-xs font-bold tracking-widest uppercase text-zinc-500'>

              Título

            </label>

            <input

              required

              name='titulo'

              value={form.titulo}

              onChange={handleChange}

              className='w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none'

            />

          </div>

          {/* Descripción */}

          <div>

            <label className='mb-2 block text-xs font-bold tracking-widest uppercase text-zinc-500'>

              Descripción

            </label>

            <textarea

              required

              rows={5}

              name='descripcion'

              value={form.descripcion}

              onChange={handleChange}

              className='w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none'

            />

          </div>

          {/* Categoria */}

          <div>

            <label className='mb-2 block text-xs font-bold tracking-widest uppercase text-zinc-500'>

              Categoría

            </label>

            <input

              required

              name='categoria'

              value={form.categoria}

              onChange={handleChange}

              placeholder='Taller'

              className='w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none'

            />

          </div>

          {/* Fecha */}

          <div>

            <label className='mb-2 block text-xs font-bold tracking-widest uppercase text-zinc-500'>

              Fecha

            </label>

            <input

              required

              type='date'

              name='fecha'

              value={form.fecha}

              onChange={handleChange}

              className='w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none'

            />

          </div>

          {/* Ubicación */}

          <div>

            <label className='mb-2 block text-xs font-bold tracking-widest uppercase text-zinc-500'>

              Ubicación

            </label>

            <input

              required

              name='ubicacion'

              value={form.ubicacion}

              onChange={handleChange}

              placeholder='Bogotá'

              className='w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none'

            />

          </div>

          {/* Precio */}

          <div>

            <label className='mb-2 block text-xs font-bold tracking-widest uppercase text-zinc-500'>

              Precio

            </label>

            <input

              required

              name='precio'

              value={form.precio}

              onChange={handleChange}

              placeholder='$120.000'

              className='w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none'

            />

          </div>

          {/* Imagen */}

          <div>

            <label className='mb-2 block text-xs font-bold tracking-widest uppercase text-zinc-500'>

              Imagen

            </label>

            <label
    className="flex cursor-pointer items-center justify-center border-2 border-zinc-200 px-4 py-3 text-sm font-medium transition hover:border-[#023047]"
  >

    {
      form.imagen
        ? form.imagen.name
        : 'Seleccionar imagen'
    }

    <input

      type="file"

      accept="image/*"

      onChange={handleImage}

      className="hidden"

      required

    />

  </label>

          </div>

          {/* Botones */}

          <div className='flex justify-end gap-4 pt-4'>

            <button

              type='button'

              onClick={handleClose}

              className='border-2 border-zinc-300 px-6 py-3 text-xs font-bold tracking-widest uppercase'

            >

              Cancelar

            </button>

            <button

              type='submit'

              disabled={loading}

              className='border-2 border-[#E63946] bg-[#E63946] px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition hover:bg-white hover:text-[#E63946]'

            >

              {loading

                ? 'Creando...'

                : 'Crear evento'}

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}
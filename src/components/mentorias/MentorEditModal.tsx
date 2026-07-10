'use client'

import { useEffect, useState } from 'react'
import { X, Upload, Trash2 } from 'lucide-react'

export interface MentorFormData {
  usuarioId: string
  name: string
  title: string
  location: string
  focus: string
  notes: string[]
  galleryImages: { url: string; alt: string }[]
  active: boolean
  orden: number
}

export interface MentorDB {
  id: string
  usuarioId: string | null
  name: string
  title: string
  location: string
  focus: string
  notes: string[]
  galleryImages: { url: string; alt: string }[] | null
  active: boolean
  orden: number
  usuario?: {
    id: string
    username: string
    firstName: string
    lastName: string
    email: string
    perfil?: { avatar: string | null; artisticName: string | null } | null
  } | null
}

interface Props {
  open: boolean
  mentor?: MentorDB | null
  onClose: () => void
  onSave: (data: MentorFormData) => Promise<void>
}

async function searchUsers(q: string) {
  const res = await fetch(`/api/usuarios?q=${encodeURIComponent(q)}`)
  if (!res.ok) return []
  const data = await res.json()
  return data.usuarios
}

const INITIAL_FORM: MentorFormData = {
  usuarioId: '',
  name: '',
  title: '',
  location: '',
  focus: '',
  notes: ['', '', ''],
  galleryImages: [],
  active: true,
  orden: 0,
}

interface UserResult {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  perfil?: { avatar: string | null; artisticName: string | null } | null
}

export function MentorEditModal({ open, mentor, onClose, onSave }: Props) {
  const [form, setForm] = useState<MentorFormData>({ ...INITIAL_FORM })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [userResults, setUserResults] = useState<UserResult[]>([])
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (open) {
      if (mentor) {
        setForm({
          usuarioId: mentor.usuarioId || '',
          name: mentor.name,
          title: mentor.title,
          location: mentor.location,
          focus: mentor.focus,
          notes:
            mentor.notes.length >= 3
              ? mentor.notes
              : [...mentor.notes, ...Array(3 - mentor.notes.length).fill('')],
          galleryImages: mentor.galleryImages || [],
          active: mentor.active,
          orden: mentor.orden,
        })
        if (mentor.usuario) {
          const u = mentor.usuario
          setUserSearch(`${u.firstName} ${u.lastName} (${u.email})`)
        }
      } else {
        setForm({ ...INITIAL_FORM })
        setUserSearch('')
      }
      setErrors({})
      setUserResults([])
      setShowUserSearch(false)
    }
  }, [open, mentor])

  useEffect(() => {
    if (!userSearch || userSearch.length < 2) {
      setUserResults([])
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      const results = await searchUsers(userSearch)
      setUserResults(results)
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [userSearch])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleNoteChange(index: number, value: string) {
    setForm((prev) => {
      const notes = [...prev.notes]
      notes[index] = value
      return { ...prev, notes }
    })
  }

  function addNote() {
    setForm((prev) => ({ ...prev, notes: [...prev.notes, ''] }))
  }

  function removeNote(index: number) {
    setForm((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index),
    }))
  }

  function selectUser(user: UserResult) {
    setForm((prev) => ({ ...prev, usuarioId: user.id }))
    const displayName = user.perfil?.artisticName || `${user.firstName} ${user.lastName}`
    setUserSearch(`${displayName} (${user.email})`)
    setShowUserSearch(false)
    setUserResults([])
    if (!form.name) {
      setForm((prev) => ({ ...prev, name: displayName }))
    }
  }

  function clearUser() {
    setForm((prev) => ({ ...prev, usuarioId: '' }))
    setUserSearch('')
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload/image', { method: 'POST', body: fd })
    if (res.ok) {
      const data = await res.json()
      setForm((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, { url: data.url, alt: form.name || 'Mentor' }],
      }))
    }
  }

  function removeGalleryImage(index: number) {
    setForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }))
  }

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio'
    if (!form.title.trim()) newErrors.title = 'El título es obligatorio'
    if (!form.location.trim()) newErrors.location = 'La ubicación es obligatoria'
    if (!form.focus.trim()) newErrors.focus = 'El enfoque es obligatorio'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      await onSave(form)
      onClose()
    } catch {
      console.error('Error al guardar mentor')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-200 flex items-start justify-center overflow-y-auto bg-black/40 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-2xl border-2 border-zinc-900 bg-white shadow-[8px_8px_0_#111]"
      >
        <div className="flex items-center justify-between border-b-2 border-zinc-200 px-8 py-6">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase">Mentores</p>
            <h2 className="mt-1 text-2xl font-bold">{mentor ? 'Editar mentor' : 'Nuevo mentor'}</h2>
          </div>
          <button type="button" onClick={onClose} className="transition hover:text-[#E63946]">
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Vincular a usuario existente
            </label>
            <div className="relative">
              <div className="flex gap-2">
                <input
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value)
                    setShowUserSearch(true)
                    if (!e.target.value) setForm((prev) => ({ ...prev, usuarioId: '' }))
                  }}
                  onFocus={() => setShowUserSearch(true)}
                  placeholder="Buscar por nombre, email o username..."
                  className="w-full border-2 border-zinc-200 px-4 py-3 text-sm focus:border-[#023047] focus:outline-none"
                />
                {form.usuarioId && (
                  <button
                    type="button"
                    onClick={clearUser}
                    className="border-2 border-zinc-200 px-3 text-xs text-zinc-500 hover:border-[#E63946] hover:text-[#E63946]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {showUserSearch && userResults.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto border-2 border-zinc-200 bg-white shadow-lg">
                  {userResults.map((u: UserResult) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => selectUser(u)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-zinc-50"
                    >
                      {u.perfil?.avatar ? (
                        <img
                          src={u.perfil.avatar}
                          alt=""
                          className="size-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-500">
                          {u.firstName[0]}
                          {u.lastName[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-zinc-800">
                          {u.perfil?.artisticName || `${u.firstName} ${u.lastName}`}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          @{u.username} — {u.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searching && <p className="mt-1 text-xs text-zinc-400">Buscando...</p>}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Nombre del mentor
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />
            {errors.name && (
              <p className="mt-1 text-[0.6rem] font-bold tracking-widest text-[#E63946] uppercase">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Título / Especialidad
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Portafolio, convocatorias y becas"
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />
            {errors.title && (
              <p className="mt-1 text-[0.6rem] font-bold tracking-widest text-[#E63946] uppercase">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Ubicación
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Bogotá, presencial + online"
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />
            {errors.location && (
              <p className="mt-1 text-[0.6rem] font-bold tracking-widest text-[#E63946] uppercase">
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Enfoque / Descripción
            </label>
            <textarea
              rows={3}
              name="focus"
              value={form.focus}
              onChange={handleChange}
              className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
            />
            {errors.focus && (
              <p className="mt-1 text-[0.6rem] font-bold tracking-widest text-[#E63946] uppercase">
                {errors.focus}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Temas que trabajamos (notas)
            </label>
            <div className="space-y-2">
              {form.notes.map((note, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={note}
                    onChange={(e) => handleNoteChange(index, e.target.value)}
                    placeholder={`Tema ${index + 1}`}
                    className="flex-1 border-2 border-zinc-200 px-4 py-2 text-sm focus:border-[#023047] focus:outline-none"
                  />
                  {form.notes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeNote(index)}
                      className="border-2 border-zinc-200 px-3 text-zinc-400 transition hover:border-[#E63946] hover:text-[#E63946]"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addNote}
              className="mt-2 border-2 border-zinc-200 px-4 py-2 text-xs font-bold tracking-widest text-zinc-500 uppercase transition hover:border-[#023047] hover:text-[#023047]"
            >
              + Agregar tema
            </button>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Fotos de galería
            </label>
            <div className="flex flex-wrap gap-3">
              {form.galleryImages.map((img, index) => (
                <div key={index} className="group relative h-24 w-24 border-2 border-zinc-200">
                  <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-1 right-1 flex size-6 items-center justify-center bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {form.galleryImages.length < 3 && (
                <label className="flex h-24 w-24 cursor-pointer items-center justify-center border-2 border-dashed border-zinc-300 text-zinc-400 transition hover:border-[#023047] hover:text-[#023047]">
                  <Upload size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Orden
              </label>
              <input
                type="number"
                name="orden"
                value={form.orden}
                onChange={handleChange}
                className="w-full border-2 border-zinc-200 px-4 py-3 focus:border-[#023047] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Activo
              </label>
              <label className="flex cursor-pointer items-center gap-3 border-2 border-zinc-200 px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
                  className="size-4 accent-[#023047]"
                />
                <span className="text-sm text-zinc-600">
                  {form.active ? 'Visible en la página' : 'Oculto'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border-2 border-zinc-300 px-6 py-3 text-xs font-bold tracking-widest uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="border-2 border-[#023047] bg-[#023047] px-6 py-3 text-xs font-bold tracking-widest text-white uppercase transition hover:bg-[#023047]/90"
            >
              {loading ? 'Guardando...' : mentor ? 'Guardar cambios' : 'Crear mentor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

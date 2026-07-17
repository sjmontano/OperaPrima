'use client'

import { compressImage } from '@/lib/useImageCompressor'
import { createClient } from '@/lib/supabaseClient'
import { ImagePlus, Pencil, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

interface GalleryImage {
  id: string
  src: string
  title: string | null
  alt: string | null
  span: string | null
  orden: number
}

export function Gallery({ userId: propUserId }: { userId?: string }) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [selected, setSelected] = useState<GalleryImage | null>(null)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const sessionRef = useRef<string | null>(null)

  const loadImages = useCallback(async () => {
    const params = propUserId ? `?userId=${propUserId}` : ''
    const headers: Record<string, string> = {}
    if (!propUserId && sessionRef.current) {
      headers.Authorization = `Bearer ${sessionRef.current}`
    }
    const res = await fetch(`/api/gallery${params}`, { headers })
    if (!res.ok) return
    const data = await res.json()
    setImages(data.images)
  }, [propUserId])

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        sessionRef.current = session.access_token
        if (!propUserId) setIsOwner(true)
      }
      await loadImages()
    }
    init()
  }, [propUserId, loadImages])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const token = sessionRef.current
      if (!token) return

      const compressed = await compressImage(file)
      const fd = new FormData()
      fd.append('file', compressed)
      const uploadRes = await fetch('/api/upload/image', {
        method: 'POST',
        body: fd,
      })
      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}))
        throw new Error(err.error || 'Error al subir')
      }
      const { url, publicId } = await uploadRes.json()

      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ src: url, publicId, title: file.name.replace(/\.[^.]+$/, '') }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Error al crear entrada')
      }

      await loadImages()
    } catch (e) {
      console.error('Upload error:', e)
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleDelete(id: string) {
    const token = sessionRef.current
    if (!token) return

    const res = await fetch(`/api/gallery/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return
    await loadImages()
    if (selected?.id === id) setSelected(null)
  }

  async function handleSaveTitle(id: string) {
    const token = sessionRef.current
    if (!token) return

    await fetch(`/api/gallery/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitle }),
    })
    setEditingId(null)
    await loadImages()
  }

  return (
    <>
      <section style={{ background: '#FFFFFF' }}>
        <div className="mx-auto px-6 py-8" style={{ maxWidth: '1200px' }}>
          <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h2
                className="text-lg font-bold tracking-wide uppercase"
                style={{ color: '#353535' }}
              >
                Galería
              </h2>
              {images.length > 0 && (
                <p className="mt-0.5 text-xs" style={{ color: 'oklch(0.62 0.010 350)' }}>
                  {images.length} {images.length === 1 ? 'obra' : 'obras'}
                </p>
              )}
            </div>
            {isOwner && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 border-2 px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-150"
                style={{
                  borderColor: '#353535',
                  color: '#FFFFFF',
                  background: '#353535',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFFFFF'
                  e.currentTarget.style.color = '#353535'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#353535'
                  e.currentTarget.style.color = '#FFFFFF'
                }}
              >
                <ImagePlus size={15} />
                {uploading ? 'Subiendo...' : 'Subir foto'}
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </div>

          {images.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              {isOwner ? (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="group flex cursor-pointer flex-col items-center gap-2 transition-all duration-200 hover:opacity-70"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200"
                    style={{ background: '#F5F5F0' }}
                  >
                    <ImagePlus
                      size={24}
                      className="transition-transform duration-200 group-hover:scale-110"
                      style={{ color: 'oklch(0.52 0.010 350)' }}
                    />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#353535' }}>
                    Subí tu primera obra
                  </p>
                  <p className="text-xs" style={{ color: 'oklch(0.62 0.010 350)' }}>
                    Tocá para seleccionar una foto
                  </p>
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ background: '#F5F5F0' }}
                  >
                    <ImagePlus size={24} style={{ color: 'oklch(0.52 0.010 350)' }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: '#353535' }}>
                    Este artista no tiene obras aún
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`group relative cursor-pointer overflow-hidden rounded-sm ${
                    img.span === 'col-span-2 row-span-2' ? 'col-span-2 row-span-2' : ''
                  }`}
                  style={{
                    background: '#F5F5F0',
                    minHeight: img.span?.includes('row-span-2') ? '416px' : '200px',
                  }}
                  onClick={() => !editingId && setSelected(img)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt || img.title || 'Galería'}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    unoptimized
                  />

                  <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {editingId === img.id ? (
                      <div className="flex w-full gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 border bg-white px-2 py-1 text-xs text-zinc-900"
                          placeholder="Título"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveTitle(img.id)
                            if (e.key === 'Escape') setEditingId(null)
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveTitle(img.id)}
                          className="bg-white px-2 py-1 text-[0.6rem] font-bold text-zinc-900 uppercase"
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <p className="translate-y-2 text-xs font-medium text-white transition-transform duration-300 ease-in-out group-hover:translate-y-0">
                        {img.title}
                      </p>
                    )}
                  </div>

                  {isOwner && !editingId && (
                    <div
                      className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(img.id)
                          setEditTitle(img.title || '')
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-sm bg-white/90 text-zinc-700 shadow hover:bg-white"
                        title="Editar título"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(img.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-sm bg-red-600/90 text-white shadow hover:bg-red-600"
                        title="Eliminar"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selected.src}
              alt={selected.alt || selected.title || 'Galería'}
              width={1200}
              height={900}
              className="max-h-[85vh] w-auto rounded-lg object-contain shadow-2xl"
              unoptimized
            />
            {selected.title && (
              <p className="mt-3 text-center text-sm text-white/80">{selected.title}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
          >
            <X size={24} />
          </button>
        </div>
      )}
    </>
  )
}

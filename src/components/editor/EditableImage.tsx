'use client'

import { useEditMode } from '@/context/EditModeContext'
import { compressImage } from '@/lib/useImageCompressor'
import { Loader2, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'

interface EditableImageProps {
  src: string
  alt: string
  onSave: (src: string) => void
  className?: string
  width?: number
  height?: number
  style?: React.CSSProperties
  uploadFolder?: string
  publicId?: string
  onDelete?: () => void
}

export function EditableImage({
  src,
  alt,
  onSave,
  className = '',
  width,
  height,
  style,
  uploadFolder = 'content',
  publicId: externalPublicId,
  onDelete,
}: EditableImageProps) {
  const { isEditMode } = useEditMode()
  const [showPopup, setShowPopup] = useState(false)
  const [url, setUrl] = useState(src)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const isCloudinary = src.includes('res.cloudinary.com')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const compressed = await compressImage(file)
      const formData = new FormData()
      formData.append(
        'file',
        new File([compressed], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' })
      )
      formData.append('folder', uploadFolder)

      const res = await fetch('/api/upload/image', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()

      setUrl(data.url)
      setPreview(null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!externalPublicId && !isCloudinary) return
    setLoading(true)
    try {
      let publicId = externalPublicId
      if (!publicId && isCloudinary) {
        const parts = src.split('/')
        const filename = parts[parts.length - 1].replace(/\.[^.]+$/, '')
        publicId = filename
      }
      if (publicId) {
        await fetch('/api/upload/image', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId }),
        })
      }
      onSave('')
      setShowPopup(false)
      onDelete?.()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!isEditMode) {
    return (
      <img src={src} alt={alt} className={className} width={width} height={height} style={style} />
    )
  }

  return (
    <div className="group relative inline-block">
      <img src={src} alt={alt} className={className} width={width} height={height} style={style} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 bg-black/0 transition-all group-hover:bg-black/30">
        {isCloudinary && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            disabled={loading}
            className="pointer-events-auto rounded-sm bg-red-600/90 px-3 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:bg-red-600"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setUrl(src)
            setPreview(null)
            setShowPopup(true)
          }}
          className="pointer-events-auto rounded-sm bg-white/90 px-3 py-1.5 text-[10px] font-bold tracking-widest text-zinc-800 uppercase opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:bg-white"
        >
          📷 Cambiar
        </button>
      </div>
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="w-96 rounded-sm bg-white p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-[10px] font-bold tracking-widest text-zinc-700 uppercase">
              Cambiar imagen
            </p>

            <label className="mb-3 flex cursor-pointer items-center gap-2 rounded-sm border-2 border-dashed border-zinc-300 px-4 py-3 text-xs text-zinc-500 transition-all hover:border-[#8ECAE6] hover:text-[#8ECAE6]">
              <Upload size={14} />
              Subir archivo
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/avif,image/tiff"
                onChange={handleFile}
                className="hidden"
                disabled={loading}
              />
            </label>

            {loading && (
              <div className="mb-3 flex items-center gap-2 text-xs text-zinc-500">
                <Loader2 size={14} className="animate-spin" />
                Comprimiendo y subiendo…
              </div>
            )}

            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="mb-3 h-32 w-full rounded-sm object-cover"
              />
            )}

            {!loading && !preview && (
              <>
                <div className="mb-2 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  O pegar URL
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://…"
                  className="mb-4 w-full border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-[#8ECAE6]"
                />
              </>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="rounded-sm border border-zinc-300 px-3 py-1 text-[10px] font-bold tracking-wider text-zinc-600 uppercase hover:bg-zinc-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (url) {
                    onSave(url)
                    setShowPopup(false)
                  }
                }}
                disabled={loading || !url}
                className="rounded-sm border border-[#023047] bg-[#023047] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase hover:bg-[#023047]/90 disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

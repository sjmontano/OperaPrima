'use client'

import { useEditMode } from '@/context/EditModeContext'
import { useState } from 'react'

interface EditableImageProps {
  src: string
  alt: string
  onSave: (src: string) => void
  className?: string
  width?: number
  height?: number
  style?: React.CSSProperties
}

export function EditableImage({
  src,
  alt,
  onSave,
  className = '',
  width,
  height,
  style,
}: EditableImageProps) {
  const { isEditMode } = useEditMode()
  const [showPopup, setShowPopup] = useState(false)
  const [url, setUrl] = useState(src)

  if (!isEditMode) {
    return (
      <img src={src} alt={alt} className={className} width={width} height={height} style={style} />
    )
  }

  return (
    <div className="group relative inline-block">
      <img src={src} alt={alt} className={className} width={width} height={height} style={style} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setUrl(src)
            setShowPopup(true)
          }}
          className="pointer-events-auto rounded-sm bg-white/90 px-3 py-1.5 text-[10px] font-bold tracking-widest text-zinc-800 uppercase opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:bg-white"
        >
          📷 Cambiar imagen
        </button>
      </div>
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="w-80 rounded-sm bg-white p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 text-[10px] font-bold tracking-widest text-zinc-700 uppercase">
              Cambiar imagen
            </p>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="URL de la imagen"
              className="mb-3 w-full border border-zinc-200 px-3 py-2 text-xs outline-none focus:border-[#8ECAE6]"
              autoFocus
            />
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
                  onSave(url)
                  setShowPopup(false)
                }}
                className="rounded-sm border border-[#023047] bg-[#023047] px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase hover:bg-[#023047]/90"
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

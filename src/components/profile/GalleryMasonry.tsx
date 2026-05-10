'use client'

import { Upload, X, ZoomIn } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface GalleryItem {
  src: string
  title: string
  date: string
  href?: string
}

interface GalleryMasonryProps {
  items: GalleryItem[]
  showUpload?: boolean
}

// â”€â”€ Lightbox â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Lightbox({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ background: 'rgba(17,17,17,0.94)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl"
        style={{ border: '2px solid #F65B7F', boxShadow: '8px 8px 0 #111111' }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.src}
          alt={item.title}
          className="block w-full"
          style={{ maxHeight: '75vh', objectFit: 'contain', background: '#0d0d0d' }}
        />
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ background: '#111111', borderTop: '1px solid rgba(250,250,249,0.1)' }}
        >
          <div>
            <p
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: '#F65B7F' }}
            >
              {item.date}
            </p>
            <p className="mt-0.5 text-sm font-semibold" style={{ color: '#FAFAF9' }}>
              {item.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center border-2 border-white/20 text-white/60 transition-colors duration-150 hover:border-[#F65B7F] hover:text-[#F65B7F]"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

// â”€â”€ Single gallery column â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface ColumnProps {
  items: GalleryItem[]
  direction: 'up' | 'down'
  speed: number
  onLightbox: (item: GalleryItem) => void
}

function GalleryColumn({ items, direction, speed, onLightbox }: ColumnProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({
    offset: 0,
    paused: false,
    dragging: false,
    lastY: 0,
    momentum: 0,
    initialized: false,
  })
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const track = trackRef.current
    if (!wrapper || !track) return

    const s = stateRef.current
    const dir = direction === 'down' ? 1 : -1
    let running = true

    const tick = () => {
      if (!running) return

      const half = track.scrollHeight / 2

      if (!s.initialized && half > 0) {
        if (direction === 'up') s.offset = -half
        s.initialized = true
      }

      if (half > 0) {
        if (!s.paused) {
          s.offset += dir * speed
        } else if (!s.dragging) {
          if (Math.abs(s.momentum) > 0.05) {
            s.offset += s.momentum
            s.momentum *= 0.91
          } else {
            s.momentum = 0
            s.paused = false
          }
        }

        if (s.offset <= -half) s.offset += half
        if (s.offset >= 0) s.offset -= half

        track.style.transform = `translateY(${s.offset}px)`
      }

      frameRef.current = requestAnimationFrame(tick)
    }

    const onEnter = () => {
      s.paused = true
    }
    const onLeave = () => {
      if (!s.dragging) {
        s.momentum = 0
        s.paused = false
      }
    }
    const onDown = (e: MouseEvent) => {
      s.dragging = true
      s.paused = true
      s.lastY = e.clientY
      s.momentum = 0
      wrapper.style.cursor = 'grabbing'
      e.preventDefault()
    }
    const onMove = (e: MouseEvent) => {
      if (!s.dragging) return
      const delta = e.clientY - s.lastY
      s.momentum = delta * 0.55
      s.offset += delta
      s.lastY = e.clientY
    }
    const onUp = () => {
      if (!s.dragging) return
      s.dragging = false
      wrapper.style.cursor = 'grab'
    }

    wrapper.addEventListener('mouseenter', onEnter)
    wrapper.addEventListener('mouseleave', onLeave)
    wrapper.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(frameRef.current)
      wrapper.removeEventListener('mouseenter', onEnter)
      wrapper.removeEventListener('mouseleave', onLeave)
      wrapper.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [direction, speed])

  return (
    <div
      ref={wrapperRef}
      style={{
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'grab',
        userSelect: 'none',
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div
        ref={trackRef}
        style={{ display: 'flex', flexDirection: 'column', lineHeight: 0, willChange: 'transform' }}
      >
        {[...items, ...items].map((item, idx) => (
          <GalleryItemCard key={idx} item={item} onLightbox={onLightbox} />
        ))}
      </div>
    </div>
  )
}

// â”€â”€ Individual gallery card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function GalleryItemCard({
  item,
  onLightbox,
}: {
  item: GalleryItem
  onLightbox: (item: GalleryItem) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative overflow-hidden"
      style={{ marginBottom: '14px', background: 'oklch(0.12 0.005 350)', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onLightbox(item)}
    >
      <img
        src={item.src}
        alt={item.title}
        loading="lazy"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          pointerEvents: 'none',
        }}
      />

      {/* Gradient overlay + info */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-4"
        style={{
          background:
            'linear-gradient(to top, rgba(17,17,17,0.9) 0%, rgba(17,17,17,0.15) 45%, transparent 70%)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div
          style={{
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'transform 0.3s ease',
          }}
        >
          <p
            className="mb-1 text-[10px] font-bold tracking-widest uppercase"
            style={{ color: '#F65B7F' }}
          >
            {item.date}
          </p>
          <p className="text-sm leading-tight font-semibold" style={{ color: '#FAFAF9' }}>
            {item.title}
          </p>
        </div>
      </div>

      {/* Zoom icon */}
      <div
        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center"
        style={{
          background: 'rgba(17,17,17,0.72)',
          border: '1px solid rgba(246,91,127,0.55)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <ZoomIn size={13} color="#F65B7F" />
      </div>

      {/* Inset coral border */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          outline: '2px solid #F65B7F',
          outlineOffset: '-2px',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
      />
    </div>
  )
}

// â”€â”€ Upload button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function UploadButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<{ src: string; name: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview({ src: URL.createObjectURL(file), name: file.name })
    e.target.value = ''
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 border-2 border-[#111111] px-4 py-2 text-xs font-bold tracking-widest text-[#111111] uppercase transition-all duration-150 hover:border-[#F65B7F] hover:bg-[#F65B7F] hover:text-white hover:shadow-[3px_3px_0_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
      >
        <Upload size={13} />
        Subir obra
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleChange}
      />

      {preview && (
        <div
          className="fixed right-6 bottom-6 z-50 flex items-center gap-3 border-2 border-[#111111] px-4 py-3 shadow-[4px_4px_0_#111111]"
          style={{ background: '#FAFAF9' }}
        >
          <img
            src={preview.src}
            alt=""
            className="h-10 w-10 object-cover"
            style={{ border: '1px solid rgba(17,17,17,0.15)' }}
          />
          <div>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#111111' }}>
              Obra cargada
            </p>
            <p className="max-w-32 truncate text-[10px]" style={{ color: 'oklch(0.52 0.010 350)' }}>
              {preview.name}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="ml-1 text-zinc-400 hover:text-zinc-700"
            aria-label="Cerrar"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </>
  )
}

// â”€â”€ Main export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ensureMin(arr: GalleryItem[], min = 4): GalleryItem[] {
  let result = [...arr]
  while (result.length < min) result = [...result, ...arr]
  return result
}

export function GalleryMasonry({ items, showUpload = false }: GalleryMasonryProps) {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  const col1 = ensureMin(items.filter((_, i) => i % 3 === 0))
  const col2 = ensureMin(items.filter((_, i) => i % 3 === 1))
  const col3 = ensureMin(items.filter((_, i) => i % 3 === 2))

  const columns: Array<{ items: GalleryItem[]; direction: 'up' | 'down'; speed: number }> = [
    { items: col1, direction: 'down', speed: 0.55 },
    { items: col2, direction: 'up', speed: 0.45 },
    { items: col3, direction: 'down', speed: 0.6 },
  ]

  const openLightbox = useCallback((item: GalleryItem) => {
    setLightbox(item)
  }, [])

  return (
    <>
      {showUpload && (
        <div className="mb-4 flex justify-end">
          <UploadButton />
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
          height: '600px',
        }}
      >
        {columns.map(({ items: colItems, direction, speed }, colIdx) => (
          <GalleryColumn
            key={colIdx}
            items={colItems}
            direction={direction}
            speed={speed}
            onLightbox={openLightbox}
          />
        ))}
      </div>

      {lightbox && <Lightbox item={lightbox} onClose={() => setLightbox(null)} />}
    </>
  )
}

'use client'

import { EditableImage } from '@/components/editor/EditableImage'
import { EditableRichText } from '@/components/editor/EditableRichText'
import { EditableText } from '@/components/editor/EditableText'
import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { compressImage } from '@/lib/useImageCompressor'
import { ChevronLeft, ChevronRight, Loader2, Plus, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'

export interface Partner {
  name: string
  src: string
}

const DEFAULT_PARTNERS: Partner[] = [
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
]

export function PartnersStrip({
  eyebrow = 'Aliados y Red',
  heading = 'Nuestros aliados',
  description = 'instituciones, proyectos y profesionales que creen en el talento emergente.',
  partners = DEFAULT_PARTNERS,
  ctaText = '¿Quieres colaborar con nosotros?',
  ctaEmail = 'direccion@operaprimacultura.com',
  isEditMode,
  __onFieldChange,
}: {
  eyebrow?: string
  heading?: string
  description?: string
  partners?: Partner[]
  ctaText?: string
  ctaEmail?: string
  isEditMode?: boolean
  __onFieldChange?: (path: string, value: unknown) => void
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  const VISIBLE_COUNT = 3
  const maxIndex = Math.max(0, partners.length - VISIBLE_COUNT)

  const handleSlotUpload = async (i: number, file: File) => {
    setUploadingIndex(i)
    try {
      const compressed = await compressImage(file)
      const formData = new FormData()
      formData.append(
        'file',
        new File([compressed], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' })
      )
      formData.append('folder', 'partners')

      const res = await fetch('/api/upload/image', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()

      __onFieldChange?.(`partners.${i}.src`, data.url)
      if (!partners[i]?.name) {
        __onFieldChange?.(`partners.${i}.name`, `Aliado ${i + 1}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploadingIndex(null)
    }
  }

  const addSlot = () => {
    const newPartners = [...partners, { name: '', src: '' }]
    __onFieldChange?.('partners', newPartners)
    setCurrentIndex(Math.max(0, newPartners.length - VISIBLE_COUNT))
  }

  const removeSlot = (i: number) => {
    if (partners.length <= 1) return
    const newPartners = partners.filter((_, idx) => idx !== i)
    __onFieldChange?.('partners', newPartners)
    if (currentIndex >= newPartners.length) {
      setCurrentIndex(Math.max(0, newPartners.length - VISIBLE_COUNT))
    }
  }

  if (isEditMode) {
    const visiblePartners = partners.slice(currentIndex, currentIndex + VISIBLE_COUNT)
    const startIndex = currentIndex

    return (
      <section ref={sectionRef} className="bg-background w-full border-b-2 border-zinc-200">
        <div className="mx-[100px] border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
          <div className="px-8 pt-20 pb-14 text-center">
            <TimelineAnimation
              as="p"
              animationNum={0}
              timelineRef={sectionRef}
              className="mb-4 text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase"
            >
              <EditableText
                value={eyebrow}
                onSave={(v) => __onFieldChange?.('eyebrow', v)}
                as="span"
                singleLine
              />
            </TimelineAnimation>
            <TimelineAnimation
              as="h2"
              animationNum={1}
              timelineRef={sectionRef}
              className="text-4xl leading-[1.06] font-semibold tracking-[-0.025em] text-zinc-900 lg:text-5xl"
            >
              <EditableRichText
                value={heading}
                onSave={(v) => __onFieldChange?.('heading', v)}
                as="span"
              />
            </TimelineAnimation>
            <TimelineAnimation
              as="p"
              animationNum={2}
              timelineRef={sectionRef}
              className="mx-auto mt-3 max-w-md text-base text-zinc-500"
            >
              <EditableRichText
                value={description}
                onSave={(v) => __onFieldChange?.('description', v)}
                as="span"
              />
            </TimelineAnimation>
          </div>

          <div className="relative px-12 pb-4">
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full border border-zinc-200 bg-white p-2 shadow-sm transition-all hover:bg-zinc-100 active:scale-95"
                aria-label="Anteriores"
              >
                <ChevronLeft size={18} className="text-zinc-600" />
              </button>
            )}

            <div className="grid grid-cols-3 gap-6">
              {visiblePartners.map((partner, offset) => {
                const i = startIndex + offset
                const isEmpty = !partner.src
                return (
                  <div
                    key={i}
                    className={`group relative flex min-h-[160px] flex-col items-center justify-center rounded-sm border-2 ${
                      isEmpty
                        ? 'border-dashed border-zinc-300 bg-zinc-50'
                        : 'border-zinc-200 bg-white'
                    } transition-all`}
                  >
                    <div className="mt-2 mb-1 text-[9px] font-bold tracking-wider text-zinc-400 uppercase">
                      Aliado #{i + 1}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSlot(i)}
                      disabled={partners.length <= 1}
                      className="absolute -top-2 -right-2 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:bg-red-600 disabled:hidden"
                      title="Eliminar slot"
                    >
                      <X size={10} />
                    </button>

                    {isEmpty ? (
                      <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 px-4 py-6 text-center">
                        {uploadingIndex === i ? (
                          <Loader2 size={18} className="animate-spin text-zinc-400" />
                        ) : (
                          <>
                            <Upload size={18} className="text-zinc-300" />
                            <span className="text-[9px] font-bold tracking-widest text-zinc-300 uppercase">
                              Subir logo
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleSlotUpload(i, file)
                          }}
                          className="hidden"
                          disabled={uploadingIndex !== null}
                        />
                      </label>
                    ) : (
                      <div className="flex w-full flex-1 flex-col items-center justify-center gap-2 p-4 pb-2">
                        <EditableImage
                          src={partner.src}
                          alt={partner.name}
                          onSave={(v) => __onFieldChange?.(`partners.${i}.src`, v)}
                          uploadFolder="partners"
                          style={{ height: '80px', width: 'auto', maxWidth: '100%' }}
                          className="object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                        />
                        <input
                          type="text"
                          value={partner.name}
                          onChange={(e) => __onFieldChange?.(`partners.${i}.name`, e.target.value)}
                          className="w-full border-b border-zinc-200 bg-transparent px-1 py-0.5 text-center text-xs text-zinc-600 outline-none focus:border-[#8ECAE6]"
                          placeholder="Nombre del aliado"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {currentIndex < maxIndex && (
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => Math.min(maxIndex, i + 1))}
                className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full border border-zinc-200 bg-white p-2 shadow-sm transition-all hover:bg-zinc-100 active:scale-95"
                aria-label="Siguientes"
              >
                <ChevronRight size={18} className="text-zinc-600" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 pb-4">
            {Array.from({ length: Math.ceil(partners.length / VISIBLE_COUNT) }).map((_, dotI) => (
              <button
                key={dotI}
                type="button"
                onClick={() => setCurrentIndex(dotI * VISIBLE_COUNT)}
                className={`h-1.5 rounded-full transition-all ${
                  Math.floor(currentIndex / VISIBLE_COUNT) === dotI
                    ? 'w-5 bg-[#023047]'
                    : 'w-1.5 bg-zinc-300'
                }`}
                aria-label={`Ir a grupo ${dotI + 1}`}
              />
            ))}
          </div>

          <div className="mb-6 flex justify-center">
            <button
              type="button"
              onClick={addSlot}
              className="flex items-center gap-1.5 rounded-sm border-2 border-dashed border-zinc-300 px-5 py-2 text-[10px] font-bold tracking-widest text-zinc-400 uppercase transition-all hover:border-[#8ECAE6] hover:text-[#8ECAE6]"
            >
              <Plus size={14} />
              Añadir slot
            </button>
          </div>

          <div className="px-8 pt-4 pb-24 text-center">
            <TimelineAnimation
              as="p"
              animationNum={3}
              timelineRef={sectionRef}
              className="text-sm text-zinc-500"
            >
              <EditableText
                value={ctaText}
                onSave={(v) => __onFieldChange?.('ctaText', v)}
                as="span"
                singleLine
              />{' '}
              <a
                href={`mailto:${ctaEmail}`}
                className="font-semibold text-[#023047] underline-offset-4 hover:underline"
              >
                {ctaEmail}
              </a>
            </TimelineAnimation>
          </div>
        </div>
      </section>
    )
  }

  // ── Non-edit mode: ticker ──

  const activePartners = partners.filter((p) => p.src)
  const REPEAT_COUNT = 4
  const items = Array.from({ length: REPEAT_COUNT }, () => activePartners).flat()

  if (activePartners.length === 0) return null

  return (
    <section ref={sectionRef} className="bg-background w-full border-b-2 border-zinc-200">
      <div className="mx-[100px] border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] max-md:border-x-2 min-[620px]:border-x-2">
        <div className="px-8 pt-20 pb-14 text-center">
          <TimelineAnimation
            as="p"
            animationNum={0}
            timelineRef={sectionRef}
            className="mb-4 text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase"
          >
            <EditableText
              value={eyebrow}
              onSave={(v) => __onFieldChange?.('eyebrow', v)}
              as="span"
              singleLine
            />
          </TimelineAnimation>
          <TimelineAnimation
            as="h2"
            animationNum={1}
            timelineRef={sectionRef}
            className="text-4xl leading-[1.06] font-semibold tracking-[-0.025em] text-zinc-900 lg:text-5xl"
          >
            <EditableRichText
              value={heading}
              onSave={(v) => __onFieldChange?.('heading', v)}
              as="span"
            />
          </TimelineAnimation>
          <TimelineAnimation
            as="p"
            animationNum={2}
            timelineRef={sectionRef}
            className="mx-auto mt-3 max-w-md text-base text-zinc-500"
          >
            <EditableRichText
              value={description}
              onSave={(v) => __onFieldChange?.('description', v)}
              as="span"
            />
          </TimelineAnimation>
        </div>

        <div className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 left-0 z-10"
            style={{
              background:
                'linear-gradient(to right, var(--background) 0%, transparent 25%, transparent 75%, var(--background) 100%)',
            }}
          />
          <div className="ticker-wrap">
            <div className="ticker-track" style={{ animationDuration: '40s' }}>
              {items.map((partner, i) => {
                const partnerIndex = i % activePartners.length
                return (
                  <PartnerItem
                    key={i}
                    partner={partner}
                    partnerIndex={partnerIndex}
                    __onFieldChange={__onFieldChange}
                  />
                )
              })}
            </div>
          </div>
        </div>

        <div className="px-8 pt-16 pb-24 text-center">
          <TimelineAnimation
            as="p"
            animationNum={3}
            timelineRef={sectionRef}
            className="text-sm text-zinc-500"
          >
            <EditableText
              value={ctaText}
              onSave={(v) => __onFieldChange?.('ctaText', v)}
              as="span"
              singleLine
            />{' '}
            <a
              href={`mailto:${ctaEmail}`}
              className="font-semibold text-[#023047] underline-offset-4 hover:underline"
            >
              {ctaEmail}
            </a>
          </TimelineAnimation>
        </div>
      </div>
    </section>
  )
}

function PartnerItem({
  partner,
  partnerIndex,
  __onFieldChange,
}: {
  partner: Partner
  partnerIndex: number
  __onFieldChange?: (path: string, value: unknown) => void
}) {
  return (
    <div
      className="ticker-item flex shrink-0 items-center justify-center px-8"
      style={{
        marginRight: '32px',
        height: '120px',
      }}
    >
      <EditableImage
        src={partner.src}
        alt={partner.name}
        onSave={(v) => __onFieldChange?.(`partners.${partnerIndex}.src`, v)}
        style={{ height: '120px', width: 'auto' }}
        className="opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
      />
    </div>
  )
}

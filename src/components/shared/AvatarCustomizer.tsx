'use client'

import Image from 'next/image'
import { useState } from 'react'

export type AvatarStyle = 'lorelei' | 'open-peeps'

export interface AvatarConfig {
  style: AvatarStyle
  seed: string
  backgroundColor?: string
  [key: string]: string | number | boolean | undefined
}

function buildUrl(config: AvatarConfig): string {
  const { style, seed, ...options } = config
  const params = new URLSearchParams()
  params.set('seed', seed)
  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined && value !== '' && key !== 'style') {
      params.set(key, String(value))
    }
  }
  return `https://api.dicebear.com/10.x/${style}/svg?${params.toString()}`
}

// ── Part definitions ──

type PartDef = {
  key: string
  label: string
  variants: { value: string; label: string }[]
}

const LORELEI_COLOR_PARTS = [
  { key: 'skinColor', label: 'Piel', defaultColor: 'f3d3d0' },
  { key: 'hairColor', label: 'Cabello', defaultColor: '2c1b18' },
  { key: 'eyesColor', label: 'Ojos', defaultColor: '2c1b18' },
  { key: 'eyebrowsColor', label: 'Cejas', defaultColor: '2c1b18' },
  { key: 'mouthColor', label: 'Boca', defaultColor: 'd1495b' },
  { key: 'glassesColor', label: 'Gafas', defaultColor: '2c1b18' },
  { key: 'beardColor', label: 'Barba', defaultColor: '2c1b18' },
  { key: 'backgroundColor', label: 'Fondo', defaultColor: 'c0aedd' },
]

const OPENPEEPS_COLOR_PARTS = [
  { key: 'skinColor', label: 'Piel', defaultColor: 'f3d3d0' },
  { key: 'clothingColor', label: 'Ropa', defaultColor: '2c1b18' },
  { key: 'headContrastColor', label: 'Contraste', defaultColor: 'd1495b' },
  { key: 'backgroundColor', label: 'Fondo', defaultColor: 'c0aedd' },
]

const LORELEI_PARTS: PartDef[] = [
  {
    key: 'hairVariant',
    label: 'Cabello',
    variants: Array.from({ length: 48 }, (_, i) => ({
      value: `variant${String(i + 1).padStart(2, '0')}`,
      label: `${String(i + 1).padStart(2, '0')}`,
    })),
  },
  {
    key: 'eyesVariant',
    label: 'Ojos',
    variants: Array.from({ length: 24 }, (_, i) => ({
      value: `variant${String(i + 1).padStart(2, '0')}`,
      label: `${String(i + 1).padStart(2, '0')}`,
    })),
  },
  {
    key: 'mouthVariant',
    label: 'Boca',
    variants: [
      ...Array.from({ length: 18 }, (_, i) => ({
        value: `happy${String(i + 1).padStart(2, '0')}`,
        label: `Happy ${i + 1}`,
      })),
      ...Array.from({ length: 9 }, (_, i) => ({
        value: `sad${String(i + 1).padStart(2, '0')}`,
        label: `Sad ${i + 1}`,
      })),
    ],
  },
  {
    key: 'eyebrowsVariant',
    label: 'Cejas',
    variants: Array.from({ length: 13 }, (_, i) => ({
      value: `variant${String(i + 1).padStart(2, '0')}`,
      label: `${String(i + 1).padStart(2, '0')}`,
    })),
  },
  {
    key: 'headVariant',
    label: 'Cabeza',
    variants: [
      { value: 'variant01', label: '01' },
      { value: 'variant02', label: '02' },
      { value: 'variant03', label: '03' },
      { value: 'variant04', label: '04' },
    ],
  },
  {
    key: 'glassesVariant',
    label: 'Gafas',
    variants: [
      { value: 'variant01', label: '01' },
      { value: 'variant02', label: '02' },
      { value: 'variant03', label: '03' },
      { value: 'variant04', label: '04' },
      { value: 'variant05', label: '05' },
    ],
  },
  {
    key: 'beardVariant',
    label: 'Barba',
    variants: [
      { value: 'variant01', label: '01' },
      { value: 'variant02', label: '02' },
    ],
  },
  {
    key: 'earringsVariant',
    label: 'Pendientes',
    variants: [
      { value: 'variant01', label: '01' },
      { value: 'variant02', label: '02' },
      { value: 'variant03', label: '03' },
    ],
  },
  {
    key: 'frecklesVariant',
    label: 'Pecas',
    variants: [{ value: 'variant01', label: '01' }],
  },
  {
    key: 'hairAccessoriesVariant',
    label: 'Acc. Cabello',
    variants: [{ value: 'flowers', label: 'Flores' }],
  },
  {
    key: 'noseVariant',
    label: 'Nariz',
    variants: Array.from({ length: 6 }, (_, i) => ({
      value: `variant${String(i + 1).padStart(2, '0')}`,
      label: `${String(i + 1).padStart(2, '0')}`,
    })),
  },
]

const OPENPEEPS_PARTS: PartDef[] = [
  {
    key: 'headVariant',
    label: 'Cabeza',
    variants: [
      { value: 'afro', label: 'Afro' },
      { value: 'bangs', label: 'Bang' },
      { value: 'bangs2', label: 'Bang 2' },
      { value: 'bantuKnots', label: 'Bantu' },
      { value: 'bear', label: 'Bear' },
      { value: 'bun', label: 'Bun' },
      { value: 'bun2', label: 'Bun 2' },
      { value: 'buns', label: 'Buns' },
      { value: 'cornrows', label: 'Cornrows' },
      { value: 'cornrows2', label: 'Cornrows2' },
      { value: 'dreads1', label: 'Dreads 1' },
      { value: 'dreads2', label: 'Dreads 2' },
      { value: 'flatTop', label: 'Flat Top' },
      { value: 'flatTopLong', label: 'Flat Top L' },
      { value: 'grayBun', label: 'Gray Bun' },
      { value: 'grayMedium', label: 'Gray Med' },
      { value: 'grayShort', label: 'Gray Short' },
      { value: 'hatBeanie', label: 'Beanie' },
      { value: 'hatHip', label: 'Hat Hip' },
      { value: 'hijab', label: 'Hijab' },
      { value: 'long', label: 'Long' },
      { value: 'longAfro', label: 'Long Afro' },
      { value: 'longBangs', label: 'L. Bangs' },
      { value: 'longCurly', label: 'L. Curly' },
      { value: 'medium1', label: 'Medium 1' },
      { value: 'medium2', label: 'Medium 2' },
      { value: 'medium3', label: 'Medium 3' },
      { value: 'mediumBangs', label: 'M. Bangs' },
      { value: 'mediumBangs2', label: 'M. Bangs2' },
      { value: 'mediumBangs3', label: 'M. Bangs3' },
      { value: 'mediumStraight', label: 'M. Straight' },
      { value: 'mohawk', label: 'Mohawk' },
      { value: 'mohawk2', label: 'Mohawk 2' },
      { value: 'noHair1', label: 'No Hair 1' },
      { value: 'noHair2', label: 'No Hair 2' },
      { value: 'noHair3', label: 'No Hair 3' },
      { value: 'pomp', label: 'Pomp' },
      { value: 'shaved1', label: 'Shaved 1' },
      { value: 'shaved2', label: 'Shaved 2' },
      { value: 'shaved3', label: 'Shaved 3' },
      { value: 'short1', label: 'Short 1' },
      { value: 'short2', label: 'Short 2' },
      { value: 'short3', label: 'Short 3' },
      { value: 'short4', label: 'Short 4' },
      { value: 'short5', label: 'Short 5' },
      { value: 'turban', label: 'Turban' },
      { value: 'twists', label: 'Twists' },
      { value: 'twists2', label: 'Twists 2' },
    ],
  },
  {
    key: 'expressionVariant',
    label: 'Expresión',
    variants: [
      { value: 'smile', label: 'Sonrisa' },
      { value: 'smileBig', label: 'Sonrisa G' },
      { value: 'smileLOL', label: 'LOL' },
      { value: 'smileTeethGap', label: 'Dientes' },
      { value: 'lovingGrin1', label: 'Amor 1' },
      { value: 'lovingGrin2', label: 'Amor 2' },
      { value: 'cheeky', label: 'Pícaro' },
      { value: 'awe', label: 'Asombro' },
      { value: 'calm', label: 'Calma' },
      { value: 'blank', label: 'Neutro' },
      { value: 'cute', label: 'Lindo' },
      { value: 'concerned', label: 'Preocupado' },
      { value: 'concernedFear', label: 'Miedo' },
      { value: 'contempt', label: 'Desprecio' },
      { value: 'driven', label: 'Decidido' },
      { value: 'eatingHappy', label: 'Feliz' },
      { value: 'explaining', label: 'Explicando' },
      { value: 'eyesClosed', label: 'Ojos Cerrados' },
      { value: 'fear', label: 'Terror' },
      { value: 'hectic', label: 'Ajetreado' },
      { value: 'rage', label: 'Rabia' },
      { value: 'serious', label: 'Serio' },
      { value: 'solemn', label: 'Solemne' },
      { value: 'suspicious', label: 'Sospechoso' },
      { value: 'tired', label: 'Cansado' },
      { value: 'veryAngry', label: 'Enojado' },
      { value: 'old', label: 'Viejo' },
      { value: 'monster', label: 'Monstruo' },
      { value: 'cyclops', label: 'Cíclope' },
      { value: 'angryWithFang', label: 'Rabia Colmillo' },
    ],
  },
  {
    key: 'accessoriesVariant',
    label: 'Accesorios',
    variants: [
      { value: 'glasses', label: 'Gafas' },
      { value: 'glasses2', label: 'Gafas 2' },
      { value: 'glasses3', label: 'Gafas 3' },
      { value: 'glasses4', label: 'Gafas 4' },
      { value: 'glasses5', label: 'Gafas 5' },
      { value: 'sunglasses', label: 'Lentes Sol' },
      { value: 'sunglasses2', label: 'Lentes Sol 2' },
      { value: 'eyepatch', label: 'Parche' },
    ],
  },
  {
    key: 'facialHairVariant',
    label: 'Vello Facial',
    variants: [
      { value: 'chin', label: 'Barbilla' },
      { value: 'full', label: 'Completa' },
      { value: 'full2', label: 'Completa 2' },
      { value: 'full3', label: 'Completa 3' },
      { value: 'full4', label: 'Completa 4' },
      { value: 'goatee1', label: 'Chiva 1' },
      { value: 'goatee2', label: 'Chiva 2' },
      { value: 'moustache1', label: 'Bigote 1' },
      { value: 'moustache2', label: 'Bigote 2' },
      { value: 'moustache3', label: 'Bigote 3' },
      { value: 'moustache4', label: 'Bigote 4' },
      { value: 'moustache5', label: 'Bigote 5' },
      { value: 'moustache6', label: 'Bigote 6' },
      { value: 'moustache7', label: 'Bigote 7' },
      { value: 'moustache8', label: 'Bigote 8' },
      { value: 'moustache9', label: 'Bigote 9' },
    ],
  },
  {
    key: 'maskVariant',
    label: 'Máscara',
    variants: [
      { value: 'medicalMask', label: 'Médica' },
      { value: 'respirator', label: 'Respiratoria' },
    ],
  },
]

// ── Color Picker helper ──

const PRESET_COLORS = [
  '#2c1b18',
  '#d1495b',
  '#007582',
  '#eac394',
  '#a5c4d4',
  '#c0aedd',
  '#f3d3d0',
  '#d4a59a',
  '#f4d150',
  '#ffffff',
]

function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1">
      {PRESET_COLORS.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c.replace('#', ''))}
          className="h-5 w-5 rounded-full border transition-all hover:scale-110"
          style={{
            backgroundColor: c,
            borderColor: value === c.replace('#', '') ? '#023047' : '#E4E4E7',
            borderWidth: value === c.replace('#', '') ? '2px' : '1px',
          }}
        />
      ))}
    </div>
  )
}

// ── AvatarCustomizer ──

interface AvatarCustomizerProps {
  initialStyle?: AvatarStyle
  initialSeed?: string
  initialConfig?: Record<string, string | number | boolean | undefined>
  onChange: (config: AvatarConfig) => void
  size?: number
}

export function AvatarCustomizer({
  initialStyle = 'lorelei',
  initialSeed = 'user',
  initialConfig = {},
  onChange,
  size = 200,
}: AvatarCustomizerProps) {
  const [style, setStyle] = useState<AvatarStyle>(initialStyle)
  const [seed, setSeed] = useState(initialSeed)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [options, setOptions] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(initialConfig ?? {}).filter(([_, v]) => typeof v === 'string')
    ) as Record<string, string>
  )

  const parts = style === 'lorelei' ? LORELEI_PARTS : OPENPEEPS_PARTS
  const colorParts = style === 'lorelei' ? LORELEI_COLOR_PARTS : OPENPEEPS_COLOR_PARTS

  const config: AvatarConfig = { style, seed, ...options }
  const previewUrl = buildUrl(config)

  function updateOption(key: string, value: string) {
    const next = { ...options, [key]: value }
    setOptions(next)
    onChange({ style, seed, ...next })
  }

  function handleStyleChange(newStyle: AvatarStyle) {
    setStyle(newStyle)
    setOptions({})
    onChange({ style: newStyle, seed, ...options })
  }

  function regenerate() {
    const newSeed = `${seed}-${Date.now()}`
    setSeed(newSeed)
    onChange({ style, seed: newSeed, ...options })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Preview + Style picker */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="relative overflow-hidden rounded-full border-4 border-white shadow-lg"
          style={{ width: size, height: size }}
        >
          <Image
            src={previewUrl}
            alt="Preview"
            width={size}
            height={size}
            className="h-full w-full"
            unoptimized
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleStyleChange('lorelei')}
            className="border-2 px-4 py-1.5 text-xs font-bold uppercase transition-all"
            style={{
              borderColor: style === 'lorelei' ? '#023047' : '#E4E4E7',
              backgroundColor: style === 'lorelei' ? '#023047' : 'transparent',
              color: style === 'lorelei' ? '#fff' : '#353535',
            }}
          >
            Lorelei
          </button>
          <button
            onClick={() => handleStyleChange('open-peeps')}
            className="border-2 px-4 py-1.5 text-xs font-bold uppercase transition-all"
            style={{
              borderColor: style === 'open-peeps' ? '#023047' : '#E4E4E7',
              backgroundColor: style === 'open-peeps' ? '#023047' : 'transparent',
              color: style === 'open-peeps' ? '#fff' : '#353535',
            }}
          >
            Open Peeps
          </button>
        </div>

        <button
          onClick={regenerate}
          className="border-2 border-[#8ECAE6] px-4 py-1.5 text-xs font-bold uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#8ECAE6] hover:text-white hover:shadow-[2px_2px_0_#353535]"
          style={{ color: '#023047' }}
        >
          ⋮ Aleatorio
        </button>
      </div>

      {/* Customization sections */}
      <div className="flex flex-col gap-1">
        <p
          className="mb-1 text-xs font-bold tracking-widest uppercase"
          style={{ color: 'oklch(0.40 0.008 350)' }}
        >
          Partes
        </p>
        {parts.map((part) => {
          const isOpen = expandedSection === part.key
          const currentValue = options[part.key]
          return (
            <div key={part.key} className="border" style={{ borderColor: '#E4E4E7' }}>
              <button
                onClick={() => setExpandedSection(isOpen ? null : part.key)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-bold uppercase"
                style={{ color: '#353535' }}
              >
                <span>{part.label}</span>
                <span
                  className="transition-transform"
                  style={{ transform: isOpen ? 'rotate(180deg)' : '' }}
                >
                  ▾
                </span>
              </button>
              {isOpen && (
                <div
                  className="flex max-h-40 flex-wrap gap-1 overflow-y-auto border-t px-3 py-2"
                  style={{ borderColor: '#E4E4E7' }}
                >
                  {part.variants.map((v) => (
                    <button
                      key={v.value}
                      onClick={() => updateOption(part.key, v.value)}
                      className="border px-2 py-1 text-[10px] font-semibold uppercase transition-all"
                      style={{
                        borderColor: currentValue === v.value ? '#023047' : '#E4E4E7',
                        backgroundColor: currentValue === v.value ? '#023047' : 'transparent',
                        color: currentValue === v.value ? '#fff' : '#353535',
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Colors */}
      <div>
        <p
          className="mb-2 text-xs font-bold tracking-widest uppercase"
          style={{ color: 'oklch(0.40 0.008 350)' }}
        >
          Colores
        </p>
        {colorParts.map((cp) => (
          <div key={cp.key} className="mb-2">
            <p
              className="mb-1 text-[10px] font-semibold uppercase"
              style={{ color: 'oklch(0.52 0.010 350)' }}
            >
              {cp.label}
            </p>
            <ColorPicker
              value={options[cp.key] || cp.defaultColor}
              onChange={(v) => updateOption(cp.key, v)}
            />
          </div>
        ))}
      </div>

      {/* Probability sliders for selected part */}
      {style === 'lorelei' && (
        <div>
          <p
            className="mb-2 text-xs font-bold tracking-widest uppercase"
            style={{ color: 'oklch(0.40 0.008 350)' }}
          >
            Probabilidades
          </p>
          {['hairProbability', 'eyesProbability', 'mouthProbability'].map((key) => {
            const label = key.replace('Probability', '')
            return (
              <div key={key} className="mb-1 flex items-center gap-2">
                <span
                  className="w-16 text-[10px] font-semibold uppercase"
                  style={{ color: 'oklch(0.52 0.010 350)' }}
                >
                  {label}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={parseInt(options[key] || '100', 10)}
                  onChange={(e) => updateOption(key, e.target.value)}
                  className="flex-1 accent-[#023047]"
                />
                <span
                  className="w-6 text-right text-[10px]"
                  style={{ color: 'oklch(0.52 0.010 350)' }}
                >
                  {options[key] || '100'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { buildUrl }

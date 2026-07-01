'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { X, Shuffle, ChevronDown } from 'lucide-react'

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

type PartDef = {
  key: string
  label: string
  variants: { value: string; label: string }[]
}

const LORELEI_COLOR_PARTS = [
  { key: 'backgroundColor', label: 'Fondo', defaultColor: 'c0aedd' },
  { key: 'skinColor', label: 'Piel', defaultColor: 'f3d3d0' },
  { key: 'hairColor', label: 'Cabello', defaultColor: '2c1b18' },
  { key: 'eyesColor', label: 'Ojos', defaultColor: '2c1b18' },
  { key: 'eyebrowsColor', label: 'Cejas', defaultColor: '2c1b18' },
  { key: 'mouthColor', label: 'Boca', defaultColor: 'd1495b' },
  { key: 'glassesColor', label: 'Gafas', defaultColor: '2c1b18' },
  { key: 'beardColor', label: 'Barba', defaultColor: '2c1b18' },
  { key: 'earringsColor', label: 'Pendientes', defaultColor: '2c1b18' },
  { key: 'frecklesColor', label: 'Pecas', defaultColor: 'd1495b' },
  { key: 'noseColor', label: 'Nariz', defaultColor: 'f3d3d0' },
  { key: 'hairAccessoriesColor', label: 'Acc. Cabello', defaultColor: 'd1495b' },
]

const OPENPEEPS_COLOR_PARTS = [
  { key: 'backgroundColor', label: 'Fondo', defaultColor: 'c0aedd' },
  { key: 'skinColor', label: 'Piel', defaultColor: 'f3d3d0' },
  { key: 'clothingColor', label: 'Ropa', defaultColor: '2c1b18' },
  { key: 'headContrastColor', label: 'Contraste', defaultColor: 'd1495b' },
]

const LORELEI_PARTS: PartDef[] = [
  {
    key: 'hairVariant',
    label: 'Cabello',
    variants: Array.from({ length: 48 }, (_, i) => ({
      value: `variant${String(i + 1).padStart(2, '0')}`,
      label: `${i + 1}`,
    })),
  },
  {
    key: 'eyesVariant',
    label: 'Ojos',
    variants: Array.from({ length: 24 }, (_, i) => ({
      value: `variant${String(i + 1).padStart(2, '0')}`,
      label: `${i + 1}`,
    })),
  },
  {
    key: 'mouthVariant',
    label: 'Boca',
    variants: [
      ...Array.from({ length: 18 }, (_, i) => ({ value: `happy${i + 1}`, label: `H${i + 1}` })),
      ...Array.from({ length: 9 }, (_, i) => ({ value: `sad${i + 1}`, label: `S${i + 1}` })),
    ],
  },
  {
    key: 'eyebrowsVariant',
    label: 'Cejas',
    variants: Array.from({ length: 13 }, (_, i) => ({
      value: `variant${String(i + 1).padStart(2, '0')}`,
      label: `${i + 1}`,
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
  { key: 'frecklesVariant', label: 'Pecas', variants: [{ value: 'variant01', label: '01' }] },
  {
    key: 'noseVariant',
    label: 'Nariz',
    variants: Array.from({ length: 6 }, (_, i) => ({
      value: `variant${String(i + 1).padStart(2, '0')}`,
      label: `${i + 1}`,
    })),
  },
]

const OPENPEEPS_PARTS: PartDef[] = [
  {
    key: 'headVariant',
    label: 'Peinado',
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
      { value: 'flatTopLong', label: 'FlatTop L' },
      { value: 'grayBun', label: 'Gray Bun' },
      { value: 'grayMedium', label: 'Gray Med' },
      { value: 'grayShort', label: 'Gray Short' },
      { value: 'hatBeanie', label: 'Beanie' },
      { value: 'hatHip', label: 'Hat Hip' },
      { value: 'hijab', label: 'Hijab' },
      { value: 'long', label: 'Long' },
      { value: 'longAfro', label: 'L. Afro' },
      { value: 'longBangs', label: 'L. Bangs' },
      { value: 'longCurly', label: 'L. Curly' },
      { value: 'medium1', label: 'Med 1' },
      { value: 'medium2', label: 'Med 2' },
      { value: 'medium3', label: 'Med 3' },
      { value: 'mediumBangs', label: 'M. Bangs' },
      { value: 'mediumBangs2', label: 'M. Bangs2' },
      { value: 'mediumBangs3', label: 'M. Bangs3' },
      { value: 'mediumStraight', label: 'M.Str' },
      { value: 'mohawk', label: 'Mohawk' },
      { value: 'mohawk2', label: 'Mohawk 2' },
      { value: 'noHair1', label: 'No Hair' },
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
      { value: 'smileBig', label: 'S. Grande' },
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
      { value: 'explaining', label: 'Explica' },
      { value: 'eyesClosed', label: 'Ojos Cer.' },
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
      { value: 'angryWithFang', label: 'Colmillo' },
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
      { value: 'sunglasses', label: 'Sol' },
      { value: 'sunglasses2', label: 'Sol 2' },
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
  const [hexInput, setHexInput] = useState(value)
  useEffect(() => {
    setHexInput(value)
  }, [value])
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-1">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
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
      <div className="flex items-center gap-1">
        <span className="font-mono text-[0.45rem]" style={{ color: '#71717A' }}>
          #
        </span>
        <input
          type="text"
          value={hexInput}
          onChange={(e) => {
            const v = e.target.value.replace('#', '').slice(0, 6)
            setHexInput(v)
            if (/^[0-9a-fA-F]{6}$/.test(v)) onChange(v)
          }}
          className="w-14 border border-[#E4E4E7] px-1 py-0.5 font-mono text-[0.5rem] outline-none focus:border-[#023047]"
          maxLength={6}
          placeholder="000000"
        />
      </div>
    </div>
  )
}

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
  const [panelOpen, setPanelOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [colorsOpen, setColorsOpen] = useState(false)
  const [probOpen, setProbOpen] = useState(false)
  const [options, setOptions] = useState<Record<string, string>>(() => {
    const init = Object.fromEntries(
      Object.entries(initialConfig ?? {}).filter(([_, v]) => typeof v === 'string')
    ) as Record<string, string>
    if (!init.backgroundColor) init.backgroundColor = 'c0aedd'
    return init
  })

  const parts = style === 'lorelei' ? LORELEI_PARTS : OPENPEEPS_PARTS
  const colorParts = style === 'lorelei' ? LORELEI_COLOR_PARTS : OPENPEEPS_COLOR_PARTS

  const config: AvatarConfig = useMemo(() => ({ style, seed, ...options }), [style, seed, options])
  const previewUrl = useMemo(() => buildUrl(config), [config])

  function updateOption(key: string, value: string) {
    const next = { ...options, [key]: value }
    setOptions(next)
    onChange({ style, seed, ...next })
  }

  function handleStyleChange(newStyle: AvatarStyle) {
    if (newStyle === style) return
    setStyle(newStyle)
    setOptions({ backgroundColor: 'c0aedd' })
    setExpandedSection(null)
    onChange({ style: newStyle, seed, backgroundColor: 'c0aedd' })
  }

  function regenerate() {
    const newSeed = `${seed}-${Date.now()}`
    setSeed(newSeed)
    const bgColors = [
      'c0aedd',
      '8ECAE6',
      'f3d3d0',
      'a5c4d4',
      'f4d150',
      'eac394',
      'd4a59a',
      '007582',
    ]
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)]
    const next = { ...options, backgroundColor: randomBg }
    setOptions(next)
    onChange({ style, seed: newSeed, ...next })
  }

  function thumbUrl(partKey: string, partValue: string): string {
    const full = { ...config, [partKey]: partValue }
    return buildUrl(full as AvatarConfig)
  }

  const THUMB_SIZE = 68

  return (
    <>
      {/* ── Compact bar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="relative shrink-0 overflow-hidden rounded-full border-2 border-white shadow"
            style={{ width: 56, height: 56 }}
          >
            <Image
              src={previewUrl}
              alt="Vista previa"
              width={56}
              height={56}
              className="size-full"
              unoptimized
            />
          </div>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => handleStyleChange('lorelei')}
              className="border-2 px-3 py-1 text-[0.55rem] font-bold tracking-wider uppercase transition-all"
              style={{
                borderColor: style === 'lorelei' ? '#023047' : '#E4E4E7',
                backgroundColor: style === 'lorelei' ? '#023047' : 'transparent',
                color: style === 'lorelei' ? '#fff' : '#353535',
              }}
            >
              Lorelei
            </button>
            <button
              type="button"
              onClick={() => handleStyleChange('open-peeps')}
              className="border-2 px-3 py-1 text-[0.55rem] font-bold tracking-wider uppercase transition-all"
              style={{
                borderColor: style === 'open-peeps' ? '#023047' : '#E4E4E7',
                backgroundColor: style === 'open-peeps' ? '#023047' : 'transparent',
                color: style === 'open-peeps' ? '#fff' : '#353535',
              }}
            >
              Open Peeps
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={regenerate}
            className="flex items-center gap-1 border-2 border-[#8ECAE6] px-3 py-1.5 text-[0.55rem] font-bold tracking-wider text-[#023047] uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#8ECAE6] hover:text-white hover:shadow-[2px_2px_0_#353535]"
          >
            <Shuffle size={12} /> Aleatorio
          </button>
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="border-2 border-[#023047] bg-[#023047] px-3 py-1.5 text-[0.55rem] font-bold tracking-wider text-white uppercase transition-all hover:bg-white hover:text-[#023047] hover:shadow-[3px_3px_0_#353535]"
          >
            Personalizar ▸
          </button>
        </div>
      </div>

      {/* ── Modal panel ── */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          onClick={() => setPanelOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative z-10 flex w-full max-w-3xl flex-col overflow-hidden border-2 border-[#353535] bg-white shadow-[8px_8px_0_#353535]"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '90vh' }}
          >
            {/* ── Panel header ── */}
            <div className="flex items-center justify-between border-b-2 border-[#E4E4E7] px-5 py-3">
              <h2
                className="text-sm font-bold tracking-wider uppercase"
                style={{ color: '#023047' }}
              >
                Personalizar Avatar
              </h2>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="flex size-8 items-center justify-center border-2 border-zinc-200 transition-all hover:border-[#023047] hover:text-[#023047]"
              >
                <X size={14} />
              </button>
            </div>

            {/* ── Panel body ── */}
            <div className="flex flex-1 flex-col overflow-y-auto p-5 lg:flex-row lg:overflow-hidden">
              {/* Preview - fixed at top on mobile, sticky on right on desktop */}
              <div className="flex shrink-0 flex-col items-center justify-start gap-3 pb-4 lg:order-2 lg:w-[200px] lg:pb-0 lg:pl-5">
                <div
                  className="overflow-hidden rounded-full border-4 border-white shadow-lg"
                  style={{ width: 180, height: 180 }}
                >
                  <Image
                    src={previewUrl}
                    alt="Vista previa final"
                    width={180}
                    height={180}
                    className="size-full"
                    unoptimized
                  />
                </div>
                <p
                  className="text-[0.55rem] font-bold tracking-widest uppercase"
                  style={{ color: '#71717A' }}
                >
                  Vista previa
                </p>
              </div>
              {/* Accordion - scrollable independently on desktop */}
              <div className="flex flex-col gap-2 lg:order-1 lg:max-h-[420px] lg:flex-1 lg:overflow-y-auto">
                {parts.map((part) => {
                  const isOpen = expandedSection === part.key
                  const currentValue = options[part.key]
                  return (
                    <div key={part.key} className="border border-[#E4E4E7]">
                      <button
                        type="button"
                        onClick={() => setExpandedSection(isOpen ? null : part.key)}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-[0.6rem] font-bold tracking-wider uppercase"
                        style={{ color: '#353535' }}
                      >
                        <span>{part.label}</span>
                        <ChevronDown
                          size={12}
                          className="transition-transform"
                          style={{ transform: isOpen ? 'rotate(180deg)' : '' }}
                        />
                      </button>
                      {isOpen && (
                        <div className="grid grid-cols-5 gap-1.5 border-t border-[#E4E4E7] px-3 py-2 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8">
                          {part.variants.map((v) => {
                            const active = currentValue === v.value
                            const url = thumbUrl(part.key, v.value)
                            return (
                              <button
                                key={v.value}
                                type="button"
                                onClick={() => updateOption(part.key, v.value)}
                                className="flex flex-col items-center gap-0.5 p-1 transition-all"
                                style={{
                                  border: active ? '2px solid #023047' : '2px solid transparent',
                                  borderRadius: 0,
                                  background: active ? '#F0F8FF' : 'transparent',
                                }}
                              >
                                <img
                                  src={url}
                                  alt={v.label}
                                  width={THUMB_SIZE}
                                  height={THUMB_SIZE}
                                  className="block"
                                  loading="lazy"
                                />
                                <span
                                  className="text-[0.45rem] leading-tight font-semibold uppercase"
                                  style={{ color: active ? '#023047' : '#71717A' }}
                                >
                                  {v.label}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Colors ── */}
            <div className="border-t-2 border-[#E4E4E7] px-5 py-3">
              <button
                type="button"
                onClick={() => setColorsOpen(!colorsOpen)}
                className="flex w-full items-center justify-between text-[0.6rem] font-bold tracking-wider uppercase"
                style={{ color: '#353535' }}
              >
                <span>Colores</span>
                <ChevronDown
                  size={12}
                  className="transition-transform"
                  style={{ transform: colorsOpen ? 'rotate(180deg)' : '' }}
                />
              </button>
              {colorsOpen && (
                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                  {colorParts.map((cp) => (
                    <div key={cp.key}>
                      <p
                        className="mb-1 text-[0.5rem] font-bold tracking-wider uppercase"
                        style={{ color: '#71717A' }}
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
              )}
            </div>

            {/* ── Probabilities (Lorelei only) ── */}
            {style === 'lorelei' && (
              <div className="border-t-2 border-[#E4E4E7] px-5 py-3">
                <button
                  type="button"
                  onClick={() => setProbOpen(!probOpen)}
                  className="flex w-full items-center justify-between text-[0.6rem] font-bold tracking-wider uppercase"
                  style={{ color: '#353535' }}
                >
                  <span>Probabilidades</span>
                  <ChevronDown
                    size={12}
                    className="transition-transform"
                    style={{ transform: probOpen ? 'rotate(180deg)' : '' }}
                  />
                </button>
                {probOpen && (
                  <div className="mt-2 space-y-1">
                    {['hairProbability', 'eyesProbability', 'mouthProbability'].map((key) => {
                      const label = key.replace('Probability', '')
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span
                            className="w-14 text-[0.5rem] font-bold uppercase"
                            style={{ color: '#71717A' }}
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
                            className="w-5 text-right text-[0.5rem]"
                            style={{ color: '#71717A' }}
                          >
                            {options[key] || '100'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Panel footer ── */}
            <div className="flex items-center justify-between border-t-2 border-[#E4E4E7] px-5 py-3">
              <button
                type="button"
                onClick={regenerate}
                className="flex items-center gap-1 border-2 border-[#8ECAE6] px-4 py-2 text-[0.55rem] font-bold tracking-wider text-[#023047] uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#8ECAE6] hover:text-white hover:shadow-[2px_2px_0_#353535]"
              >
                <Shuffle size={12} /> Aleatorio
              </button>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="border-2 border-[#023047] bg-[#023047] px-6 py-2 text-[0.55rem] font-bold tracking-wider text-white uppercase transition-all hover:bg-white hover:text-[#023047] hover:shadow-[3px_3px_0_#353535]"
              >
                Aplicar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export { buildUrl }

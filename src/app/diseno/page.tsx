import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { DSButton, DSCard, DSBadge, DSInput } from '@/components/ui/ds'
import {
  colors,
  btn,
  btnDark,
  card,
  shadow,
  input,
  inputDark,
  eyebrow,
  section,
  gridOverlay,
  layout,
} from '@/lib/design-tokens'
import {
  Palette as PaletteIcon,
  Type,
  Square,
  LayoutGrid,
  Image,
  Move,
  SeparatorHorizontal,
  AlertCircle,
  CheckCircle2,
  Info,
  Loader,
  ChevronRight,
  Menu,
  X,
  Search,
  Star,
  Heart,
  Users,
  CalendarDays,
  MapPin,
  Clock3,
  Compass,
  Layers,
  Target,
  BookOpen,
  FileText,
  User,
  Mic,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Upload,
  ZoomIn,
  Camera,
  MessageCircle,
  LogOut,
  Link2,
  PlayCircle,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
} from 'lucide-react'

const COLORS: { name: string; hex: string; usage: string }[] = [
  { name: 'blue-tint', hex: colors.blueTint, usage: 'Secciones de acento azul claro' },
  { name: 'blue-light', hex: colors.blueLight, usage: 'Acento principal, subrayados, hovers' },
  { name: 'blue-mid', hex: colors.blueMid, usage: 'Acento secundario, slides, badges' },
  { name: 'blue-dark', hex: colors.blueDark, usage: 'Eyebrows, textos acento en claro' },
  { name: 'dark', hex: colors.dark, usage: 'Texto primario, bordes, sombras' },
  { name: 'light', hex: colors.light, usage: 'Reservado — fondos alternativos' },
  { name: 'pink', hex: colors.pink, usage: 'Reservado — acento secundario' },
  { name: 'near-black', hex: colors.nearBlack, usage: 'Sombras offset, bordes pesados' },
  { name: 'surface', hex: colors.surface, usage: 'Fondo base anterior (crema)' },
  { name: 'zinc-200', hex: colors.zinc200, usage: 'Bordes editoriales, separadores' },
  { name: 'error', hex: colors.error, usage: 'Validación, mensajes de error' },
  { name: 'success', hex: colors.success, usage: 'Éxito, estados completados' },
  { name: 'punch', hex: colors.punch, usage: 'CTAs, botones primarios, hover cards' },
]

const TYPOGRAPHY = [
  {
    label: 'display-xl',
    sample: 'Lorem ipsum dolor sit amet',
    cls: 'text-[clamp(3rem,6vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.04em]',
  },
  {
    label: 'display-lg',
    sample: 'Consectetur adipiscing elit sed do',
    cls: 'text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.0] tracking-[-0.03em]',
  },
  {
    label: 'h1',
    sample: 'Eiusmod tempor incididunt ut labore',
    cls: 'text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em]',
  },
  {
    label: 'h2',
    sample: 'Dolore magna aliqua ut enim ad minim',
    cls: 'text-[clamp(1.25rem,2vw,1.75rem)] font-bold leading-[1.2] tracking-[-0.01em]',
  },
  {
    label: 'h3',
    sample: 'Veniam quis nostrud exercitation',
    cls: 'text-xl font-bold leading-[1.3]',
  },
  {
    label: 'body-lg',
    sample:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
    cls: 'text-[1.0625rem] leading-[1.7]',
  },
  {
    label: 'body-md',
    sample:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    cls: 'text-[0.9375rem] leading-[1.65]',
  },
  {
    label: 'label',
    sample: 'EYEBROW LABEL — LOREM IPSUM',
    cls: 'text-[0.75rem] font-bold tracking-[0.1em] uppercase',
  },
  {
    label: 'caption',
    sample: 'LOREM IPSUM DOLOR SIT',
    cls: 'text-[0.6875rem] font-medium tracking-[0.06em] uppercase',
  },
]

const ICONS = [
  ArrowRight,
  BookOpen,
  CalendarDays,
  Compass,
  Layers,
  Target,
  Heart,
  Users,
  MapPin,
  Clock3,
  FileText,
  User,
  Mic,
  Mail,
  Eye,
  EyeOff,
  Upload,
  ZoomIn,
  Camera,
  MessageCircle,
  LogOut,
  Link2,
  PlayCircle,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Search,
  Star,
  X,
  Menu,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader,
  Move,
  SeparatorHorizontal,
  Image,
  Square,
  LayoutGrid,
  Type,
  PaletteIcon,
  ChevronRight,
]

function isLightHex(hex: string) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

function ColorSwatch({ name, hex, usage }: { name: string; hex: string; usage: string }) {
  const light = isLightHex(hex)
  return (
    <div className="border-2 border-[#353535]">
      <div className="h-24" style={{ backgroundColor: hex }} />
      <div
        className={`border-t-2 border-[#353535] p-3 ${light ? 'text-[#353535]' : 'text-white'}`}
        style={{ backgroundColor: hex }}
      >
        <p className="text-xs font-bold tracking-widest uppercase">{name}</p>
        <p className="mt-0.5 font-mono text-[10px] opacity-80">{hex}</p>
        <p className="mt-1 text-[10px] leading-tight opacity-70">{usage}</p>
      </div>
    </div>
  )
}

function SectionHeader({
  num,
  title,
  description,
}: {
  num: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-12">
      <p className={eyebrow.light}>
        {num} — {title}
      </p>
      {description && <p className="mt-3 max-w-2xl text-base text-zinc-500">{description}</p>}
    </div>
  )
}

function Section({
  children,
  num,
  title,
  description,
}: {
  children: React.ReactNode
  num: string
  title: string
  description?: string
}) {
  return (
    <section className={section.light}>
      <div className={`mx-auto ${layout.maxWidth} ${layout.sectionPadding}`}>
        <SectionHeader num={num} title={title} description={description} />
        {children}
      </div>
    </section>
  )
}

function DarkSection({
  children,
  num,
  title,
  description,
}: {
  children: React.ReactNode
  num: string
  title: string
  description?: string
}) {
  return (
    <section className={section.dark}>
      <div className="max-w-landing relative mx-auto px-8 py-24">
        <div className={gridOverlay.base} style={gridOverlay.style} />
        <div className="relative">
          <p className={eyebrow.dark}>
            {num} — {title}
          </p>
          {description && <p className="mt-3 max-w-2xl text-base text-white/60">{description}</p>}
          <div className="mt-12">{children}</div>
        </div>
      </div>
    </section>
  )
}

function SplitPanel({ light, dark }: { light: React.ReactNode; dark: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-0 border-2 border-[#353535] lg:grid-cols-2">
      <div className="bg-white p-6 lg:p-8">{light}</div>
      <div className="border-t-2 border-[#353535] bg-[#0f0f0f] p-6 lg:border-t-0 lg:border-l-2 lg:p-8">
        {dark}
      </div>
    </div>
  )
}

function SplitLabel({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`mb-5 text-[10px] font-bold tracking-widest uppercase ${dark ? 'text-[#8ECAE6]' : 'text-[#023047]'}`}
    >
      {children}
    </p>
  )
}

/* ─── Buttons on light background ─── */
function ButtonsLight() {
  return (
    <div className="space-y-8">
      <div>
        <SplitLabel>Primario (punch)</SplitLabel>
        <div className="flex flex-wrap items-center gap-3">
          <DSButton variant="primary" size="md" context="light">
            Comenzar
          </DSButton>
          <DSButton variant="primary" size="sm" context="light">
            Registrarse
          </DSButton>
          <DSButton variant="primary" size="lg" context="light">
            Reservar
          </DSButton>
          <DSButton variant="primary" size="md" disabled>
            Deshab.
          </DSButton>
        </div>
      </div>
      <div>
        <SplitLabel>Secundario (outline)</SplitLabel>
        <div className="flex flex-wrap items-center gap-3">
          <DSButton variant="secondary" size="md" context="light">
            Conocer más
          </DSButton>
          <DSButton variant="secondary" size="sm" context="light">
            Explorar
          </DSButton>
          <DSButton variant="secondary" size="lg" context="light">
            Ver todos
          </DSButton>
        </div>
      </div>
      <div>
        <SplitLabel>Ghost & Link</SplitLabel>
        <div className="flex flex-wrap items-center gap-3">
          <DSButton variant="ghost" context="light">
            Cancelar
          </DSButton>
          <DSButton variant="link" context="light">
            Volver al inicio
          </DSButton>
        </div>
      </div>
      <div>
        <SplitLabel>Brutalist (sombra offset)</SplitLabel>
        <div className="flex flex-wrap items-center gap-3">
          <DSButton variant="brutalist" context="light">
            Brutalist
          </DSButton>
          <button className={`${btn.base} ${btn.brutalist}`}>Brutalist</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Buttons on dark background ─── */
function ButtonsDark() {
  return (
    <div className="space-y-8">
      <div>
        <SplitLabel dark>Primario (punch)</SplitLabel>
        <div className="flex flex-wrap items-center gap-3">
          <DSButton variant="primary" size="md" context="dark">
            Comenzar
          </DSButton>
          <DSButton variant="primary" size="sm" context="dark">
            Registrarse
          </DSButton>
          <DSButton variant="primary" size="lg" context="dark">
            Reservar
          </DSButton>
          <DSButton variant="primary" size="md" disabled>
            Deshab.
          </DSButton>
        </div>
      </div>
      <div>
        <SplitLabel dark>Secundario (outline)</SplitLabel>
        <div className="flex flex-wrap items-center gap-3">
          <DSButton variant="secondary" size="md" context="dark">
            Conocer más
          </DSButton>
          <DSButton variant="secondary" size="sm" context="dark">
            Explorar
          </DSButton>
          <DSButton variant="secondary" size="lg" context="dark">
            Ver todos
          </DSButton>
        </div>
      </div>
      <div>
        <SplitLabel dark>Ghost & Link</SplitLabel>
        <div className="flex flex-wrap items-center gap-3">
          <DSButton variant="ghost" context="dark">
            Cancelar
          </DSButton>
          <DSButton variant="link" context="dark">
            Volver al inicio
          </DSButton>
        </div>
      </div>
      <div>
        <SplitLabel dark>Brutalist (sombra offset)</SplitLabel>
        <div className="flex flex-wrap items-center gap-3">
          <DSButton variant="brutalist" context="dark">
            Brutalist
          </DSButton>
          <button className={`${btnDark.base} ${btnDark.brutalist}`}>Brutalist</button>
        </div>
      </div>
    </div>
  )
}

export default function DisenoPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col bg-white">
        {/* ═══ HERO ═══ */}
        <section className={section.hero}>
          <div className="max-w-landing relative mx-auto px-8 pt-28 pb-20">
            <div className={gridOverlay.base} style={gridOverlay.style} />
            <div className="relative max-w-3xl">
              <div className="h-0.75 w-16 bg-[#8ECAE6]" />
              <h1 className="mt-6 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.0] font-extrabold tracking-[-0.04em] text-white">
                Sistema de Diseño
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                Manual de componentes con comparación visual sobre fondo claro y fondo oscuro. Lorem
                ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </section>

        {/* 01 — PALETA */}
        <Section
          num="01"
          title="Paleta Cromática"
          description="Colores base del sistema. Cada sección de componentes se muestra sobre fondo claro (#FFFFFF) y fondo oscuro (#0f0f0f)."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {COLORS.map((c) => (
              <ColorSwatch key={c.name} {...c} />
            ))}
          </div>
        </Section>

        {/* 02 — TIPOGRAFÍA */}
        <Section num="02" title="Tipografía" description="Poppins en 5 pesos (400–800).">
          <div className="space-y-8">
            {TYPOGRAPHY.map((t) => (
              <div
                key={t.label}
                className="border-b border-zinc-100 pb-6 last:border-b-0 last:pb-0"
              >
                <p className="mb-2 text-[10px] font-bold tracking-widest text-[#4682B4] uppercase">
                  {t.label}
                </p>
                <p className={t.cls}>{t.sample}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t-2 border-zinc-200 pt-8">
            <p className="mb-4 text-[10px] font-bold tracking-widest text-[#4682B4] uppercase">
              Variable de fuente
            </p>
            <p className="font-mono text-sm text-zinc-600">
              --font-sans: Poppins · --font-heading: Poppins · --font-mono: Geist Mono
            </p>
          </div>
        </Section>

        {/* 03 — BOTONES — Split claro / oscuro */}
        <section className={section.light}>
          <div className={`mx-auto ${layout.maxWidth} ${layout.sectionPadding}`}>
            <SectionHeader
              num="03"
              title="Botones"
              description="Cada variante se muestra sobre fondo claro (izquierda) y fondo oscuro (derecha) para verificar contraste."
            />
            <SplitPanel light={<ButtonsLight />} dark={<ButtonsDark />} />
          </div>
        </section>

        {/* 04 — CARDS — Split */}
        <section className={section.light}>
          <div className={`mx-auto ${layout.maxWidth} ${layout.sectionPadding}`}>
            <SectionHeader
              num="04"
              title="Cards"
              description="Tarjetas sobre fondo claro y oscuro."
            />
            <SplitPanel
              light={
                <div className="space-y-6">
                  <SplitLabel>Testimonial</SplitLabel>
                  <div className="testimonial-card" style={{ minWidth: 0, width: 'auto' }}>
                    <p className="testimonial-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua.
                    </p>
                    <div className="author-meta mt-6">
                      <p className="author-name">Lorem Ipsum</p>
                      <p className="author-handle">@lorem_ipsum</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <SplitLabel>Evento</SplitLabel>
                    <DSCard variant="event">
                      <div className="aspect-[4/3] bg-zinc-100" />
                      <div className="p-4">
                        <DSBadge variant="category" style={{ color: colors.blueLight }}>
                          Taller
                        </DSBadge>
                        <h3 className="mt-1 text-lg font-bold tracking-[-0.02em] text-[#353535]">
                          Lorem Ipsum Dolor
                        </h3>
                        <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
                          <span className="text-base font-bold text-[#353535]">$99.000</span>
                          <DSButton variant="primary" size="sm" context="light">
                            Reservar
                          </DSButton>
                        </div>
                      </div>
                    </DSCard>
                  </div>
                </div>
              }
              dark={
                <div className="space-y-6">
                  <SplitLabel dark>Dark card</SplitLabel>
                  <DSCard variant="dark">
                    <div className="aspect-[4/3] bg-white/5" />
                    <div className="p-4">
                      <DSBadge variant="category" style={{ color: colors.blueLight }}>
                        Taller
                      </DSBadge>
                      <h3 className="mt-1 text-lg font-bold tracking-[-0.02em] text-white">
                        Lorem Ipsum Dolor
                      </h3>
                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-base font-bold text-white">$99.000</span>
                        <DSButton variant="primary" size="sm" context="dark">
                          Reservar
                        </DSButton>
                      </div>
                    </div>
                  </DSCard>
                  <div className="mt-6">
                    <SplitLabel dark>Service card</SplitLabel>
                    <div className={`${card.dark} ${card.darkHover} p-6`}>
                      <div className="flex h-12 w-12 items-center justify-center border-2 border-white/12 transition-all duration-200 group-hover:shadow-[3px_3px_0_#8ECAE6]">
                        <Compass size={20} style={{ color: colors.blueLight }} />
                      </div>
                      <h3 className="mt-4 text-xl font-bold tracking-[-0.02em] text-white">
                        Mentorías 1:1
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit.
                      </p>
                      <span className="mt-4 flex items-center gap-1 text-[0.62rem] font-bold tracking-widest text-[#8ECAE6] uppercase transition-all group-hover:gap-3">
                        Explorar <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </section>

        {/* 05 — FORMULARIOS — Split */}
        <section className={section.light}>
          <div className={`mx-auto ${layout.maxWidth} ${layout.sectionPadding}`}>
            <SectionHeader
              num="05"
              title="Formularios"
              description="Inputs sobre fondo claro y oscuro."
            />
            <SplitPanel
              light={
                <div className="space-y-5">
                  <div>
                    <SplitLabel>Input por defecto</SplitLabel>
                    <DSInput type="text" placeholder="Lorem ipsum dolor sit" />
                  </div>
                  <div>
                    <SplitLabel>Input con focus</SplitLabel>
                    <input
                      type="text"
                      defaultValue="Lorem ipsum dolor sit"
                      className={`${input.base} border-[#023047] ${shadow.inputFocus}`}
                    />
                  </div>
                  <div>
                    <SplitLabel>Input con error</SplitLabel>
                    <DSInput type="text" defaultValue="Email inválido" hasError />
                  </div>
                  <div>
                    <SplitLabel>Select</SplitLabel>
                    <select className={`${input.base} ${input.border} ${input.focus}`}>
                      <option>Lorem ipsum</option>
                      <option>Dolor sit amet</option>
                    </select>
                  </div>
                  <div>
                    <SplitLabel>Checkbox</SplitLabel>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#E63946]" />
                      <span className="text-sm text-[#353535]">Acepto términos lorem ipsum</span>
                    </label>
                  </div>
                </div>
              }
              dark={
                <div className="space-y-5">
                  <div>
                    <SplitLabel dark>Input por defecto</SplitLabel>
                    <input
                      type="text"
                      placeholder="Lorem ipsum dolor sit"
                      className={`${inputDark.base} ${inputDark.border} ${inputDark.focus}`}
                    />
                  </div>
                  <div>
                    <SplitLabel dark>Input con focus</SplitLabel>
                    <input
                      type="text"
                      defaultValue="Lorem ipsum dolor sit"
                      className={`${inputDark.base} border-[#8ECAE6] shadow-[3px_3px_0_#8ECAE6]`}
                    />
                  </div>
                  <div>
                    <SplitLabel dark>Input con error</SplitLabel>
                    <input
                      type="text"
                      defaultValue="Email inválido"
                      className={`${inputDark.base} ${inputDark.error}`}
                    />
                  </div>
                  <div>
                    <SplitLabel dark>Select</SplitLabel>
                    <select className={`${inputDark.base} ${inputDark.border} ${inputDark.focus}`}>
                      <option>Lorem ipsum</option>
                      <option>Dolor sit amet</option>
                    </select>
                  </div>
                  <div>
                    <SplitLabel dark>Checkbox</SplitLabel>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#E63946]" />
                      <span className="text-sm text-white/80">Acepto términos lorem ipsum</span>
                    </label>
                  </div>
                </div>
              }
            />
          </div>
        </section>

        {/* 06 — BADGES — Split */}
        <section className={section.light}>
          <div className={`mx-auto ${layout.maxWidth} ${layout.sectionPadding}`}>
            <SectionHeader
              num="06"
              title="Badges & Labels"
              description="Eyebrow labels, badges y pills sobre ambos fondos."
            />
            <SplitPanel
              light={
                <div className="space-y-6">
                  <div>
                    <SplitLabel>Eyebrow labels</SplitLabel>
                    <div className="flex flex-wrap gap-4">
                      <DSBadge variant="eyebrow-light">01 — Sección</DSBadge>
                      <DSBadge variant="eyebrow-dark">Nuestra Misión</DSBadge>
                    </div>
                  </div>
                  <div>
                    <SplitLabel>Category badges</SplitLabel>
                    <div className="flex flex-wrap gap-3">
                      <DSBadge variant="category" style={{ color: colors.blueLight }}>
                        Taller
                      </DSBadge>
                      <DSBadge variant="category" style={{ color: colors.blueDark }}>
                        Mentoría
                      </DSBadge>
                      <DSBadge variant="category" style={{ color: colors.blueMid }}>
                        Evento
                      </DSBadge>
                      <DSBadge variant="file">File Label</DSBadge>
                    </div>
                  </div>
                  <div>
                    <SplitLabel>Filter pills</SplitLabel>
                    <div className="flex flex-wrap gap-2">
                      <button className="-translate-x-0.5 -translate-y-0.5 border-2 border-[#353535] bg-[#023047] px-4 py-2 text-xs font-bold tracking-widest text-white uppercase shadow-[3px_3px_0_#353535]">
                        Todos
                      </button>
                      <DSBadge variant="pill">Música</DSBadge>
                      <DSBadge variant="pill">Artes</DSBadge>
                      <DSBadge variant="pill">Danza</DSBadge>
                    </div>
                  </div>
                </div>
              }
              dark={
                <div className="space-y-6">
                  <div>
                    <SplitLabel dark>Eyebrow labels</SplitLabel>
                    <div className="flex flex-wrap gap-4">
                      <span className="text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase">
                        01 — Sección
                      </span>
                      <span className="text-[0.62rem] font-bold tracking-[0.28em] text-white/60 uppercase">
                        Eyebrow alt
                      </span>
                    </div>
                  </div>
                  <div>
                    <SplitLabel dark>Category badges</SplitLabel>
                    <div className="flex flex-wrap gap-3">
                      <DSBadge variant="category" style={{ color: colors.blueLight }}>
                        Taller
                      </DSBadge>
                      <DSBadge variant="category" style={{ color: '#ffffff80' }}>
                        Mentoría
                      </DSBadge>
                      <DSBadge variant="file">File Label</DSBadge>
                    </div>
                  </div>
                  <div>
                    <SplitLabel dark>Filter pills</SplitLabel>
                    <div className="flex flex-wrap gap-2">
                      <button className="-translate-x-0.5 -translate-y-0.5 border-2 border-[#8ECAE6] bg-[#023047] px-4 py-2 text-xs font-bold tracking-widest text-white uppercase shadow-[3px_3px_0_rgba(142,202,230,0.5)]">
                        Todos
                      </button>
                      <button className="border-2 border-white/30 px-4 py-2 text-xs font-bold tracking-widest text-white/70 uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_rgba(255,255,255,0.2)]">
                        Música
                      </button>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </section>

        {/* 07 — GRID */}
        <DarkSection
          num="07"
          title="Grid & Layout"
          description="12 columnas · max-width 1740px · padding clamp(1.5rem, 5vw, 6rem)."
        >
          <div className="space-y-4">
            {[4, 3, 2, 1].map((divisor) => (
              <div key={divisor} className="flex gap-1">
                {Array.from({ length: 12 / divisor }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-12 items-center justify-center border-2 border-[#8ECAE6] bg-white/5 text-[10px] font-bold tracking-widest text-[#8ECAE6] uppercase"
                    style={{ flex: `${divisor}` }}
                  >
                    {divisor === 1 ? `${12 / divisor}` : `${12 / divisor} col`}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </DarkSection>

        {/* 08 — SOMBRAS */}
        <Section num="08" title="Sombras" description="Offset shadows brutalist.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Card hover', cls: shadow.cardHover, color: colors.nearBlack },
              { label: 'Card active', cls: shadow.cardActive, color: colors.nearBlack },
              { label: 'Button primary', cls: shadow.btnPrimary, color: colors.dark },
              { label: 'Button hover', cls: shadow.btnHover, color: colors.dark },
              { label: 'Blue-dark', cls: shadow.blueDark, color: colors.blueDark },
              { label: 'Blue-light', cls: shadow.blueLight, color: colors.blueLight },
              {
                label: 'Testimonial hover',
                cls: shadow.testimonialHover,
                color: colors.legacyRosa,
              },
              { label: 'Modal', cls: shadow.modal, color: colors.nearBlack },
              { label: 'Input focus', cls: shadow.inputFocus, color: colors.blueDark },
            ].map((s) => (
              <div key={s.label} className={`border-2 border-zinc-200 p-5 ${s.cls}`}>
                <p className="font-mono text-xs text-[#353535]">{s.cls}</p>
                <p className="mt-1 text-[10px] font-bold tracking-widest text-[#4682B4] uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* 09 — ICONOS */}
        <DarkSection
          num="09"
          title="Iconos"
          description="Lucide React — 42 iconos usados en el sistema."
        >
          <div className="grid grid-cols-6 gap-4 sm:grid-cols-8 lg:grid-cols-12">
            {ICONS.map((Icon, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-3">
                <Icon size={20} style={{ color: colors.blueLight }} />
              </div>
            ))}
          </div>
        </DarkSection>

        {/* 10 — ANIMACIONES */}
        <Section
          num="10"
          title="Animaciones"
          description="Cubic-bezier(0.16, 1, 0.3, 1) como easing principal."
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border-2 border-zinc-200 bg-white p-6">
              <p className="text-[10px] font-bold tracking-widest text-[#4682B4] uppercase">
                Fade-up + blur
              </p>
              <div
                className="mt-4 h-16 bg-[#8ECAE6] transition-all duration-500"
                style={{ filter: 'blur(0px)', opacity: 1, transform: 'translateY(0)' }}
              />
              <p className="mt-3 text-xs text-zinc-500">filter: blur(8px) → 0 · y: 10 → 0</p>
            </div>
            <div className="border-2 border-zinc-200 bg-white p-6">
              <p className="text-[10px] font-bold tracking-widest text-[#4682B4] uppercase">
                Stagger
              </p>
              <div className="mt-4 flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-12 w-12 bg-[#023047] transition-all"
                    style={{ transitionDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
              <p className="mt-3 text-xs text-zinc-500">delay: i × 0.12s · duración: 0.5s</p>
            </div>
            <div className="border-2 border-zinc-200 bg-white p-6">
              <p className="text-[10px] font-bold tracking-widest text-[#4682B4] uppercase">
                Hover translate
              </p>
              <div className="mt-4 flex h-16 w-16 items-center justify-center border-2 border-[#353535] bg-white shadow-[4px_4px_0_#353535] transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0_#353535]">
                <ArrowRight size={20} />
              </div>
              <p className="mt-3 text-xs text-zinc-500">translate(-1px,-1px) · shadow: 4px→5px</p>
            </div>
          </div>
        </Section>

        {/* 11 — LOADERS */}
        <DarkSection num="11" title="Loaders & Spinners" description="Estados de carga.">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border-2 border-white/10 bg-white/5 p-6">
              <p className="text-[10px] font-bold tracking-widest text-[#8ECAE6] uppercase">
                Skeleton card
              </p>
              <div className="mt-4 space-y-3">
                <div className="h-32 w-full animate-pulse bg-white/10" />
                <div className="h-4 w-3/4 animate-pulse bg-white/10" />
                <div className="h-3 w-1/2 animate-pulse bg-white/10" />
              </div>
            </div>
            <div className="border-2 border-white/10 bg-white/5 p-6">
              <p className="text-[10px] font-bold tracking-widest text-[#8ECAE6] uppercase">
                Loading button
              </p>
              <div className="mt-4">
                <button
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 border-2 border-white/10 bg-white/10 px-6 py-3 text-xs font-bold tracking-widest text-white/50 uppercase"
                >
                  <Loader size={14} className="animate-spin" /> Cargando
                </button>
              </div>
            </div>
            <div className="border-2 border-white/10 bg-white/5 p-6">
              <p className="text-[10px] font-bold tracking-widest text-[#8ECAE6] uppercase">
                Skeleton text
              </p>
              <div className="mt-4 space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-3 w-4/6 animate-pulse bg-white/10"
                    style={{ width: `${50 + i * 10}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </DarkSection>

        {/* 12 — TOOLTIPS — Split */}
        <section className={section.light}>
          <div className={`mx-auto ${layout.maxWidth} ${layout.sectionPadding}`}>
            <SectionHeader
              num="12"
              title="Tooltips & Popovers"
              description="Menús desplegables sobre claro y oscuro."
            />
            <SplitPanel
              light={
                <div className="space-y-6">
                  <SplitLabel>Dropdown usuario</SplitLabel>
                  <div className="border-2 border-[#353535] bg-white shadow-[4px_4px_0_#111]">
                    <div className="border-b border-zinc-200 px-3 py-2">
                      <p className="text-[10px] font-bold tracking-widest text-[#023047] uppercase">
                        Sesión activa
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-zinc-800">@lorem_ipsum</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100">
                      Ver perfil
                    </div>
                    <div className="flex items-center gap-2 border-t border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100">
                      <LogOut size={12} /> Cerrar sesión
                    </div>
                  </div>
                </div>
              }
              dark={
                <div className="space-y-6">
                  <SplitLabel dark>Country picker</SplitLabel>
                  <div className="border-2 border-white/20 bg-[#0f0f0f] shadow-[4px_4px_0_rgba(255,255,255,0.15)]">
                    <input
                      type="text"
                      placeholder="Buscar país..."
                      className="w-full border-b border-white/10 bg-transparent px-3 py-2 text-xs text-white outline-none placeholder:text-white/40"
                    />
                    <div className="max-h-32 overflow-y-auto">
                      <p className="sticky top-0 bg-[#0f0f0f] px-3 py-1 text-[9px] font-bold tracking-widest text-[#8ECAE6] uppercase">
                        América
                      </p>
                      {[
                        { n: 'Colombia', c: '+57' },
                        { n: 'México', c: '+52' },
                      ].map(({ n, c }) => (
                        <button
                          key={n}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-white/70 hover:bg-white/10"
                        >
                          {n}
                          <span className="ml-auto text-[10px] text-white/40">{c}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </section>

        {/* 13 — TABLAS — Split */}
        <section className={section.light}>
          <div className={`mx-auto ${layout.maxWidth} ${layout.sectionPadding}`}>
            <SectionHeader
              num="13"
              title="Tablas & Listas"
              description="Tablas de datos sobre claro y oscuro."
            />
            <SplitPanel
              light={
                <div className="space-y-6">
                  <SplitLabel>Tabla de datos</SplitLabel>
                  <div className="border-2 border-[#353535] bg-white">
                    <div className="grid grid-cols-3 gap-2 border-b-2 border-[#353535] bg-white px-4 py-3 text-[10px] font-bold tracking-widest text-[#023047] uppercase">
                      <span>Nombre</span>
                      <span>Categoría</span>
                      <span>Estado</span>
                    </div>
                    {['Lorem', 'Ipsum', 'Dolor'].map((name, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-3 gap-2 border-b border-zinc-200 px-4 py-2.5 text-sm text-[#353535] last:border-b-0"
                      >
                        <span>
                          {name} {i + 1}
                        </span>
                        <span className="text-[10px] font-bold tracking-widest text-[#4682B4] uppercase">
                          {['Taller', 'Mentoría', 'Evento'][i]}
                        </span>
                        <span
                          className={`text-xs font-semibold ${i === 0 ? 'text-[#16A34A]' : 'text-zinc-400'}`}
                        >
                          {i === 0 ? 'Completado' : 'Pendiente'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              }
              dark={
                <div className="space-y-6">
                  <SplitLabel dark>Tabla de datos</SplitLabel>
                  <div className="border-2 border-white/20 bg-white/5">
                    <div className="grid grid-cols-3 gap-2 border-b border-white/10 px-4 py-3 text-[10px] font-bold tracking-widest text-[#8ECAE6] uppercase">
                      <span>Nombre</span>
                      <span>Categoría</span>
                      <span>Estado</span>
                    </div>
                    {['Lorem', 'Ipsum', 'Dolor'].map((name, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-3 gap-2 border-b border-white/5 px-4 py-2.5 text-sm text-white/70 last:border-b-0"
                      >
                        <span>
                          {name} {i + 1}
                        </span>
                        <span className="text-[10px] font-bold tracking-widest text-[#4682B4] uppercase">
                          {['Taller', 'Mentoría', 'Evento'][i]}
                        </span>
                        <span
                          className={`text-xs font-semibold ${i === 0 ? 'text-[#16A34A]' : 'text-white/40'}`}
                        >
                          {i === 0 ? 'Completado' : 'Pendiente'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <SplitLabel dark>Lista de notas</SplitLabel>
                  <div className="border-2 border-white/10 bg-white/5 p-5">
                    {[
                      'Lorem ipsum dolor sit amet',
                      'Consectetur adipiscing elit',
                      'Eiusmod tempor incididunt',
                    ].map((note, i) => (
                      <div key={i} className="relative pb-2 pl-5 text-sm text-white/70 last:pb-0">
                        <span className="absolute top-[0.6rem] left-0 h-1.5 w-1.5 bg-[#8ECAE6]" />
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              }
            />
          </div>
        </section>

        {/* 14 — NAVEGACIÓN — Split */}
        <section className={section.light}>
          <div className={`mx-auto ${layout.maxWidth} ${layout.sectionPadding}`}>
            <SectionHeader
              num="14"
              title="Navegación"
              description="Tabs y step indicators sobre claro y oscuro."
            />
            <SplitPanel
              light={
                <div className="space-y-8">
                  <div>
                    <SplitLabel>Tabs</SplitLabel>
                    <div className="flex items-center gap-6">
                      <button className="text-[0.72rem] font-bold tracking-[0.12em] text-[#353535] uppercase underline decoration-[#023047] decoration-2 underline-offset-[3px]">
                        Activo
                      </button>
                      <button className="text-[0.72rem] font-bold tracking-[0.12em] text-zinc-500 uppercase">
                        Inactivo
                      </button>
                    </div>
                  </div>
                  <div>
                    <SplitLabel>Step indicator</SplitLabel>
                    <div className="flex items-center gap-2">
                      {['Paso 1', 'Paso 2', 'Paso 3'].map((step, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 border ${i <= 1 ? 'border-[#353535] bg-[#353535]' : 'border-zinc-300 bg-zinc-200'}`}
                          />
                          <span
                            className={`text-[9px] font-bold tracking-wider uppercase ${i <= 1 ? 'text-[#353535]' : 'text-zinc-400'}`}
                          >
                            {step}
                          </span>
                          {i < 2 && <ChevronRight size={10} className="text-zinc-300" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              }
              dark={
                <div className="space-y-8">
                  <div>
                    <SplitLabel dark>Tabs</SplitLabel>
                    <div className="flex items-center gap-6">
                      <button className="text-[0.72rem] font-bold tracking-[0.12em] text-white uppercase underline decoration-[#8ECAE6] decoration-2 underline-offset-[3px]">
                        Activo
                      </button>
                      <button className="text-[0.72rem] font-bold tracking-[0.12em] text-white/40 uppercase">
                        Inactivo
                      </button>
                    </div>
                  </div>
                  <div>
                    <SplitLabel dark>Step indicator</SplitLabel>
                    <div className="flex items-center gap-2">
                      {['Paso 1', 'Paso 2', 'Paso 3'].map((step, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 border ${i <= 1 ? 'border-[#8ECAE6] bg-[#8ECAE6]' : 'border-white/20 bg-white/10'}`}
                          />
                          <span
                            className={`text-[9px] font-bold tracking-wider uppercase ${i <= 1 ? 'text-white' : 'text-white/30'}`}
                          >
                            {step}
                          </span>
                          {i < 2 && <ChevronRight size={10} className="text-white/20" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </section>

        {/* 15 — ALERTAS — Split */}
        <section className={section.light}>
          <div className={`mx-auto ${layout.maxWidth} ${layout.sectionPadding}`}>
            <SectionHeader
              num="15"
              title="Alertas & Mensajes"
              description="Banners sobre claro y oscuro."
            />
            <SplitPanel
              light={
                <div className="space-y-4">
                  {[
                    {
                      icon: CheckCircle2,
                      title: '¡Lorem ipsum!',
                      desc: 'Lorem ipsum success.',
                      color: colors.success,
                    },
                    {
                      icon: AlertCircle,
                      title: 'Error — lorem ipsum',
                      desc: 'Duis aute irure dolor.',
                      color: colors.error,
                    },
                    {
                      icon: Info,
                      title: 'Información',
                      desc: 'Sed do eiusmod tempor.',
                      color: colors.blueMid,
                    },
                  ].map((a, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 border-2 px-4 py-3"
                      style={{ borderColor: a.color }}
                    >
                      <a.icon size={16} style={{ color: a.color, flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p className="text-sm font-bold text-[#353535]">{a.title}</p>
                        <p className="text-sm text-zinc-600">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              }
              dark={
                <div className="space-y-4">
                  {[
                    {
                      icon: CheckCircle2,
                      title: '¡Lorem ipsum!',
                      desc: 'Lorem ipsum success.',
                      color: colors.success,
                    },
                    {
                      icon: AlertCircle,
                      title: 'Error — lorem ipsum',
                      desc: 'Duis aute irure dolor.',
                      color: colors.error,
                    },
                    {
                      icon: Info,
                      title: 'Información',
                      desc: 'Sed do eiusmod tempor.',
                      color: colors.blueLight,
                    },
                  ].map((a, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 border-2 px-4 py-3"
                      style={{ borderColor: a.color, background: `${a.color}1A` }}
                    >
                      <a.icon size={16} style={{ color: a.color, flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p className="text-sm font-bold text-white">{a.title}</p>
                        <p className="text-sm text-white/70">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        </section>

        {/* 16 — SEPARADORES */}
        <Section num="16" title="Separadores & Líneas" description="Divisores estructurales.">
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-[10px] font-bold tracking-widest text-[#4682B4] uppercase">
                Border-bottom (claro)
              </p>
              <div className="border-b-2 border-zinc-200 pb-6">
                <p className="text-sm text-zinc-500">border-b-2 border-zinc-200</p>
              </div>
            </div>
            <div className="bg-[#0f0f0f] p-8">
              <p className="mb-3 text-[10px] font-bold tracking-widest text-[#8ECAE6] uppercase">
                Border-top (oscuro)
              </p>
              <div className="border-t-2 border-white/10 pt-6">
                <p className="text-sm text-white/50">border-t-2 border-white/10</p>
              </div>
            </div>
            <div>
              <p className="mb-3 text-[10px] font-bold tracking-widest text-[#4682B4] uppercase">
                Accent strip
              </p>
              <div className="h-0.75 w-full bg-[#8ECAE6]" />
              <p className="mt-2 text-xs text-zinc-500">h-0.75 bg-[#8ECAE6]</p>
            </div>
            <div>
              <p className="mb-3 text-[10px] font-bold tracking-widest text-[#4682B4] uppercase">
                Grid overlay
              </p>
              <div className="relative h-24 border-2 border-zinc-200">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                  }}
                />
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}

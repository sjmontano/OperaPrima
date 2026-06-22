'use client'

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { DSButton, DSCard, DSBadge, DSInput } from '@/components/ui/ds'
import {
  colors,
  btn,
  card,
  shadow,
  input,
  eyebrow,
  section,
  gridOverlay,
} from '@/lib/design-tokens'
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
  Target,
  Heart,
  Compass,
  Layers,
  BookOpen,
  Mic,
  Star,
  Quote,
  CheckCircle2,
  ChevronRight,
  Mail,
} from 'lucide-react'

const LOREM =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
const LOREM_SHORT = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.'

const ITEMS = [
  {
    title: 'Mentorías 1:1',
    desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt.',
    icon: Compass,
    accent: colors.blueLight,
  },
  {
    title: 'Talleres y Eventos',
    desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
    icon: CalendarDays,
    accent: colors.blueDark,
  },
  {
    title: 'Tablero de Oportunidades',
    desc: 'Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt.',
    icon: Target,
    accent: colors.blueMid,
  },
  {
    title: 'Membresía Premium',
    desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.',
    icon: Star,
    accent: colors.blueLight,
  },
]

const EVENTS = [
  {
    title: 'Taller de Lorem Ipsum',
    cat: 'Taller',
    date: '15 Jul 2026',
    loc: 'Bogotá',
    price: '$99.000',
  },
  {
    title: 'Masterclass Dolor Sit',
    cat: 'Masterclass',
    date: '22 Jul 2026',
    loc: 'Medellín',
    price: '$149.000',
  },
  { title: 'Networking Amet', cat: 'Evento', date: '05 Ago 2026', loc: 'Online', price: 'Gratis' },
]

const TESTIMONIALS = [
  {
    name: 'María López',
    handle: '@marialopez',
    text: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.',
  },
  {
    name: 'Carlos M.',
    handle: '@carlosm',
    text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint.',
  },
  {
    name: 'Ana García',
    handle: '@anagarcia',
    text: 'Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
]

const PARTNERS = ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur']

export default function MuestraPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col bg-[#F0F8FF]">
        {/* ═══ HERO ═══ */}
        <section className={section.hero}>
          <div className="max-w-landing relative mx-auto px-8 pt-28 pb-24">
            <div className={gridOverlay.base} style={gridOverlay.style} />
            <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="max-w-2xl">
                <div className="h-0.75 w-16 bg-[#8ECAE6]" />
                <h1 className="mt-6 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.0] font-extrabold tracking-[-0.04em] text-white">
                  Lorem ipsum dolor
                  <br />
                  sit amet consectetur
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">{LOREM}</p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <DSButton variant="primary" size="lg">
                    Comenzar gratis
                  </DSButton>
                  <DSButton variant="secondary">Conocer más</DSButton>
                </div>
              </div>
              <div className="hidden lg:block">
                <div
                  className="ml-auto aspect-square max-w-[360px] border-2 border-white/10 bg-white/5 shadow-[6px_6px_0_rgba(142,202,230,0.35)]"
                  style={{ background: 'oklch(0.30 0.07 165)' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ¿QUÉ ES? ═══ */}
        <section className={section.light}>
          <div className="max-w-landing mx-auto px-8 py-24">
            <div className="max-w-2xl">
              <p className={eyebrow.light}>01 — ¿Qué es Opera Prima?</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-[#353535] lg:text-[3.4rem]">
                Bienvenido a{' '}
                <span className="text-[#023047]" style={{ boxShadow: 'inset 0 -0.75lh 0 #8ECAE6' }}>
                  Ópera
                </span>{' '}
                Prima
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600">{LOREM}</p>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">{LOREM_SHORT}</p>
            </div>
            <div className="mt-4 text-[0.6rem] font-bold tracking-[0.24em] text-[#4682B4] uppercase">
              Nuestros servicios{' '}
              <span className="ml-4 inline-block w-32 border-t-2 border-zinc-200 align-middle" />
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ITEMS.map((item, i) => {
                const Icon = item.icon
                return (
                  <DSCard key={i} variant="service">
                    <div
                      className={card.serviceIcon}
                      style={{ boxShadow: `3px 3px 0 ${item.accent}` }}
                    >
                      <Icon size={20} style={{ color: item.accent }} />
                    </div>
                    <h3 className="mt-4 text-xl font-bold tracking-[-0.02em] text-[#353535]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.desc}</p>
                    <span className="mt-4 flex items-center gap-1 text-[0.62rem] font-bold tracking-widest text-[#023047] uppercase transition-all group-hover:gap-3">
                      Explorar <ArrowRight size={12} />
                    </span>
                  </DSCard>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══ EVENTOS / TARJETAS ═══ */}
        <section className={section.dark}>
          <div className="max-w-landing relative mx-auto px-8 py-24">
            <div className={gridOverlay.base} style={gridOverlay.style} />
            <div className="relative">
              <div className="flex items-end justify-between">
                <div>
                  <p className={eyebrow.dark}>02 — Próximos Eventos</p>
                  <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-white lg:text-5xl">
                    Lorem ipsum dolor sit
                  </h2>
                </div>
                <DSButton variant="secondary" size="sm" className="hidden sm:flex">
                  Ver todos
                </DSButton>
              </div>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {EVENTS.map((ev, i) => (
                  <div key={i} className={card.event}>
                    <div className="aspect-[4/3] bg-white/5" />
                    <div className="p-4">
                      <DSBadge variant="category" style={{ color: colors.blueLight }}>
                        {ev.cat}
                      </DSBadge>
                      <h3 className="mt-1 text-lg font-bold tracking-[-0.02em] text-white">
                        {ev.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
                        <CalendarDays size={12} /> {ev.date}
                        <span className="ml-auto">
                          <MapPin size={12} /> {ev.loc}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-base font-bold text-white">{ev.price}</span>
                        <DSButton variant="primary" size="sm">
                          Reservar
                        </DSButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <DSButton variant="secondary" size="md" className="mt-8 sm:hidden">
                Ver todos
              </DSButton>
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIOS ═══ */}
        <section className={section.light}>
          <div className="max-w-landing mx-auto px-8 py-24">
            <p className={eyebrow.light}>03 — Comunidad</p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.025em] text-[#353535] lg:text-5xl">
              Lo que dicen de nosotros
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="testimonial-card" style={{ minWidth: 0, width: 'auto' }}>
                  <Quote size={24} style={{ color: colors.blueLight, opacity: 0.4 }} />
                  <p className="testimonial-text mt-3">{t.text}</p>
                  <div className="author-meta mt-6">
                    <p className="author-name">{t.name}</p>
                    <p className="author-handle">{t.handle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA + STATS ═══ */}
        <section className={section.dark}>
          <div className="max-w-landing relative mx-auto px-8 py-24">
            <div className={gridOverlay.base} style={gridOverlay.style} />
            <div className="relative">
              <div className="h-0.75 w-full bg-[#8ECAE6]" />
              <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center">
                <div>
                  <p className={eyebrow.dark}>04 — Únete</p>
                  <h2 className="mt-4 text-5xl font-bold tracking-[-0.03em] text-white lg:text-[4.5rem]">
                    Lorem ipsum
                    <br />
                    <span className="text-[#8ECAE6]">dolor sit</span>
                  </h2>
                  <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">{LOREM}</p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <DSButton variant="primary" size="lg">
                      Comenzar gratis
                    </DSButton>
                    <DSButton variant="secondary">Conocer más</DSButton>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    { icon: Users, num: '2.4K+', label: 'Artistas' },
                    { icon: CalendarDays, num: '120+', label: 'Eventos' },
                    { icon: Star, num: '50+', label: 'Mentores' },
                    { icon: Heart, num: '98%', label: 'Satisfacción' },
                  ].map((stat, i) => {
                    const Icon = stat.icon
                    return (
                      <div key={i} className="border-2 border-white/10 bg-white/5 p-6">
                        <Icon size={24} style={{ color: colors.blueLight }} />
                        <p className="mt-3 text-4xl font-bold tracking-tight text-white">
                          {stat.num}
                        </p>
                        <p className="mt-1 text-xs tracking-widest text-white/40 uppercase">
                          {stat.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="mt-16 h-px bg-white/10" />
            </div>
          </div>
        </section>

        {/* ═══ PARTNERS ═══ */}
        <section className={section.light}>
          <div className="max-w-landing mx-auto px-8 py-24">
            <p className={eyebrow.light}>05 — Aliados</p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.025em] text-[#353535] lg:text-5xl">
              Confían en nosotros
            </h2>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-12 opacity-60 grayscale">
              {PARTNERS.map((p, i) => (
                <div
                  key={i}
                  className="flex h-16 w-32 items-center justify-center border-2 border-zinc-200 bg-white text-sm font-bold tracking-widest text-zinc-400 uppercase"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FORMULARIO / CONTACTO ═══ */}
        <section className={section.dark}>
          <div className="max-w-landing relative mx-auto px-8 py-24">
            <div className={gridOverlay.base} style={gridOverlay.style} />
            <div className="relative mx-auto max-w-2xl text-center">
              <p className={eyebrow.dark}>06 — Contacto</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em] text-white lg:text-5xl">
                Lorem ipsum dolor
              </h2>
              <p className="mt-4 text-lg text-white/60">{LOREM_SHORT}</p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                <DSInput type="email" placeholder="tu@email.com" className="flex-1" />
                <DSButton variant="primary">Suscribirme</DSButton>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ENLACE A /DISENO ═══ */}
        <section className="border-b-2 border-zinc-200 bg-[#F0F8FF]">
          <div className="mx-auto flex items-center justify-center gap-4 px-8 py-6">
            <p className="text-xs text-zinc-500">Explora el catálogo completo de componentes en</p>
            <a
              href="/diseno"
              className="inline-flex items-center gap-1 border-2 border-[#023047] px-4 py-2 text-[10px] font-bold tracking-widest text-[#023047] uppercase transition-all hover:bg-[#023047] hover:text-white"
            >
              Sistema de Diseño <ChevronRight size={12} />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

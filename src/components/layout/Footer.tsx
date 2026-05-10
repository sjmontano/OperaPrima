'use client'

import { TimelineAnimation } from '@/components/ui/timeline-animation'
import { ArrowRight, Link2, Mail, PlayCircle } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'

// -- Configuración editable --
const FOOTER_CONFIG = {
  year: 2026,
  tagline: 'Acompañamos a los artistas emergentes colombianos en cada etapa de su carrera.',
  watermarkText: 'Ópera Prima',
  email: 'direccion@operaprimacultura.com',
}

const NAV_LINKS = [
  { label: 'Sobre ÓP', href: '/sobre-op' },
  { label: 'Mentorías', href: '/mentorias' },
  { label: 'Talleres y Eventos', href: '/eventos' },
  { label: 'Comunidad', href: '/comunidad' },
  { label: 'Tablero', href: '/tablero' },
  { label: 'Contacto', href: '/contacto' },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/operaprimacultura', icon: Link2 },
  { label: 'YouTube', href: 'https://youtube.com/@operaprimacultura', icon: PlayCircle },
  { label: 'Correo', href: `mailto:${FOOTER_CONFIG.email}`, icon: Mail },
]

// -- Componente --
export function Footer() {
  const [email, setEmail] = useState('')
  const footerRef = useRef<HTMLElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: conectar con Resend / lista de correos
    setEmail('')
  }

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden border-t-2 border-white/10 bg-[#0f0f0f]"
    >
      {/* Watermark "Ópera Prima" de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 left-0 flex items-end justify-center leading-none select-none"
        style={{
          fontSize: 'clamp(4rem, 18vw, 17rem)',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.04)',
          lineHeight: 0.85,
          letterSpacing: '-0.04em',
        }}
      >
        {FOOTER_CONFIG.watermarkText}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 mx-auto max-w-420 border-white/10 px-8 pt-20 pb-16 sm:border-x">
        {/* Grid 3 columnas */}
        <div className="mb-14 grid grid-cols-1 gap-16 md:grid-cols-3">
          {/* -- Brand -- */}
          <div className="space-y-4">
            <Image
              src="/OperaPrima_Imagotipo_Color.svg"
              alt="Opera Prima"
              width={160}
              height={48}
              unoptimized
              className="w-36"
            />
            <TimelineAnimation
              as="p"
              animationNum={0}
              timelineRef={footerRef}
              className="max-w-xs text-sm leading-relaxed text-white/60"
            >
              {FOOTER_CONFIG.tagline}
            </TimelineAnimation>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-white/40 transition-colors hover:text-[#F65B7F]"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* -- Navegación -- */}
          <div className="space-y-4">
            <TimelineAnimation
              as="h4"
              animationNum={1}
              timelineRef={footerRef}
              className="text-xs font-semibold tracking-wider text-white/90 uppercase"
            >
              Explorar
            </TimelineAnimation>
            <nav className="grid grid-cols-2 gap-2">
              <TimelineAnimation
                as="div"
                animationNum={2}
                timelineRef={footerRef}
                className="contents"
              >
                {NAV_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {label}
                  </a>
                ))}
              </TimelineAnimation>
            </nav>
          </div>

          {/* -- Newsletter -- */}
          <div className="space-y-4">
            <TimelineAnimation
              as="h4"
              animationNum={2}
              timelineRef={footerRef}
              className="text-xs font-semibold tracking-wider text-white/90 uppercase"
            >
              Mantente al día
            </TimelineAnimation>
            <TimelineAnimation
              as="p"
              animationNum={3}
              timelineRef={footerRef}
              className="text-sm text-white/60"
            >
              Recibe convocatorias, eventos y novedades directamente en tu correo.
            </TimelineAnimation>
            <TimelineAnimation as="div" animationNum={4} timelineRef={footerRef}>
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  className="w-full border-2 border-white/15 bg-white/8 px-3 py-2 pr-10 text-sm text-white transition-all duration-150 placeholder:text-white/40 hover:border-white/40 hover:shadow-[4px_4px_0_rgba(255,255,255,0.15)] focus:border-[#F65B7F] focus:shadow-[4px_4px_0_#F65B7F] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Suscríbete"
                  className="absolute top-1/2 right-1 flex size-7 -translate-y-1/2 items-center justify-center bg-[#F65B7F] text-white transition-colors hover:bg-[#d6405f]"
                >
                  <ArrowRight size={14} />
                </button>
              </form>
            </TimelineAnimation>
          </div>
        </div>

        {/* -- Bottom bar -- */}
        <TimelineAnimation
          as="div"
          animationNum={5}
          timelineRef={footerRef}
          className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row"
        >
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-xs text-white/40">© {FOOTER_CONFIG.year} Ópera Prima</span>
            <div className="flex items-center gap-4">
              {[
                { label: 'Privacidad', href: '/privacidad' },
                { label: 'Términos', href: '/terminos' },
                { label: 'Cookies', href: '/cookies' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-xs text-white/40 transition-colors hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <span className="text-xs text-white/40">Hecho con intención · Colombia</span>
        </TimelineAnimation>
      </div>
    </footer>
  )
}

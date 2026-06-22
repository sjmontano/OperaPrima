export const colors = {
  /* ── Primarios (brand-defining) ── */
  blueLight: '#8ECAE6', // acento sobre fondos oscuros, hero
  blueDark: '#023047', // acento sobre fondos claros, hover, focus
  punch: '#E63946', // CTA, botón primario, acción principal

  /* ── Neutros (fondos, texto, bordes) ── */
  white: '#FFFFFF', // fondo de página
  surface: '#FAFAF9', // fondo de tarjetas, secciones
  zinc200: '#E4E4E7', // bordes, separadores
  light: '#e0e1d9', // neutro claro
  dark: '#353535', // texto principal, hover oscuro
  nearBlack: '#111111', // sombras, hover intenso

  /* ── Secundarios (acentos de soporte) ── */
  blueTint: '#F0F8FF', // fondo azul muy claro
  blueMid: '#4682B4', // azul intermedio, categorías
  pink: '#FB6F92', // acento suave

  /* ── Funcionales (estados) ── */
  error: '#DC2626',
  success: '#16A34A',
}

export const font = {
  sans: 'Poppins',
  mono: 'Geist Mono',
}

export const layout = {
  maxWidth: 'max-w-landing',
  sectionPadding: 'px-8 py-24',
  contentPadding: 'clamp(1.5rem, 5vw, 6rem)',
  sectionGap: '96px',
}

export const btn = {
  base: 'inline-flex items-center justify-center gap-2 border-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
  primary: `inline-flex items-center justify-center gap-2 border-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-[#E63946] border-[#E63946] text-white shadow-[4px_4px_0_#353535] hover:bg-transparent hover:text-[#E63946] hover:shadow-[4px_4px_0_#353535] hover:-translate-x-0.5 hover:-translate-y-0.5`,
  secondary: `inline-flex items-center justify-center gap-2 border-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none border-[#353535] text-[#353535] hover:bg-[#353535] hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#353535]`,
  ghost: `inline-flex items-center justify-center gap-2 border-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none border-transparent text-[#353535] hover:bg-zinc-100`,
  link: `inline-flex items-center justify-center gap-2 border-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none border-transparent text-[#023047] underline-offset-4 hover:underline`,
  disabled: `inline-flex items-center justify-center gap-2 border-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-zinc-200 border-zinc-200 text-zinc-400 cursor-not-allowed`,
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-sm',
  brutalist: `inline-flex items-center justify-center gap-2 border-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-white border-[#353535] text-[#353535] shadow-[4px_4px_0_#353535] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0_#353535]`,
}

export const btnDark = {
  base: btn.base,
  primary: btn.primary,
  secondary: `inline-flex items-center justify-center gap-2 border-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none border-white/40 text-white/80 hover:bg-white hover:text-[#353535] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_rgba(255,255,255,0.25)]`,
  ghost: `inline-flex items-center justify-center gap-2 border-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none border-transparent text-white/60 hover:bg-white/10`,
  link: `inline-flex items-center justify-center gap-2 border-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none border-transparent text-[#8ECAE6] underline-offset-4 hover:underline`,
  disabled: `inline-flex items-center justify-center gap-2 border-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-white/5 border-white/10 text-white/30 cursor-not-allowed`,
  brutalist: `inline-flex items-center justify-center gap-2 border-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-white/5 border-white/20 text-white shadow-[4px_4px_0_rgba(255,255,255,0.2)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[5px_5px_0_rgba(255,255,255,0.3)]`,
}

export const card = {
  base: 'border-2 border-zinc-200 bg-white transition-all duration-200',
  hover: 'hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#023047]',
  dark: 'border-2 border-white/10 bg-white/5 transition-all duration-200',
  darkHover: 'hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#8ECAE6]',
  testimonial: 'testimonial-card',
  event:
    'group bg-white ring-2 ring-transparent transition-all duration-200 hover:shadow-[4px_4px_0_#023047] hover:ring-[#023047]',
  service:
    'group flex flex-col border-2 border-zinc-200 bg-white p-6 transition-all duration-200 hover:bg-zinc-50',
  serviceIcon:
    'flex h-12 w-12 items-center justify-center border-2 border-zinc-200 transition-all duration-200 group-hover:shadow-[3px_3px_0_#8ECAE6]',
}

export const shadow = {
  cardHover: 'shadow-[4px_4px_0_#111]',
  cardActive: 'shadow-[2px_2px_0_#111]',
  btnPrimary: 'shadow-[4px_4px_0_#353535]',
  btnHover: 'shadow-[5px_5px_0_#353535]',
  blueDark: 'shadow-[4px_4px_0_#023047]',
  blueLight: 'shadow-[6px_6px_0_#8ECAE6]',
  testimonialHover: 'shadow-[5px_5px_0_#E63946]',
  modal: 'shadow-[8px_8px_0_#111]',
  inputFocus: 'shadow-[3px_3px_0_#023047]',
  input: 'shadow-[3px_3px_0_rgba(0,0,0,0.06)]',
}

export const input = {
  base: 'w-full border-2 bg-white px-4 py-3 text-sm font-medium text-[#353535] outline-none transition-all placeholder:text-zinc-400',
  border: 'border-zinc-200',
  focus: 'focus:border-[#023047] focus:shadow-[3px_3px_0_#023047]',
  error: 'border-[#DC2626] shadow-[3px_3px_0_#DC2626]',
}

export const inputDark = {
  base: 'w-full border-2 bg-white/5 px-4 py-3 text-sm font-medium text-white outline-none transition-all placeholder:text-white/40',
  border: 'border-white/20',
  focus: 'focus:border-[#8ECAE6] focus:shadow-[3px_3px_0_#8ECAE6]',
  error: 'border-[#DC2626] shadow-[3px_3px_0_#DC2626]',
}

export const eyebrow = {
  light: 'text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase',
  dark: 'text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase',
}

export const section = {
  light: 'border-b-2 border-zinc-200',
  dark: 'bg-[#0f0f0f] border-b border-white/10',
  hero: 'bg-[#0f0f0f] border-b border-white/10',
}

export const gridOverlay = {
  base: 'pointer-events-none absolute inset-0 opacity-[0.04]',
  style: {
    backgroundImage:
      'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
    backgroundSize: '80px 80px',
  },
}

export const hover = {
  translateCard: 'hover:-translate-x-1 hover:-translate-y-1',
}

export const animation = {
  timeline: {
    hidden: { filter: 'blur(8px)', y: 10, opacity: 0 },
    visible: { filter: 'blur(0px)', y: 0, opacity: 1 },
  },
  stagger: 0.12,
  duration: 0.5,
  easing: [0.16, 1, 0.3, 1],
}

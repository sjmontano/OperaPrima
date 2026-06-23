import type { HTMLAttributes } from 'react'

type Variant = 'eyebrow-light' | 'eyebrow-dark' | 'category' | 'file' | 'pill'

interface Props extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
}

const variantMap: Record<Variant, string> = {
  'eyebrow-light': 'text-[0.62rem] font-bold tracking-[0.28em] text-[#023047] uppercase',
  'eyebrow-dark': 'text-[0.62rem] font-bold tracking-[0.28em] text-[#8ECAE6] uppercase',
  category: 'text-[0.62rem] font-bold tracking-[0.18em] uppercase',
  file: 'border-2 border-[#E63946] px-3 py-1 text-[0.625rem] font-bold tracking-[0.28em] text-[#E63946] uppercase',
  pill: 'border-2 border-[#353535] px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all hover:shadow-[3px_3px_0_#353535] hover:-translate-x-0.5 hover:-translate-y-0.5',
}

export function DSBadge({ variant = 'eyebrow-light', className, children, ...props }: Props) {
  return (
    <span className={`${variantMap[variant]} ${className || ''}`} {...props}>
      {children}
    </span>
  )
}

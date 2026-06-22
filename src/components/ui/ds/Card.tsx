import type { HTMLAttributes } from 'react'
import { card } from '@/lib/design-tokens'

type Variant = 'default' | 'dark' | 'testimonial' | 'event' | 'service'

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
}

const variantMap: Record<Variant, string> = {
  default: `${card.base} ${card.hover}`,
  dark: `${card.dark} ${card.darkHover}`,
  testimonial: card.testimonial,
  event: card.event,
  service: card.service,
}

export function DSCard({ variant = 'default', className, children, ...props }: Props) {
  return (
    <div className={`${variantMap[variant]} ${className || ''}`} {...props}>
      {children}
    </div>
  )
}

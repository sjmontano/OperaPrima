import { type ButtonHTMLAttributes } from 'react'
import { btn, btnDark } from '@/lib/design-tokens'

type Variant = 'primary' | 'secondary' | 'ghost' | 'link' | 'brutalist'
type Size = 'sm' | 'md' | 'lg'
type Context = 'light' | 'dark'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  context?: Context
}

const variantMap: Record<Context, Record<Variant, string>> = {
  light: {
    primary: btn.primary,
    secondary: btn.secondary,
    ghost: btn.ghost,
    link: btn.link,
    brutalist: btn.brutalist,
  },
  dark: {
    primary: btnDark.primary,
    secondary: btnDark.secondary,
    ghost: btnDark.ghost,
    link: btnDark.link,
    brutalist: btnDark.brutalist,
  },
}

const sizeMap: Record<Size, string> = {
  sm: btn.sm,
  md: btn.md,
  lg: btn.lg,
}

export function DSButton({
  variant = 'primary',
  size = 'md',
  context = 'light',
  disabled,
  className,
  children,
  ...props
}: Props) {
  const tokens = disabled ? btn : variantMap[context]
  const variantCls = disabled ? btn.disabled : tokens[variant]
  const cls = `${variantCls} ${sizeMap[size]} ${className || ''}`
  return (
    <button className={cls} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

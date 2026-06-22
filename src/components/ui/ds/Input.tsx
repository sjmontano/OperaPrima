import { forwardRef, type InputHTMLAttributes } from 'react'
import { input } from '@/lib/design-tokens'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

export const DSInput = forwardRef<HTMLInputElement, Props>(
  ({ hasError, className, ...props }, ref) => {
    const cls = `${input.base} ${input.border} ${input.focus} ${hasError ? input.error : ''} ${className || ''}`
    return <input ref={ref} className={cls} {...props} />
  }
)
DSInput.displayName = 'DSInput'

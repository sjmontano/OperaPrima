import type { ReactNode } from 'react'

export function ContentFrame({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`mx-[100px] border-x-2 border-zinc-200 max-lg:mx-[48px] max-md:mx-[18px] ${className}`}
    >
      {children}
    </div>
  )
}

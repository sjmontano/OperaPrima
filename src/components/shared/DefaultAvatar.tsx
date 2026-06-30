'use client'

import Image from 'next/image'
import type { AvatarConfig } from './AvatarCustomizer'

interface DefaultAvatarProps {
  seed: string
  style?: AvatarConfig['style']
  options?: Record<string, string>
  size?: number
  className?: string
}

export function buildAvatarUrl(
  seed: string,
  style: AvatarConfig['style'] = 'lorelei',
  options: Record<string, string> = {}
): string {
  const params = new URLSearchParams({ seed, ...options })
  return `https://api.dicebear.com/10.x/${style}/svg?${params.toString()}`
}

export function generateBannerUrl(seed: string) {
  return `https://api.dicebear.com/10.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=8ECAE6,023047,4682B4&backgroundType=gradientLinear&size=800&shapeColor=f0f8ff`
}

export function DefaultAvatar({
  seed,
  style = 'lorelei',
  options = {},
  size = 112,
  className = '',
}: DefaultAvatarProps) {
  const url = buildAvatarUrl(seed, style, options)
  return (
    <Image src={url} alt="Avatar" width={size} height={size} className={className} unoptimized />
  )
}

'use client'

import dynamic from 'next/dynamic'

const Player = dynamic(() => import('lottie-react').then((m) => ({ default: m.default })), {
  ssr: false,
})

interface LottieAnimationProps {
  src: object
  className?: string
  loop?: boolean
  autoplay?: boolean
  size?: number
}

export function LottieAnimation({
  src,
  className = '',
  loop = true,
  autoplay = true,
  size = 200,
}: LottieAnimationProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Player animationData={src} loop={loop} autoplay={autoplay} />
    </div>
  )
}

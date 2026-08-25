'use client'

import { useEffect, useRef } from 'react'
import { consentFor } from '@/components/cookies/cookieConsent'

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
  style?: React.CSSProperties
}

export function AdUnit({ slot, format = 'auto', className, style }: AdUnitProps) {
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true

    const personalized = consentFor('marketing')
    ;(window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = personalized
      ? 0
      : 1

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // silent
    }
  }, [])

  const sizeStyles: React.CSSProperties = {
    display: 'block',
    ...(format === 'rectangle' ? { width: '300px', height: '250px' } : {}),
    ...(format === 'horizontal' ? { width: '728px', height: '90px' } : {}),
    ...(format === 'vertical' ? { width: '160px', height: '600px' } : {}),
    ...style,
  }

  return (
    <div className={`flex justify-center ${className ?? ''}`}>
      <ins
        className="adsbygoogle"
        style={sizeStyles}
        data-ad-client="ca-pub-6819564886386658"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

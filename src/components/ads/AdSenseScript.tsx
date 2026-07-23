'use client'

import { useEffect } from 'react'
import { consentFor } from '@/components/cookies/cookieConsent'

const AD_CLIENT = 'ca-pub-6819564886386658'

export function AdSenseScript() {
  useEffect(() => {
    const personalized = consentFor('marketing')
    ;(window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = personalized
      ? '0'
      : '1'
  }, [])

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
      crossOrigin="anonymous"
    />
  )
}

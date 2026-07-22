'use client'

import Script from 'next/script'
import { consentFor } from '@/components/cookies/cookieConsent'

const AD_CLIENT = 'ca-pub-6819564886386658'

export function AdSenseScript() {
  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
      onReady={() => {
        const personalized = consentFor('marketing')
        ;(window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = personalized
          ? '0'
          : '1'
      }}
    />
  )
}

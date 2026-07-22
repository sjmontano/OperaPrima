'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { consentFor } from '@/components/cookies/cookieConsent'

const AD_CLIENT = 'ca-pub-6819564886386658'

function updateNpa() {
  if (typeof window === 'undefined' || !window.adsbygoogle) return
  const personalized = consentFor('marketing')
  ;(window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = personalized
    ? '0'
    : '1'
}

export function AdSenseScript() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    updateNpa()

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'op-cookies-accepted') updateNpa()
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  )
}

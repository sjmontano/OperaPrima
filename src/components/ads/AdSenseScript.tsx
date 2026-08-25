'use client'

import Script from 'next/script'

const AD_CLIENT = 'ca-pub-6819564886386658'

export function AdSenseScript() {
  return (
    <Script
      id="adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
      strategy="afterInteractive"
    />
  )
}

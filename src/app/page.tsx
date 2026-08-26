import { AdUnit } from '@/components/ads/AdUnit'
import { FloatingEditButton } from '@/components/editor/FloatingEditButton'
import { DbPageServer } from '@/components/shared/DbPageServer'
import { EventsSection } from '@/components/events/EventsSection'
import { AdBar } from '@/components/layout/AdBar'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ComunidadCTA } from '@/components/shared/ComunidadCTA'
import { HeroCarousel } from '@/components/shared/HeroCarousel'
import { PartnersStrip } from '@/components/shared/PartnersStrip'
import { TestimonialsWall } from '@/components/shared/TestimonialsWall'
import { WhatIsSection } from '@/components/shared/WhatIsSection'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <>
      <AdBar />
      <Navbar accentColor="#F65B7F" />
      <main className="relative flex flex-col">
        <DbPageServer
          slug="inicio"
          fallback={
            <>
              <HeroCarousel />
              <WhatIsSection />
              <EventsSection />
              <AdUnit slot="home-events-cta" format="horizontal" />
              <ComunidadCTA />
              <TestimonialsWall />
              <PartnersStrip />
              <AdUnit slot="home-before-footer" format="horizontal" />
            </>
          }
        />
        <AdUnit slot="home-post-db" format="horizontal" />
        <FloatingEditButton />
      </main>
      <Footer />
      <AdUnit slot="home-hero-whatis" format="horizontal" />
    </>
  )
}

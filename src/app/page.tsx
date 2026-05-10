import { EventsSection } from '@/components/events/EventsSection'
import { AdBar } from '@/components/layout/AdBar'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ComunidadCTA } from '@/components/shared/ComunidadCTA'
import { HeroCarousel } from '@/components/shared/HeroCarousel'
import { PartnersStrip } from '@/components/shared/PartnersStrip'
import { TestimonialsWall } from '@/components/shared/TestimonialsWall'
import { WhatIsSection } from '@/components/shared/WhatIsSection'

export default function Home() {
  return (
    <>
      {/* -- Ad bar -- */}
      <AdBar />
      <Navbar />
      <main className="flex flex-col">
        {/* -- Hero -- */}
        <HeroCarousel />

        {/* -- ¿Qué es Opera Prima? + Servicios -- */}
        <WhatIsSection />

        {/* -- Talleres y Eventos -- */}
        <EventsSection />

        {/* -- CTA Comunidad -- */}
        <ComunidadCTA />

        {/* -- Testimonios -- */}
        <TestimonialsWall />

        {/* -- Aliados -- */}
        <PartnersStrip />

        {/* -- Footer -- */}
        <Footer />
      </main>
    </>
  )
}

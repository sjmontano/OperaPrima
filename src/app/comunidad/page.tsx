import { ComunidadArtistsSection } from '@/components/comunidad/ComunidadArtistsSection'
import { ComunidadEventsSection } from '@/components/comunidad/ComunidadEventsSection'
import { ComunidadLandingSection } from '@/components/comunidad/ComunidadLandingSection'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comunidad | Opera Prima',
  description:
    'Únete a la comunidad de artistas emergentes. Eventos, calendario, artistas destacados y más.',
}

export default function ComunidadPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col bg-[#F0F8FF]">
        <ComunidadLandingSection />
        <ComunidadEventsSection />
        <ComunidadArtistsSection />
      </main>
      <Footer />
    </>
  )
}

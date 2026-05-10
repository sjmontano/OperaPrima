import { EventsLandingSection } from '@/components/events/EventsLandingSection'
import { EventsSection } from '@/components/events/EventsSection'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Talleres y eventos | Opera Prima',
  description: 'Talleres prácticos y eventos de networking para artistas emergentes colombianos.',
}

export default function EventosPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col bg-[#FAFAF9]">
        <EventsLandingSection />

        <div id="proximos">
          <EventsSection />
        </div>
      </main>
      <Footer />
    </>
  )
}

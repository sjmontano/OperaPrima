import { DbPageServer } from '@/components/shared/DbPageServer'
import { ComunidadEventsSection } from '@/components/comunidad/ComunidadEventsSection'
import { EventsLandingSection } from '@/components/events/EventsLandingSection'
import { MentorEventsSection } from '@/components/events/MentorEventsSection'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Talleres y eventos | Opera Prima',
  description: 'Talleres prácticos y eventos de networking para artistas emergentes.',
}

export default function EventosPage() {
  return (
    <DbPageServer
      slug="eventos"
      fallback={
        <>
          <Navbar />
          <main className="flex flex-col bg-[#F0F8FF]">
            <EventsLandingSection />
            <div id="proximos">
              <MentorEventsSection />
            </div>
          </main>
          <Footer />
        </>
      }
    />
  )
}

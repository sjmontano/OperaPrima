import { AdUnit } from '@/components/ads/AdUnit'
import { FloatingEditButton } from '@/components/editor/FloatingEditButton'
import { DbPageServer } from '@/components/shared/DbPageServer'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { MentoriasLandingSection } from '@/components/mentorias/MentoriasLandingSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentorías | Opera Prima',
  description:
    'Mentorías 1:1 para artistas emergentes: portafolio, becas, proyectos culturales y ruta profesional.',
}

export const dynamic = 'force-dynamic'

export default function MentoriasPage() {
  return (
    <>
      <Navbar />
      <main className="relative flex flex-col" style={{ background: '#FFFFFF' }}>
        <DbPageServer
          slug="mentorias"
          fallback={
            <>
              <MentoriasLandingSection />
              <AdUnit slot="1390814692" format="auto" />
            </>
          }
        />
        <AdUnit slot="1390814692" format="auto" />
        <FloatingEditButton />
      </main>
      <Footer />
    </>
  )
}

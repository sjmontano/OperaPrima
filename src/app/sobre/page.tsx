import { FloatingEditButton } from '@/components/editor/FloatingEditButton'
import { DbPageServer } from '@/components/shared/DbPageServer'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { PartnersStrip } from '@/components/shared/PartnersStrip'
import { SobreLandingSection } from '@/components/sobre/SobreLandingSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Ópera Prima',
  description:
    'Conoce la plataforma que acompaña a artistas emergentes con mentorías, eventos y comunidad.',
}

export const dynamic = 'force-dynamic'

export default function SobrePage() {
  return (
    <>
      <Navbar />
      <main className="relative flex flex-col" style={{ background: '#FFFFFF' }}>
        <DbPageServer
          slug="sobre"
          fallback={
            <>
              <SobreLandingSection />
              <PartnersStrip />
            </>
          }
        />
        <FloatingEditButton />
      </main>
      <Footer />
    </>
  )
}

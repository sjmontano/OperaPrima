import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { PartnersStrip } from '@/components/shared/PartnersStrip'
import { SobreLandingSection } from '@/components/sobre/SobreLandingSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Ópera Prima',
  description:
    'Conoce la plataforma que acompaña a artistas emergentes colombianos con mentorías, eventos y comunidad.',
}

export default function SobrePage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col bg-[#FAFAF9]">
        <SobreLandingSection />
        <PartnersStrip />
      </main>
      <Footer />
    </>
  )
}

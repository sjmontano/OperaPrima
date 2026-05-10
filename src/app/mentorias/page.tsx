import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { MentoriasLandingSection } from '@/components/mentorias/MentoriasLandingSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentorías | Opera Prima',
  description:
    'Mentorías 1:1 para artistas emergentes: portafolio, becas, proyectos culturales y ruta profesional.',
}

export default function MentoriasPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col bg-[#FAFAF9]">
        <MentoriasLandingSection />
      </main>
      <Footer />
    </>
  )
}

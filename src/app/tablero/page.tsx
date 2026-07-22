import { AdUnit } from '@/components/ads/AdUnit'
import { FloatingEditButton } from '@/components/editor/FloatingEditButton'
import { DbPageServer } from '@/components/shared/DbPageServer'
import { DisclaimerSection } from '@/components/proyectos/DisclaimerSection'
import { ProyectosDestacados } from '@/components/proyectos/ProyectosDestacados'
import { ProyectosLandingSection } from '@/components/proyectos/ProyectosLandingSection'
import { ProyectosSection } from '@/components/proyectos/ProyectosSection'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tablero de Oportunidades | Opera Prima',
  description:
    'Explora proyectos, convocatorias y oportunidades para artistas emergentes. Publica tu proyecto gratuitamente.',
}

export const dynamic = 'force-dynamic'

export default function ProyectosPage() {
  return (
    <>
      <Navbar />
      <main className="relative flex flex-col" style={{ background: '#FFFFFF' }}>
        <DbPageServer
          slug="tablero"
          fallback={
            <>
              <ProyectosLandingSection />
              <AdUnit slot="tablero-landing-proyectos" format="horizontal" />
              <ProyectosSection />
              <AdUnit slot="tablero-proyectos-destacados" format="horizontal" />
              <ProyectosDestacados />
              <DisclaimerSection />
              <AdUnit slot="tablero-before-footer" format="horizontal" />
            </>
          }
        />
        <AdUnit slot="tablero-post-db" format="horizontal" />
        <FloatingEditButton />
      </main>
      <Footer />
    </>
  )
}

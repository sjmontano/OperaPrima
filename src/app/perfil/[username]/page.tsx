import { AdUnit } from '@/components/ads/AdUnit'
import { ContentFrame } from '@/components/layout/ContentFrame'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { AdBar } from '@/components/layout/AdBar'
import { Gallery } from '@/components/gallery/Gallery'
import { ProfileTestimonials } from '@/components/profile/ProfileTestimonials'
import { CommunityMembersSection } from '@/components/comunidad/CommunityMembersSection'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ username: string }>
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params

  const usuario = await prisma.usuario.findUnique({
    where: { username },
    include: {
      perfil: {
        include: { redes: true },
      },
    },
  })

  if (!usuario) notFound()

  const { perfil } = usuario

  return (
    <>
      <AdBar />
      <Navbar />
      <main
        style={{
          minHeight: '100vh',
          background: '#FFFFFF',
          fontFamily: 'var(--font-poppins)',
        }}
      >
        <ContentFrame>
          <ProfileHeader
            artisticName={perfil?.artisticName || `${usuario.firstName} ${usuario.lastName}`}
            realName={perfil?.realName}
            username={usuario.username}
            handle={perfil?.artisticName ?? undefined}
            avatar={perfil?.avatar ?? null}
            banner={perfil?.banner ?? null}
            isOwner={false}
          />

          <div className="mx-auto px-6 pb-2" style={{ maxWidth: '1024px' }}>
            {/* Bio */}
            {perfil?.bio && (
              <section className="mb-8">
                <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.40 0.008 350)' }}>
                  {perfil.bio}
                </p>
              </section>
            )}

            {/* Tags */}
            {perfil && perfil.tags.length > 0 && (
              <section className="mb-8">
                <p
                  className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
                  style={{ color: 'oklch(0.40 0.008 350)' }}
                >
                  Disciplinas
                </p>
                <div className="flex flex-wrap gap-2">
                  {perfil.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="border-2 px-3 py-1 text-xs font-bold uppercase"
                      style={{ borderColor: '#8ECAE6', color: '#023047' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Interests */}
            {perfil && perfil.interests.length > 0 && (
              <section className="mb-8">
                <p
                  className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
                  style={{ color: 'oklch(0.40 0.008 350)' }}
                >
                  Intereses
                </p>
                <div className="flex flex-wrap gap-2">
                  {perfil.interests.map((interest: string) => (
                    <span
                      key={interest}
                      className="px-3 py-1 text-xs"
                      style={{ backgroundColor: '#F0F8FF', color: '#4682B4' }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Social Links */}
            {perfil && perfil.redes.length > 0 && (
              <section className="mb-8">
                <p
                  className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
                  style={{ color: 'oklch(0.40 0.008 350)' }}
                >
                  Redes sociales
                </p>
                <div className="flex flex-wrap gap-3">
                  {perfil.redes.map(
                    (social: { id: string; label: string; handle: string; href: string }) => (
                      <a
                        key={social.id}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 border-2 px-3.5 py-2 text-xs font-bold uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#023047] hover:shadow-[3px_3px_0_#353535]"
                        style={{ borderColor: '#E4E4E7', color: '#353535' }}
                      >
                        <span style={{ color: '#8ECAE6' }}>{social.label}</span>
                        <span>/</span>
                        <span>{social.handle}</span>
                      </a>
                    )
                  )}
                </div>
              </section>
            )}

            <AdUnit slot="publicperfil-gallery-testimonials" format="horizontal" />
            <Gallery userId={usuario.id} />

            <ProfileTestimonials
              username={usuario.username}
              artisticName={perfil?.artisticName || `${usuario.firstName} ${usuario.lastName}`}
            />

            <CommunityMembersSection />
          </div>
        </ContentFrame>
      </main>
      <Footer />
    </>
  )
}

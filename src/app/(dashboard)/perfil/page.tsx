import { Footer } from '@/components/layout/Footer'
import { GalleryMasonry, type GalleryItem } from '@/components/profile/GalleryMasonry'
import { MemberGrid, type Member } from '@/components/profile/MemberGrid'
import { ProfileHero } from '@/components/profile/ProfileHero'

// ── Mock data ──────────────────────────────────────────────────────────────────

const USER = {
  artisticName: 'Valentina Cruz',
  realName: 'María Valentina Cruz Morales',
  username: 'valentinacruze',
  bio: 'Bailarina y coreógrafa contemporánea nacida en Cali, Colombia. Fusiono técnicas de danza clásica con expresión corporal urbana para crear piezas que dialogan con la identidad latinoamericana y la memoria del cuerpo. He colaborado con compañías en Colombia, México y Argentina.',
  tags: ['Danza', 'Calí', 'Contemporánea', 'Coreografía', 'Performance'],
  interests: [
    'Danza Contemporánea',
    'Performance Art',
    'Instalación',
    'Circo Social',
    'Video Danza',
  ],
  avatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop&q=80',
  socials: [
    { label: 'Instagram', handle: '@valentinacruze', href: '#' },
    { label: 'TikTok', handle: '@valentinacruze', href: '#' },
    { label: 'Web', handle: 'valentinacruz.co', href: '#' },
  ],
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=70',
    title: 'Fragmentos del silencio',
    date: 'Mar 2025',
  },
  {
    src: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&auto=format&fit=crop&q=70',
    title: 'Cuerpo y territorio',
    date: 'Ene 2025',
  },
  {
    src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=70',
    title: 'Ensayo abierto #3',
    date: 'Oct 2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&auto=format&fit=crop&q=70',
    title: 'Residencia Bogotá',
    date: 'Sep 2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=600&auto=format&fit=crop&q=70',
    title: 'La piel que habito',
    date: 'Ago 2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=70',
    title: 'Duelo coreográfico',
    date: 'Jul 2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1545959570-a94084071b5d?w=600&auto=format&fit=crop&q=70',
    title: 'Festival Iberoamericano',
    date: 'Jun 2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1614859324967-bdf413c35703?w=600&auto=format&fit=crop&q=70',
    title: 'Improvisación en sitio',
    date: 'May 2024',
  },
  {
    src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&auto=format&fit=crop&q=70',
    title: 'Arquitecturas del cuerpo',
    date: 'Mar 2024',
  },
]

const COMMUNITY_MEMBERS: Member[] = [
  {
    name: 'Andrés Ospina',
    discipline: 'Música',
    location: 'Medellín',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Laura Jiménez',
    discipline: 'Artes Visuales',
    location: 'Bogotá',
    image:
      'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Camila Torres',
    discipline: 'Danza',
    location: 'Cali',
    image:
      'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Sebastián Ríos',
    discipline: 'Teatro',
    location: 'Cartagena',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Mariana López',
    discipline: 'Performance',
    location: 'Bogotá',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Felipe Mora',
    discipline: 'Circo',
    location: 'Medellín',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Isabella García',
    discipline: 'Música',
    location: 'Cali',
    image:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=400&auto=format&fit=crop&q=70',
  },
  {
    name: 'Daniel Castro',
    discipline: 'Artes Visuales',
    location: 'Barranquilla',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&auto=format&fit=crop&q=70',
  },
]

const DISCIPLINES = ['Música', 'Artes Visuales', 'Danza', 'Teatro', 'Performance', 'Circo']

// ── Interest badge color rotation ─────────────────────────────────────────────
const INTEREST_COLORS = [
  { bg: 'oklch(0.30 0.07 165)', text: '#FAFAF9' }, // verde selva
  { bg: 'oklch(0.40 0.14 295)', text: '#FAFAF9' }, // lavanda
  { bg: 'oklch(0.92 0.008 350)', text: '#111111' }, // surface tinted
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PerfilPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'oklch(0.98 0.005 350)',
        fontFamily: 'var(--font-poppins)',
      }}
    >
      {/* ── HERO ── */}
      <ProfileHero user={USER} />

      {/* ── BIO + TAGS ── */}
      <section
        className="mx-auto px-6 py-10"
        style={{
          maxWidth: '1024px',
          borderBottom: '1px solid oklch(0.88 0.010 350)',
        }}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-16">
          {/* Bio (2/3) */}
          <div className="lg:col-span-2">
            <p
              className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
              style={{ color: 'oklch(0.40 0.008 350)' }}
            >
              Sobre @{USER.username}
            </p>
            <p
              style={{
                color: 'oklch(0.28 0.008 350)',
                lineHeight: 1.7,
                fontSize: '0.9375rem',
                maxWidth: '58ch',
              }}
            >
              {USER.bio}
            </p>

            {/* Interests */}
            <div className="mt-8">
              <p
                className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
                style={{ color: 'oklch(0.40 0.008 350)' }}
              >
                Intereses creativos
              </p>
              <div className="flex flex-wrap gap-2">
                {USER.interests.map((interest, idx) => {
                  const c = INTEREST_COLORS[idx % INTEREST_COLORS.length]
                  return (
                    <span
                      key={interest}
                      className="border-2 border-[#111111] px-3 py-1 text-xs font-bold"
                      style={{ background: c.bg, color: c.text }}
                    >
                      {interest}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Tags (1/3) */}
          <div>
            <p
              className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
              style={{ color: 'oklch(0.40 0.008 350)' }}
            >
              Tags
            </p>
            <ul className="space-y-1.5">
              {USER.tags.map((tag) => (
                <li key={tag}>
                  <a
                    href="#"
                    className="text-base font-semibold transition-colors hover:text-[#c8405f] hover:underline"
                    style={{ color: '#F65B7F' }}
                  >
                    #{tag}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── GALERÍA ── */}
      <section style={{ borderBottom: '1px solid oklch(0.88 0.010 350)', paddingBottom: '2.5rem' }}>
        <div className="mx-auto px-6 pt-10 pb-6" style={{ maxWidth: '1024px' }}>
          <div className="mb-6 flex items-baseline gap-3">
            <h2 className="text-lg font-bold tracking-wide uppercase" style={{ color: '#111111' }}>
              Galería
            </h2>
            <span className="text-sm" style={{ color: 'oklch(0.52 0.010 350)' }}>
              {GALLERY_ITEMS.length} obras
            </span>
          </div>
        </div>
        <div className="mx-auto px-6" style={{ maxWidth: '1024px' }}>
          <GalleryMasonry items={GALLERY_ITEMS} showUpload />
        </div>
      </section>

      {/* ── SÍGUEME ── */}
      <section
        className="mx-auto px-6 py-10"
        style={{
          maxWidth: '1024px',
          borderBottom: '1px solid oklch(0.88 0.010 350)',
        }}
      >
        <p
          className="mb-6 text-xs font-bold tracking-[0.18em] uppercase"
          style={{ color: 'oklch(0.40 0.008 350)' }}
        >
          Sígueme
        </p>
        <div className="flex flex-wrap gap-6">
          {USER.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="group flex items-baseline gap-2 border-b-2 border-[#111111] pb-0.5 transition-colors duration-150 hover:border-[#F65B7F]"
            >
              <span
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: 'oklch(0.52 0.010 350)' }}
              >
                {s.label}
              </span>
              <span
                className="text-base font-bold transition-colors duration-150 group-hover:text-[#F65B7F]"
                style={{ color: '#111111' }}
              >
                {s.handle}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── DESCUBRE MIEMBROS ── */}
      <section
        className="mx-auto px-6 py-10"
        style={{
          maxWidth: '1024px',
          borderBottom: '1px solid oklch(0.88 0.010 350)',
        }}
      >
        <div className="mb-6">
          <h2
            className="mb-1 text-lg font-bold tracking-wide uppercase"
            style={{ color: '#111111' }}
          >
            Descubre a otros miembros
          </h2>
          <p className="text-sm" style={{ color: 'oklch(0.52 0.010 350)' }}>
            Artistas de tu comunidad — filtra por disciplina
          </p>
        </div>
        <MemberGrid members={COMMUNITY_MEMBERS} disciplines={DISCIPLINES} />
      </section>

      <Footer />
    </main>
  )
}

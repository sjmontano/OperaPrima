import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const HERO_SLIDES = [
  {
    id: 1,
    headline: 'El arte emergente\nnecesita tu voz.',
    subtext:
      'Conecta con mentores que ya recorrieron el camino. Aprende, crece y haz que tu obra llegue más lejos.',
    cta: { label: 'Explorar mentores', href: '/mentorias' },
    secondaryCta: { label: 'Conocer más', href: '/sobre' },
    bg: 'from-[#1a1a1a] to-[#2d1a14]',
    accent: '#8ECAE6',
    tag: 'Mentorías 1:1',
  },
  {
    id: 2,
    headline: 'Comunidad que\nimpulsa tu obra.',
    subtext:
      'Talleres, eventos y networking con otros artistas emergentes. Tu próximo colaborador está aquí.',
    cta: { label: 'Ver eventos', href: '/eventos' },
    secondaryCta: { label: 'Unirte gratis', href: '/registro' },
    bg: 'from-[#0d2b24] to-[#023047]',
    accent: '#8ECAE6',
    tag: 'Talleres y Eventos',
  },
  {
    id: 3,
    headline: 'Oportunidades\nreales, ahora.',
    subtext:
      'Convocatorias, residencias y proyectos que buscan artistas como tú. El tablero que faltaba.',
    cta: { label: 'Ver tablero', href: '/tablero' },
    secondaryCta: { label: 'Registrarse', href: '/registro' },
    bg: 'from-[#1e1228] to-[#4682B4]',
    accent: '#8ECAE6',
    tag: 'Tablero de Oportunidades',
  },
  {
    id: 4,
    headline: 'Tu próximo paso\nempieza aquí.',
    subtext: 'Plataforma para artistas emergentes. Acceso a contenido exclusivo, mentores y más.',
    cta: { label: 'Comenzar ahora', href: '/registro' },
    secondaryCta: { label: 'Iniciar sesión', href: '/login' },
    bg: 'from-[#353535] to-[#1c1c1c]',
    accent: '#8ECAE6',
    tag: 'Ópera Prima',
  },
]

const WHAT_IS_CARDS = [
  {
    num: '01',
    icon: 'Users',
    title: 'Mentorías 1:1',
    desc: 'Sesiones personalizadas con artistas y gestores culturales que ya han recorrido el camino. Aprende directo de quien lo vive.',
    accent: '#8ECAE6',
    href: '/mentorias',
  },
  {
    num: '02',
    icon: 'CalendarDays',
    title: 'Talleres y Eventos',
    desc: 'Workshops prácticos, encuentros de networking y residencias. Presenciales y online, pensados para impulsar tu carrera.',
    accent: '#023047',
    href: '/eventos',
  },
  {
    num: '03',
    icon: 'Compass',
    title: 'Tablero de Oportunidades',
    desc: 'Convocatorias, becas y proyectos que buscan artistas como tú. Actualizado constantemente por nuestro equipo editorial.',
    accent: '#4682B4',
    href: '/tablero',
  },
  {
    num: '04',
    icon: 'Layers',
    title: 'Membresía Premium',
    desc: 'Acceso completo a contenido exclusivo, tarifas preferenciales en eventos y visibilidad dentro de la comunidad.',
    accent: '#8ECAE6',
    href: '/membresia',
  },
]

const TESTIMONIALS = [
  {
    name: 'Camila Rojas',
    handle: '@camilarte',
    text: 'En Opera Prima encontré un espacio donde mi trabajo tiene visibilidad y comunidad. Las mentorías y eventos me han ayudado a conectar con nuevos públicos.',
    avatar: 'https://i.pravatar.cc/150?u=camila',
  },
  {
    name: 'Mateo Vargas',
    handle: '@mateovibes',
    text: 'La plataforma me permitió mostrar mis proyectos emergentes en un contexto profesional. Ahora participo en más convocatorias gracias al respaldo de la comunidad.',
    avatar: 'https://i.pravatar.cc/150?u=mateo',
  },
  {
    name: 'Mariana Cruz',
    handle: '@mariana.crea',
    text: 'Me gusta cómo Opera Prima pone el talento emergente al frente. Los eventos y talleres son justo lo que necesitaba para avanzar con confianza.',
    avatar: 'https://i.pravatar.cc/150?u=mariana',
  },
  {
    name: 'Santiago Pérez',
    handle: '@santiagop',
    text: 'La experiencia de colaborar con otros artistas aquí ha sido real. Me ayudó a expandir mi red y presentar mi trabajo a aliados clave.',
    avatar: 'https://i.pravatar.cc/150?u=santiago',
  },
]

const PARTNERS = [
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
  { name: 'Opera Prima', src: '/OperaPrima_Imagotipo.svg' },
]

const CTA_STATS = [
  { icon: 'Users', end: 2400, thousands: true, suffix: '+', label: 'artistas activos' },
  { icon: 'Palette', end: 120, thousands: false, suffix: '+', label: 'eventos al año' },
  { icon: 'Mic', end: 85, thousands: false, suffix: '+', label: 'mentores expertos' },
]

const SEED_PAGES = [
  {
    slug: 'inicio',
    title: 'Inicio',
    blocks: [
      { type: 'hero-carousel', props: { slides: HERO_SLIDES } },
      {
        type: 'what-is',
        props: {
          eyebrow: '¿Qué es Opera Prima?',
          heading: 'Bienvenido a Ópera Prima',
          description:
            'Una plataforma digital que acompaña a artistas emergentes con herramientas reales para dar sus primeros pasos profesionales.',
          description2:
            'Aquí encuentras herramientas, oportunidades y una comunidad que te ayuda a construir tu camino profesional con estrategia, no con suerte.',
          serviceEyebrow: 'Nuestros servicios',
          serviceHeading: 'Todo lo que necesitas para crecer',
          cards: WHAT_IS_CARDS,
        },
      },
      { type: 'events-opera-prima', props: {} },
      {
        type: 'comunidad-cta',
        props: {
          eyebrow: 'Únete a la comunidad',
          headline: 'Tu obra merece\nmás público,\nmás oportunidades.',
          description:
            'Opera Prima conecta artistas emergentes con mentores, talleres, convocatorias y una comunidad que entiende lo que significa construir una carrera artística desde cero.',
          stats: CTA_STATS,
          primaryCta: { label: 'Comenzar gratis', href: '/registro' },
          secondaryCta: { label: 'Conocer más', href: '/sobre' },
        },
      },
      {
        type: 'testimonials',
        props: {
          headline: 'Esto dicen los artistas de nuestra comunidad',
          testimonialEyebrow: 'Comunidad Opera Prima',
          testimonials: TESTIMONIALS,
        },
      },
      {
        type: 'partners',
        props: {
          eyebrow: 'Aliados y Red',
          heading: 'Nuestros aliados',
          description:
            'instituciones, proyectos y profesionales que creen en el talento emergente.',
          partners: PARTNERS,
          ctaText: '¿Quieres colaborar con nosotros?',
          ctaEmail: 'direccion@operaprimacultura.com',
        },
      },
    ],
  },
  {
    slug: 'comunidad',
    title: 'Comunidad',
    blocks: [
      { type: 'comunidad-landing', props: {} },
      { type: 'events-comunidad', props: {} },
      { type: 'community-artists', props: {} },
    ],
  },
  {
    slug: 'eventos',
    title: 'Eventos',
    blocks: [
      { type: 'events-landing', props: {} },
      { type: 'events-mentor', props: {} },
      { type: 'events-comunidad', props: {} },
    ],
  },
  {
    slug: 'mentorias',
    title: 'Mentorías',
    blocks: [{ type: 'mentorias-landing', props: {} }],
  },
  {
    slug: 'tablero',
    title: 'Tablero',
    blocks: [
      { type: 'proyectos-landing', props: {} },
      { type: 'proyectos-section', props: {} },
      { type: 'proyectos-destacados', props: {} },
      { type: 'disclaimer', props: {} },
    ],
  },
  {
    slug: 'sobre',
    title: 'Sobre',
    blocks: [
      { type: 'sobre-landing', props: {} },
      {
        type: 'partners',
        props: { partners: PARTNERS, ctaEmail: 'direccion@operaprimacultura.com' },
      },
    ],
  },
]

async function main() {
  // Promover admin
  const email = process.env.ADMIN_EMAIL
  if (email) {
    const user = await prisma.usuario.findUnique({ where: { email } })
    if (user) {
      await prisma.usuario.update({ where: { email }, data: { rol: 'ADMIN' } })
      console.log(`Usuario ${email} promovido a ADMIN`)
    } else {
      console.log(`No se encontró usuario con email: ${email}`)
    }
  }

  // Sembrar/actualizar páginas
  for (const page of SEED_PAGES) {
    const existing = await prisma.pageContent.findUnique({ where: { slug: page.slug } })
    if (existing) {
      await prisma.pageContent.update({
        where: { slug: page.slug },
        data: {
          title: page.title,
          blocks: page.blocks,
          published: true,
        },
      })
      console.log(`Página "${page.title}" (/${page.slug}) actualizada`)
    } else {
      await prisma.pageContent.create({
        data: {
          slug: page.slug,
          title: page.title,
          blocks: page.blocks,
          published: true,
        },
      })
      console.log(`Página "${page.title}" (/${page.slug}) creada`)
    }
  }

  console.log('Seed completado')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

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
    href: '/comunidad',
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

interface SeedUser {
  username: string
  email: string
  firstName: string
  lastName: string
  password: string
  rol?: string
  perfil: {
    artisticName: string
    realName: string
    bio: string
    avatar: string
    tags: string[]
    interests: string[]
  }
  location: string
}

const COLOMBIAN_USERS: SeedUser[] = [
  {
    username: 'valentina.artes',
    email: 'valentina@email.com',
    firstName: 'Valentina',
    lastName: 'Arango',
    password: 'Opera123.*',
    perfil: {
      artisticName: 'Valentina Arango',
      realName: 'Valentina Arango Moreno',
      bio: 'Artista visual contemporánea explorando la memoria del paisaje colombiano a través de la acuarela y el grabado.',
      avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=valentina',
      tags: ['acuarela', 'grabado', 'paisaje'],
      interests: ['naturaleza', 'viajes', 'fotografía'],
    },
    location: 'Bogotá',
  },
  {
    username: 'pipe.musica',
    email: 'felipe@email.com',
    firstName: 'Felipe',
    lastName: 'Restrepo',
    password: 'Opera123.*',
    rol: 'MENTOR',
    perfil: {
      artisticName: 'Pipe Restrepo',
      realName: 'Felipe Restrepo Zapata',
      bio: 'Productor musical y compositor de música electrónica experimental. Fusión de ritmos andinos con sintetizadores modulares.',
      avatar: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=pipe',
      tags: ['música', 'producción', 'experimental'],
      interests: ['synth', 'sonido', 'improvisación'],
    },
    location: 'Medellín',
  },
  {
    username: 'laura.danza',
    email: 'laura@email.com',
    firstName: 'Laura',
    lastName: 'Cifuentes',
    password: 'Opera123.*',
    perfil: {
      artisticName: 'Laura Cifuentes',
      realName: 'Laura Cifuentes Díaz',
      bio: 'Bailarina y coreógrafa de danza contemporánea. Investigo el movimiento como lenguaje de resistencia.',
      avatar:
        'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=300&h=300&fit=crop&crop=face',
      tags: ['danza', 'coreografía', 'performance'],
      interests: ['movimiento', 'acción social', 'colaboración'],
    },
    location: 'Cali',
  },
  {
    username: 'santiago.teatro',
    email: 'santiago@email.com',
    firstName: 'Santiago',
    lastName: 'Mendoza',
    password: 'Opera123.*',
    perfil: {
      artisticName: 'Santiago Mendoza',
      realName: 'Santiago Mendoza Ríos',
      bio: 'Actor y dramaturgo. Mis obras exploran las narrativas urbanas de la periferia bogotana.',
      avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=santiago',
      tags: ['teatro', 'dramaturgia', 'actuación'],
      interests: ['literatura', 'política', 'cine'],
    },
    location: 'Bogotá',
  },
  {
    username: 'camila.visual',
    email: 'camila.artes@email.com',
    firstName: 'Camila',
    lastName: 'Quintero',
    password: 'Opera123.*',
    perfil: {
      artisticName: 'Camila Quintero',
      realName: 'Camila Quintero Londoño',
      bio: 'Fotógrafa documental y artista multimedia. Retrato la memoria afrocolombiana del Pacífico.',
      avatar:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face',
      tags: ['fotografía', 'documental', 'multimedia'],
      interests: ['memoria', 'archivo', 'identidad'],
    },
    location: 'Barranquilla',
  },
  {
    username: 'andres.circo',
    email: 'andres@email.com',
    firstName: 'Andrés',
    lastName: 'Montoya',
    password: 'Opera123.*',
    perfil: {
      artisticName: 'Andrés Montoya',
      realName: 'Andrés Montoya Patiño',
      bio: 'Artista circense especializado en malabares y acrobacia aérea. Combino teatro físico con técnicas de circo contemporáneo.',
      avatar: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=andres',
      tags: ['circo', 'acrobacia', 'malabares'],
      interests: ['movimiento', 'risoterapia', 'pedagogía'],
    },
    location: 'Medellín',
  },
  {
    username: 'isabella.musica',
    email: 'isabella@email.com',
    firstName: 'Isabella',
    lastName: 'Giraldo',
    password: 'Opera123.*',
    perfil: {
      artisticName: 'Isabella Giraldo',
      realName: 'Isabella Giraldo Mejía',
      bio: 'Cantautora de música popular colombiana. Fusiono el bambuco y el pasillo con sonidos contemporáneos.',
      avatar:
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop&crop=face',
      tags: ['música', 'canto', 'composición'],
      interests: ['tradición', 'poesía', 'guitarra'],
    },
    location: 'Manizales',
  },
  {
    username: 'daniel.visual',
    email: 'daniel@email.com',
    firstName: 'Daniel',
    lastName: 'Castro',
    password: 'Opera123.*',
    perfil: {
      artisticName: 'Daniel Castro',
      realName: 'Daniel Castro Herrera',
      bio: 'Pintor muralista y street artist. Mis murales cuentan las historias del Caribe colombiano.',
      avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=daniel',
      tags: ['muralismo', 'street art', 'pintura'],
      interests: ['urbano', 'comunidad', 'color'],
    },
    location: 'Cartagena',
  },
  {
    username: 'mariana.performance',
    email: 'mariana@email.com',
    firstName: 'Mariana',
    lastName: 'Duque',
    password: 'Opera123.*',
    perfil: {
      artisticName: 'Mariana Duque',
      realName: 'Mariana Duque Ramírez',
      bio: 'Artista interdisciplinaria. Trabajo con performance, video arte e instalación para cuestionar el espacio doméstico.',
      avatar: 'https://api.dicebear.com/9.x/open-peeps/svg?seed=mariana',
      tags: ['performance', 'video arte', 'instalación'],
      interests: ['feminismo', 'espacio', 'cotidianidad'],
    },
    location: 'Bogotá',
  },
  {
    username: 'jose.letras',
    email: 'jose@email.com',
    firstName: 'José',
    lastName: 'Arias',
    password: 'Opera123.*',
    perfil: {
      artisticName: 'José Arias',
      realName: 'José Arias Páez',
      bio: 'Escritor y poeta. Publico narrativa breve y poesía sobre la identidad colombiana contemporánea.',
      avatar: 'https://api.dicebear.com/9.x/lorelei/svg?seed=jose',
      tags: ['literatura', 'poesía', 'narrativa'],
      interests: ['lectura', 'edición', 'traducción'],
    },
    location: 'Bucaramanga',
  },
  {
    username: 'opera.admin',
    email: 'opera@email.com',
    firstName: 'Opera',
    lastName: 'Prima',
    password: 'Opera123.*',
    rol: 'ADMIN',
    perfil: {
      artisticName: 'Opera Prima',
      realName: 'Opera Prima Admin',
      bio: 'Administrador de la plataforma Opera Prima.',
      avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=OP',
      tags: ['admin'],
      interests: ['gestión cultural'],
    },
    location: 'Bogotá',
  },
]

const SEED_TESTIMONIALS = [
  'Opera Prima me dio las herramientas y la comunidad que necesitaba para dar el salto profesional en mi carrera artística.',
  'Los talleres y mentorías me conectaron con artistas que hoy son mis colaboradores. Una red real, no solo virtual.',
  'Por primera vez siento que hay una plataforma que entiende lo que significa ser artista emergente en Colombia.',
  'Gracias a Opera Prima conseguí mi primera residencia artística. La comunidad te empuja a postularte a cosas que antes no te atrevías.',
  'El acompañamiento personalizado de los mentores transformó mi forma de entender mi práctica artística.',
  'Los eventos de comunidad son espacios seguros donde podemos mostrar nuestro trabajo sin miedo al juicio.',
  'Opera Prima no es solo una plataforma, es un movimiento que está cambiando la forma en que se hace cultura en el país.',
  'Encontrar otros artistas que están en las mismas me ha dado la confianza para seguir creando y mostrando mi obra.',
]

async function seedUsers() {
  console.log('Sembrando usuarios colombianos...')
  let seededCount = 0

  for (const userData of COLOMBIAN_USERS) {
    const existing = await prisma.usuario.findUnique({ where: { username: userData.username } })
    if (existing) {
      // Actualizar contraseña en Supabase Auth si ya existe
      if (existing.supabaseId) {
        const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(
          existing.supabaseId,
          { password: userData.password }
        )
        if (pwError)
          console.error(`  Error actualizando password de ${userData.username}: ${pwError.message}`)
      }
      // Actualizar rol si cambió
      const newRol = userData.rol || 'USUARIO'
      if (existing.rol !== newRol) {
        await prisma.usuario.update({ where: { id: existing.id }, data: { rol: newRol } })
      }
      console.log(`  Usuario ${userData.username} ya existe, datos actualizados`)
      continue
    }

    const { data: authUser, error } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
    })

    if (error || !authUser.user) {
      console.error(`  Error creando usuario ${userData.username}: ${error?.message}`)
      continue
    }

    await prisma.usuario.create({
      data: {
        supabaseId: authUser.user.id,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        countryCode: 'CO',
        phone: `300${Math.floor(1000000 + Math.random() * 9000000)}`,
        rol: userData.rol || 'USUARIO',
        perfil: {
          create: {
            artisticName: userData.perfil.artisticName,
            realName: userData.perfil.realName,
            bio: userData.perfil.bio,
            avatar: userData.perfil.avatar,
            tags: userData.perfil.tags,
            interests: userData.perfil.interests,
          },
        },
      },
    })

    seededCount++
    console.log(`  ✓ ${userData.firstName} ${userData.lastName} (${userData.location})`)
  }

  console.log(`  Total: ${seededCount} usuarios creados`)
  return COLOMBIAN_USERS.map((u) => u.username)
}

async function seedTestimonials(createdUsernames: string[]) {
  const existingCount = await prisma.testimonial.count()
  if (existingCount >= SEED_TESTIMONIALS.length) {
    console.log('Testimonios ya existen, saltando...')
    return
  }

  console.log('Sembrando testimonios...')

  const targetUsernames =
    createdUsernames.length > 0 ? createdUsernames : COLOMBIAN_USERS.map((u) => u.username)

  const users = await prisma.usuario.findMany({
    where: { username: { in: targetUsernames } },
    include: { perfil: true },
  })

  for (let i = 0; i < Math.min(SEED_TESTIMONIALS.length, users.length); i++) {
    const user = users[i]
    const existing = await prisma.testimonial.findFirst({
      where: { usuarioId: user.id, text: SEED_TESTIMONIALS[i] },
    })
    if (existing) continue

    await prisma.testimonial.create({
      data: {
        text: SEED_TESTIMONIALS[i],
        usuarioId: user.id,
        active: true,
      },
    })
    console.log(`  ✓ Testimonio de ${user.perfil?.artisticName || user.firstName}`)
  }

  console.log(`  Total: ${Math.min(SEED_TESTIMONIALS.length, users.length)} testimonios creados`)
}

async function main() {
  // Seed users
  const createdUsernames = await seedUsers()

  // Seed testimonials
  await seedTestimonials(createdUsernames)

  // Promover admin (por env o por defecto opera@email.com)
  const adminEmail = process.env.ADMIN_EMAIL || 'opera@email.com'
  const user = await prisma.usuario.findUnique({ where: { email: adminEmail } })
  if (user) {
    if (user.rol !== 'ADMIN') {
      await prisma.usuario.update({ where: { email: adminEmail }, data: { rol: 'ADMIN' } })
      console.log(`Usuario ${adminEmail} promovido a ADMIN`)
    }
  } else {
    console.log(`No se encontró usuario con email: ${adminEmail}`)
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

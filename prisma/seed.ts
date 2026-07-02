import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SEED_PAGES = [
  {
    slug: 'inicio',
    title: 'Inicio',
    blocks: [
      { type: 'hero-carousel', props: {} },
      { type: 'what-is', props: {} },
      { type: 'events-opera-prima', props: {} },
      { type: 'comunidad-cta', props: {} },
      { type: 'testimonials', props: {} },
      { type: 'partners', props: {} },
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
      { type: 'partners', props: {} },
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

  // Sembrar páginas
  for (const page of SEED_PAGES) {
    const existing = await prisma.pageContent.findUnique({ where: { slug: page.slug } })
    if (!existing) {
      await prisma.pageContent.create({
        data: {
          slug: page.slug,
          title: page.title,
          blocks: page.blocks,
          published: true,
        },
      })
      console.log(`Página "${page.title}" (/${page.slug}) creada`)
    } else {
      console.log(`Página "${page.title}" (/${page.slug}) ya existe, saltando`)
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

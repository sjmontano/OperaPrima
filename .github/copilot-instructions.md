# Opera Prima — Instrucciones para GitHub Copilot

## Proyecto

Plataforma web para artistas emergentes colombianos. Incluye:

- Mentorías 1:1 con pago integrado
- Calendario de eventos y networking
- Tablero de oportunidades
- Contenido por membresía (free / premium)

## Stack técnico

- Next.js 16 App Router, TypeScript estricto
- Tailwind CSS v4 + shadcn/ui
- Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- Stripe Checkout + webhooks
- WordPress headless via WPGraphQL
- Resend
- Vercel

## Estructura de carpetas

src/
├── app/
│ ├── (marketing)/
│ ├── (auth)/
│ ├── (dashboard)/
│ └── api/
├── components/
│ ├── ui/ # shadcn/ui — no editar manualmente
│ ├── layout/ # Navbar, Footer
│ ├── profile/ # ProfileHero, GalleryMasonry, MemberGrid
│ ├── mentors/
│ ├── booking/
│ ├── events/
│ └── shared/
├── lib/
│ ├── supabase/
│ ├── stripe/
│ └── wordpress/
├── hooks/
├── types/
└── constants/

## Convenciones

- Componentes: PascalCase
- Hooks: camelCase con prefijo use
- Variables y funciones: camelCase
- Constantes: SCREAMING_SNAKE_CASE en src/constants/index.ts
- Tipos e interfaces: PascalCase sin prefijo I
- Rutas: kebab-case

## Principios

- Server Components por defecto
- Usa "use client" solo cuando haya estado o eventos del navegador
- Early returns para evitar nesting
- Sin números mágicos
- DRY: lógica repetida va a hooks/ o lib/utils.ts
- Componentes < 100 líneas, funciones < 20 líneas
- Comentarios solo explican el porqué
- UI en español, identificadores en inglés

## Seguridad

- Nunca exponer SUPABASE_SERVICE_ROLE_KEY ni STRIPE_SECRET_KEY al cliente
- Variables públicas solo con prefijo NEXT*PUBLIC*
- Validar inputs con zod antes de tocar la DB
- Usar RLS para control free / premium
- Verificar webhooks de Stripe con stripe.webhooks.constructEvent()

## Patrones preferidos

- Data fetching en Server Components con async/await directo
- Mutaciones con Server Actions
- Estado global mínimo; React Query solo para cache del cliente
- Tipos de DB desde @/types/database

## Estilo de respuesta

- Responde en español, breve y directo.
- Si el usuario pide el modo más compacto, usa /caveman.

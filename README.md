# Opera Prima

Plataforma web de acompañamiento profesional para artistas emergentes colombianos. El proyecto nació de una necesidad concreta: conectar creadores con los recursos que la academia no da. Mentorías 1:1, talleres, convocatorias y comunidad, todo en un solo lugar.

**Sitio en producción:** [operaprima.vercel.app](https://operaprima.vercel.app)  
**Repositorio:** [github.com/sjmontano/OperaPrima](https://github.com/sjmontano/OperaPrima)

---

## Qué ofrece la plataforma

- **Mentorías 1:1** con profesionales del sector cultural. Temas que la universidad no enseña: estructurar un proyecto, diseñar un portafolio, redactar cartas de motivación para becas, planear giras, revisar presupuestos.
- **Talleres y eventos** de formación y networking dentro de la comunidad.
- **Tablero de oportunidades**: convocatorias y proyectos con fecha de caducidad, filtros por categoría y diferenciación visual entre publicaciones de la plataforma y de usuarios.
- **Membresías**: contenido libre (`free`) y contenido restringido a sesión activa (`premium`), señalizado visualmente con el color de marca.
- **Newsletter** y sección de aliados para mantener la comunidad conectada.

---

## Stack técnico

El stack fue elegido para escalar sin fricción y para que un equipo pequeño pueda mantenerlo.

| Tecnología                | Por qué                                                                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Next.js 16 App Router** | SSR real, rutas anidadas limpias, deploy nativo en Vercel. Los Server Components mejoran SEO y tiempo de carga inicial. |
| **TypeScript estricto**   | Errores detectados en escritura, no en producción. Autocompletado con tipos generados por Supabase CLI.                 |
| **Tailwind CSS v4**       | Sin clases predefinidas que delaten el framework. La v4 simplifica la config a un solo `@import`.                       |
| **shadcn/ui**             | Componentes accesibles y totalmente personalizables, construidos sobre Tailwind.                                        |
| **motion/react v11**      | Animaciones declarativas: scroll-driven, spring physics, AnimatePresence para transiciones de lista.                    |
| **Supabase**              | PostgreSQL real con RLS, auth integrado y storage. Capa gratuita para validar el MVP sin costo inicial.                 |
| **Stripe**                | Pagos por mentoría. Webhooks para confirmar reservas tras pago exitoso, sin polling.                                    |
| **Drupal headless**       | CMS editorial. El equipo publica sin tocar código. Integración via JSON:API.                                            |
| **Resend**                | Emails transaccionales: confirmaciones de reserva, recuperación de contraseña.                                          |
| **Vercel**                | Deploy automático en cada push a `master`. SSL, CDN y variables de entorno incluidos.                                   |

---

## Arquitectura de carpetas

```
web/src/
├── app/
│   ├── (marketing)/        # páginas públicas: landing, mentores, eventos
│   ├── (auth)/             # login y registro
│   ├── (dashboard)/        # área privada del usuario autenticado
│   └── api/                # route handlers: webhooks de Stripe, callbacks OAuth
├── components/
│   ├── ui/                 # shadcn/ui — no editar manualmente
│   ├── layout/             # AdBar, Navbar, Footer
│   ├── mentors/            # MentorCard, MentorGrid, MentorProfile
│   ├── booking/            # BookingForm, TimeSlotPicker, BookingSummary
│   ├── events/             # EventsSection, EventCard
│   └── shared/             # HeroCarousel, WhatIsSection, ComunidadCTA,
│                           # TestimonialsWall, PartnersStrip
├── lib/
│   ├── supabase/           # client.ts (browser) | server.ts (RSC) | middleware.ts
│   ├── stripe/             # client.ts | webhooks.ts
│   └── cms/                # queries.ts para Drupal headless
├── hooks/                  # useAuth, useBooking, useMentors
├── types/                  # database.ts (generado con Supabase CLI) | index.ts
└── constants/              # ROUTES, CURRENCIES, SESSION_DURATION, BOOKING_STATUS
```

---

## Principios de diseño

La interfaz parte de referentes como **Nau Ivanow** y **La Escocesa** en Barcelona y el portafolio de **André Cândido**: base limpia con momentos de color, tipografía activa y señalización visual del contenido restringido.

El patrón que más influyó fue La Escocesa, que marca en rojo las funciones disponibles solo para usuarios autenticados. Opera Prima aplica la misma lógica con su color de marca para señalar el contenido premium.

### Tokens visuales

| Token           | Valor                                                       |
| --------------- | ----------------------------------------------------------- |
| Fondo claro     | `#ffffff` / `zinc-50`                                       |
| Fondo oscuro    | `#0f0f0f` (navbar con scroll, footer, secciones de impacto) |
| Color de marca  | `#F65B7F` (CTAs, eyebrows, acentos, contenido premium)      |
| Texto principal | `zinc-900`                                                  |
| Texto suave     | `zinc-500` / `white/60`                                     |
| Contenedor      | `max-w-420` (1680 px) con `border-x border-zinc-200`        |

### Estilo de botones (brutalist)

```
border-2, sin border-radius
hover: shadow-[4px_4px_0_#111] + translate(-1px, -1px)
active: translate(0.5px, 0.5px) + shadow none
```

### Grid overlay

Presente en el hero y en secciones oscuras para coherencia visual:

```css
background:
  linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px);
background-size: 80px 80px;
opacity: 0.05;
```

---

## Secciones de la landing

El orden en `app/page.tsx` responde a un flujo editorial deliberado:

| #   | Componente         | Propósito                                                  |
| --- | ------------------ | ---------------------------------------------------------- |
| 1   | `AdBar`            | Franja de anuncio dismissible sobre la navbar              |
| 2   | `Navbar`           | Fija, con transición a fondo oscuro al hacer scroll        |
| 3   | `HeroCarousel`     | Cuatro slides con overlay de cuadrícula y CTAs principales |
| 4   | `WhatIsSection`    | Propuesta de valor en dos columnas con cuatro servicios    |
| 5   | `EventsSection`    | Próximos eventos con buscador, filtros y layout parallax   |
| 6   | `ComunidadCTA`     | Sección oscura con estadísticas animadas y CTA de registro |
| 7   | `TestimonialsWall` | Testimonios de la comunidad                                |
| 8   | `PartnersStrip`    | Aliados institucionales                                    |
| 9   | `Footer`           | Newsletter, navegación y datos de contacto                 |

---

## Primeros pasos

```bash
cd web
npm install
npm run dev
```

El servidor arranca en [localhost:3000](http://localhost:3000).

### Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_DRUPAL_API_URL=
```

> `SUPABASE_SERVICE_ROLE_KEY` y `STRIPE_SECRET_KEY` nunca deben exponerse al cliente ni comitearse.

Para conectar Supabase y generar los tipos reales de la base de datos:

```bash
npx supabase gen types typescript --project-id <ID> > src/types/database.ts
```

---

## Convenciones de código

- **Server Components por defecto.** `"use client"` solo cuando hay estado del navegador o event handlers.
- **Early returns** para evitar nesting mayor a dos niveles.
- **Sin números mágicos.** Todas las constantes en `src/constants/index.ts`.
- **Validación con zod** antes de cualquier operación en base de datos.
- **RLS en Supabase** para control de acceso por rol. La seguridad vive en la base de datos, no solo en la aplicación.
- **Webhooks de Stripe** siempre verificados con `stripe.webhooks.constructEvent()`.
- **Sin caracteres Unicode box-drawing** (`─`, `┌`, etc.) en comentarios JSX. El parser de Turbopack falla al calcular offsets de bytes en caracteres multi-byte.

### Nomenclatura

| Tipo        | Patrón                     | Ejemplo             |
| ----------- | -------------------------- | ------------------- |
| Componentes | PascalCase                 | `MentorCard.tsx`    |
| Hooks       | camelCase con `use`        | `useBooking.ts`     |
| Constantes  | SCREAMING_SNAKE_CASE       | `SESSION_DURATION`  |
| Tipos       | PascalCase sin prefijo `I` | `Booking`, `Mentor` |
| Rutas       | kebab-case                 | `/mis-reservas`     |

---

## Roadmap

### Fase 1 — MVP

Valida lo único que genera ingreso desde el primer día: las mentorías.

- [x] Landing completa con todas las secciones
- [ ] Catálogo de mentores con filtros
- [ ] Flujo de reserva: elegir mentor → horario → formulario → pago Stripe
- [ ] Auth: registro y login con email y Google OAuth
- [ ] Email de confirmación de reserva
- [ ] Dashboard básico del usuario

### Fase 2 — Después de validar demanda

- [ ] Tablero de oportunidades con convocatorias y caducidad
- [ ] Galería de artistas de la comunidad
- [ ] Eventos con pago integrado
- [ ] Membresías premium con RLS
- [ ] Contenido editorial integrado con Drupal headless

---

## Deploy

Cada push a `master` despliega automáticamente a [opera-prima.vercel.app](https://opera-prima.vercel.app) vía Vercel. Sin servidor que mantener.

---

## Stack

- **Framework:** Next.js 16 (App Router) con TypeScript estricto
- **UI:** Tailwind CSS v4 + shadcn/ui
- **Animaciones:** motion/react v11 (parallax, scroll-driven, AnimatePresence)
- **Backend / DB:** Supabase (PostgreSQL + Auth + Storage)
- **Pagos:** Stripe Checkout + Webhooks
- **CMS:** Drupal headless
- **Emails:** Resend
- **Deploy:** Vercel

---

## Estructura del proyecto

```
web/src/
├── app/
│   ├── (marketing)/     # páginas públicas
│   ├── (auth)/          # login, registro
│   ├── (dashboard)/     # área privada del usuario
│   └── api/             # route handlers (webhooks, OAuth)
├── components/
│   ├── ui/              # shadcn/ui — no editar manualmente
│   ├── layout/          # AdBar, Navbar, Footer
│   ├── events/          # EventsSection, EventCard
│   ├── booking/         # BookingForm, TimeSlotPicker
│   └── shared/          # HeroCarousel, WhatIsSection, ComunidadCTA, TestimonialsWall, PartnersStrip
├── lib/
│   ├── supabase/        # client.ts | server.ts | middleware.ts
│   └── stripe/          # client.ts | webhooks.ts
├── hooks/               # useAuth, useBooking, useMentors
├── types/               # database.ts (generado) | index.ts (dominio)
└── constants/           # ROUTES, CURRENCIES, SESSION_DURATION
```

---

## Desarrollo local

```bash
cd web
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Variables de entorno necesarias (copia `.env.example` a `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
```

---

## Convenciones

- Server Components por defecto. `"use client"` solo cuando haya estado o eventos del navegador.
- Validación de inputs con `zod` antes de tocar la DB.
- RLS de Supabase para control de acceso por rol (`free` / `premium`).
- Webhooks de Stripe siempre verificados con `stripe.webhooks.constructEvent()`.
- Sin números mágicos — constantes en `src/constants/index.ts`.
- No usar caracteres Unicode box-drawing (`─`, `┌`, etc.) en comentarios JSX — causan panic en el parser de Turbopack.

---

## Deploy

El proyecto está conectado a Vercel. Cada push a `master` despliega automáticamente a [opera-prima.vercel.app](https://opera-prima.vercel.app).

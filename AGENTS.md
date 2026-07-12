<!-- BEGIN:user-rules -->

# User Rules (must follow at all times)

- **Never** commit or push changes unless the user explicitly asks for it.
- If the user says "haz commit", "pushea", "commitea", or similar explicit wording, then proceed.
- Otherwise, just make the changes locally and wait for authorization.

## 📝 Convenciones de commits

- **Idioma**: todos los commits deben escribirse en **español**.
- **Agrupación lógica**: agrupa cambios relacionados en un mismo commit (ej. "todo lo del admin de eventos en uno"), pero **separa tareas independientes** en commits distintos (ej. no mezcles "fix toolbar" con "admin eventos").
- **Formato del mensaje**:

  ```
  tipo: descripción breve (máx 72 caracteres)

  - Detalle 1: qué se hizo y por qué
  - Detalle 2
  - ...
  ```

- **Tipos permitidos**: `feat` (nueva funcionalidad), `fix` (corrección), `refactor` (cambio sin afectar comportamiento), `style` (estilos/UI), `perf` (rendimiento), `chore` (infraestructura), `docs` (documentación), `revert`.
- **Descripción**: debe ser específica y entendible sin contexto externo. Incluye el "por qué" cuando no sea obvio.
- **Longitud**: mensaje principal ≤ 72 caracteres; cuerpo con viñetas, cada línea ≤ 100 caracteres.
- **Ejemplo**:

  ```
  feat: agregar modal de detalle en admin de eventos

  - Click en fila abre modal con pestañas Info/Edit, Entries, Delete
  - Vista de entradas con tabla de usuarios, email y fecha
  - Eliminación con advertencia, countdown de 10s y backup automático
  - Admin puede editar eventos de cualquier usuario
  ```

<!-- END:user-rules -->

<!-- BEGIN:persistent-context -->

# 🧠 Persistent Context — Auth & DB

## ⚠️ Build & Push Rules

- **Nunca** correr `next build`, `npm run build` o similar sin que el usuario lo pida explícitamente.
- **Nunca** hacer commit ni push sin autorización explícita ("haz commit", "pushea", "commitea").
- Después de cambios críticos, avisar que se necesita build, no ejecutarlo.

---

## 🔐 Sistema de Autenticación (Supabase SSR)

### Stack

- **Supabase** como proveedor de auth (email/password + magic link)
- **`@supabase/ssr`** para manejo de cookies en Next.js (vía `createBrowserClient` y `createServerClient`)
- **Prisma** como ORM para datos de usuario (`Usuario` model con `supabaseId` FK)
- **Proxy file**: `src/proxy.ts` es el middleware de Next.js 16 (NO `middleware.ts`)

### Reglas de oro

1. **Todo Route Handler que necesite auth debe usar `createServerClient` de `@supabase/ssr`**, NUNCA `createClient` de `@supabase/supabase-js`.
2. El patrón correcto en API routes:

   ```ts
   import { createServerClient } from '@supabase/ssr'
   import { NextResponse } from 'next/server'

   // GET handler
   const supabase = createServerClient(URL, ANON_KEY, {
     cookies: {
       getAll() {
         const cookieHeader = req.headers.get('cookie') ?? ''
         return cookieHeader
           .split(';')
           .filter(Boolean)
           .map((c) => {
             const [name, ...rest] = c.trim().split('=')
             return { name, value: rest.join('=') }
           })
       },
       setAll() {
         /* read-only si no necesitas setear */
       },
     },
   })

   const {
     data: { user },
   } = await supabase.auth.getUser()
   ```

3. **Login** (`/api/auth/login`) debe crear un `cookieContainer = NextResponse.next()`, usarlo en `setAll`, y luego copiar cookies a la respuesta final con `jsonResponse.cookies.set(...)`.
4. **Nunca** crear un cliente Supabase como módulo singleton (`const supabase = createClient(...)` a nivel de archivo) — siempre instanciar por-request.
5. **`proxy.ts`** se encarga de refrescar la sesión en cada request a rutas protegidas vía `getUser()`. Si el usuario no está autenticado, redirige a `/auth`.

### Flujo correcto de login

1. `FlipAuthCard` → fetch `POST /api/auth/login`
2. Ruta usa `createServerClient` → `signInWithPassword()` → SSR setea cookies en la respuesta
3. AuthModalProvider recibe usuario vía `onLoginSuccess` + `onAuthStateChange`
4. `currentUser` se guarda en React state (no depender solo de localStorage)
5. Al navegar a `/perfil`, las cookies existen → `getSession()` funciona → perfil carga OK

### Errores comunes (NO HACER)

- ❌ Usar `createClient` de `@supabase/supabase-js` en Route Handlers (no setea cookies, no refresca sesión)
- ❌ Crear cliente singleton a nivel de módulo
- ❌ Validar token manual desde header `Authorization` en vez de leer cookies
- ❌ Dejar al usuario en skeleton si falla auth — siempre redirigir

---

## 🗄️ Base de Datos (Prisma + PostgreSQL)

### Stack

- **Neon** (PostgreSQL serverless)
- **Prisma** como ORM con `prisma-client-js`

### Modelos principales

| Modelo        | Descripción                                                   | Relaciones clave                                                     |
| ------------- | ------------------------------------------------------------- | -------------------------------------------------------------------- |
| `Usuario`     | Cuenta de usuario                                             | 1:1 `Perfil`, 1:1 `Mentor`, N: `Evento`, N: `Entrada`, N: `Proyecto` |
| `Perfil`      | Perfil extendido (artisticName, bio, avatar, tags, interests) | 1:1 `Usuario`, 1:N `Social`                                          |
| `Social`      | Redes sociales del perfil                                     | N:1 `Perfil`                                                         |
| `Mentor`      | Perfil de mentor (name, title, focus, active, orden)          | 1:1 `Usuario`                                                        |
| `Evento`      | Eventos/talleres (tipo: OPEAR_PRIMA / COMUNIDAD)              | N:1 `Usuario`, 1:N `Entrada`                                         |
| `Entrada`     | Tickets de eventos                                            | N:1 `Usuario`, N:1 `Evento`, N:1 `Pago`                              |
| `Pago`        | Pagos (referencia, stripeSessionId, monto, estado)            | 1:N `Entrada`                                                        |
| `Proyecto`    | Proyectos (COMUNIDAD / ENTIDAD, destacado, fechaLimite)       | N:1 `Usuario`                                                        |
| `PageContent` | CMS dinámico (slug, title, blocks JSON, published)            | —                                                                    |
| `Testimonial` | Testimonios de usuarios (text, active)                        | N:1 `Usuario`                                                        |

### Convenciones DB

- **ID**: UUIDs generados por Prisma/Postgres
- **JSON**: `blocks` en PageContent, `galleryImages` en Mentor
- **Arrays nativos**: `tags`, `interests`, `disciplinas`, `notes`
- **Soft-delete**: `DeletedEventBackup` guarda JSON del evento antes de eliminar
- **Enums en Prisma**: Se usan en lugar de strings para `Rol`, `TipoEvento`, `TipoProyecto`, `EstadoPago`

### Acceso a DB

- `prisma` se importa de `@/lib/prisma` (singleton de PrismaClient)
- El cliente admin de Supabase (`@/lib/supabaseAdmin`) usa `SUPABASE_SERVICE_ROLE_KEY` solo para operaciones de administración (crear usuarios).
- **Nunca** exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente.

<!-- END:persistent-context -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:design-workflow -->

# Design Workflow — Skill Integration

When working on design/frontend tasks, chain skills in this order:

```
ui-ux-pro-max → google-design-md → tailwind-v4-shadcn → impeccable
                                                           │
                                                           ├── accessibility
                                                           └── seo
```

## Decision Flow

1. **ui-ux-pro-max** — Decide style, palette, typography, UX patterns (use `--domain color`, `--domain typography`, `--design-system`)
2. **google-design-md** — Formalize decisions into `DESIGN.md` (machine-readable tokens + rationale)
3. **tailwind-v4-shadcn** — Export tokens to `@theme` in `globals.css` and `design-tokens.ts`
4. **impeccable** — Build components/pages using `craft` (shape-then-build), reinforce design system with `extract`
5. **accessibility** — WCAG 2.2 audit before delivery
6. **seo** — Meta, structured data, sitemap

## Key Rules

- Always run ui-ux-pro-max first before google-design-md — it provides the design decisions that populate DESIGN.md
- impeccable's `teach` sets design context; ui-ux-pro-max's `--domain` queries provide the data
- After building, run `extract` to pull reusable tokens/components back into the design system

<!-- END:design-workflow -->

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

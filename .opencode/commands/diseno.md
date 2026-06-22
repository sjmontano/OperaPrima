---
description: 'Flujo completo de diseño: paleta, tokens, componentes y auditoría. Solo para tareas GRANDES de diseño (nuevas páginas, secciones completas, refactors visuales mayores).'
---

# /diseno — Flujo Completo de Diseño

Usa este comando SOLO para trabajo de diseño sustancial: nuevas páginas, secciones completas, refactors visuales mayores, o creation de design system. NO lo uses para cambios breves de color o ajustes menores.

## Workflow

### 1. Diseño — ui-ux-pro-max

skill({ name: "ui-ux-pro-max" })
Usa `--domain color`, `--domain typography`, `--domain style`, `--design-system` para decidir dirección de diseño basada en el tipo de producto.

### 2. Tokens — google-design-md

skill({ name: "google-design-md" })
Formaliza las decisiones de ui-ux-pro-max en un archivo DESIGN.md con tokens legibles por IA.

### 3. Export — tailwind-v4-shadcn

skill({ name: "tailwind-v4-shadcn" })
Exporta los tokens de DESIGN.md a @theme en globals.css y design-tokens.ts.

### 4. Implementación — impeccable

skill({ name: "impeccable" })
Construye componentes/páginas usando `craft` (shape-then-build). Después de construir, corre `extract` para formalizar patrones reutilizables.

### 5. Auditoría — accessibility + seo

skill({ name: "accessibility" })
skill({ name: "seo" })
Verifica WCAG 2.2, meta tags, datos estructurados y sitemap antes de entregar.

## ⚠️ Cuándo NO usar este comando

- Cambios menores de color (una línea)
- Ajustes de espaciado
- Renombrar clases
- Correcciones rápidas de CSS
- Bugs pequeños de UI

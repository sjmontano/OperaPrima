---
mode: agent
description: 'Auditoría técnica: a11y, performance, responsive, anti-patterns'
---

Eres un auditor técnico de UI. Ejecuta una auditoría completa del componente o página que te indican.

**Primero**, lee estos archivos de contexto:

- `.impeccable.md` (contexto de diseño del proyecto)
- `.agents/skills/impeccable/reference/interaction-design.md`
- `.agents/skills/impeccable/reference/responsive-design.md`
- `.agents/skills/accessibility/SKILL.md`

**Luego**, analiza el código objetivo y genera un informe estructurado con estas secciones:

## 🔍 Auditoría: [nombre del archivo]

### Accesibilidad (WCAG AA)

Revisa y reporta:

- [ ] ¿Todos los botones icon-only tienen `aria-label`?
- [ ] ¿Los inputs tienen `<label>` visible vinculado con `for`/`id` o `aria-labelledby`?
- [ ] ¿Los errores de formulario están enlazados con `aria-describedby`?
- [ ] ¿El contraste de texto cumple 4.5:1 (normal) o 3:1 (grande)?
- [ ] ¿El foco con teclado es visible (`:focus-visible` con estilo)?
- [ ] ¿Los modales atrapan el foco y lo devuelven al cerrar?
- [ ] ¿Los elementos interactivos tienen touch targets ≥ 44px?

### Patrones prohibidos (impeccable absolute_bans)

- [ ] ¿Hay `border-left:` o `border-right:` > 1px como acento visual?
- [ ] ¿Hay `background-clip: text` con gradiente (gradient text)?
- [ ] ¿Hay glassmorphism decorativo (backdrop-blur sin propósito)?
- [ ] ¿Hay bounce/elastic easing en animaciones?
- [ ] ¿Se animan propiedades de layout (height, width, padding, margin)?

### Responsive

- [ ] ¿El layout funciona desde 320px?
- [ ] ¿Los textos cuerpo tienen `max-width: ~65-75ch`?
- [ ] ¿Las imágenes tienen `max-width: 100%`?
- [ ] ¿Los componentes usan container queries donde corresponde?
- [ ] ¿No hay viewport meta con `user-scalable=no`?

### Performance

- [ ] ¿Las imágenes usan `next/image` con `sizes` correcto?
- [ ] ¿Las animaciones usan solo `transform` y `opacity`?
- [ ] ¿`"use client"` está limitado al mínimo necesario?
- [ ] ¿Hay data fetching innecesario en Client Components?

**Para cada ítem que falla**, proporciona:

1. La línea/patrón específico que falla
2. El código corregido listo para copiar

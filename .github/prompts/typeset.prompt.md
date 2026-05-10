---
mode: agent
description: 'Revisar tipografía y jerarquía'
---

Eres un especialista en tipografía. Revisa y refina la tipografía del componente o página indicado.

**Primero**, lee:

- `.agents/skills/impeccable/reference/typography.md`
- `.impeccable.md` (para confirmar: Poppins, tokens tipográficos del proyecto)

**Sistema tipográfico de Opera Prima**:

- Fuente: Poppins (400, 500, 700, 800)
- Display: `clamp(3rem, 6vw, 6rem)`, weight 800, tracking -0.04em, line-height 0.95
- H1: `clamp(1.75rem, 3vw, 2.5rem)`, weight 800, tracking -0.02em, line-height 1.1
- H2: `clamp(1.25rem, 2vw, 1.75rem)`, weight 700, tracking -0.01em
- H3: `1.25rem`, weight 700
- Body: `0.9375–1.0625rem`, weight 400, line-height 1.65–1.7
- Labels: `0.75rem`, weight 700, tracking 0.1em, ALL-CAPS
- Eyebrow: como label pero en `#F65B7F`

**Luego**, diagnostica y corrige:

## Typeset Pass: [nombre del componente]

### Jerarquía

- ¿El ratio entre pasos contiguos es ≥ 1.25×?
- ¿Se distingue inmediatamente el heading del body?
- ¿El CTA y los labels son claramente distintos del body text?
- ¿Hay demasiados niveles de tamaño compitiendo (más de 4 tamaños distintos en una vista)?

### Escalas y fluid sizing

- ¿Los headings usan `clamp()` en páginas de marketing/landing?
- ¿El body text en app UI usa tamaño fijo (`rem`) en lugar de fluid?
- ¿El texto body es ≥ 16px en mobile?

### Detalles tipográficos

- ¿Los headings display tienen `letter-spacing` negativo?
- ¿Los labels ALL-CAPS tienen `letter-spacing: 0.08-0.1em`?
- ¿El line-height del prose es ≥ 1.65?
- ¿Los textos largos tienen `max-width: 65-75ch`?
- ¿Los números en datos/tablas usan `font-variant-numeric: tabular-nums`?

### Sobre texto en fondos oscuros

Si hay texto claro sobre fondo oscuro:

- ¿El `line-height` es 0.05-0.1 mayor que el equivalente en light?
- ¿El `font-weight` está un paso arriba (400→500, 500→600)?

### Patrones prohibidos

- ¿Hay párrafos completos en ALL-CAPS?
- ¿Hay texto largo centrado (más de 3 líneas)?
- ¿Hay gradient text (`background-clip: text`)?
- ¿Se usa Inter, DM Sans, Syne, Fraunces, Playfair Display u otra fuente de la lista rechazada?

**Aplica todos los cambios directamente.** Prioriza los que más afectan la legibilidad.

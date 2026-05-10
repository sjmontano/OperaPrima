---
mode: agent
description: 'Pulido final antes de subir a producción'
---

Eres el ojo más fino del equipo. Ejecuta el pass de pulido final sobre el componente o página indicado. Buscas los detalles que separan "funciona" de "impecable".

**Primero**, lee estos archivos de contexto:

- `.impeccable.md` (contexto de diseño del proyecto)
- `.agents/skills/impeccable/reference/typography.md`
- `.agents/skills/impeccable/reference/spatial-design.md`
- `.agents/skills/impeccable/reference/motion-design.md`

**Luego**, ejecuta el polish checklist completo:

## ✨ Polish Pass: [nombre del componente]

### Tipografía micro-detalles

- ¿Los headings tienen `letter-spacing` negativo adecuado (display: -0.03em, h1: -0.02em)?
- ¿El line-height del body prose es ≥ 1.65?
- ¿Las etiquetas ALL-CAPS tienen `letter-spacing: 0.08–0.1em`?
- ¿Los números en tablas o datos usan `font-variant-numeric: tabular-nums`?
- ¿Los textos largos tienen `max-width: 65-75ch`?

### Espaciado y ritmo

- ¿Todo el espaciado proviene de la escala 4pt (4, 8, 12, 16, 24, 32, 48, 64, 96)?
- ¿Hay espaciado variable para crear jerarquía (más espacio antes de elementos importantes)?
- ¿Se usa `gap` en lugar de margin para siblings?
- ¿Los botones tienen padding-bottom ligeramente mayor que padding-top para centrado óptico?

### Color y superficies

- ¿Los neutrales están ligeramente teñidos hacia `#F65B7F` (no gris puro)?
- ¿Ningún color es `#000` puro ni `#fff` puro?
- ¿Los estados hover/focus/active son perceptiblemente distintos pero no exagerados?
- ¿Las sombras offset brutalistas (4px 4px 0 #111) se usan consistentemente?

### Motion refinements

- ¿Los timings de entrada (300ms) son más largos que los de salida (200ms)?
- ¿Se usa easing exponencial (`cubic-bezier(0.16, 1, 0.3, 1)`) en lugar de `ease`?
- ¿Hay `prefers-reduced-motion` implementado?
- ¿Las transiciones más pequeñas (hover states) son ≤ 200ms?

### Producción final

- ¿Sin `console.log` ni comentarios de debug?
- ¿Sin valores hardcoded que deberían ser tokens o constantes?
- ¿Sin `TODO` ni `FIXME` pendientes?
- ¿TypeScript sin `any` ni `@ts-ignore` innecesarios?

**Aplica directamente** todos los fixes que encuentres. No los listes — impleméntalos.

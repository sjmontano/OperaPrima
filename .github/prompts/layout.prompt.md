---
agent: agent
description: 'Corregir espaciado y ritmo visual'
---

Eres un especialista en layout y espaciado. Corrige el espaciado y el ritmo visual del componente o página indicado.

**Primero**, lee:

- `.agents/skills/impeccable/reference/spatial-design.md`
- `.impeccable.md` (para confirmar el sistema de espaciado del proyecto)

**Escala de referencia (4pt)**:
`4px · 8px · 12px · 16px · 24px · 32px · 48px · 64px · 96px`

**Luego**, analiza e implementa correcciones en estas áreas:

## Layout Pass: [nombre del componente]

### Diagnóstico de espaciado

- Identifica todos los valores de `padding`, `margin`, `gap` en el componente
- Marca cuáles NO provienen de la escala 4pt
- Reemplázalos con el valor más cercano de la escala

### Ritmo visual

El problema más común: espaciado uniforme que elimina la jerarquía. Corrige:

- ¿Hay más espacio antes de un nuevo bloque de contenido que dentro de él?
- ¿Los elementos relacionados están más juntos que los no relacionados (ley de proximidad)?
- ¿Las secciones de la página tienen `padding-y` generoso (`clamp(3rem, 5vw, 6rem)`)?

### Grid y alineación

- ¿Los elementos están alineados al grid base?
- ¿Se usa `gap` en flex/grid en lugar de `margin` entre siblings?
- ¿El texto body tiene `max-width: 65-75ch`?
- ¿Los contenedores tienen el `max-width` correcto para su contexto?

### Correcciones ópticas

- ¿Los botones tienen padding-bottom ≥ padding-top (centrado óptico del texto)?
- ¿Las íconos inline están alineados al cap-height del texto adyacente?
- ¿El padding interno de cards es consistente en todos los bordes?

**Aplica todos los cambios directamente al código.** Para cada cambio documenta brevemente el "por qué" (solo cuando no sea obvio).

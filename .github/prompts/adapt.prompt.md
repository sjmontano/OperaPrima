---
mode: agent
description: 'Asegurar responsividad'
---

Eres un especialista en diseño responsivo. Asegura que el componente o página indicado funcione correctamente en todos los tamaños de pantalla.

**Primero**, lee:

- `.agents/skills/impeccable/reference/responsive-design.md`
- `.impeccable.md` (stack: Next.js, Tailwind v4, container queries disponibles)

**Viewports objetivo**:

- Mobile: 320px – 639px (prioritario)
- Tablet: 640px – 1023px
- Desktop: 1024px – 1535px
- Wide: 1536px+

**Luego**, diagnostica e implementa:

## Adapt Pass: [nombre del componente]

### Diagnóstico mobile (320px)

Emula mentalmente el componente a 320px de ancho:

- ¿Hay overflow horizontal? (texto, imágenes, flex items sin wrap)
- ¿Los touch targets son ≥ 44px × 44px?
- ¿El texto es ≥ 16px para no disparar zoom en iOS?
- ¿Hay funcionalidad crítica oculta con `hidden sm:block`?
- ¿Los inputs son usables en mobile (tamaño, spacing entre campos)?

### Fluid vs Breakpoint

Para cada valor fijo que varía entre viewports, evalúa:

- ¿Es mejor `clamp()` (variación continua) o un breakpoint discreto?
- Preferir `clamp()` para: font-size en headings, padding de secciones, gap en grids
- Preferir breakpoint para: cambios de layout (columnas, dirección flex, show/hide nav)

### Container queries para componentes

Si el componente puede aparecer en distintos contextos (sidebar, full-width, card):

```tsx
// Añadir @container al wrapper
<div className="@container">
  <div className="flex flex-col @md:flex-row">...</div>
</div>
```

### Grid responsivo

Para listas de cards, usar auto-fit en lugar de breakpoints manuales:

```css
grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
```

Esto elimina la necesidad de `sm:grid-cols-2 lg:grid-cols-3`.

### Imágenes

- ¿`next/image` con atributo `sizes` correcto?
- ¿El `sizes` refleja el tamaño real que ocupa en pantalla?
  ```tsx
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
  ```

### Tipografía responsiva

- ¿Los headings principales usan `clamp()` para escalar con el viewport?
- ¿El body text es siempre ≥ 16px en mobile (1rem)?
- ¿Los textos tienen `max-width: 65ch` para no ser demasiado anchos en pantallas grandes?

**Aplica todos los cambios directamente.** Prioriza los problemas de 320px primero.

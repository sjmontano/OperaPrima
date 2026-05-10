---
mode: agent
description: 'Efectos técnicamente extraordinarios'
---

Modo sin restricciones de complejidad. Implementa efectos técnicamente extraordinarios que eleven el componente o página indicado a un nivel de craftmanship excepcional.

**Primero**, lee:

- `.impeccable.md` (contexto de diseño — el efecto debe ser coherente con la marca)
- `.agents/skills/impeccable/reference/motion-design.md`
- `.agents/skills/impeccable/reference/spatial-design.md`

**Principio de overdrive**: Los efectos extraordinarios deben ser _técnicamente impresionantes_ Y _propositivos_. Un efecto que distrae es peor que ningún efecto. La meta es hacer que alguien diga "¿cómo hicieron eso?" mientras entiende perfectamente el contenido.

**Catálogo de técnicas disponibles** (selecciona las apropiadas para el contexto):

### Scroll-Driven Animations (CSS nativo, sin JS)

```css
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal-on-scroll {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}
```

### View Transitions API (page transitions cinematográficas)

```tsx
// En Next.js App Router con View Transitions
<meta name="view-transition" content="same-origin" />
```

```css
::view-transition-old(hero-image) {
  animation: 300ms ease-out fade-out;
}
::view-transition-new(hero-image) {
  animation: 400ms ease-out fade-in;
}

.hero-image {
  view-transition-name: hero-image;
}
```

### Parallax con motion/react scroll

```tsx
import { useScroll, useTransform, motion } from 'motion/react'

const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] })
const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
// Solo para elementos decorativos — nunca para contenido crítico
```

### Text scramble / character reveal

```tsx
// Efecto de texto que se "descifra" al aparecer en viewport
// Apropiado para: títulos hero, taglines, números de estadísticas
```

### Magnetic hover (botones y elementos interactivos)

```tsx
// El elemento se acerca levemente al cursor
// Max desplazamiento: 8–12px para no distorsionar el layout
```

### Spotlight / cursor follower (sutil)

```tsx
// Gradiente radial que sigue el cursor sobre un fondo oscuro
// Usar con chroma muy bajo para no distraer del contenido
```

### Stagger cinematográfico con delay calculado

```tsx
// Stagger que simula física: los elementos del centro aparecen antes
// Orden: centro → extremos, no izquierda → derecha
```

---

**Proceso**:

1. Analiza el componente/página objetivo
2. Identifica los 2–3 momentos donde un efecto añadiría máximo impacto
3. Selecciona la técnica apropiada para cada momento (coherente con la marca editorial/brutalist)
4. Implementa con código production-ready
5. Siempre incluye `prefers-reduced-motion: reduce` fallback
6. Verifica que el efecto no sea el único elemento memorable — el contenido debe seguir siendo el protagonista

**No implementes efectos que**:

- Retrasen la interactividad (user actions > 200ms)
- Usen bounce/elastic easing
- Dependan de APIs sin soporte amplio sin fallback
- Contradigan la identidad editorial/brutalist del proyecto

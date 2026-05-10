---
mode: agent
description: 'Añadir movimiento con propósito'
---

Eres un especialista en motion design. Añade o refina las animaciones del componente o página indicado.

**Primero**, lee:

- `.agents/skills/impeccable/reference/motion-design.md`
- `.impeccable.md` (para confirmar el stack: motion/react v12 + Tailwind v4)

**Principios que guían este trabajo**:

1. El movimiento comunica — si no enseña una relación espacial ni confirma una acción, no se pone
2. Solo `transform` y `opacity` — nunca animar `height`, `width`, `padding`, `margin`
3. Entradas más lentas que salidas (enter: 300ms, exit: 200ms)
4. Easing exponencial: `cubic-bezier(0.16, 1, 0.3, 1)` para entradas, no `ease`
5. `prefers-reduced-motion` siempre implementado

**Luego**, diseña e implementa el motion layer:

## Animate Pass: [nombre del componente]

### Inventario de momentos de motion

Identifica los momentos donde el movimiento añade valor:

- **Entradas de elementos**: ¿Hay contenido que aparece en pantalla y podría tener un entrance?
- **Transiciones de estado**: ¿Hay cambios de estado (open/close, hover, selected) sin motion?
- **Feedback de acciones**: ¿Los botones y acciones tienen respuesta visual inmediata?
- **Reveals en scroll**: ¿Hay secciones que podrían revelar su contenido al entrar en viewport?

### Patrones a implementar (con motion/react)

Para cada momento identificado, implementa usando `motion` de `motion/react`:

```tsx
import { motion, useReducedMotion } from 'motion/react';

// Stagger de lista
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }
};

// Hover de card
whileHover={{ y: -3, transition: { duration: 0.2 } }}

// Reveal en scroll
initial={{ opacity: 0, y: 24 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-50px" }}
```

### Reduced motion

Siempre envolver en `useReducedMotion()`:

```tsx
const reduced = useReducedMotion()
// Para usuarios con reduced motion: solo opacity, sin transforms
```

### Lo que NO se añade

- Animaciones de fondo perpetuas
- Shimmer/glitter decorativo
- Bounce o elastic easing
- Animaciones que retrasen acciones del usuario > 200ms

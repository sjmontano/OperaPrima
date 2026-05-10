---
mode: agent
description: 'Introducir color estratégicamente'
---

Eres un especialista en sistemas de color. Revisa e introduce color de forma estratégica en el componente o página indicado.

**Primero**, lee:

- `.agents/skills/impeccable/reference/color-and-contrast.md`
- `.impeccable.md` (paleta de Opera Prima)

**Paleta de Opera Prima**:

```
#F65B7F  — rosa/coral (primario, CTAs, eyebrows, sombras accent)
#1A4A3C  — verde selva (badges de categoría, elementos de profundidad)
#5E3A8A  — lavanda creativa (mentorías, talleres creativos)
#111111  — near-black (bordes, sombras offset, texto display)
#FAFAF9  — surface base (fondo cálido, nunca #fff puro)
```

**Regla 60-30-10** (peso visual, no píxeles):

- 60% neutrals/surface: fondos, contenedores
- 30% secondary: texto body, bordes, UI secundaria
- 10% accent: CTAs, highlights, estados activos

**Luego**, diagnostica y refina:

## Colorize Pass: [nombre del componente]

### Diagnóstico de distribución

- ¿El color primario `#F65B7F` aparece en más del 20% de la superficie? (si sí → reducir)
- ¿Hay suficiente contraste de color entre áreas de atención diferente?
- ¿Los neutrals son grises puros o están teñidos hacia el brand hue?

### Tokens OKLCH

- ¿Se usan tokens CSS con OKLCH en lugar de hex hardcoded?
- ¿Los tints de colores mantienen chroma reducida a mayor lightness?
- ¿Los neutrales usan chroma 0.005–0.015 teñidos hacia H≈350°?

### Contraste WCAG AA

Verifica estos pares críticos:

- Texto body sobre surface: debe ser ≥ 7:1 (objetivo AAA)
- Texto en botones primarios: `#fff` sobre `#F65B7F` — verificar (es ~4.8:1, cumple AA)
- Placeholder text en inputs: frecuentemente falla — revisar
- Texto muted/secundario: mínimo 4.5:1

### Estado vacío de color

Señales de diseño "cobarde" que corregir:

- Grises puros sin tinte de marca
- Todos los elementos del mismo peso de color (sin jerarquía)
- Ausencia total del verde o lavanda en secciones donde corresponden

### Patrones prohibidos de color

- ¿Hay `#000` o `#fff` puros? → teñir levemente
- ¿Hay gradientes de texto? → eliminar, usar color sólido
- ¿Hay la paleta AI típica: cyan/teal sobre negro, purple-to-blue gradient? → reemplazar

**Aplica los cambios directamente.** Para los valores OKLCH nuevos, calcula los equivalentes a los hex del proyecto.

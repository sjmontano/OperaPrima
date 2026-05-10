---
version: alpha
name: Opera Prima
description: Plataforma editorial para artistas emergentes colombianos. Combina mentorías 1:1, eventos y marketplace de oportunidades culturales.

colors:
  primary: '#F65B7F'
  primary-dark: '#D94268'
  green: '#1A4A3C'
  purple: '#5E3A8A'
  near-black: '#111111'
  surface: '#FAFAF9'
  surface-alt: '#F4F4F3'
  border: '#E4E4E7'
  text-primary: '#111111'
  text-secondary: '#52525B'
  text-muted: '#A1A1AA'
  white: '#FFFFFF'
  error: '#DC2626'
  success: '#16A34A'

typography:
  display-xl:
    fontFamily: Poppins
    fontSize: clamp(3rem, 6vw, 6rem)
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Poppins
    fontSize: clamp(2rem, 4vw, 3.5rem)
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: -0.03em
  h1:
    fontFamily: Poppins
    fontSize: clamp(1.75rem, 3vw, 2.5rem)
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.02em
  h2:
    fontFamily: Poppins
    fontSize: clamp(1.25rem, 2vw, 1.75rem)
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  h3:
    fontFamily: Poppins
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.3
  body-lg:
    fontFamily: Poppins
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: Poppins
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: Poppins
    fontSize: 0.75rem
    fontWeight: 700
    letterSpacing: 0.1em
  caption:
    fontFamily: Poppins
    fontSize: 0.6875rem
    fontWeight: 500
    letterSpacing: 0.06em

rounded:
  none: 0px
  sm: 2px
  md: 4px

spacing:
  xs: 4px
  sm: 8px
  sm2: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px

layout:
  columns: 12
  max-width: 1740px
  content-padding: 'clamp(1.5rem, 5vw, 6rem)'
  section-gap: 96px
  cluster-gap: 48px
  alignment: left
  rhythm: asymmetric

elevation:
  hover-card: '4px 4px 0 #111111'
  active-card: '2px 2px 0 #111111'
  button-primary: '4px 4px 0 #111111'
  overlay: 'rgba(0,0,0,0.7)'

motion:
  duration-fast: 120ms
  duration-base: 180ms
  duration-slow: 240ms
  easing-standard: 'cubic-bezier(0.2, 0, 0, 1)'
  easing-emphasis: 'cubic-bezier(0.16, 1, 0.3, 1)'
  reveal: fade-up
  stagger: staggered

components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.white}'
    rounded: '{rounded.none}'
    padding: '12px 24px'
  button-primary-hover:
    backgroundColor: '{colors.primary-dark}'
    textColor: '{colors.white}'
  button-secondary:
    backgroundColor: '{colors.white}'
    textColor: '{colors.near-black}'
    rounded: '{rounded.none}'
    padding: '10px 22px'
  card:
    backgroundColor: '{colors.white}'
    textColor: '{colors.text-primary}'
    rounded: '{rounded.none}'
  card-hover:
    backgroundColor: '{colors.white}'
    textColor: '{colors.text-primary}'
  input:
    backgroundColor: '{colors.white}'
    textColor: '{colors.text-primary}'
    rounded: '{rounded.none}'
---

## Design Standard

- .impeccable.md is the narrative source of truth for design decisions.
- DESIGN.md is the machine-readable token layer from the Google design standard.
- Keep both aligned; if they differ, update DESIGN.md to match .impeccable.md.

## Users

Artistas emergentes colombianos de 18 a 35 anos: musicos, artistas visuales, performers y disenadores. Buscan mentores, talleres, eventos, convocatorias, residencias y una comunidad real. Usan movil y desktop, en casa y en movimiento. Estado emocional: ambicion mezclada con incertidumbre.

## Brand Personality

Tres palabras: calida, editorial, latinoamericana.

- Calida pero profesional.
- Culturalmente arraigada en Colombia, sin folclorismo superficial.
- Editorial y de alto nivel: debe sentirse como revista cultural, no como SaaS generico.
- Emociones objetivo: confianza, pertenencia e inspiracion.

## Aesthetic Direction

Editorial limpio con audacia tipografica. Base blanco/crema, con secciones oscuras de alto contraste en el hero y el carrusel. Lineas estructurales como arquitectura visual, no decoracion.

## Overview

This file is the machine-readable token layer. Keep it aligned with .impeccable.md, which carries the narrative direction and has priority for design behavior.

**Editorial latinoamericana con brutalismo suave.** Opera Prima está diseñada para artistas emergentes colombianos (18–35 años): músicos, artistas visuales, performers, diseñadores. La interfaz debe sentirse como una revista cultural de alto nivel, no como un SaaS genérico. Cálida pero profesional, culturalmente arraigada sin folclorismo superficial.

El sistema gráfico combina:

- **Grid editorial** con líneas estructurales (`border-zinc-200`) como divisores que respiran
- **Brutalismo suave**: offset box-shadow `4px 4px 0 #111111` en hover, sin border-radius
- **Eyebrow labels** en rosa `#F65B7F` como firma Swiss Design consistente
- **Hero oscuro** de alto contraste + secciones claras en crema

## Colors

La paleta tiene un acento dominante y tres toques de identidad cultural:

- **Primary `#F65B7F`** — Rosa coral. Logo, CTAs, offset shadows, eyebrow labels, underlines activos. El color firma de la plataforma.
- **Green `#1A4A3C`** — Verde selva colombiana. Badges de categoría, elementos de profundidad, secciones sobre naturaleza/comunidad.
- **Purple `#5E3A8A`** — Lavanda creativa. Badges creativos, secciones de mentorías y talleres.
- **Near-black `#111111`** — Bordes pesados, sombras offset brutalist, texto de display.
- **Surface `#FAFAF9`** — Fondo base. Blanco cálido con tinte muy sutil — nunca `#fff` puro.

Los neutrales (`text-secondary`, `text-muted`, `border`) están levemente teñidos hacia el Rosa para cohesión subconsciente.

## Typography

Poppins es la fuente única del sistema. Se usa en 4 pesos (400, 500, 700, 800) con una escala de contraste pronunciado:

- **Display** (`display-xl`, `display-lg`): fluid con `clamp()`, weight 800, tracking muy negativo. Para heros y títulos de secciones impactantes.
- **Headings** (`h1`–`h3`): fluid o fijo, weight 700–800. Jerarquía clara con ratio mínimo 1.4× entre pasos.
- **Body** (`body-lg`, `body-md`): line-height generoso (1.65–1.7), max-width ~70ch.
- **Labels** (`label`, `caption`): ALL-CAPS, letter-spacing amplio, weight 700. Para eyebrows, tags, UI metadata.

Ratio entre pasos: mínimo 1.25×. La jerarquía debe ser inmediatamente legible.

## Layout

Grid de 12 columnas con `max-width: 1740px` (clase Tailwind `max-w-420`). El sistema respira con espacios generosos entre secciones:

- **Padding horizontal**: `clamp(1.5rem, 5vw, 6rem)` en contenedores principales
- **Gap entre secciones**: 96px entre bloques, 48px entre elementos relacionados
- **Columnas editoriales**: siempre alineadas al grid — nunca centered-everything

El layout es **left-aligned y asimétrico**. Las variaciones de padding crean jerarquía visual natural.

## Elevation & Depth

El sistema no usa `box-shadow` difuso. Usa sombras offset brutalist:

- **Hover card**: `4px 4px 0 #111111`
- **Active card**: `2px 2px 0 #111111`
- **Button primary**: `4px 4px 0 #111111`, se eleva a `5px 5px 0 #111111` en hover
- **Overlay/modal**: fondo negro semitransparente `rgba(0,0,0,0.7)` + blur mínimo

No se usan gradientes, glassmorphism ni shadows radiales.

## Shapes

`border-radius: 0` en toda la UI. El sistema es cuadrado, sin excepción:

- Cards: cuadradas
- Botones: cuadrados
- Inputs: cuadrados
- Badges: cuadrados con padding simétrico

Los únicos elementos con radius son avatares de usuario (`9999px`) y el toggle pill de la auth.

## Components

Los componentes clave siguen el patrón: borde 2px `#111111` + offset shadow 4px.

**Testimonial card**: `border: 2px solid #E4E4E7`, hover → `transform: translate(-3px,-3px)`, `box-shadow: 5px 5px 0 #F65B7F`, `border-color: #F65B7F`.

**Auth flip card**: `border-top: 3px solid #F65B7F`, otros bordes 2px `#111111`, shadow `5px 5px 0 #111111`.

**Botón primario**: fondo `#F65B7F`, texto blanco, sin radius, `box-shadow: 4px 4px 0 #111111`.

**Input**: fondo blanco, `border: 2px solid oklch(0.82 0 0)`, `box-shadow: 3px 3px 0 oklch(0.82 0 0)`, focus → color `#F65B7F`.

## Do's and Don'ts

**Do:**

- Usar eyebrow labels en `#F65B7F` antes de cada título de sección
- Usar offset shadows brutalist en hover de cards y botones
- Usar líneas `border-zinc-200` como estructura editorial, no decoración
- Alternar secciones claras (crema) y oscuras (negro editorial) para ritmo visual
- Fluid sizing con `clamp()` en display y headings

**Don't:**

- Usar `border-radius` salvo en avatares
- Usar gradientes de color en texto (gradient text)
- Usar glassmorphism o blur decorativo
- Usar layouts centrados genéricos — siempre left-aligned
- Anidar cards dentro de cards
- Usar Inter, DM Sans o cualquier fuente de la lista de rechazados del skill impeccable

## Design Principles

- Editorial sobre funcional. Cada seccion debe tener ritmo.
- Lineas como arquitectura. Los bordes y divisores crean jerarquia.
- Calor colombiano sin sobreuso. El blanco debe respirar.
- Movimiento con proposito. Stagger suave, blur-in, transiciones limpias, sin bounce.
- Tipografia ambiciosa. La jerarquia debe leerse de inmediato.

## Stack

- Next.js 16 App Router
- TypeScript strict
- Tailwind CSS v4
- shadcn/ui
- motion/react
- TimelineAnimation util ya creado
- Poppins via next/font/google
- Supabase, Stripe, headless CMS, Resend

## Google Design Notes

- Design tokens live in DESIGN.md.
- Use DESIGN.md for the machine-readable layer: colors, typography, spacing, radii, components.
- Prefer stable token names and explicit references.
- Add tokens first, then map component behavior.

## References

- UI layout editorial grid.
- Latin American cultural magazines.
- Whitney Museum.
- ZK/U Berlin.
- Nau Ivanow.
- Bauhaus-inspired bold editorial for the hero.

## Anti-references

- No Inter in display.
- No purple gradients.
- No glassmorphism.
- No nested cards.
- No generic SaaS layouts.
- No strange glyphs or corrupted punctuation.

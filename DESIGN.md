---
version: alpha
name: Opera Prima
description: Plataforma cultural para artistas emergentes hispanohablantes. Mentorías 1:1, eventos, tablero de oportunidades y comunidad.

colors:
  pink: '#F65B7F'
  blue-light: '#8ECAE6'
  blue-mid: '#4682B4'
  blue-dark: '#023047'
  dark: '#353535'
  near-black: '#0f0f0f'
  white: '#FFFFFF'
  border: '#E4E4E7'
  text-primary: '#353535'
  text-secondary: '#52525B'
  text-muted: '#A1A1AA'
  error: '#DC2626'
  success: '#16A34A'

typography:
  display-xl:
    fontFamily: Poppins
    fontSize: clamp(2.5rem, 6vw, 5rem)
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Poppins
    fontSize: clamp(2rem, 4vw, 3.5rem)
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.04em
  h1:
    fontFamily: Poppins
    fontSize: clamp(1.75rem, 3vw, 2.5rem)
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -0.04em
  h2:
    fontFamily: Poppins
    fontSize: clamp(1.5rem, 2.5vw, 2rem)
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Poppins
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.7
  body-md:
    fontFamily: Poppins
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.65
  eyebrow:
    fontFamily: Poppins
    fontSize: 0.62rem
    fontWeight: 700
    letterSpacing: 0.28em
    textTransform: uppercase
  label:
    fontFamily: Poppins
    fontSize: 0.75rem
    fontWeight: 700
    letterSpacing: 0.1em

rounded:
  none: 0px
  full: 9999px

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
  columns: 2
  max-width: 1740px
  side-margin: clamp(18px, 5vw, 100px)
  section-gap: 0px
  cluster-gap: 48px
  alignment: left
  rhythm: alternating

elevation:
  card-default: '4px 4px 0 {colors.dark}15'
  card-hover: '6px 6px 0 {colors.dark}30'
  color-card-default: '4px 4px 0 {colors.blue-dark}20'
  color-card-hover: '6px 6px 0 {colors.blue-dark}35'
  button-default: '4px 4px 0 {colors.dark}'
  button-active: '0 0 0 transparent'
  overlay: 'rgba(0,0,0,0.4)'

motion:
  duration-fast: 120ms
  duration-base: 180ms
  duration-slow: 300ms
  easing-standard: 'cubic-bezier(0.2, 0, 0, 1)'
  easing-emphasis: 'cubic-bezier(0.16, 1, 0.3, 1)'
  reveal: fade-up
  stagger: staggered

components:
  hero-section:
    backgroundColor: '{colors.near-black}'
    accentBar:
      height: 0.75px
      color: '{colors.pink}'
    radialGradient: 'ellipse_at_top_right,rgba(246,91,127,0.06),transparent_70%'
  section-white:
    backgroundColor: '{colors.white}'
    accentBar:
      height: 0.75px
      color: '{colors.pink}'
  section-color-block-blue:
    backgroundColor: '{colors.blue-light}'
    textColor: '{colors.white}'
    headingTextShadow: '2px 2px 0 {colors.blue-dark}'
  section-color-block-dark:
    backgroundColor: '{colors.blue-dark}'
    textColor: '{colors.white}'
    eyebrowColor: '{colors.blue-light}'
  service-card:
    backgroundColor: '{colors.white}'
    textColor: '{colors.text-primary}'
    border: '2px solid {colors.border}'
    hover: 'translateY(-4px)'
    iconBg: alternating '{colors.pink}' , '{colors.blue-light}'
    iconTextColor: '{colors.white}'
  cta-button-primary:
    backgroundColor: '{colors.pink}'
    textColor: '{colors.white}'
    border: '2px solid {colors.pink}'
    hover:
      backgroundColor: transparent
      textColor: '{colors.pink}'
      shadow: '4px 4px 0 {colors.dark}'
  cta-button-secondary:
    backgroundColor: transparent
    textColor: '{colors.white}'
    border: '2px solid rgba(255,255,255,0.2)'
    hover:
      border: '2px solid {colors.pink}'
      textColor: '{colors.white}'
  stat-box:
    backgroundColor: 'rgba(255,255,255,0.05)'
    border: '2px solid rgba(255,255,255,0.1)'
    shadow: '4px 4px 0 rgba(255,255,255,0.06)'
  highlight-list:
    backgroundColor: 'rgba(255,255,255,0.05)'
    border: '2px solid rgba(255,255,255,0.1)'
    iconColor: '{colors.pink}'
  button-blue-cta:
    backgroundColor: '{colors.white}'
    textColor: '{colors.blue-dark}'
    border: '2px solid {colors.white}'
    shadow: '4px 4px 0 rgba(0,0,0,0.12)'
  button-dark-cta:
    backgroundColor: '{colors.blue-light}'
    textColor: '{colors.blue-dark}'
    border: '2px solid {colors.blue-dark}'
    shadow: '4px 4px 0 rgba(0,0,0,0.2)'
    hover:
      backgroundColor: '{colors.white}'
      textColor: '{colors.blue-dark}'
      border: '2px solid {colors.white}'
---

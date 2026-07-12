export type FieldType =
  | 'text'
  | 'richtext'
  | 'image'
  | 'boolean'
  | 'number'
  | 'color'
  | 'array'
  | 'object'
  | 'cta'

export interface FieldSchema {
  key: string
  label: string
  type: FieldType
  fields?: FieldSchema[]
  default?: unknown
  required?: boolean
  placeholder?: string
  maxItems?: number
  description?: string
}

export interface BlockSchema {
  type: string
  label: string
  category: 'Content' | 'Section' | 'Component'
  fields: FieldSchema[]
  defaultProps: Record<string, unknown>
}

export const BLOCK_SCHEMAS: Record<string, BlockSchema> = {
  'hero-carousel': {
    type: 'hero-carousel',
    label: 'Carrusel Hero',
    category: 'Section',
    fields: [
      {
        key: 'slides',
        label: 'Slides',
        type: 'array',
        maxItems: 6,
        fields: [
          { key: 'tag', label: 'Etiqueta', type: 'text' },
          { key: 'headline', label: 'Título', type: 'richtext' },
          { key: 'subtext', label: 'Subtítulo', type: 'richtext' },
          { key: 'bgImage', label: 'Imagen de fondo', type: 'image' },
          { key: 'accent', label: 'Color acento', type: 'color' },
          {
            key: 'cta',
            label: 'CTA',
            type: 'object',
            fields: [
              { key: 'label', label: 'Texto', type: 'text' },
              { key: 'href', label: 'Enlace', type: 'text' },
            ],
          },
          {
            key: 'secondaryCta',
            label: 'CTA secundario',
            type: 'object',
            fields: [
              { key: 'label', label: 'Texto', type: 'text' },
              { key: 'href', label: 'Enlace', type: 'text' },
            ],
          },
        ],
      },
      { key: 'autoPlayInterval', label: 'Intervalo (ms)', type: 'number', default: 5000 },
      { key: 'transitionDuration', label: 'Duración transición', type: 'number', default: 0.7 },
    ],
    defaultProps: { slides: [] },
  },

  'what-is': {
    type: 'what-is',
    label: '¿Qué es Opera Prima?',
    category: 'Section',
    fields: [
      { key: 'eyebrow', label: 'Etiqueta', type: 'text', default: '¿Qué es Opera Prima?' },
      { key: 'heading', label: 'Título', type: 'richtext', default: 'Bienvenido a Ópera Prima' },
      { key: 'description', label: 'Descripción', type: 'richtext' },
      { key: 'description2', label: 'Descripción 2', type: 'richtext' },
      {
        key: 'serviceEyebrow',
        label: 'Etiqueta servicios',
        type: 'text',
        default: 'Nuestros servicios',
      },
      { key: 'serviceHeading', label: 'Título servicios', type: 'richtext' },
      {
        key: 'cards',
        label: 'Tarjetas de servicio',
        type: 'array',
        maxItems: 8,
        fields: [
          { key: 'num', label: 'Número', type: 'text' },
          { key: 'icon', label: 'Icono', type: 'text' },
          { key: 'title', label: 'Título', type: 'text' },
          { key: 'desc', label: 'Descripción', type: 'richtext' },
          { key: 'accent', label: 'Color acento', type: 'color' },
          { key: 'href', label: 'Enlace', type: 'text' },
        ],
      },
    ],
    defaultProps: {},
  },

  'comunidad-cta': {
    type: 'comunidad-cta',
    label: 'CTA Comunidad',
    category: 'Section',
    fields: [
      { key: 'eyebrow', label: 'Etiqueta', type: 'text', default: 'Únete a la comunidad' },
      { key: 'headline', label: 'Título', type: 'richtext' },
      { key: 'description', label: 'Descripción', type: 'richtext' },
      {
        key: 'stats',
        label: 'Estadísticas',
        type: 'array',
        maxItems: 4,
        fields: [
          { key: 'icon', label: 'Icono', type: 'text' },
          { key: 'end', label: 'Valor final', type: 'number' },
          { key: 'thousands', label: '¿En miles?', type: 'boolean' },
          { key: 'suffix', label: 'Sufijo', type: 'text' },
          { key: 'label', label: 'Etiqueta', type: 'text' },
        ],
      },
      {
        key: 'primaryCta',
        label: 'CTA principal',
        type: 'object',
        fields: [
          { key: 'label', label: 'Texto', type: 'text' },
          { key: 'href', label: 'Enlace', type: 'text' },
        ],
      },
      {
        key: 'secondaryCta',
        label: 'CTA secundario',
        type: 'object',
        fields: [
          { key: 'label', label: 'Texto', type: 'text' },
          { key: 'href', label: 'Enlace', type: 'text' },
        ],
      },
    ],
    defaultProps: {},
  },

  testimonials: {
    type: 'testimonials',
    label: 'Muro de Testimonios',
    category: 'Section',
    fields: [
      {
        key: 'testimonialEyebrow',
        label: 'Etiqueta',
        type: 'text',
        default: 'Comunidad Opera Prima',
      },
      { key: 'headline', label: 'Título', type: 'richtext' },
      {
        key: 'testimonials',
        label: 'Testimonios',
        type: 'array',
        maxItems: 20,
        fields: [
          { key: 'name', label: 'Nombre', type: 'text' },
          { key: 'handle', label: '@handle', type: 'text' },
          { key: 'text', label: 'Texto', type: 'richtext' },
          { key: 'avatar', label: 'Avatar', type: 'image' },
        ],
      },
    ],
    defaultProps: {},
  },

  partners: {
    type: 'partners',
    label: 'Aliados',
    category: 'Section',
    fields: [
      { key: 'eyebrow', label: 'Etiqueta', type: 'text', default: 'Aliados y Red' },
      { key: 'heading', label: 'Título', type: 'richtext' },
      { key: 'description', label: 'Descripción', type: 'richtext' },
      {
        key: 'partners',
        label: 'Aliados',
        type: 'array',
        maxItems: 20,
        fields: [
          { key: 'name', label: 'Nombre', type: 'text' },
          { key: 'src', label: 'Logo', type: 'image' },
        ],
      },
      { key: 'ctaText', label: 'Texto CTA', type: 'text' },
      { key: 'ctaEmail', label: 'Email CTA', type: 'text' },
    ],
    defaultProps: {},
  },

  'events-opera-prima': {
    type: 'events-opera-prima',
    label: 'Eventos Opera Prima',
    category: 'Section',
    fields: [],
    defaultProps: {},
  },

  'events-comunidad': {
    type: 'events-comunidad',
    label: 'Eventos Comunidad',
    category: 'Section',
    fields: [],
    defaultProps: {},
  },

  'events-landing': {
    type: 'events-landing',
    label: 'Hero Eventos',
    category: 'Section',
    fields: [
      {
        key: 'heading',
        label: 'Título',
        type: 'richtext',
        default: 'Aprende, conecta y <span class="text-[#F65B7F]">crece con método.</span>',
      },
      { key: 'description', label: 'Descripción', type: 'richtext' },
      { key: 'typewriterLabel', label: 'Etiqueta typewriter', type: 'text', default: 'Aprende a' },
      {
        key: 'typewriterWords',
        label: 'Palabras typewriter',
        type: 'array',
        maxItems: 10,
        fields: [{ key: 'item', label: 'Frase', type: 'text' }],
      },
      {
        key: 'highlights',
        label: 'Destacados',
        type: 'array',
        maxItems: 6,
        fields: [{ key: 'item', label: 'Texto', type: 'text' }],
      },
      {
        key: 'infoCards',
        label: 'Tarjetas informativas',
        type: 'array',
        maxItems: 6,
        fields: [
          { key: 'eyebrow', label: 'Etiqueta', type: 'text' },
          { key: 'title', label: 'Título', type: 'text' },
          { key: 'body', label: 'Cuerpo', type: 'richtext' },
          { key: 'accent', label: 'Color acento', type: 'color' },
          { key: 'icon', label: 'Icono', type: 'text' },
        ],
      },
      { key: 'calendarText', label: 'Texto calendario', type: 'richtext' },
      { key: 'ctaText', label: 'Texto CTA', type: 'text', default: 'Ver eventos' },
      {
        key: 'guestCtaText',
        label: 'Texto CTA invitado',
        type: 'text',
        default: 'Comenzar gratis',
      },
      {
        key: 'secondaryCtaText',
        label: 'Texto CTA secundario',
        type: 'text',
        default: 'Ver próximos talleres',
      },
      { key: 'bottomDescription', label: 'Descripción inferior', type: 'richtext' },
    ],
    defaultProps: {},
  },

  'events-mentor': {
    type: 'events-mentor',
    label: 'Próximos Eventos',
    category: 'Section',
    fields: [
      { key: 'eyebrow', label: 'Etiqueta', type: 'text', default: 'Eventos de Ópera Prima' },
      {
        key: 'headingLogged',
        label: 'Título (logueado)',
        type: 'richtext',
        default: '¿Qué está pasando?',
      },
      {
        key: 'headingGuest',
        label: 'Título (invitado)',
        type: 'richtext',
        default: 'Explora Ópera Prima',
      },
      { key: 'emptyTitle', label: 'Título vacío', type: 'text', default: 'Sin resultados' },
      {
        key: 'emptyDescription',
        label: 'Descripción vacía',
        type: 'richtext',
        default: 'No encontramos eventos con esos criterios.',
      },
      {
        key: 'searchPlaceholder',
        label: 'Placeholder búsqueda',
        type: 'text',
        default: 'Buscar eventos…',
      },
      {
        key: 'createButtonText',
        label: 'Texto crear evento',
        type: 'text',
        default: '+ Crear evento',
      },
    ],
    defaultProps: {},
  },

  'comunidad-landing': {
    type: 'comunidad-landing',
    label: 'Hero Comunidad',
    category: 'Section',
    fields: [
      { key: 'eyebrow', label: 'Etiqueta', type: 'text', default: 'Comunidad' },
      {
        key: 'heading',
        label: 'Título',
        type: 'richtext',
        default: 'Bienvenidx a <span class="text-[#F65B7F]">Ópera Prima</span>',
      },
      { key: 'description', label: 'Descripción', type: 'richtext' },
      { key: 'description2', label: 'Descripción 2', type: 'richtext' },
      { key: 'listEyebrow', label: 'Etiqueta lista', type: 'text', default: 'Puedes encontrar' },
      {
        key: 'listItems',
        label: 'Items de lista',
        type: 'array',
        maxItems: 10,
        fields: [{ key: 'item', label: 'Texto', type: 'text' }],
      },
      { key: 'ctaLoggedText', label: 'CTA logueado', type: 'text', default: 'Ir a la comunidad' },
      { key: 'ctaGuestText', label: 'CTA invitado', type: 'text', default: 'Únete a la comunidad' },
      { key: 'secondaryCtaText', label: 'CTA secundario', type: 'text', default: 'Ver eventos' },
      {
        key: 'statsEyebrow',
        label: 'Etiqueta estadísticas',
        type: 'text',
        default: 'La comunidad en cifras',
      },
      {
        key: 'stats',
        label: 'Estadísticas',
        type: 'array',
        maxItems: 6,
        fields: [
          { key: 'number', label: 'Número', type: 'text' },
          { key: 'label', label: 'Etiqueta', type: 'text' },
          { key: 'accent', label: 'Color acento', type: 'color' },
        ],
      },
    ],
    defaultProps: {},
  },

  'community-artists': {
    type: 'community-artists',
    label: 'Artistas Comunidad',
    category: 'Section',
    fields: [],
    defaultProps: {},
  },

  'mentorias-landing': {
    type: 'mentorias-landing',
    label: 'Landing Mentorías',
    category: 'Section',
    fields: [
      { key: 'eyebrow', label: 'Etiqueta', type: 'text', default: 'Mentorías a la medida' },
      {
        key: 'heading',
        label: 'Título',
        type: 'richtext',
        default: 'NO ESTÁS <span class="text-[#F65B7F]">SOLO</span>',
      },
      { key: 'description', label: 'Descripción', type: 'richtext' },
      { key: 'description2', label: 'Descripción 2', type: 'richtext' },
      {
        key: 'rotatingLabel',
        label: 'Etiqueta rotativa',
        type: 'text',
        default: '¿Te identificas con esto?',
      },
      { key: 'ctaLoggedText', label: 'CTA logueado', type: 'text', default: 'Ver mentores' },
      { key: 'ctaGuestText', label: 'CTA invitado', type: 'text', default: 'Reservar mentoría' },
      { key: 'secondaryCtaText', label: 'CTA secundario', type: 'text', default: 'Ver perfiles' },
      { key: 'asideEyebrow', label: 'Etiqueta aside', type: 'text', default: 'Puedes trabajar en' },
      {
        key: 'asideItems',
        label: 'Items aside',
        type: 'array',
        maxItems: 10,
        fields: [{ key: 'item', label: 'Texto', type: 'text' }],
      },
      {
        key: 'bannerText',
        label: 'Texto banner',
        type: 'richtext',
        default: 'Mentores expertos en diferentes áreas listos para ayudarte.',
      },
    ],
    defaultProps: {},
  },

  'proyectos-landing': {
    type: 'proyectos-landing',
    label: 'Hero Tablero',
    category: 'Section',
    fields: [
      { key: 'eyebrow', label: 'Etiqueta', type: 'text', default: 'Tablero de Oportunidades' },
      {
        key: 'heading',
        label: 'Título',
        type: 'richtext',
        default: 'Encuentra tu <span class="text-[#8ECAE6]">próximo proyecto</span>',
      },
      { key: 'description', label: 'Descripción', type: 'richtext' },
      { key: 'description2', label: 'Descripción 2', type: 'richtext' },
      {
        key: 'listEyebrow',
        label: 'Etiqueta lista',
        type: 'text',
        default: 'Tipos de oportunidades',
      },
      {
        key: 'listItems',
        label: 'Items de lista',
        type: 'array',
        maxItems: 10,
        fields: [{ key: 'item', label: 'Texto', type: 'text' }],
      },
      { key: 'buttonText', label: 'Texto botón', type: 'text', default: 'Ver proyectos' },
      { key: 'loggedButtonText', label: 'Botón logueado', type: 'text', default: 'Ir a proyectos' },
      {
        key: 'guestButtonText',
        label: 'Botón invitado',
        type: 'text',
        default: 'Publica tu proyecto',
      },
      { key: 'asideEyebrow', label: 'Etiqueta aside', type: 'text', default: 'Puedes trabajar en' },
      {
        key: 'asideItems',
        label: 'Items aside',
        type: 'array',
        maxItems: 10,
        fields: [{ key: 'item', label: 'Texto', type: 'text' }],
      },
    ],
    defaultProps: {},
  },

  'proyectos-section': {
    type: 'proyectos-section',
    label: 'Proyectos',
    category: 'Section',
    fields: [],
    defaultProps: {},
  },

  'proyectos-destacados': {
    type: 'proyectos-destacados',
    label: 'Proyectos Destacados',
    category: 'Section',
    fields: [],
    defaultProps: {},
  },

  disclaimer: {
    type: 'disclaimer',
    label: 'Disclaimer',
    category: 'Component',
    fields: [
      { key: 'eyebrow', label: 'Etiqueta', type: 'text', default: 'Aviso de responsabilidad' },
      { key: 'content', label: 'Contenido', type: 'richtext' },
    ],
    defaultProps: {},
  },

  'sobre-landing': {
    type: 'sobre-landing',
    label: 'Hero Sobre',
    category: 'Section',
    fields: [
      { key: 'heroEyebrow', label: 'Etiqueta hero', type: 'text', default: 'Sobre la plataforma' },
      {
        key: 'heroHeading',
        label: 'Título hero',
        type: 'richtext',
        default: 'Ópera <span class="text-[#F65B7F]">Prima</span>',
      },
      { key: 'heroDescription', label: 'Descripción hero', type: 'richtext' },
      { key: 'heroDescription2', label: 'Descripción hero 2', type: 'richtext' },
      {
        key: 'heroCtaLoggedText',
        label: 'CTA logueado',
        type: 'text',
        default: 'Ir a la comunidad',
      },
      {
        key: 'heroCtaGuestText',
        label: 'CTA invitado',
        type: 'text',
        default: 'Únete a la comunidad',
      },
      { key: 'misionEyebrow', label: 'Etiqueta misión', type: 'text', default: 'Nuestra Misión' },
      {
        key: 'misionTitle',
        label: 'Título misión',
        type: 'richtext',
        default: 'Acortar la distancia entre la formación y la profesión.',
      },
      { key: 'misionDescription', label: 'Descripción misión', type: 'richtext' },
      { key: 'visionEyebrow', label: 'Etiqueta visión', type: 'text', default: 'Nuestra Visión' },
      {
        key: 'visionTitle',
        label: 'Título visión',
        type: 'richtext',
        default: 'Ser el puente que el talento hispanohablante necesita.',
      },
      { key: 'visionDescription', label: 'Descripción visión', type: 'richtext' },
      {
        key: 'valoresEyebrow',
        label: 'Etiqueta valores',
        type: 'text',
        default: 'Nuestros valores',
      },
      {
        key: 'valoresTitle',
        label: 'Título valores',
        type: 'richtext',
        default: 'Lo que nos mueve',
      },
      {
        key: 'plataformaEyebrow',
        label: 'Etiqueta plataforma',
        type: 'text',
        default: 'La plataforma',
      },
      {
        key: 'plataformaTitle',
        label: 'Título plataforma',
        type: 'richtext',
        default: 'Un espacio para <span class="text-[#F65B7F]">artistas emergentes.</span>',
      },
      {
        key: 'testimonioEyebrow',
        label: 'Etiqueta testimonios',
        type: 'text',
        default: 'La comunidad',
      },
      {
        key: 'testimonioHeadline',
        label: 'Título testimonios',
        type: 'richtext',
        default: 'Esto dicen los artistas de nuestra comunidad',
      },
      { key: 'equipoEyebrow', label: 'Etiqueta equipo', type: 'text', default: 'El equipo' },
      {
        key: 'equipoTitle',
        label: 'Título equipo',
        type: 'richtext',
        default: 'Detrás de Ópera Prima',
      },
    ],
    defaultProps: {},
  },
}

export function getBlockSchema(type: string): BlockSchema | undefined {
  return BLOCK_SCHEMAS[type]
}

export function isContentBlock(type: string): boolean {
  const schema = BLOCK_SCHEMAS[type]
  return !!schema && schema.fields.length > 0
}

export function getContentBlockTypes(): string[] {
  return Object.entries(BLOCK_SCHEMAS)
    .filter(([, s]) => s.fields.length > 0)
    .map(([type]) => type)
}

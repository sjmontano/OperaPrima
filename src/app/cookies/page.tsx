import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies | Ópera Prima',
  description:
    'Política de cookies de Ópera Prima. Información sobre los tipos de cookies utilizadas y cómo gestionarlas.',
}

const cookieTypes = [
  {
    category: 'Cookies Técnicas o Esenciales',
    purpose: 'Necesarias para el funcionamiento básico de la plataforma.',
    examples: [
      {
        name: 'sb-auth-token',
        description: 'Cookie de autenticación de Supabase. Permite mantener la sesión iniciada.',
        duration: 'Sesión / Persistente',
      },
      {
        name: 'next-auth.session-token',
        description: 'Cookie de sesión de Next.js. Necesaria para la navegación autenticada.',
        duration: 'Sesión',
      },
      {
        name: 'XSRF-TOKEN',
        description: 'Protección contra falsificación de solicitudes entre sitios (CSRF).',
        duration: 'Sesión',
      },
    ],
  },
  {
    category: 'Cookies Funcionales',
    purpose: 'Permiten recordar preferencias del usuario para mejorar la experiencia.',
    examples: [
      {
        name: 'op-prefs',
        description: 'Almacena preferencias de visualización del usuario (idioma, tema, etc.).',
        duration: '1 año',
      },
      {
        name: 'op-cookies-accepted',
        description: 'Registra si el usuario ha aceptado la política de cookies.',
        duration: '1 año',
      },
    ],
  },
  {
    category: 'Cookies de Análisis',
    purpose:
      'Recogen información anónima sobre el uso de la plataforma para mejorar su funcionamiento.',
    examples: [
      {
        name: '_ga',
        description: 'Cookie de Google Analytics. Distingue usuarios únicos.',
        duration: '2 años',
      },
      {
        name: '_ga_*',
        description: 'Cookie de Google Analytics. Persistencia de sesión.',
        duration: '2 años',
      },
      {
        name: '_gid',
        description: 'Cookie de Google Analytics. Identificador de sesión.',
        duration: '24 horas',
      },
    ],
  },
]

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col bg-[#F0F8FF]">
        <article className="mx-auto w-full max-w-3xl px-6 py-20">
          <div className="mb-12">
            <p className="mb-2 text-xs font-semibold tracking-wider text-[#023047] uppercase">
              Documento legal
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[#111]">Política de Cookies</h1>
            <p className="mt-3 text-sm text-[#52525B]">
              Ópera Prima &mdash; Última actualización: Mayo 2026
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-[#52525B]">
              En Ópera Prima utilizamos cookies y tecnologías similares para garantizar el correcto
              funcionamiento de la plataforma, mejorar tu experiencia y analizar el uso que haces de
              nuestros servicios. Esta Política de Cookies explica qué son las cookies, qué tipos
              utilizamos y cómo puedes gestionarlas.
            </p>

            <section>
              <h2 className="mb-3 text-lg font-bold text-[#111]">1. ¿Qué son las cookies?</h2>
              <p className="text-sm leading-relaxed text-[#52525B]">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo
                (ordenador, tableta, teléfono móvil) cuando visitas un sitio web. Permiten que el
                sitio web recuerde tus preferencias y acciones durante un período de tiempo, para
                que no tengas que volver a introducirlas cada vez que nos visites.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-[#111]">
                2. Tipos de cookies que utilizamos
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-[#52525B]">
                A continuación se detallan las cookies que podemos utilizar en Ópera Prima,
                clasificadas por categoría:
              </p>

              {cookieTypes.map((type, i) => (
                <div key={i} className="mb-8">
                  <h3 className="mb-2 text-base font-bold text-[#111]">
                    {i + 2}.1. {type.category}
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed text-[#52525B]">{type.purpose}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#E4E4E7]">
                          <th className="py-2 pr-4 text-left font-bold text-[#111]">Cookie</th>
                          <th className="py-2 pr-4 text-left font-bold text-[#111]">Descripción</th>
                          <th className="py-2 text-right font-bold text-[#111]">Duración</th>
                        </tr>
                      </thead>
                      <tbody>
                        {type.examples.map((cookie, j) => (
                          <tr key={j} className="border-b border-[#E4E4E7]">
                            <td className="py-2 pr-4 font-mono text-xs text-[#52525B]">
                              {cookie.name}
                            </td>
                            <td className="py-2 pr-4 text-[#52525B]">{cookie.description}</td>
                            <td className="py-2 text-right whitespace-nowrap text-[#52525B]">
                              {cookie.duration}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-[#111]">5. Gestión de cookies</h2>
              <p className="text-sm leading-relaxed text-[#52525B]">
                Puedes gestionar y/o eliminar las cookies en cualquier momento desde la
                configuración de tu navegador. A continuación te indicamos los enlaces a las páginas
                de configuración de los navegadores más utilizados:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#52525B]">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#023047] underline hover:text-[#023047]"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#023047] underline hover:text-[#023047]"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#023047] underline hover:text-[#023047]"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#023047] underline hover:text-[#023047]"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-[#111]">6. Cookies de terceros</h2>
              <p className="text-sm leading-relaxed text-[#52525B]">
                En Ópera Prima utilizamos servicios de terceros que pueden establecer cookies en tu
                dispositivo. Estos terceros incluyen a Google Analytics (análisis de uso), Supabase
                (autenticación y base de datos), Vercel (alojamiento) y Stripe (procesamiento de
                pagos). Te recomendamos consultar sus respectivas políticas de cookies para obtener
                información detallada sobre el tratamiento de tus datos.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-bold text-[#111]">7. Actualizaciones</h2>
              <p className="text-sm leading-relaxed text-[#52525B]">
                Esta Política de Cookies puede ser actualizada periódicamente para reflejar cambios
                en las cookies que utilizamos o en la normativa aplicable. Te notificaremos
                cualquier cambio significativo a través de la plataforma o por correo electrónico.
                Te recomendamos revisar esta página periódicamente para mantenerte informado.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}

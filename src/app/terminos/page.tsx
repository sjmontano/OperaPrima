import { ContentFrame } from '@/components/layout/ContentFrame'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Ópera Prima',
  description:
    'Términos y condiciones de uso de la plataforma Ópera Prima para artistas emergentes.',
}

const sections = [
  {
    num: 1,
    title: 'IDENTIFICACIÓN DEL TITULAR',
    content:
      'La plataforma es gestionada por una profesional autónoma establecida en España, actuando bajo el nombre comercial "Ópera Prima". La actividad se desarrolla conforme al Reglamento General de Protección de Datos (RGPD) de la Unión Europea, la Ley Orgánica de Protección de Datos y Garantía de Derechos Digitales (LOPDGDD), la Ley de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE) y demás normativa española y europea aplicable.',
  },
  {
    num: 2,
    title: 'MAYORÍA DE EDAD',
    content:
      'El acceso y registro en Ópera Prima está permitido únicamente a personas mayores de 18 años. Al registrarse, el usuario declara y garantiza que tiene capacidad legal suficiente para contratar y utilizar la plataforma, y que toda la información proporcionada es veraz y actualizada. Ópera Prima podrá suspender o eliminar cualquier cuenta respecto de la cual existan indicios de incumplimiento de esta condición.',
  },
  {
    num: 3,
    title: 'NATURALEZA DE LA PLATAFORMA',
    content:
      'Ópera Prima funciona como comunidad artística digital, espacio de networking, plataforma de difusión cultural, entorno de visibilización profesional y canal de conexión entre usuarios, artistas, instituciones y entidades culturales. Ópera Prima actúa exclusivamente como intermediario tecnológico y comunitario. La plataforma NO garantiza oportunidades laborales, contrataciones, convocatorias, representación artística, ni resultados profesionales o económicos. Tampoco participa en acuerdos privados entre usuarios, ni actúa como agencia de empleo o representante artístico.',
  },
  {
    num: 4,
    title: 'REGISTRO DE USUARIOS',
    content:
      'Los usuarios podrán crear perfiles públicos dentro de la plataforma incluyendo, entre otros: nombre artístico o pseudónimo, fotografías, videos, biografía, portafolio, muestras de trabajo, enlaces externos, redes sociales y disciplinas artísticas. El usuario será el único responsable del contenido publicado en su perfil. Ópera Prima no garantiza la veracidad, autenticidad o legalidad de la información compartida por terceros.',
  },
  {
    num: 5,
    title: 'CONTENIDO GENERADO POR USUARIOS',
    content:
      'Los usuarios podrán publicar contenido artístico y profesional dentro de la plataforma. Al publicar contenido, el usuario declara y garantiza que posee los derechos necesarios sobre dicho contenido, que no infringe derechos de terceros, que no utiliza material plagiado o ilegal, y que cuenta con autorización para compartir imágenes, obras o materiales publicados. El usuario será el único responsable de las consecuencias legales derivadas del contenido que publique. Ópera Prima no realiza una supervisión previa exhaustiva de las publicaciones realizadas por los usuarios y no será responsable por plagios, infracciones de copyright, conflictos de autoría, uso indebido de obras o reclamaciones entre terceros. Cualquier conflicto relacionado con propiedad intelectual será responsabilidad exclusiva de las partes implicadas.',
  },
  {
    num: 6,
    title: 'LICENCIA DE USO DE CONTENIDO',
    content:
      'El usuario conserva en todo momento la propiedad intelectual de sus obras y contenidos. Sin embargo, al publicar contenido en la plataforma, concede a Ópera Prima una licencia no exclusiva, gratuita, revocable e internacional para mostrar contenido dentro de la plataforma, promocionar la comunidad, difundir proyectos y artistas, realizar publicaciones en redes sociales, e incluir contenido en newsletters, campañas y materiales promocionales. Ópera Prima no adquiere titularidad sobre las obras publicadas.',
  },
  {
    num: 7,
    title: 'MENSAJERÍA E INTERACCIONES ENTRE USUARIOS',
    content:
      'La plataforma podrá incluir sistemas de mensajería o comunicación entre usuarios. Ópera Prima no supervisa permanentemente las comunicaciones privadas y no será responsable por conflictos entre usuarios, acoso, fraude, estafas, acuerdos económicos, colaboraciones externas, daños derivados de interacciones privadas o conductas inapropiadas de terceros. Los usuarios interactúan bajo su propia responsabilidad.',
  },
  {
    num: 8,
    title: 'CONVOCATORIAS Y OPORTUNIDADES',
    content:
      'Ópera Prima podrá permitir la publicación de convocatorias, castings, becas, residencias, oportunidades laborales, eventos, colaboraciones y actividades culturales. Ópera Prima no garantiza la autenticidad de las ofertas, la legalidad de las convocatorias ni los resultados derivados de dichas oportunidades. La plataforma no participa en negociaciones ni acuerdos celebrados entre terceros.',
  },
  {
    num: 9,
    title: 'NORMAS DE COMUNIDAD',
    content:
      'Queda estrictamente prohibido acosar o intimidar a otros usuarios, discriminar, difundir discursos de odio, publicar contenido ilegal, realizar spam, suplantar identidades, publicar convocatorias fraudulentas, plagiar obras, difundir malware o contenido dañino, utilizar la plataforma para actividades ilícitas, compartir contenido sexual explícito, manipular información profesional, o utilizar IA de forma engañosa o fraudulenta. Los usuarios deberán indicar cuando un contenido haya sido generado o alterado significativamente mediante inteligencia artificial.',
  },
  {
    num: 10,
    title: 'MODERACIÓN Y SUSPENSIÓN DE CUENTAS',
    content:
      'Ópera Prima podrá moderar contenido, eliminar publicaciones, bloquear perfiles, restringir accesos, suspender cuentas temporal o permanentemente, y cancelar funcionalidades o servicios. Estas medidas podrán aplicarse sin previo aviso en casos graves o cuando exista incumplimiento legal, riesgo reputacional, riesgo de seguridad, vulneración de normas comunitarias o comportamiento perjudicial para la comunidad o la plataforma. Ópera Prima se reserva el derecho exclusivo de interpretar y valorar el incumplimiento de estas normas.',
  },
  {
    num: 11,
    title: 'PUBLICIDAD Y CONTENIDO PATROCINADO',
    content:
      'Ópera Prima podrá incluir publicidad, newsletters patrocinadas, contenido promocional, colaboraciones comerciales, convocatorias destacadas y espacios publicitarios para terceros. La plataforma no garantiza ni responde por productos, servicios, actividades, convocatorias, promociones o actuaciones de anunciantes o patrocinadores. Toda relación comercial entre usuarios y terceros será ajena a Ópera Prima.',
  },
  {
    num: 12,
    title: 'SERVICIOS DE PAGO',
    content:
      'La plataforma podrá ofrecer servicios de pago como talleres, mentorías, eventos, actividades formativas y experiencias de networking. Las condiciones económicas y de contratación específicas serán informadas y aceptadas individualmente en cada servicio correspondiente.',
  },
  {
    num: 13,
    title: 'LIMITACIÓN DE RESPONSABILIDAD',
    content:
      'Ópera Prima presta sus servicios "tal cual" y según disponibilidad. La plataforma no garantiza funcionamiento ininterrumpido, ausencia de errores, disponibilidad permanente, compatibilidad tecnológica, ni ausencia de virus o ataques externos. Ópera Prima no será responsable por pérdidas económicas, daños indirectos, pérdida de datos, conflictos entre usuarios, actuaciones de terceros, contenido publicado por usuarios, decisiones profesionales tomadas por los usuarios, ni resultados derivados del uso de la plataforma.',
  },
  {
    num: 14,
    title: 'DENUNCIAS Y RETIRADA DE CONTENIDO',
    content:
      'Los usuarios podrán denunciar perfiles, publicaciones, mensajes, convocatorias y comportamientos inapropiados. Ópera Prima podrá revisar y retirar contenido cuando lo considere necesario para proteger la comunidad, la legalidad, la seguridad y el funcionamiento de la plataforma. La plataforma no garantiza una supervisión inmediata ni permanente.',
  },
  {
    num: 15,
    title: 'COLABORACIÓN CON AUTORIDADES',
    content:
      'Ópera Prima podrá colaborar con autoridades competentes cuando exista una obligación legal válida. En dichos casos, únicamente se facilitará la información estrictamente requerida conforme a la legislación aplicable. Ópera Prima no actúa como entidad investigadora ni como mediadora legal entre usuarios.',
  },
  {
    num: 16,
    title: 'PRIVACIDAD Y PROTECCIÓN DE DATOS',
    content:
      'El tratamiento de datos personales se realizará conforme a la Política de Privacidad y la normativa europea vigente en materia de protección de datos. El usuario podrá ejercer sus derechos de acceso, rectificación, eliminación, oposición, limitación y portabilidad.',
  },
  {
    num: 17,
    title: 'NEWSLETTER Y COMUNICACIONES COMERCIALES',
    content:
      'Ópera Prima podrá enviar newsletters, información cultural, oportunidades, promociones, campañas y comunicaciones comerciales propias o patrocinadas. El usuario podrá darse de baja en cualquier momento mediante los mecanismos habilitados para ello.',
  },
  {
    num: 18,
    title: 'MODIFICACIONES DE LA PLATAFORMA Y DE LOS TÉRMINOS',
    content:
      'Ópera Prima podrá actualizar funcionalidades, modificar servicios, cambiar normas, adaptar políticas, incorporar nuevas herramientas y suspender partes de la plataforma. Las modificaciones podrán notificarse mediante la web, correo electrónico o comunicaciones internas. El uso continuado de la plataforma implicará la aceptación de dichas modificaciones.',
  },
  {
    num: 19,
    title: 'LEGISLACIÓN APLICABLE',
    content:
      'Los presentes términos se regirán por la legislación española y europea aplicable. Cualquier controversia será sometida a los juzgados y tribunales competentes conforme a la normativa vigente.',
  },
]

export default function TerminosPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col bg-[#F0F8FF]">
        <ContentFrame>
          <article className="mx-auto w-full max-w-3xl px-6 py-20">
            <div className="mb-12">
              <p className="mb-2 text-xs font-semibold tracking-wider text-[#023047] uppercase">
                Documento legal
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-[#111]">
                Términos y Condiciones de Uso
              </h1>
              <p className="mt-3 text-sm text-[#52525B]">
                Plataforma Ópera Prima &mdash; Última actualización: Mayo 2026
              </p>
            </div>

            <div className="prose prose-sm max-w-none text-[#52525B]">
              <p className="text-base leading-relaxed text-[#111]">
                Bienvenido/a a Ópera Prima. Al acceder, registrarte o utilizar esta plataforma,
                aceptas los presentes Términos y Condiciones de Uso. Si no estás de acuerdo con
                ellos, deberás abstenerte de utilizar los servicios ofrecidos.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#111]">
                Ópera Prima es una plataforma digital orientada a la conexión, visibilización y
                acompañamiento de artistas, creadores y profesionales del sector cultural y
                creativo.
              </p>
            </div>

            <div className="mt-12 space-y-10">
              {sections.map((section) => (
                <section key={section.num}>
                  <h2 className="mb-3 text-lg font-bold text-[#111]">
                    {section.num}. {section.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-[#52525B]">{section.content}</p>
                </section>
              ))}
            </div>
          </article>
        </ContentFrame>
      </main>
      <Footer />
    </>
  )
}

import { ContentFrame } from '@/components/layout/ContentFrame'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Ópera Prima',
  description: 'Política de privacidad de Ópera Prima conforme al RGPD y LOPDGDD.',
}

const privacySections = [
  {
    title: 'RESPONSABLE DEL TRATAMIENTO',
    content:
      'La plataforma Ópera Prima es gestionada por una profesional autónoma establecida en España, actuando bajo el nombre comercial "Ópera Prima". Los datos de contacto del responsable del tratamiento se pondrán a disposición del usuario a través de los canales de comunicación habilitados en la plataforma.',
  },
  {
    title: 'DATOS PERSONALES RECOGIDOS',
    content:
      'En Ópera Prima recogemos los siguientes datos personales: (a) Datos de registro: nombre completo o pseudónimo, dirección de correo electrónico y contraseña. (b) Datos de perfil: fotografía, biografía, disciplinas artísticas, portafolio, muestras de trabajo, enlaces a redes sociales y sitios web personales. (c) Datos de uso: información sobre la interacción con la plataforma, páginas visitadas y funcionalidades utilizadas. (d) Datos de comunicación: mensajes enviados a través de los sistemas de mensajería interna y consultas realizadas al equipo de Ópera Prima. (e) Datos de pago: cuando se adquieran servicios de pago se recogerán exclusivamente los datos necesarios para procesar la transacción a través de Stripe, sin que Ópera Prima almacene números de tarjeta bancaria.',
  },
  {
    title: 'FINALIDAD DEL TRATAMIENTO',
    content:
      'Los datos personales se tratarán con las siguientes finalidades: (a) Gestión del registro y la cuenta de usuario. (b) Prestación de los servicios de la plataforma, incluyendo perfiles públicos, tablero de oportunidades, calendario comunitario, mentorías y eventos. (c) Moderación de contenido y cumplimiento de las normas de comunidad. (d) Envío de newsletters, comunicaciones comerciales y contenido promocional propio o patrocinado, siempre que el usuario haya prestado su consentimiento. (e) Cumplimiento de obligaciones legales aplicables.',
  },
  {
    title: 'LEGITIMACIÓN DEL TRATAMIENTO',
    content:
      'La base legal para el tratamiento de datos personales es: (a) La ejecución de la relación contractual derivada del registro y uso de la plataforma (RGPD art. 6.1.b). (b) El consentimiento del usuario para comunicaciones comerciales y tratamiento de datos opcionales (RGPD art. 6.1.a). (c) El cumplimiento de obligaciones legales aplicables al responsable del tratamiento (RGPD art. 6.1.c). El usuario puede retirar su consentimiento en cualquier momento sin que ello afecte a la licitud del tratamiento basado en el consentimiento previo a su retirada.',
  },
  {
    title: 'DESTINATARIOS DE LOS DATOS',
    content:
      'Los datos personales podrán ser comunicados a: (a) Proveedores de servicios tecnológicos necesarios para el funcionamiento de la plataforma, como Vercel (alojamiento), Supabase (base de datos y autenticación), Stripe (procesamiento de pagos) y Resend (envío de correos electrónicos). (b) Autoridades competentes cuando exista una obligación legal válida. Ópera Prima no vende, alquila ni cede datos personales a terceros para fines comerciales no relacionados con la plataforma.',
  },
  {
    title: 'TRANSFERENCIAS INTERNACIONALES',
    content:
      'Algunos proveedores de servicios de Ópera Prima pueden estar ubicados fuera del Espacio Económico Europeo. En tales casos, se garantiza que las transferencias internacionales de datos se realizan conforme a las garantías adecuadas previstas en el RGPD, incluyendo la adopción de cláusulas contractuales tipo aprobadas por la Comisión Europea.',
  },
  {
    title: 'PLAZOS DE CONSERVACIÓN',
    content:
      'Los datos personales se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos y para determinar las posibles responsabilidades que pudieran derivarse de dicha finalidad. Una vez finalizada la relación con el usuario, los datos se conservarán bloqueados durante los plazos legales de prescripción aplicables, tras los cuales serán eliminados de forma segura.',
  },
  {
    title: 'DERECHOS DEL USUARIO',
    content:
      'El usuario puede ejercer en cualquier momento sus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad de sus datos personales. Para ejercer estos derechos, el usuario debe enviar una solicitud a través de los canales de contacto habilitados en la plataforma, indicando el derecho que desea ejercer y acompañando copia de su documento de identidad. Ópera Prima responderá a la solicitud en el plazo máximo de un mes, prorrogable por dos meses en casos de especial complejidad.',
  },
  {
    title: 'MEDIDAS DE SEGURIDAD',
    content:
      'Ópera Prima adopta las medidas técnicas y organizativas necesarias para garantizar la seguridad e integridad de los datos personales, incluyendo el cifrado de conexiones mediante HTTPS, el almacenamiento cifrado de contraseñas, la autenticación segura de usuarios y la monitorización de accesos no autorizados.',
  },
  {
    title: 'RECLAMACIONES',
    content:
      'Si el usuario considera que el tratamiento de sus datos personales infringe la normativa de protección de datos, puede presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD), a través de su sede electrónica o en su dirección postal: Calle de Jorge Juan, 6, 28001 Madrid.',
  },
]

interface AnnexSection {
  title: string
  content: string[]
}

const colombiaAnnex: AnnexSection[] = [
  {
    title: 'ANEXO PARA CIUDADANOS COLOMBIANOS',
    content: [
      'En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, que reglamentan la protección de datos personales en Colombia, se informa adicionalmente a los ciudadanos colombianos que:',
      'El responsable del tratamiento de datos personales de ciudadanos colombianos es Ópera Prima, quien actuará como responsable del tratamiento conforme a la legislación colombiana aplicable.',
      'Los datos personales de ciudadanos colombianos serán tratados conforme a las finalidades descritas en esta Política de Privacidad. Los derechos ARCO (acceso, rectificación, cancelación y oposición) podrán ejercerse mediante comunicación dirigida a Ópera Prima a través de los canales habilitados en la plataforma.',
      'Ópera Prima podrá transferir datos personales de ciudadanos colombianos a países que no proporcionen niveles adecuados de protección de datos, únicamente cuando sea necesario para la ejecución de la relación contractual o cuando el titular haya otorgado su autorización expresa.',
      'La Superintendencia de Industria y Comercio (SIC) es la autoridad de control competente en materia de protección de datos en Colombia, ante quien los titulares pueden presentar quejas por infracciones a la normativa de protección de datos.',
    ],
  },
]

export default function PrivacidadPage() {
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
                Política de Privacidad
              </h1>
              <p className="mt-3 text-sm text-[#52525B]">
                Ópera Prima &mdash; Última actualización: Mayo 2026
              </p>
            </div>

            <div className="prose prose-sm max-w-none text-[#52525B]">
              <p className="text-base leading-relaxed text-[#111]">
                En Ópera Prima nos tomamos en serio tu privacidad. Esta Política de Privacidad
                describe cómo recogemos, utilizamos y protegemos tus datos personales cuando accedes
                y utilizas nuestra plataforma, en cumplimiento del Reglamento General de Protección
                de Datos (RGPD) de la Unión Europea, la Ley Orgánica de Protección de Datos y
                Garantía de Derechos Digitales (LOPDGDD) y la normativa colombiana aplicable.
              </p>
            </div>

            <div className="mt-12 space-y-10">
              {privacySections.map((section, i) => (
                <section key={i}>
                  <h2 className="mb-3 text-lg font-bold text-[#111]">
                    {i + 1}. {section.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-[#52525B]">{section.content}</p>
                </section>
              ))}
            </div>

            <div className="mt-16 space-y-6 border-t border-[#E4E4E7] pt-10" id="colombia">
              {colombiaAnnex.map((section, i) => (
                <section key={i}>
                  <h2 className="mb-4 text-lg font-bold text-[#111]">{section.title}</h2>
                  {section.content.map((paragraph, j) => (
                    <p key={j} className="mb-3 text-sm leading-relaxed text-[#52525B]">
                      {paragraph}
                    </p>
                  ))}
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

# Plan de Entregas — Ópera Prima

**Cliente:** Ángela María Rodríguez
**Proyecto:** Plataforma digital Ópera Prima
**Duración:** 4 Jun → 4 Jul (30 días / 2 sprints)
**Versión:** 3.0

---

## Equipo

| Rol          | Persona          |
| ------------ | ---------------- |
| Frontend     | Santiago Montaño |
| Backend      | Camilo Sotelo    |
| Coordinación | Alexander Paz    |

---

## Estructura general

| Sprint                                | Fechas         | Días | Enfoque                                                                     |
| ------------------------------------- | -------------- | :--: | --------------------------------------------------------------------------- |
| **Sprint 1 — MVP**                    | 4 – 18 Jun     |  15  | Santiago + Camilo trabajan en paralelo para tener un producto mínimo viable |
| **Sprint 2 — Correcciones y ajustes** | 19 Jun – 4 Jul |  15  | Integración, QA, deploy, assets finales, cierre                             |
| **Entrega final**                     | **4 de julio** |      | **Plataforma completa operativa**                                           |

---

## Sprint 1: MVP (4 – 18 de junio)

> Ambos equipos trabajan en paralelo desde el día 1. Santiago frontend, Camilo backend.

### Santiago Montaño — Frontend

| #    | Tarea                        | Días | Descripción                                                                |
| ---- | ---------------------------- | :--: | -------------------------------------------------------------------------- |
| 1.1  | Términos y Condiciones       |  1   | Crear ruta `/terminos` con el texto legal completo. Maquetación editorial. |
| 1.2  | Eliminar grid overlay        | 0.5  | Quitar fondo de rejilla en todas las páginas oscuras.                      |
| 1.3  | Hero /sobre — textos         | 0.5  | Reemplazar textos del hero con los nuevos.                                 |
| 1.4  | Hero /sobre — fondo          | 0.5  | Fondo negro `#0f0f0f`. Espacio para imagen 1920×1080.                      |
| 1.5  | Sección Servicios            |  2   | 6 tarjetas de servicio en /sobre.                                          |
| 1.6  | Quitar iconos Valores        | 0.5  |                                                                            |
| 1.7  | Cards Equipo clickeables     |  1   | → `/perfil/[slug]`                                                         |
| 1.8  | Hero /mentorias              |  1   | "NO ESTÁS SOLO", eliminar 3 cajitas.                                       |
| 1.9  | Paso a paso                  |  1   | 6 pasos al lado derecho del hero.                                          |
| 1.10 | Texto rotativo               |  1   | 10 temas animados.                                                         |
| 1.11 | Textos mentores              | 0.5  |                                                                            |
| 1.12 | Rediseño /eventos            |  1   | Solo título + grilla.                                                      |
| 1.13 | Evento Networking            |  1   | Tarjeta del primer evento.                                                 |
| 1.14 | Instagram                    | 0.5  | Enlaces a @opera.prima\_                                                   |
| 1.15 | Sistema de perfiles          |  2   | Ruta `/perfil/[slug]` con layout completo.                                 |
| 1.16 | Tablero Oportunidades        |  2   | Grid con filtros + detalle.                                                |
| 1.17 | Calendario Comunitario       |  2   | Vista mes/día + formulario creación.                                       |
| 1.18 | Formulario reserva mentorías | 1.5  | Selección de mentor, tema, fecha.                                          |
| 1.19 | Formulario registro eventos  | 1.5  | Inscripción con datos.                                                     |
| 1.20 | Newsletter                   |  1   | Conexión Footer → Resend.                                                  |
| 1.21 | Google Drive                 |  1   | Revisar assets del cliente.                                                |

### Camilo Sotelo — Backend

| #   | Tarea                    | Días | Descripción                     |
| --- | ------------------------ | :--: | ------------------------------- |
| B.1 | Configurar Supabase      | 1.5  | Schema de tablas + RLS.         |
| B.2 | Migrar autenticación     |  2   | Supabase Auth, login, registro. |
| B.3 | API de perfiles          | 1.5  | CRUD de perfiles de usuario.    |
| B.4 | API de Oportunidades     | 1.5  | CRUD del Tablero.               |
| B.5 | API de Calendario        | 1.5  | CRUD de eventos comunitarios.   |
| B.6 | API de reserva mentorías | 1.5  | Crear y gestionar reservas.     |
| B.7 | API de registro eventos  |  1   | Inscripción, cupos, asistentes. |
| B.8 | API de newsletter        | 0.5  | Resend.                         |
| B.9 | Dominio                  |  1   | DNS + entorno producción.       |

> **Al final del Sprint 1:** MVP funcional. Frontend con todas las pantallas montadas, backend con APIs listas. Falta integración.

---

## Sprint 2: Correcciones y ajustes (19 Jun – 4 Jul)

| #   | Tarea                 | Días | Responsable       |
| --- | --------------------- | :--: | ----------------- |
| 2.1 | Integración full      |  3   | Santiago + Camilo |
| 2.2 | QA completo           |  2   | Santiago          |
| 2.3 | Imagen hero 1920×1080 | 0.5  | Santiago          |
| 2.4 | Assets Google Drive   |  1   | Santiago          |
| 2.5 | Correcciones post-QA  |  2   | Santiago + Camilo |
| 2.6 | Ajustes responsive    |  1   | Santiago          |
| 2.7 | Deploy Vercel         |  1   | Camilo            |
| 2.8 | Reunión final         |  —   | Ambos             |

---

## Dependencias del cliente

| Elemento                     |   Fecha tope   | ¿Qué bloquea?                  |
| ---------------------------- | :------------: | ------------------------------ |
| Imagen hero 1920×1080        |  19 de junio   | Hero se queda con fondo negro  |
| Assets Google Drive          |  11 de junio   | No se integran assets visuales |
| Definición del dominio       |  25 de junio   | Deploy                         |
| Título Evento Networking     |  11 de junio   | Card con "Por definir"         |
| Reuniones validación         | 18 jun y 4 jul | Aprobación MVP y cierre        |
| Datos mentores (fotos, bios) |  11 de junio   | Perfiles con placeholder       |

---

_Versión 3.0 — 4 de junio de 2026_

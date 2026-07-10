'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Image,
  Settings,
  LogOut,
  FileText,
  Ticket,
  DollarSign,
  TrendingUp,
  MessageCircle,
  GraduationCap,
} from 'lucide-react'
import Link from 'next/link'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface AdminUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  rol: string
}

interface Stats {
  totalUsuarios: number
  usuariosPorRol: { rol: string; _count: number }[]
  totalEventos: number
  eventosPorTipo: { tipo: string; _count: number }[]
  proximosEventos: number
  totalEntradas: number
  ingresosTotales: number
  totalPages: number
  eventosRecientes: { id: string; titulo: string; tipo: string; fecha: string; createdAt: string }[]
  usuariosRecientes: {
    id: string
    firstName: string
    lastName: string
    email: string
    rol: string
    createdAt: string
  }[]
}

const COLORS = ['#023047', '#219EBC', '#FFB703', '#E63946', '#8ECAE6', '#353535']

const sectionLinks = [
  {
    title: 'Páginas',
    description: 'Editar contenido de páginas estáticas',
    icon: FileText,
    href: '/admin/pages',
  },
  {
    title: 'Eventos',
    description: 'Gestionar todos los eventos (CRUD completo)',
    icon: Calendar,
    href: '/admin/eventos',
  },
  {
    title: 'Testimonios',
    description: 'Moderar testimonios de la comunidad',
    icon: MessageCircle,
    href: '/admin/testimonios',
  },
  {
    title: 'Mentores',
    description: 'Gestionar mentores (CRUD completo)',
    icon: GraduationCap,
    href: '/admin/mentores',
  },
  {
    title: 'Usuarios',
    description: 'Administrar usuarios y roles',
    icon: Users,
    href: '#',
    disabled: true,
  },
  {
    title: 'Multimedia',
    description: 'Gestionar imágenes y archivos',
    icon: Image,
    href: '#',
    disabled: true,
  },
  {
    title: 'Configuración',
    description: 'Ajustes del sistema',
    icon: Settings,
    href: '#',
    disabled: true,
  },
]

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/admin/login')
        return
      }

      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!res.ok) {
        router.replace('/admin/login')
        return
      }

      const data = await res.json()
      if (data.usuario?.rol !== 'ADMIN') {
        router.replace('/')
        return
      }

      setUser(data.usuario)

      const statsRes = await fetch('/api/admin/stats')
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      setLoading(false)
    }
    load()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F0F8FF]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#023047] border-t-transparent" />
      </main>
    )
  }

  const metricCards = stats
    ? [
        { label: 'Usuarios', value: stats.totalUsuarios, icon: Users, color: '#023047' },
        { label: 'Eventos', value: stats.totalEventos, icon: Calendar, color: '#219EBC' },
        { label: 'Próximos', value: stats.proximosEventos, icon: TrendingUp, color: '#FFB703' },
        { label: 'Entradas', value: stats.totalEntradas, icon: Ticket, color: '#8ECAE6' },
        {
          label: 'Ingresos',
          value: `$${(stats.ingresosTotales / 100).toLocaleString()}`,
          icon: DollarSign,
          color: '#2A9D8F',
        },
        { label: 'Páginas', value: stats.totalPages, icon: FileText, color: '#353535' },
      ]
    : []

  return (
    <main className="min-h-screen bg-[#F0F8FF]">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center border-2 border-[#023047] bg-[#023047]">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[#353535]">Panel Admin</h1>
              <p className="text-[10px] text-zinc-500">
                {user?.firstName} {user?.lastName} — @{user?.username}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border-2 border-zinc-200 px-3 py-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-all hover:border-[#E63946] hover:text-[#E63946]"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-tight text-[#353535]">
            Bienvenido, {user?.firstName}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">Panel de administración de Opera Prima</p>
        </div>

        {/* Metric Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {metricCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className="border-2 border-zinc-200 bg-white p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#353535]"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                    {card.label}
                  </span>
                  <Icon size={14} style={{ color: card.color }} />
                </div>
                <p className="text-xl font-bold tracking-tight text-[#353535]">{card.value}</p>
              </div>
            )
          })}
        </div>

        {/* Charts Row */}
        {stats && (
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            {/* Eventos por Tipo - Donut */}
            <div className="border-2 border-zinc-200 bg-white p-6">
              <h3 className="mb-4 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Eventos por Tipo
              </h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={stats.eventosPorTipo.map((e) => ({ name: e.tipo, value: e._count }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stats.eventosPorTipo.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-4">
                {stats.eventosPorTipo.map((e, i) => (
                  <div key={e.tipo} className="flex items-center gap-1.5">
                    <div
                      className="size-2.5"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-[11px] text-zinc-600">
                      {e.tipo === 'OPEAR_PRIMA' ? 'Opera Prima' : 'Comunidad'} ({e._count})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Usuarios por Rol - Bar */}
            <div className="border-2 border-zinc-200 bg-white p-6">
              <h3 className="mb-4 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Usuarios por Rol
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={stats.usuariosPorRol.map((u) => ({ name: u.rol, value: u._count }))}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar dataKey="value" radius={[2, 2, 0, 0]} fill="#023047" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {stats && (
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            {/* Recent Users */}
            <div className="border-2 border-zinc-200 bg-white p-6">
              <h3 className="mb-3 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Usuarios Recientes
              </h3>
              <div className="space-y-2">
                {stats.usuariosRecientes.length === 0 && (
                  <p className="text-xs text-zinc-400">Sin usuarios aún</p>
                )}
                {stats.usuariosRecientes.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between border-b border-zinc-100 pb-2 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#353535]">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-[10px] text-zinc-400">{u.email}</p>
                    </div>
                    <span className="rounded border border-zinc-200 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                      {u.rol}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Events */}
            <div className="border-2 border-zinc-200 bg-white p-6">
              <h3 className="mb-3 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                Eventos Recientes
              </h3>
              <div className="space-y-2">
                {stats.eventosRecientes.length === 0 && (
                  <p className="text-xs text-zinc-400">Sin eventos aún</p>
                )}
                {stats.eventosRecientes.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between border-b border-zinc-100 pb-2 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#353535]">{e.titulo}</p>
                      <p className="text-[10px] text-zinc-400">
                        {new Date(e.fecha).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                    <span className="rounded border border-zinc-200 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                      {e.tipo === 'OPEAR_PRIMA' ? 'Opera Prima' : 'Comunidad'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section Links */}
        <div>
          <h3 className="mb-4 text-xs font-bold tracking-widest text-zinc-500 uppercase">
            Navegación rápida
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sectionLinks.map((section) => {
              const Icon = section.icon
              return section.disabled ? (
                <div
                  key={section.title}
                  className="cursor-not-allowed border-2 border-zinc-200 bg-white p-6 opacity-40"
                >
                  <div className="mb-3 flex size-10 items-center justify-center border-2 border-zinc-200 bg-zinc-50">
                    <Icon size={18} className="text-zinc-400" />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-[#353535]">
                    {section.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400">{section.description}</p>
                  <span className="mt-3 inline-block text-[9px] font-bold tracking-widest text-zinc-300 uppercase">
                    Próximamente
                  </span>
                </div>
              ) : (
                <Link
                  key={section.title}
                  href={section.href}
                  className="group border-2 border-zinc-200 bg-white p-6 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[#023047] hover:shadow-[4px_4px_0_#353535]"
                >
                  <div className="mb-3 flex size-10 items-center justify-center border-2 border-[#023047] bg-[#023047] transition-colors group-hover:bg-[#023047]/90">
                    <Icon size={18} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-[#353535]">
                    {section.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">{section.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}

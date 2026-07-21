'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import {
  ArrowLeft,
  Image,
  LogOut,
  Search,
  Grid3X3,
  List,
  X,
  ExternalLink,
  HardDrive,
  FolderOpen,
  FileType,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'

interface UsageEntry {
  model: string
  field: string
  label: string
  href: string
  category: string
}

interface CloudinaryImage {
  public_id: string
  format: string
  bytes: number
  width: number
  height: number
  created_at: string
  secure_url: string
  folder: string
  usages: UsageEntry[]
}

interface Stats {
  totalImages: number
  totalBytes: number
  avgBytes: number
  orphaned: number
  byFormat: { format: string; count: number; bytes: number }[]
  byFolder: { folder: string; count: number; bytes: number }[]
  topHeavy: CloudinaryImage[]
}

interface AdminUser {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  rol: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminImagenesPage() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [formatFilter, setFormatFilter] = useState('')
  const [folderFilter, setFolderFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortKey, setSortKey] = useState<'bytes' | 'width' | 'height' | 'created_at'>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selectedImage, setSelectedImage] = useState<CloudinaryImage | null>(null)
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

      const meRes = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!meRes.ok) {
        router.replace('/admin/login')
        return
      }

      const meData = await meRes.json()
      if (meData.usuario?.rol !== 'ADMIN') {
        router.replace('/')
        return
      }

      setUser(meData.usuario)

      const imgRes = await fetch('/api/admin/imagenes', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (!imgRes.ok) {
        const err = await imgRes.json()
        setError(err.error || 'Error al cargar imágenes')
        setLoading(false)
        return
      }

      const imgData = await imgRes.json()
      setImages(imgData.images)
      setStats(imgData.stats)
      setLoading(false)
    }
    load()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const formats = useMemo(() => {
    if (!stats) return []
    return stats.byFormat.map((f) => f.format)
  }, [stats])

  const folders = useMemo(() => {
    if (!stats) return []
    return stats.byFolder.map((f) => f.folder)
  }, [stats])

  const filteredImages = useMemo(() => {
    let result = [...images]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (img) => img.public_id.toLowerCase().includes(q) || img.format.toLowerCase().includes(q)
      )
    }

    if (formatFilter) {
      result = result.filter((img) => img.format.toLowerCase() === formatFilter.toLowerCase())
    }

    if (folderFilter) {
      result = result.filter((img) => img.folder === folderFilter)
    }

    if (categoryFilter === 'orphaned') {
      result = result.filter((img) => img.usages.length === 0)
    } else if (categoryFilter) {
      result = result.filter((img) => img.usages.some((u) => u.category === categoryFilter))
    }

    result.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'bytes') return (a.bytes - b.bytes) * dir
      if (sortKey === 'width') return (a.width - b.width) * dir
      if (sortKey === 'height') return (a.height - b.height) * dir
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir
    })

    return result
  }, [images, search, formatFilter, folderFilter, categoryFilter, sortKey, sortDir])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F0F8FF]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#023047] border-t-transparent" />
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F0F8FF]">
        <div className="border-2 border-[#E63946] bg-white px-6 py-4">
          <p className="flex items-center gap-2 text-sm font-bold text-[#E63946]">
            <AlertTriangle size={16} /> {error}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F0F8FF]">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center border-2 border-[#023047] bg-[#023047]">
              <Image size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[#353535]">Imágenes</h1>
              <p className="text-[10px] text-zinc-500">
                {user?.firstName} {user?.lastName} — @{user?.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-2 border-2 border-zinc-200 px-3 py-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-all hover:border-[#023047] hover:text-[#023047]"
            >
              <ArrowLeft size={14} />
              Admin
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border-2 border-zinc-200 px-3 py-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-all hover:border-[#E63946] hover:text-[#E63946]"
            >
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-2 border-zinc-200 bg-white p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#353535]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Total imágenes
                </span>
                <Image size={14} className="text-[#023047]" />
              </div>
              <p className="text-xl font-bold tracking-tight text-[#353535]">{stats.totalImages}</p>
            </div>

            <div className="border-2 border-zinc-200 bg-white p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#353535]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Almacenamiento
                </span>
                <HardDrive size={14} className="text-[#219EBC]" />
              </div>
              <p className="text-xl font-bold tracking-tight text-[#353535]">
                {formatBytes(stats.totalBytes)}
              </p>
            </div>

            <div className="border-2 border-zinc-200 bg-white p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#353535]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Peso promedio
                </span>
                <FileType size={14} className="text-[#FFB703]" />
              </div>
              <p className="text-xl font-bold tracking-tight text-[#353535]">
                {formatBytes(stats.avgBytes)}
              </p>
            </div>

            <div className="border-2 border-zinc-200 bg-white p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#353535]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Huérfanas
                </span>
                <AlertTriangle
                  size={14}
                  className={stats.orphaned > 0 ? 'text-[#E63946]' : 'text-[#2A9D8F]'}
                />
              </div>
              <p
                className={`text-xl font-bold tracking-tight ${stats.orphaned > 0 ? 'text-[#E63946]' : 'text-[#353535]'}`}
              >
                {stats.orphaned}
              </p>
            </div>
          </div>
        )}

        {/* Stats row 2: format & folder distribution */}
        {stats && (
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <div className="border-2 border-zinc-200 bg-white p-4">
              <h3 className="mb-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                Formatos
              </h3>
              <div className="space-y-2">
                {stats.byFormat.map((f) => (
                  <div key={f.format} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#353535] uppercase">{f.format}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500">{f.count} archivos</span>
                      <span className="text-xs text-zinc-400">{formatBytes(f.bytes)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-2 border-zinc-200 bg-white p-4">
              <h3 className="mb-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                Carpetas
              </h3>
              <div className="space-y-2">
                {stats.byFolder.map((f) => (
                  <div key={f.folder} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-[#353535]">
                      <FolderOpen size={12} className="text-[#FFB703]" />
                      {f.folder}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500">{f.count} archivos</span>
                      <span className="text-xs text-zinc-400">{formatBytes(f.bytes)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top Heavy */}
        {stats && stats.topHeavy.length > 0 && (
          <div className="mb-6 border-2 border-zinc-200 bg-white p-4">
            <h3 className="mb-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Top 10 imágenes más pesadas
            </h3>
            <div className="space-y-2">
              {stats.topHeavy.map((img, i) => (
                <div
                  key={img.public_id}
                  className="flex cursor-pointer items-center justify-between border-b border-zinc-100 pb-2 last:border-0 hover:bg-zinc-50"
                  onClick={() => setSelectedImage(img)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-xs font-bold text-zinc-400">#{i + 1}</span>
                    <div className="size-8 shrink-0 overflow-hidden border border-zinc-200 bg-zinc-100">
                      <img
                        src={img.secure_url}
                        alt={img.public_id}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <p className="max-w-[300px] truncate text-xs font-medium text-[#353535]">
                        {img.public_id.replace('opera-prima/', '')}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        {img.width}x{img.height} &middot; {img.format.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#E63946]">{formatBytes(img.bytes)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por public_id..."
              className="w-full border-2 border-zinc-200 bg-white py-2 pr-3 pl-9 text-sm text-[#353535] placeholder:text-zinc-400 focus:border-[#023047] focus:outline-none"
            />
          </div>

          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="border-2 border-zinc-200 bg-white px-3 py-2 text-xs font-bold tracking-wider text-[#353535] uppercase focus:border-[#023047] focus:outline-none"
          >
            <option value="">Todos los formatos</option>
            {formats.map((f) => (
              <option key={f} value={f}>
                {f.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="border-2 border-zinc-200 bg-white px-3 py-2 text-xs font-bold tracking-wider text-[#353535] uppercase focus:border-[#023047] focus:outline-none"
          >
            <option value="">Todas las carpetas</option>
            {folders.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border-2 border-zinc-200 bg-white px-3 py-2 text-xs font-bold tracking-wider text-[#353535] uppercase focus:border-[#023047] focus:outline-none"
          >
            <option value="">Todas</option>
            <option value="evento-comunidad">Eventos Comunidad</option>
            <option value="evento-opera">Eventos Ópera Prima</option>
            <option value="proyecto">Proyectos</option>
            <option value="perfil">Perfiles</option>
            <option value="galeria">Galerías</option>
            <option value="mentor">Mentores</option>
            <option value="pagina">Páginas (banners, logos, hero)</option>
            <option value="orphaned">Sin uso</option>
          </select>

          <div className="ml-auto flex border-2 border-zinc-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#023047] text-white'
                  : 'bg-white text-zinc-400 hover:text-[#023047]'
              }`}
            >
              <Grid3X3 size={14} /> Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold tracking-wider uppercase transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#023047] text-white'
                  : 'bg-white text-zinc-400 hover:text-[#023047]'
              }`}
            >
              <List size={14} /> Tabla
            </button>
          </div>
        </div>

        {/* Count */}
        <p className="mb-4 text-xs text-zinc-500">
          {filteredImages.length} de {images.length} imágenes
        </p>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredImages.map((img) => (
              <button
                key={img.public_id}
                onClick={() => setSelectedImage(img)}
                className="group relative aspect-square overflow-hidden border-2 border-zinc-200 bg-white transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#353535]"
              >
                <img
                  src={img.secure_url}
                  alt={img.public_id}
                  className="size-full object-cover"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-[10px] font-medium text-white">
                    {img.public_id.replace('opera-prima/', '')}
                  </p>
                  <p className="text-[9px] text-white/70">
                    {img.width}x{img.height} &middot; {formatBytes(img.bytes)} &middot;{' '}
                    {img.format.toUpperCase()}
                  </p>
                  {img.usages.length > 0 && (
                    <p className="text-[9px] text-[#8ECAE6]">
                      {img.usages.length} uso{img.usages.length !== 1 ? 's' : ''}
                    </p>
                  )}
                  {img.usages.length === 0 && <p className="text-[9px] text-[#E63946]">Sin uso</p>}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto border-2 border-zinc-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="w-12 px-3 py-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Preview
                  </th>
                  <th className="px-3 py-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Public ID
                  </th>
                  <th className="px-3 py-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Formato
                  </th>
                  <th
                    className="cursor-pointer px-3 py-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase hover:text-[#023047]"
                    onClick={() => handleSort('width')}
                  >
                    Dimensiones {sortKey === 'width' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="cursor-pointer px-3 py-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase hover:text-[#023047]"
                    onClick={() => handleSort('bytes')}
                  >
                    Peso {sortKey === 'bytes' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-3 py-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Carpeta
                  </th>
                  <th
                    className="cursor-pointer px-3 py-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase hover:text-[#023047]"
                    onClick={() => handleSort('created_at')}
                  >
                    Creado {sortKey === 'created_at' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-3 py-3 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Usado en
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredImages.map((img) => (
                  <tr
                    key={img.public_id}
                    className="cursor-pointer border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50"
                    onClick={() => setSelectedImage(img)}
                  >
                    <td className="px-3 py-2">
                      <div className="size-10 overflow-hidden border border-zinc-200 bg-zinc-100">
                        <img
                          src={img.secure_url}
                          alt=""
                          className="size-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="max-w-[200px] truncate px-3 py-2 text-xs text-[#353535]">
                      {img.public_id.replace('opera-prima/', '')}
                    </td>
                    <td className="px-3 py-2 text-xs font-bold text-zinc-600 uppercase">
                      {img.format}
                    </td>
                    <td className="px-3 py-2 text-xs text-zinc-600">
                      {img.width}x{img.height}
                    </td>
                    <td className="px-3 py-2 text-xs font-medium text-[#353535]">
                      {formatBytes(img.bytes)}
                    </td>
                    <td className="px-3 py-2 text-xs text-zinc-500">{img.folder || '-'}</td>
                    <td className="px-3 py-2 text-[10px] text-zinc-500">
                      {formatDate(img.created_at)}
                    </td>
                    <td className="px-3 py-2">
                      {img.usages.length > 0 ? (
                        <span className="rounded bg-[#8ECAE6]/20 px-2 py-0.5 text-[9px] font-bold text-[#023047]">
                          {img.usages.length}
                        </span>
                      ) : (
                        <span className="rounded bg-[#E63946]/20 px-2 py-0.5 text-[9px] font-bold text-[#E63946]">
                          Huérfana
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredImages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Image size={32} className="mb-3 text-zinc-300" />
                <p className="text-sm text-zinc-400">No se encontraron imágenes</p>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {viewMode === 'grid' && filteredImages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Image size={48} className="mb-3 text-zinc-300" />
            <p className="text-sm text-zinc-400">No se encontraron imágenes</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col border-2 border-zinc-200 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
              <h2 className="text-sm font-bold text-[#353535]">Detalle de imagen</h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="flex size-8 items-center justify-center border-2 border-zinc-200 text-zinc-400 transition-colors hover:border-[#E63946] hover:text-[#E63946]"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Image Preview */}
                <div>
                  <div className="overflow-hidden border-2 border-zinc-200 bg-zinc-100">
                    <img
                      src={selectedImage.secure_url}
                      alt={selectedImage.public_id}
                      className="w-full object-contain"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                  <a
                    href={selectedImage.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center justify-center gap-1.5 border-2 border-zinc-200 py-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase transition-all hover:border-[#023047] hover:text-[#023047]"
                  >
                    <ExternalLink size={12} /> Abrir original
                  </a>
                </div>

                {/* Metadata */}
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                      Public ID
                    </p>
                    <p className="mt-1 text-xs font-medium break-all text-[#353535]">
                      {selectedImage.public_id}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        Formato
                      </p>
                      <p className="mt-1 text-xs font-bold text-[#353535] uppercase">
                        {selectedImage.format}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        Peso
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#353535]">
                        {formatBytes(selectedImage.bytes)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        Dimensiones
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#353535]">
                        {selectedImage.width} x {selectedImage.height} px
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        Relación aspecto
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#353535]">
                        {(selectedImage.width / selectedImage.height).toFixed(2)}:1
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        Carpeta
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#353535]">
                        {selectedImage.folder || '(root)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                        Subida
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#353535]">
                        {formatDate(selectedImage.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Usages */}
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                      Usado en ({selectedImage.usages.length})
                    </p>
                    {selectedImage.usages.length === 0 ? (
                      <p className="mt-1 text-xs text-[#E63946]">
                        Esta imagen no está referenciada en la base de datos
                      </p>
                    ) : (
                      <div className="mt-2 space-y-1.5">
                        {selectedImage.usages.map((usage, i) => (
                          <a
                            key={i}
                            href={usage.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded border border-zinc-200 px-3 py-2 text-xs transition-colors hover:border-[#023047]"
                          >
                            <span className="rounded bg-[#023047]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#023047] uppercase">
                              {usage.model}
                            </span>
                            <span className="truncate text-[#353535]">{usage.label}</span>
                            <span className="ml-auto flex items-center gap-2">
                              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] text-zinc-500">
                                {usage.field}
                              </span>
                              <span className="rounded bg-[#8ECAE6]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#023047]">
                                {usage.category}
                              </span>
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

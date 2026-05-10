'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { ChevronDown, LogOut, Menu, User, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// -- Config --
const NAVBAR_CONFIG = {
  logo: {
    isotipo: '/OperaPrima_Isotipo_Color.svg',
    text: 'Ópera Prima',
  },
  links: [
    { label: 'Sobre ÓP', href: '/sobre' },
    { label: 'Mentorías', href: '/mentorias' },
    { label: 'Talleres y Eventos', href: '/eventos' },
    { label: 'Comunidad', href: '/comunidad' },
    { label: 'Tablero', href: '/tablero' },
  ],
  cta: {
    login: { label: 'Iniciar sesión' },
    register: { label: 'Registrarse' },
  },
  scrollThreshold: 20,
}

// -- Component --
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const mobileRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const authModal = useAuthModal()
  const { currentUser, logout } = authModal

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > NAVBAR_CONFIG.scrollThreshold)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileOpen])

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [userMenuOpen])

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-white/10 bg-[#0f0f0f]/97 shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div
        className={`mx-auto max-w-420 px-4 sm:border-x sm:px-6 ${
          scrolled ? 'border-white/10' : 'border-zinc-200'
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <Image
              src={NAVBAR_CONFIG.logo.isotipo}
              alt="Ópera Prima"
              width={34}
              height={34}
              unoptimized
              className="transition-transform duration-300 group-hover:rotate-12"
            />
            <span
              className={`hidden text-[15px] font-semibold tracking-tight transition-colors duration-300 sm:block ${
                scrolled ? 'text-white' : 'text-zinc-900'
              }`}
            >
              {NAVBAR_CONFIG.logo.text}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {NAVBAR_CONFIG.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                  scrolled ? 'text-white/70 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {link.label}
                <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-[#F65B7F] transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            {currentUser ? (
              /* ── Authenticated user menu ── */
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className={`flex items-center gap-2.5 border-2 px-3 py-1.5 transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                    scrolled
                      ? 'border-white/25 text-white/90 hover:border-white hover:shadow-[3px_3px_0_rgba(255,255,255,0.25)]'
                      : 'border-zinc-300 text-zinc-800 hover:border-zinc-900 hover:shadow-[3px_3px_0_#111]'
                  }`}
                >
                  {/* Avatar initials */}
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: '#F65B7F' }}
                  >
                    {currentUser.firstName[0]}
                    {currentUser.lastName[0]}
                  </span>
                  <span className="max-w-30 truncate text-xs font-bold tracking-widest uppercase">
                    {currentUser.firstName}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full right-0 z-50 mt-2 w-48 border-2 border-zinc-900 shadow-[4px_4px_0_#111]"
                      style={{ background: '#FAFAF9' }}
                    >
                      <div className="border-b border-zinc-200 px-3 py-2">
                        <p
                          className="text-[10px] font-bold tracking-widest uppercase"
                          style={{ color: '#F65B7F' }}
                        >
                          Sesión activa
                        </p>
                        <p className="mt-0.5 truncate text-xs font-semibold text-zinc-800">
                          @{currentUser.username}
                        </p>
                      </div>
                      <Link
                        href="/perfil"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold tracking-widest text-zinc-700 uppercase transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                      >
                        <User size={13} />
                        Mi perfil
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout()
                          setUserMenuOpen(false)
                        }}
                        className="flex w-full items-center gap-2 border-t border-zinc-100 px-3 py-2.5 text-xs font-bold tracking-widest text-zinc-500 uppercase transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                      >
                        <LogOut size={13} />
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Guest buttons ── */
              <>
                <button
                  type="button"
                  onClick={() => authModal.open('login')}
                  className={`border-2 px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-150 ease-out active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                    scrolled
                      ? 'border-white/30 text-white/80 hover:border-white hover:shadow-[3px_3px_0_rgba(255,255,255,0.3)]'
                      : 'border-zinc-300 text-zinc-700 hover:border-zinc-900 hover:shadow-[3px_3px_0_#111]'
                  }`}
                >
                  {NAVBAR_CONFIG.cta.login.label}
                </button>
                <button
                  type="button"
                  onClick={() => authModal.open('registro')}
                  className="border-2 border-[#F65B7F] bg-[#F65B7F] px-4 py-2 text-xs font-bold tracking-widest text-white uppercase transition-all duration-150 ease-out hover:bg-transparent hover:text-[#F65B7F] hover:shadow-[3px_3px_0_rgba(255,255,255,0.4)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  {NAVBAR_CONFIG.cta.register.label}
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className={`-mr-1 rounded-md p-2 transition-colors lg:hidden ${
              scrolled
                ? 'text-white/70 hover:bg-white/10 hover:text-white'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobileRef}
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`border-t backdrop-blur-md lg:hidden ${
              scrolled ? 'border-white/10 bg-[#0f0f0f]/97' : 'border-zinc-200 bg-white/98'
            }`}
          >
            <div
              className={`mx-auto flex max-w-420 flex-col gap-1 px-4 py-4 sm:border-x ${
                scrolled ? 'border-white/10' : 'border-zinc-200'
              }`}
            >
              {NAVBAR_CONFIG.links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      scrolled
                        ? 'text-white/70 hover:bg-white/10 hover:text-white'
                        : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div
                className={`mt-2 flex flex-col gap-2 border-t pt-3 ${
                  scrolled ? 'border-white/10' : 'border-zinc-100'
                }`}
              >
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center text-[11px] font-bold text-white"
                        style={{ background: '#F65B7F' }}
                      >
                        {currentUser.firstName[0]}
                        {currentUser.lastName[0]}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`truncate text-xs font-bold ${scrolled ? 'text-white' : 'text-zinc-900'}`}
                        >
                          {currentUser.firstName} {currentUser.lastName}
                        </p>
                        <p className="text-[10px]" style={{ color: '#F65B7F' }}>
                          @{currentUser.username}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/perfil"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 border-2 px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-all ${scrolled ? 'border-white/30 text-white' : 'border-zinc-300 text-zinc-700'}`}
                    >
                      <User size={13} />
                      Mi perfil
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setMobileOpen(false)
                      }}
                      className="flex w-full items-center gap-2 border-2 border-[#111111] bg-[#111111] px-4 py-2.5 text-xs font-bold tracking-widest text-white uppercase"
                    >
                      <LogOut size={13} />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        authModal.open('login')
                        setMobileOpen(false)
                      }}
                      className={`block w-full border-2 px-4 py-2.5 text-center text-xs font-bold tracking-widest uppercase transition-all duration-150 ease-out active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                        scrolled
                          ? 'border-white/30 text-white/80 hover:border-white hover:shadow-[3px_3px_0_rgba(255,255,255,0.3)]'
                          : 'border-zinc-300 text-zinc-700 hover:border-zinc-900 hover:shadow-[3px_3px_0_#111]'
                      }`}
                    >
                      {NAVBAR_CONFIG.cta.login.label}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        authModal.open('registro')
                        setMobileOpen(false)
                      }}
                      className="block w-full border-2 border-[#F65B7F] bg-[#F65B7F] px-4 py-2.5 text-center text-xs font-bold tracking-widest text-white uppercase transition-all duration-150 ease-out hover:bg-transparent hover:text-[#F65B7F] hover:shadow-[3px_3px_0_rgba(255,255,255,0.4)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      {NAVBAR_CONFIG.cta.register.label}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

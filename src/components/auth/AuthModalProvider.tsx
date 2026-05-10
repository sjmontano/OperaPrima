'use client'

import type { LocalUser } from '@/lib/localUsers'
import { AnimatePresence, motion } from 'motion/react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { FlipAuthCard } from './FlipAuthCard'

// -- Types --
type AuthMode = 'login' | 'registro'

interface AuthModalContextValue {
  open: (mode?: AuthMode) => void
  close: () => void
  isOpen: boolean
  mode: AuthMode
  currentUser: LocalUser | null
  login: (user: LocalUser) => void
  logout: () => void
}

// -- Context --
const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) throw new Error('useAuthModal debe usarse dentro de AuthModalProvider')
  return ctx
}

// -- Provider --
export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ isOpen: boolean; mode: AuthMode }>({
    isOpen: false,
    mode: 'login',
  })
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(null)

  const open = useCallback((mode: AuthMode = 'login') => {
    setState({ isOpen: true, mode })
  }, [])

  const close = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false }))
  }, [])

  const login = useCallback((user: LocalUser) => {
    setCurrentUser(user)
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = state.isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [state.isOpen])

  // ESC to close
  useEffect(() => {
    if (!state.isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [state.isOpen, close])

  return (
    <AuthModalContext.Provider value={{ ...state, open, close, currentUser, login, logout }}>
      {children}

      <AnimatePresence>
        {state.isOpen && (
          <motion.div
            key="auth-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-200 flex items-center justify-center px-4"
            onClick={close}
            aria-modal="true"
            role="dialog"
            aria-label="Iniciar sesión o registrarse"
          >
            {/* Backdrop: desenfoca la página detrás */}
            <div className="absolute inset-0 backdrop-blur-sm" />
            {/* Relleno blanco que desaparece hacia los bordes */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 72% 72% at 50% 50%, oklch(0.985 0.004 340 / 0.94) 0%, oklch(0.985 0.004 340 / 0.55) 55%, transparent 100%)',
              }}
            />
            {/* Cuadrícula editorial — misma que el hero, desvanecida en bordes */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(oklch(0.12 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.12 0 0) 1px, transparent 1px)',
                backgroundSize: '80px 80px',
                opacity: 0.05,
                maskImage:
                  'radial-gradient(ellipse 65% 65% at 50% 50%, black 0%, transparent 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 65% 65% at 50% 50%, black 0%, transparent 100%)',
              }}
            />

            {/* Card */}
            <motion.div
              initial={{ scale: 0.94, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 10, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <FlipAuthCard initialMode={state.mode} onClose={close} onLoginSuccess={login} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthModalContext.Provider>
  )
}

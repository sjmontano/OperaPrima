'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      if (
        error.message.toLowerCase().includes('session') ||
        error.message.toLowerCase().includes('expired')
      ) {
        setError('El enlace de recuperación expiró. Solicita uno nuevo.')
      } else {
        setError(error.message)
      }

      setLoading(false)
      return
    }

    setSuccess('Contraseña actualizada correctamente.')

    setTimeout(() => {
      router.replace('/')
      router.refresh()
    }, 1200)
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="flip-auth-wrapper">
        <div className="flip-auth-card">
          <div className="flip-auth-face flip-auth-front">
            <div className="flip-auth-face-header">
              <p className="flip-auth-eyebrow">Recuperación de cuenta</p>
            </div>

            <h2 className="flip-auth-title">Crear nueva contraseña</h2>

            <p
              style={{
                color: '#6b7280',
                fontSize: '.92rem',
                lineHeight: 1.6,
                marginTop: '-.5rem',
                marginBottom: '1.75rem',
              }}
            >
              Escribe una nueva contraseña para continuar usando tu cuenta.
            </p>

            <form className="flip-auth-form" onSubmit={handleSubmit} noValidate>
              <div className="flip-auth-field">
                <label className="flip-auth-label">Nueva contraseña</label>

                <input
                  type="password"
                  className="flip-auth-input"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="flip-auth-field">
                <label className="flip-auth-label">Confirmar contraseña</label>

                <input
                  type="password"
                  className="flip-auth-input"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              {error && <p className="flip-auth-feedback error">{error}</p>}

              {success && <p className="flip-auth-feedback success">{success}</p>}

              <button type="submit" className="flip-auth-btn-primary" disabled={loading}>
                {loading ? 'Actualizando...' : 'Guardar contraseña →'}
              </button>
            </form>

            <p className="flip-auth-brand" style={{ marginTop: '2rem' }}>
              <Link href="/" className="flip-auth-brand-link">
                ← Volver al inicio de sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

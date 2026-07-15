'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)
    setError('')
    setMessage('')

    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage(
        'Si existe una cuenta con ese correo, recibirás un enlace para crear una nueva contraseña.'
      )
    }

    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="flip-auth-wrapper">
        <div className="flip-auth-card">
          <div className="flip-auth-face flip-auth-front">
            <div className="flip-auth-face-header">
              <p className="flip-auth-eyebrow">Recuperación de cuenta</p>
            </div>

            <h2 className="flip-auth-title">¿Olvidaste tu contraseña?</h2>

            <p
              style={{
                color: '#6b7280',
                fontSize: '.92rem',
                lineHeight: 1.6,
                marginTop: '-.5rem',
                marginBottom: '1.75rem',
              }}
            >
              Ingresa el correo con el que registraste tu cuenta y te enviaremos un enlace para
              establecer una nueva contraseña.
            </p>

            <form className="flip-auth-form" onSubmit={handleSubmit} noValidate>
              <div className="flip-auth-field">
                <label htmlFor="email" className="flip-auth-label">
                  Correo electrónico
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  className="flip-auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="flip-auth-feedback error" role="alert">
                  {error}
                </p>
              )}

              {message && (
                <p className="flip-auth-feedback success" role="status">
                  {message}
                </p>
              )}

              <button type="submit" className="flip-auth-btn-primary" disabled={loading}>
                {loading ? 'Enviando…' : 'Enviar enlace →'}
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

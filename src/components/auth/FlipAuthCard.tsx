'use client'

import type { LocalUser } from '@/lib/localUsers'
import { createUser, findUserByCredential, isFieldTaken } from '@/lib/localUsers'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

// ── Password requirements ──────────────────────────────────────────────────
const REQUISITOS = [
  { regex: /.{8,}/, texto: 'Mínimo 8 caracteres' },
  { regex: /[0-9]/, texto: 'Al menos 1 número' },
  { regex: /[a-z]/, texto: 'Al menos 1 minúscula' },
  { regex: /[A-Z]/, texto: 'Al menos 1 mayúscula' },
  { regex: /[^a-zA-Z0-9\s]/, texto: 'Al menos 1 carácter especial' },
] as const

const ETIQUETAS_FORTALEZA = [
  '—',
  'Muy débil',
  'Débil',
  'Aceptable',
  'Fuerte',
  'Muy fuerte ✓',
] as const

// ── Country dial codes ─────────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: '+57', name: 'Colombia', flag: '🇨🇴', region: 'destacado' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷', region: 'suramerica' },
  { code: '+591', name: 'Bolivia', flag: '🇧🇴', region: 'suramerica' },
  { code: '+55', name: 'Brasil', flag: '🇧🇷', region: 'suramerica' },
  { code: '+56', name: 'Chile', flag: '🇨🇱', region: 'suramerica' },
  { code: '+593', name: 'Ecuador', flag: '🇪🇨', region: 'suramerica' },
  { code: '+595', name: 'Paraguay', flag: '🇵🇾', region: 'suramerica' },
  { code: '+51', name: 'Perú', flag: '🇵🇪', region: 'suramerica' },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾', region: 'suramerica' },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪', region: 'suramerica' },
  { code: '+52', name: 'México', flag: '🇲🇽', region: 'mesoamerica' },
  { code: '+501', name: 'Belice', flag: '🇧🇿', region: 'mesoamerica' },
  { code: '+506', name: 'Costa Rica', flag: '🇨🇷', region: 'mesoamerica' },
  { code: '+503', name: 'El Salvador', flag: '🇸🇻', region: 'mesoamerica' },
  { code: '+502', name: 'Guatemala', flag: '🇬🇹', region: 'mesoamerica' },
  { code: '+504', name: 'Honduras', flag: '🇭🇳', region: 'mesoamerica' },
  { code: '+505', name: 'Nicaragua', flag: '🇳🇮', region: 'mesoamerica' },
  { code: '+507', name: 'Panamá', flag: '🇵🇦', region: 'mesoamerica' },
  { code: '+53', name: 'Cuba', flag: '🇨🇺', region: 'caribe' },
  { code: '+1809', name: 'R. Dominicana', flag: '🇩🇴', region: 'caribe' },
  { code: '+1787', name: 'Puerto Rico', flag: '🇵🇷', region: 'caribe' },
  { code: '+1876', name: 'Jamaica', flag: '🇯🇲', region: 'caribe' },
  { code: '+49', name: 'Alemania', flag: '🇩🇪', region: 'europa' },
  { code: '+43', name: 'Austria', flag: '🇦🇹', region: 'europa' },
  { code: '+32', name: 'Bélgica', flag: '🇧🇪', region: 'europa' },
  { code: '+385', name: 'Croacia', flag: '🇭🇷', region: 'europa' },
  { code: '+45', name: 'Dinamarca', flag: '🇩🇰', region: 'europa' },
  { code: '+34', name: 'España', flag: '🇪🇸', region: 'europa' },
  { code: '+358', name: 'Finlandia', flag: '🇫🇮', region: 'europa' },
  { code: '+33', name: 'Francia', flag: '🇫🇷', region: 'europa' },
  { code: '+30', name: 'Grecia', flag: '🇬🇷', region: 'europa' },
  { code: '+36', name: 'Hungría', flag: '🇭🇺', region: 'europa' },
  { code: '+353', name: 'Irlanda', flag: '🇮🇪', region: 'europa' },
  { code: '+39', name: 'Italia', flag: '🇮🇹', region: 'europa' },
  { code: '+31', name: 'Países Bajos', flag: '🇳🇱', region: 'europa' },
  { code: '+48', name: 'Polonia', flag: '🇵🇱', region: 'europa' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹', region: 'europa' },
  { code: '+44', name: 'Reino Unido', flag: '🇬🇧', region: 'europa' },
  { code: '+40', name: 'Rumanía', flag: '🇷🇴', region: 'europa' },
  { code: '+46', name: 'Suecia', flag: '🇸🇪', region: 'europa' },
  { code: '+41', name: 'Suiza', flag: '🇨🇭', region: 'europa' },
  { code: '+420', name: 'R. Checa', flag: '🇨🇿', region: 'europa' },
  { code: '+380', name: 'Ucrania', flag: '🇺🇦', region: 'europa' },
  { code: '+1', name: 'EE.UU. / Canadá', flag: '🇺🇸', region: 'norteamerica' },
] as const

const REGION_LABELS: Record<string, string> = {
  destacado: '⭐ Principal',
  suramerica: 'Suramérica',
  mesoamerica: 'México y Centroamérica',
  caribe: 'El Caribe',
  europa: 'Europa',
  norteamerica: 'Norteamérica',
}

// ── Country code picker ────────────────────────────────────────────────────
function CountryCodePicker({
  value,
  onChange,
  hasError,
  tabIndex,
}: {
  value: string
  onChange: (code: string) => void
  hasError?: boolean
  tabIndex?: number
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const btnRef = useRef<HTMLButtonElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        btnRef.current &&
        !btnRef.current.contains(target) &&
        dropRef.current &&
        !dropRef.current.contains(target)
      ) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 30)
  }, [open])

  const selected = COUNTRY_CODES.find((c) => c.code === value) ?? COUNTRY_CODES[0]

  const filtered = search.trim()
    ? COUNTRY_CODES.filter(
        (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
      )
    : null

  const handleSelect = (code: string) => {
    onChange(code)
    setOpen(false)
    setSearch('')
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        type="button"
        className={`flip-auth-country-btn${hasError ? 'has-error' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Indicativo: ${selected.name} ${selected.code}`}
        tabIndex={tabIndex}
      >
        <span aria-hidden>{selected.flag}</span>
        <span>{selected.code}</span>
        <span className="flip-auth-country-caret" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div ref={dropRef} className="flip-auth-country-dropdown">
          <input
            ref={searchRef}
            className="flip-auth-country-search"
            type="text"
            placeholder="País o indicativo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar país"
          />
          <ul className="flip-auth-country-list" role="listbox">
            {filtered ? (
              filtered.length > 0 ? (
                filtered.map((c) => (
                  <li key={c.code} role="option">
                    <button
                      type="button"
                      className={`flip-auth-country-item${c.code === value ? 'selected' : ''}`}
                      onClick={() => handleSelect(c.code)}
                    >
                      <span aria-hidden>{c.flag}</span>
                      <span>{c.name}</span>
                      <span className="flip-auth-country-code">{c.code}</span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="flip-auth-country-empty">Sin resultados</li>
              )
            ) : (
              Object.keys(REGION_LABELS).map((region) => {
                const items = COUNTRY_CODES.filter((c) => c.region === region)
                if (!items.length) return null
                return (
                  <Fragment key={region}>
                    <li className="flip-auth-country-group">{REGION_LABELS[region]}</li>
                    {items.map((c) => (
                      <li key={c.code} role="option">
                        <button
                          type="button"
                          className={`flip-auth-country-item${c.code === value ? 'selected' : ''}`}
                          onClick={() => handleSelect(c.code)}
                        >
                          <span aria-hidden>{c.flag}</span>
                          <span>{c.name}</span>
                          <span className="flip-auth-country-code">{c.code}</span>
                        </button>
                      </li>
                    ))}
                  </Fragment>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── Component props ────────────────────────────────────────────────────────
interface FlipAuthCardProps {
  initialMode?: 'login' | 'registro'
  onClose?: () => void
  onLoginSuccess?: (user: LocalUser) => void
}

// ── Main component ─────────────────────────────────────────────────────────
export function FlipAuthCard({
  initialMode = 'login',
  onClose,
  onLoginSuccess,
}: FlipAuthCardProps) {
  // Mode
  const [isSignUp, setIsSignUp] = useState(initialMode === 'registro')
  const [regStep, setRegStep] = useState<1 | 2>(1)
  const [stepDir, setStepDir] = useState<'fwd' | 'bwd'>('fwd')

  // ── Step 1 fields ──
  const [s1Username, setS1Username] = useState('')
  const [s1Email, setS1Email] = useState('')
  const [s1Password, setS1Password] = useState('')
  const [s1PwVisible, setS1PwVisible] = useState(false)
  const [s1Errors, setS1Errors] = useState<Record<string, string>>({})

  // ── Step 2 fields ──
  const [s2FirstName, setS2FirstName] = useState('')
  const [s2LastName, setS2LastName] = useState('')
  const [s2CountryCode, setS2CountryCode] = useState('+57')
  const [s2Phone, setS2Phone] = useState('')
  const [s2DocType, setS2DocType] = useState('cedula')
  const [s2DocNumber, setS2DocNumber] = useState('')
  const [s2BirthDate, setS2BirthDate] = useState('')
  const [s2Gender, setS2Gender] = useState('')
  const [s2Newsletter, setS2Newsletter] = useState(false)
  const [s2Terms, setS2Terms] = useState(false)
  const [s2Errors, setS2Errors] = useState<Record<string, string>>({})
  const [s2Submitting, setS2Submitting] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)

  // ── Login fields ──
  const [loginId, setLoginId] = useState('')
  const [loginPw, setLoginPw] = useState('')
  const [loginPwVisible, setLoginPwVisible] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)

  // ── Social ──
  const [socialError, setSocialError] = useState<string | null>(null)
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | 'apple' | null>(null)

  // ── Password strength ──
  const fortaleza = useMemo(() => {
    const requisitos = REQUISITOS.map((r) => ({ met: r.regex.test(s1Password), texto: r.texto }))
    return {
      puntaje: requisitos.filter((r) => r.met).length as 0 | 1 | 2 | 3 | 4 | 5,
      requisitos,
    }
  }, [s1Password])

  // Reset step on mode change
  useEffect(() => {
    if (!isSignUp) {
      setRegStep(1)
      setStepDir('fwd')
      setS1Errors({})
      setS2Errors({})
      setRegSuccess(false)
    }
  }, [isSignUp])

  // ── Handlers ──────────────────────────────────────────────────────────

  function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault()
    const errors: Record<string, string> = {}
    const username = s1Username.trim()
    const email = s1Email.trim()

    if (!username) {
      errors.username = 'Ingresa un nombre de usuario'
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      errors.username = 'Solo letras, números y _. Entre 3 y 20 caracteres'
    } else if (isFieldTaken('username', username)) {
      errors.username = 'Este usuario ya está en uso'
    }

    if (!email) {
      errors.email = 'Ingresa tu correo electrónico'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'El correo no es válido'
    } else if (isFieldTaken('email', email)) {
      errors.email = 'Este correo ya tiene una cuenta'
    }

    if (fortaleza.puntaje < 4) {
      errors.password = 'Cumple al menos 4 de los 5 requisitos de seguridad'
    }

    setS1Errors(errors)
    if (Object.keys(errors).length === 0) {
      setStepDir('fwd')
      setRegStep(2)
    }
  }

  async function handleStep2Submit(e: React.FormEvent) {
    e.preventDefault()
    const errors: Record<string, string> = {}

    if (!s2FirstName.trim()) errors.firstName = 'Ingresa tu nombre'
    if (!s2LastName.trim()) errors.lastName = 'Ingresa tu apellido'

    if (!s2Phone.trim()) {
      errors.phone = 'Ingresa tu número de celular'
    } else if (!/^[0-9\s\-]{6,15}$/.test(s2Phone.trim())) {
      errors.phone = 'Número inválido'
    } else if (isFieldTaken('phone', s2Phone.trim())) {
      errors.phone = 'Este número ya está registrado'
    }

    if (!s2DocNumber.trim()) {
      errors.docNumber = 'Ingresa tu número de documento'
    } else if (isFieldTaken('document', s2DocNumber.trim())) {
      errors.docNumber = 'Este documento ya está registrado'
    }

    if (!s2BirthDate) errors.birthDate = 'Selecciona tu fecha de nacimiento'
    if (!s2Gender) errors.gender = 'Selecciona una opción'
    if (!s2Terms) errors.terms = 'Debes aceptar los términos para continuar'

    setS2Errors(errors)
    if (Object.keys(errors).length > 0) return

    setS2Submitting(true)
    try {
      await createUser({
        username: s1Username.trim(),
        email: s1Email.trim().toLowerCase(),
        password: s1Password,
        firstName: s2FirstName.trim(),
        lastName: s2LastName.trim(),
        countryCode: s2CountryCode,
        phone: s2Phone.trim(),
        documentType: s2DocType as LocalUser['documentType'],
        document: s2DocNumber.trim(),
        birthDate: s2BirthDate,
        gender: s2Gender,
        newsletter: s2Newsletter,
      })
      setRegSuccess(true)
    } catch {
      setS2Errors({ general: 'Ocurrió un error. Intenta de nuevo.' })
    } finally {
      setS2Submitting(false)
    }
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoginError(null)
    if (!loginId.trim() || !loginPw) {
      setLoginError('Ingresa tus credenciales')
      return
    }
    setLoginLoading(true)
    void (async () => {
      const user = await findUserByCredential(loginId.trim(), loginPw)
      setLoginLoading(false)
      if (!user) {
        setLoginError('Usuario o contraseña incorrectos')
      } else {
        setLoginSuccess(`¡Bienvenido/a de nuevo, ${user.firstName}!`)
        onLoginSuccess?.(user)
        if (onClose) setTimeout(onClose, 1400)
      }
    })()
  }

  async function handleSocialLogin(provider: 'google' | 'facebook' | 'apple') {
    setSocialError(null)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setSocialError('Social login no disponible aún — configura Supabase en .env.local')
      return
    }
    setSocialLoading(provider)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
    if (error) {
      setSocialError(error.message)
      setSocialLoading(null)
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  const hidden = (face: 'front' | 'back') => (face === 'front' ? isSignUp : !isSignUp)

  const cardClass = [
    'flip-auth-card',
    isSignUp ? 'flipped' : '',
    isSignUp && regStep === 2 ? 'reg-step2' : isSignUp ? 'reg-active' : '',
  ]
    .filter(Boolean)
    .join(' ')

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flip-auth-wrapper">
      {/* Toggle */}
      <div className="flip-auth-toggle" aria-label="Cambiar entre iniciar sesión y registrarse">
        <button
          type="button"
          onClick={() => setIsSignUp(false)}
          className={`flip-auth-tab${!isSignUp ? 'active' : ''}`}
          aria-pressed={!isSignUp}
        >
          Iniciar sesión
        </button>
        <label className="flip-auth-pill-label" aria-label="Alternar formulario">
          <input
            type="checkbox"
            className="flip-auth-checkbox"
            checked={isSignUp}
            onChange={(e) => setIsSignUp(e.target.checked)}
            aria-hidden
            tabIndex={-1}
          />
          <span className="flip-auth-pill-track">
            <span className="flip-auth-pill-thumb" />
          </span>
        </label>
        <button
          type="button"
          onClick={() => setIsSignUp(true)}
          className={`flip-auth-tab${isSignUp ? 'active' : ''}`}
          aria-pressed={isSignUp}
        >
          Registrarse
        </button>
      </div>

      {/* ── Flip card ── */}
      <div className={cardClass} aria-live="polite">
        {/* FRONT — Login */}
        <div className="flip-auth-face flip-auth-front" aria-hidden={isSignUp}>
          <div className="flip-auth-face-header">
            <p className="flip-auth-eyebrow">01 — Bienvenido de nuevo</p>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flip-auth-close"
                aria-label="Cerrar"
                tabIndex={hidden('front') ? -1 : 0}
              >
                ✕
              </button>
            )}
          </div>
          <h2 className="flip-auth-title">Iniciar sesión</h2>

          {loginSuccess ? (
            <div className="flip-auth-success-state">
              <span className="flip-auth-success-icon">✓</span>
              <p className="flip-auth-success-msg">{loginSuccess}</p>
            </div>
          ) : (
            <form className="flip-auth-form" onSubmit={handleLoginSubmit} noValidate>
              <div className="flip-auth-field">
                <label htmlFor="login-id" className="flip-auth-label">
                  Correo o nombre de usuario
                </label>
                <input
                  id="login-id"
                  type="text"
                  autoComplete="username"
                  placeholder="tu@correo.com o @usuario"
                  className="flip-auth-input"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  tabIndex={hidden('front') ? -1 : 0}
                />
              </div>
              <div className="flip-auth-field">
                <label htmlFor="login-pw" className="flip-auth-label">
                  Contraseña
                </label>
                <div className="flip-auth-pw-wrapper">
                  <input
                    id="login-pw"
                    type={loginPwVisible ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="flip-auth-input"
                    value={loginPw}
                    onChange={(e) => setLoginPw(e.target.value)}
                    tabIndex={hidden('front') ? -1 : 0}
                  />
                  <button
                    type="button"
                    className="flip-auth-pw-eye"
                    onClick={() => setLoginPwVisible((v) => !v)}
                    aria-label={loginPwVisible ? 'Ocultar' : 'Mostrar'}
                    tabIndex={hidden('front') ? -1 : 0}
                  >
                    {loginPwVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <a
                href="/auth/recuperar"
                className="flip-auth-forgot"
                tabIndex={hidden('front') ? -1 : 0}
              >
                ¿Olvidaste tu contraseña?
              </a>
              {loginError && (
                <p className="flip-auth-feedback error" role="alert">
                  {loginError}
                </p>
              )}
              <button
                type="submit"
                className="flip-auth-btn-primary"
                disabled={loginLoading}
                tabIndex={hidden('front') ? -1 : 0}
              >
                {loginLoading ? 'Verificando…' : 'Entrar →'}
              </button>
            </form>
          )}
        </div>

        {/* BACK — Register (step 1 / step 2 / success) */}
        <div
          className={`flip-auth-face flip-auth-back${regStep === 2 ? 'step2-active' : ''}`}
          aria-hidden={!isSignUp}
        >
          {/* Step 1 — Acceso */}
          {regStep === 1 && !regSuccess && (
            <div className={`flip-auth-step-content${stepDir === 'bwd' ? 'step-enter-left' : ''}`}>
              <div className="flip-auth-face-header">
                <p className="flip-auth-eyebrow">02 — Crea tu cuenta</p>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flip-auth-close"
                    aria-label="Cerrar"
                    tabIndex={hidden('back') ? -1 : 0}
                  >
                    ✕
                  </button>
                )}
              </div>
              <h2 className="flip-auth-title">Crear cuenta</h2>

              <form className="flip-auth-form" onSubmit={handleStep1Submit} noValidate>
                {/* Usuario */}
                <div className="flip-auth-field">
                  <label htmlFor="s1-username" className="flip-auth-label">
                    Nombre de usuario
                  </label>
                  <input
                    id="s1-username"
                    type="text"
                    autoComplete="username"
                    placeholder="artista_co"
                    className={`flip-auth-input${s1Errors.username ? 'has-error' : ''}`}
                    value={s1Username}
                    onChange={(e) => setS1Username(e.target.value)}
                    tabIndex={hidden('back') ? -1 : 0}
                  />
                  {s1Errors.username && (
                    <span className="flip-auth-field-error">{s1Errors.username}</span>
                  )}
                </div>
                {/* Email */}
                <div className="flip-auth-field">
                  <label htmlFor="s1-email" className="flip-auth-label">
                    Correo electrónico
                  </label>
                  <input
                    id="s1-email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    className={`flip-auth-input${s1Errors.email ? 'has-error' : ''}`}
                    value={s1Email}
                    onChange={(e) => setS1Email(e.target.value)}
                    tabIndex={hidden('back') ? -1 : 0}
                  />
                  {s1Errors.email && (
                    <span className="flip-auth-field-error">{s1Errors.email}</span>
                  )}
                </div>
                {/* Contraseña */}
                <div className="flip-auth-field">
                  <label htmlFor="s1-pw" className="flip-auth-label">
                    Contraseña
                  </label>
                  <div className="flip-auth-pw-wrapper">
                    <input
                      id="s1-pw"
                      type={s1PwVisible ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Mínimo 8 caracteres"
                      className={`flip-auth-input${s1Errors.password ? 'has-error' : ''}`}
                      value={s1Password}
                      onChange={(e) => setS1Password(e.target.value)}
                      tabIndex={hidden('back') ? -1 : 0}
                    />
                    <button
                      type="button"
                      className="flip-auth-pw-eye"
                      onClick={() => setS1PwVisible((v) => !v)}
                      aria-label={s1PwVisible ? 'Ocultar' : 'Mostrar'}
                      tabIndex={hidden('back') ? -1 : 0}
                    >
                      {s1PwVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {s1Password.length > 0 && (
                    <>
                      <div className="flip-auth-strength-wrap">
                        <div className="flip-auth-strength-bars" aria-hidden>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <span
                              key={n}
                              className={`flip-auth-strength-bar${fortaleza.puntaje >= n ? ` s${fortaleza.puntaje}` : ''}`}
                            />
                          ))}
                        </div>
                        <span className="flip-auth-strength-label" aria-live="polite">
                          {ETIQUETAS_FORTALEZA[fortaleza.puntaje]}
                        </span>
                      </div>
                      <ul className="flip-auth-requirements" aria-label="Requisitos">
                        {fortaleza.requisitos.map((req) => (
                          <li
                            key={req.texto}
                            className={`flip-auth-req-item${req.met ? 'met' : ''}`}
                          >
                            <span className="flip-auth-req-icon">{req.met ? '✓' : '×'}</span>
                            <span>{req.texto}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {s1Errors.password && (
                    <span className="flip-auth-field-error">{s1Errors.password}</span>
                  )}
                </div>
                <button
                  type="submit"
                  className="flip-auth-btn-primary"
                  tabIndex={hidden('back') ? -1 : 0}
                >
                  Continuar →
                </button>
              </form>
            </div>
          )}

          {/* Step 2 — Perfil */}
          {regStep === 2 && !regSuccess && (
            <div className="flip-auth-step-content step-enter-right">
              <div className="flip-auth-face-header" style={{ marginBottom: '0.5rem' }}>
                <button
                  type="button"
                  className="flip-auth-back-link"
                  onClick={() => {
                    setStepDir('bwd')
                    setRegStep(1)
                  }}
                  tabIndex={hidden('back') ? -1 : 0}
                >
                  ← Volver
                </button>
                <div className="flip-auth-steps">
                  <span className="flip-auth-step-dot done" aria-hidden />
                  <span className="flip-auth-step-dot active" aria-hidden />
                  <span className="flip-auth-step-label">Paso 2 de 2</span>
                </div>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flip-auth-close"
                    aria-label="Cerrar"
                    tabIndex={hidden('back') ? -1 : 0}
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="flip-auth-eyebrow" style={{ marginBottom: '0.5rem' }}>
                03 — Perfil personal
              </p>

              <form
                className="flip-auth-form flip-auth-form-step2"
                onSubmit={handleStep2Submit}
                noValidate
              >
                {s2Errors.general && (
                  <p className="flip-auth-feedback error" role="alert">
                    {s2Errors.general}
                  </p>
                )}

                {/* Nombre + Apellido */}
                <div className="flip-auth-two-col">
                  <div className="flip-auth-field">
                    <label htmlFor="s2-fn" className="flip-auth-label">
                      Nombre
                    </label>
                    <input
                      id="s2-fn"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Ana"
                      className={`flip-auth-input${s2Errors.firstName ? 'has-error' : ''}`}
                      value={s2FirstName}
                      onChange={(e) => setS2FirstName(e.target.value)}
                      tabIndex={hidden('back') ? -1 : 0}
                    />
                    {s2Errors.firstName && (
                      <span className="flip-auth-field-error">{s2Errors.firstName}</span>
                    )}
                  </div>
                  <div className="flip-auth-field">
                    <label htmlFor="s2-ln" className="flip-auth-label">
                      Apellido
                    </label>
                    <input
                      id="s2-ln"
                      type="text"
                      autoComplete="family-name"
                      placeholder="García"
                      className={`flip-auth-input${s2Errors.lastName ? 'has-error' : ''}`}
                      value={s2LastName}
                      onChange={(e) => setS2LastName(e.target.value)}
                      tabIndex={hidden('back') ? -1 : 0}
                    />
                    {s2Errors.lastName && (
                      <span className="flip-auth-field-error">{s2Errors.lastName}</span>
                    )}
                  </div>
                </div>

                {/* Celular */}
                <div className="flip-auth-field">
                  <label className="flip-auth-label">Celular</label>
                  <div className="flip-auth-phone-row">
                    <CountryCodePicker
                      value={s2CountryCode}
                      onChange={setS2CountryCode}
                      hasError={!!s2Errors.phone}
                      tabIndex={hidden('back') ? -1 : 0}
                    />
                    <input
                      type="tel"
                      autoComplete="tel-national"
                      placeholder="300 123 4567"
                      className={`flip-auth-input${s2Errors.phone ? 'has-error' : ''}`}
                      value={s2Phone}
                      onChange={(e) => setS2Phone(e.target.value)}
                      tabIndex={hidden('back') ? -1 : 0}
                    />
                  </div>
                  {s2Errors.phone && (
                    <span className="flip-auth-field-error">{s2Errors.phone}</span>
                  )}
                </div>

                {/* Documento */}
                <div className="flip-auth-two-col">
                  <div className="flip-auth-field">
                    <label htmlFor="s2-dtype" className="flip-auth-label">
                      Tipo doc.
                    </label>
                    <select
                      id="s2-dtype"
                      className="flip-auth-select"
                      value={s2DocType}
                      onChange={(e) => setS2DocType(e.target.value)}
                      tabIndex={hidden('back') ? -1 : 0}
                    >
                      <option value="cedula">CC — Cédula</option>
                      <option value="cedula_ext">CE — Cédula ext.</option>
                      <option value="pasaporte">Pasaporte</option>
                      <option value="dni">DNI</option>
                      <option value="nie">NIE</option>
                      <option value="tarjeta_id">Tarjeta ID</option>
                    </select>
                  </div>
                  <div className="flip-auth-field">
                    <label htmlFor="s2-dnum" className="flip-auth-label">
                      Número
                    </label>
                    <input
                      id="s2-dnum"
                      type="text"
                      placeholder="12345678"
                      className={`flip-auth-input${s2Errors.docNumber ? 'has-error' : ''}`}
                      value={s2DocNumber}
                      onChange={(e) => setS2DocNumber(e.target.value)}
                      tabIndex={hidden('back') ? -1 : 0}
                    />
                    {s2Errors.docNumber && (
                      <span className="flip-auth-field-error">{s2Errors.docNumber}</span>
                    )}
                  </div>
                </div>

                {/* Fecha de nacimiento */}
                <div className="flip-auth-field">
                  <label htmlFor="s2-birth" className="flip-auth-label">
                    Fecha de nacimiento
                  </label>
                  <input
                    id="s2-birth"
                    type="date"
                    className={`flip-auth-input${s2Errors.birthDate ? 'has-error' : ''}`}
                    value={s2BirthDate}
                    onChange={(e) => setS2BirthDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    tabIndex={hidden('back') ? -1 : 0}
                  />
                  {s2Errors.birthDate && (
                    <span className="flip-auth-field-error">{s2Errors.birthDate}</span>
                  )}
                </div>

                {/* Género */}
                <div className="flip-auth-field">
                  <label htmlFor="s2-gender" className="flip-auth-label">
                    Género
                  </label>
                  <select
                    id="s2-gender"
                    className={`flip-auth-select${s2Errors.gender ? 'has-error' : ''}`}
                    value={s2Gender}
                    onChange={(e) => setS2Gender(e.target.value)}
                    tabIndex={hidden('back') ? -1 : 0}
                  >
                    <option value="">Seleccionar…</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="no_binario">No binario</option>
                    <option value="genero_fluido">Género fluido</option>
                    <option value="transgenero">Transgénero</option>
                    <option value="otro">Otro</option>
                    <option value="no_especificar">Prefiero no especificar</option>
                  </select>
                  {s2Errors.gender && (
                    <span className="flip-auth-field-error">{s2Errors.gender}</span>
                  )}
                </div>

                {/* Newsletter */}
                <label className="flip-auth-check-row">
                  <input
                    type="checkbox"
                    className="flip-auth-checkbox-input"
                    checked={s2Newsletter}
                    onChange={(e) => setS2Newsletter(e.target.checked)}
                    tabIndex={hidden('back') ? -1 : 0}
                  />
                  <span className="flip-auth-check-label">
                    Quiero recibir noticias, convocatorias y oportunidades de Ópera Prima
                  </span>
                </label>

                {/* Términos */}
                <label className="flip-auth-check-row">
                  <input
                    type="checkbox"
                    className="flip-auth-checkbox-input"
                    checked={s2Terms}
                    onChange={(e) => setS2Terms(e.target.checked)}
                    tabIndex={hidden('back') ? -1 : 0}
                  />
                  <span className="flip-auth-check-label">
                    Acepto la{' '}
                    <a href="/legal/privacidad" target="_blank" rel="noopener noreferrer">
                      Política de privacidad
                    </a>
                    , el{' '}
                    <a href="/legal/privacidad#colombia" target="_blank" rel="noopener noreferrer">
                      anexo para ciudadanos colombianos
                    </a>{' '}
                    (si aplica), y los{' '}
                    <a href="/legal/terminos" target="_blank" rel="noopener noreferrer">
                      Términos y condiciones
                    </a>{' '}
                    de Ópera Prima. Autorizo el tratamiento de mis datos personales.
                  </span>
                </label>
                {s2Errors.terms && <span className="flip-auth-field-error">{s2Errors.terms}</span>}

                <button
                  type="submit"
                  className="flip-auth-btn-primary"
                  disabled={s2Submitting}
                  tabIndex={hidden('back') ? -1 : 0}
                >
                  {s2Submitting ? 'Creando tu cuenta…' : 'Registrarme →'}
                </button>
              </form>
            </div>
          )}

          {/* Success */}
          {regSuccess && (
            <div className="flip-auth-step-content step-enter-right">
              <div className="flip-auth-success-state">
                <span className="flip-auth-success-icon">✓</span>
                <h2 className="flip-auth-success-title">¡Cuenta creada!</h2>
                <p className="flip-auth-success-body">
                  Bienvenido/a a Ópera Prima, <strong>{s2FirstName}</strong>. Tu perfil está listo.
                </p>
                <button
                  type="button"
                  className="flip-auth-btn-primary"
                  onClick={() => {
                    setIsSignUp(false)
                    setRegSuccess(false)
                    setRegStep(1)
                  }}
                >
                  Iniciar sesión →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Social login */}
      <div className="flip-auth-social">
        <div className="flip-auth-divider">
          <span className="flip-auth-divider-line" />
          <span className="flip-auth-divider-text">o continúa con</span>
          <span className="flip-auth-divider-line" />
        </div>
        <div className="flip-auth-social-btns">
          {(['google', 'facebook', 'apple'] as const).map((provider) => (
            <button
              key={provider}
              type="button"
              className="flip-auth-social-btn"
              aria-label={`Continuar con ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
              onClick={() => handleSocialLogin(provider)}
              disabled={!!socialLoading}
            >
              {provider === 'google' && <GoogleIcon />}
              {provider === 'facebook' && <FacebookIcon />}
              {provider === 'apple' && <AppleIcon />}
              <span>
                {socialLoading === provider
                  ? '…'
                  : provider.charAt(0).toUpperCase() + provider.slice(1)}
              </span>
            </button>
          ))}
        </div>
        {socialError && (
          <p
            className="flip-auth-feedback error"
            style={{ textAlign: 'center', marginTop: '0.5rem' }}
            role="alert"
          >
            {socialError}
          </p>
        )}
      </div>

      {!onClose && (
        <p className="flip-auth-brand">
          <a href="/" className="flip-auth-brand-link">
            ← Volver a Ópera Prima
          </a>
        </p>
      )}
    </div>
  )
}

// ── Icons ──────────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="15" height="16" viewBox="0 0 814 1000" aria-hidden>
      <path
        fill="currentColor"
        d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-43.4-150.3-109.1C74 500.5 32 339.8 32 185.8c0-159.3 104.6-244.5 205.8-244.5 92.9 0 150.4 61.4 201.4 61.4 49 0 114.3-66.3 217.9-66.3zm-101.4-100.5c15.7-21.3 25.9-50.7 25.9-80.1 0-35.5-13.1-72.5-38.5-101.8C866.7 31.5 831.5 10 794.7 10c-27.1 0-54.3 17.1-73.3 42.4-17.7 23.2-30.5 53.2-30.5 83.3 0 35.5 12.2 70.5 36.7 99.1 22.3 26.1 56.4 44.6 91.7 44.6z"
      />
    </svg>
  )
}

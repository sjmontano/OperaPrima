'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSent(true)
  }

  if (sent) {
    return (
      <p className="text-sm font-semibold" style={{ color: '#F65B7F' }}>
        ¡Listo! Te avisamos cuando haya novedades.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-0">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tucorreo@email.com"
        required
        className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
        style={{
          border: '2px solid rgba(250,250,249,0.3)',
          borderRight: 'none',
          color: '#FAFAF9',
        }}
      />
      <button
        type="submit"
        className="px-4 py-2 text-xs font-bold tracking-widest uppercase transition-colors hover:opacity-90"
        style={{ background: '#F65B7F', color: '#FAFAF9', flexShrink: 0 }}
      >
        OK
      </button>
    </form>
  )
}

'use client'

import { createClient } from '@/lib/supabaseClient'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface ProfileTestimonialsProps {
  username: string
  artisticName: string
}

export function ProfileTestimonials({ username, artisticName }: ProfileTestimonialsProps) {
  const [testimonial, setTestimonial] = useState<{ id: string; text: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newText, setNewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [session, setSession] = useState<{ user: { id: string } } | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session as unknown as { user: { id: string } } | null)
    })
  }, [])

  useEffect(() => {
    fetch('/api/testimonios')
      .then((r) => r.json())
      .then((data) => {
        const mine = (data.testimonials || []).find(
          (t: { usuario: { username: string } }) => t.usuario.username === username
        )
        if (mine) {
          setTestimonial({ id: mine.id, text: mine.text })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [username])

  async function handleSubmit() {
    if (!newText.trim() || submitting) return
    setSubmitting(true)

    const supabase = createClient()
    const {
      data: { session: s },
    } = await supabase.auth.getSession()
    if (!s) {
      router.push('/login')
      return
    }

    const res = await fetch('/api/testimonios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${s.access_token}`,
      },
      body: JSON.stringify({ text: newText.trim() }),
    })

    if (res.ok) {
      const data = await res.json()
      setTestimonial({ id: data.testimonial.id, text: data.testimonial.text })
      setNewText('')
      setShowForm(false)
      router.refresh()
    }

    setSubmitting(false)
  }

  return (
    <section ref={sectionRef} className="mb-8">
      <p
        className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
        style={{ color: 'oklch(0.40 0.008 350)' }}
      >
        Testimonio sobre Opera Prima
      </p>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#023047] border-t-transparent" />
        </div>
      ) : testimonial ? (
        <div className="border-2 p-4" style={{ borderColor: '#8ECAE6', background: '#F0F8FF' }}>
          <p className="text-sm leading-relaxed italic" style={{ color: '#353535' }}>
            &ldquo;{testimonial.text}&rdquo;
          </p>
          <div className="mt-3 flex items-center justify-between">
            <Link
              href="/"
              className="text-[0.6rem] font-bold tracking-widest uppercase transition-colors hover:text-[#E63946]"
              style={{ color: '#023047' }}
            >
              Ver en el muro →
            </Link>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed p-4"
          style={{ borderColor: 'oklch(0.85 0.010 350)' }}
        >
          <p className="mb-3 text-xs" style={{ color: 'oklch(0.52 0.010 350)' }}>
            {artisticName} aún no ha compartido su testimonio sobre Opera Prima.
          </p>
          {!showForm && (
            <button
              onClick={() => {
                if (!session) {
                  router.push('/login')
                  return
                }
                setShowForm(true)
              }}
              className="inline-flex cursor-pointer items-center gap-2 border-2 border-[#023047] px-4 py-2 text-[0.55rem] font-bold tracking-widest uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#353535]"
              style={{ color: '#023047' }}
            >
              <MessageCircle size={12} />
              {session ? 'Dejar testimonio' : 'Inicia sesión para dejar testimonio'}
            </button>
          )}
          {showForm && (
            <div>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Comparte tu experiencia en Opera Prima..."
                rows={3}
                className="mt-2 w-full resize-none border-2 border-zinc-300 bg-white p-3 text-xs focus:border-[#023047] focus:outline-none"
                style={{ fontFamily: 'var(--font-poppins)', color: '#353535' }}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    setShowForm(false)
                    setNewText('')
                  }}
                  className="cursor-pointer border-2 border-zinc-300 px-3 py-1.5 text-[0.55rem] font-bold tracking-widest uppercase"
                  style={{ color: '#353535' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!newText.trim() || submitting}
                  className="cursor-pointer border-2 border-[#023047] px-3 py-1.5 text-[0.55rem] font-bold tracking-widest uppercase transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#353535] disabled:opacity-50"
                  style={{ color: '#023047' }}
                >
                  {submitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

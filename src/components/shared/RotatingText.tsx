'use client'

import { useEffect, useState } from 'react'

export function RotatingText({ words }: { words: readonly string[] }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setReduceMotion(mq.matches)
    handleChange()
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    const currentWord = words[wordIndex] ?? ''
    const typeSpeed = 55
    const deleteSpeed = 28
    const pauseSpeed = 1500
    const resetSpeed = 220

    let timeoutId: number

    if (!isDeleting && charIndex < currentWord.length) {
      timeoutId = window.setTimeout(() => {
        setCharIndex((v) => v + 1)
      }, typeSpeed)
    } else if (!isDeleting && charIndex === currentWord.length) {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(true)
      }, pauseSpeed)
    } else if (isDeleting && charIndex > 0) {
      timeoutId = window.setTimeout(() => {
        setCharIndex((v) => v - 1)
      }, deleteSpeed)
    } else {
      timeoutId = window.setTimeout(() => {
        setIsDeleting(false)
        setWordIndex((v) => (v + 1) % words.length)
      }, resetSpeed)
    }

    return () => window.clearTimeout(timeoutId)
  }, [charIndex, isDeleting, reduceMotion, wordIndex, words])

  const display = reduceMotion ? (words[0] ?? '') : (words[wordIndex]?.slice(0, charIndex) ?? '')

  return (
    <span>
      {display}
      <span className="animate-pulse">|</span>
    </span>
  )
}

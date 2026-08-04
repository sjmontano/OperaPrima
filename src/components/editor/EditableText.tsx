'use client'

import { useEditMode } from '@/context/EditModeContext'
import { useCallback, useRef, useState } from 'react'

interface EditableTextProps {
  value: string
  onSave: (value: string) => void
  className?: string
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div'
  singleLine?: boolean
}

export function EditableText({
  value,
  onSave,
  className = '',
  as: Tag = 'span',
  singleLine = false,
}: EditableTextProps) {
  const { isEditMode } = useEditMode()
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleBlur = useCallback(() => {
    if (!ref.current) return
    const newValue = singleLine ? ref.current.innerText : ref.current.innerHTML
    if (newValue !== value) onSave(newValue)
    setEditing(false)
  }, [onSave, singleLine, value])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (ref.current) ref.current.innerHTML = value
        setEditing(false)
      }
      if (e.key === 'Enter' && singleLine) {
        e.preventDefault()
        ref.current?.blur()
      }
    },
    [singleLine, value]
  )

  if (!isEditMode) {
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: value }} />
  }

  return (
    <Tag
      ref={ref}
      className={`${className} editable-text-ring cursor-text`}
      contentEditable={editing}
      suppressContentEditableWarning
      dangerouslySetInnerHTML={{ __html: value }}
      onClick={(e) => {
        if (editing) return
        e.preventDefault()
        e.stopPropagation()
        setEditing(true)
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  )
}

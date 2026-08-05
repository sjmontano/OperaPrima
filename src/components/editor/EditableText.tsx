'use client'

import { EditorInline } from '@/components/editor/EditableRichText'
import { useEditMode } from '@/context/EditModeContext'
import { useCallback, useState } from 'react'

interface EditableTextProps {
  value: string
  onSave: (value: string) => void
  className?: string
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div'
  singleLine?: boolean
}

function isEmptyText(html: string): boolean {
  return (
    html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;|&#160;/gi, '')
      .trim() === ''
  )
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

  const handleSave = useCallback(
    (html: string) => {
      onSave(html)
      setEditing(false)
    },
    [onSave]
  )

  const handleCancel = useCallback(() => setEditing(false), [])

  if (!isEditMode) {
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: value }} />
  }

  if (editing) {
    return (
      <EditorInline
        content={value}
        onSave={handleSave}
        onCancel={handleCancel}
        singleLine={singleLine}
      />
    )
  }

  const showPlaceholder = isEmptyText(value)

  return (
    <Tag
      className={`${className} editable-text-ring cursor-text`}
      dangerouslySetInnerHTML={{
        __html: showPlaceholder ? '<span class="text-zinc-400">escribe aquí</span>' : value,
      }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setEditing(true)
      }}
    />
  )
}

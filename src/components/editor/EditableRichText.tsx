'use client'

import { useEditMode } from '@/context/EditModeContext'
import { FontSize } from '@/lib/tiptap-font-size'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Underline as UnderlineExtension } from '@tiptap/extension-underline'
import { Highlight as HighlightExtension } from '@tiptap/extension-highlight'
import { Link as LinkExtension } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { BubbleMenu as BubbleMenuExtension } from '@tiptap/extension-bubble-menu'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link,
  List,
  ListOrdered,
  Palette,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  Underline,
  Undo,
  Unlink,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

const FONT_SIZES = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '28px',
  '32px',
  '36px',
  '48px',
  '64px',
  '72px',
]
const FONT_UNIT_SUFFIX = 'px'

const COLORS = [
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#b7b7b7',
  '#cccccc',
  '#d9d9d9',
  '#efefef',
  '#f65b7f',
  '#e03e2d',
  '#f9a825',
  '#2e7d32',
  '#1565c0',
  '#023047',
  '#4527a0',
  '#ffcdd2',
  '#f8bbd0',
  '#e1bee7',
  '#d1c4e9',
  '#c5cae9',
  '#bbdefb',
  '#b3e5fc',
  '#b2ebf2',
]

interface EditableRichTextProps {
  value: string
  onSave: (value: string) => void
  className?: string
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div'
  placeholder?: string
}

function ColorPopup({
  editor,
  onClose,
}: {
  editor: NonNullable<ReturnType<typeof useEditor>>
  onClose: () => void
}) {
  const [customHex, setCustomHex] = useState('')

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
    onClose()
  }

  const applyCustom = () => {
    const val = customHex.trim()
    if (!val) return
    applyColor(val)
  }

  return (
    <div className="absolute top-full left-0 z-50 mt-1 rounded-sm border border-zinc-200 bg-white p-2 shadow-lg">
      {/* swatches */}
      <div className="mb-2 grid grid-cols-8 gap-1">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => applyColor(c)}
            className="h-6 w-6 rounded-sm border border-zinc-200 transition-transform hover:scale-125"
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>

      {/* native color picker (eyedropper) */}
      <div className="mb-2 flex items-center gap-2">
        <input
          type="color"
          onChange={(e) => applyColor(e.target.value)}
          className="h-7 w-7 cursor-pointer border-0 p-0"
          title="Selector de color"
        />
        <span className="text-[9px] text-zinc-500">Cuentagotas</span>
      </div>

      {/* custom HEX/RGB input */}
      <div className="flex items-center gap-1">
        <span className="text-[9px] font-bold text-zinc-500">#</span>
        <input
          type="text"
          value={customHex}
          onChange={(e) => setCustomHex(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyCustom()
            if (e.key === 'Escape') onClose()
          }}
          placeholder="FF5733 o rgb(...)"
          className="flex-1 border border-zinc-200 px-1.5 py-0.5 text-[10px] outline-none focus:border-[#8ECAE6]"
        />
        <button
          type="button"
          onClick={applyCustom}
          className="rounded-sm bg-[#023047] px-2 py-0.5 text-[9px] font-bold tracking-wider text-white"
        >
          OK
        </button>
      </div>
    </div>
  )
}

function FontSizePicker({ editor }: { editor: NonNullable<ReturnType<typeof useEditor>> }) {
  const [display, setDisplay] = useState('16')
  const [showDropdown, setShowDropdown] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const editorRef = useRef(editor)

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  useEffect(() => {
    const fn = () => {
      if (!editorRef.current) return
      const size = editorRef.current.getAttributes('textStyle').fontSize as string | undefined
      setDisplay(size ? size.replace(/^(\d+).*$/, '$1') : '—')
    }
    fn()
    editorRef.current.on('selectionUpdate', fn)
    editorRef.current.on('transaction', fn)
    return () => {
      editorRef.current?.off('selectionUpdate', fn)
      editorRef.current?.off('transaction', fn)
    }
  }, [editor])

  const applySize = useCallback(
    (val: string) => {
      const cleaned = val.trim()
      if (!cleaned) return
      const match = cleaned.match(/^(\d+(?:\.\d+)?)(px|rem|em|pt)?$/)
      if (match) {
        const value = match[1]
        const unit = match[2] || FONT_UNIT_SUFFIX
        editor.chain().focus().setFontSize(`${value}${unit}`).run()
      } else {
        editor.chain().focus().setFontSize(cleaned).run()
      }
      setShowDropdown(false)
      setCustomInput('')
    },
    [editor]
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative" onMouseDown={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setShowDropdown((v) => !v)}
        className="flex w-10 items-center justify-center rounded border border-zinc-200 bg-white py-0.5 text-[10px] font-bold text-zinc-600 hover:border-zinc-300"
        title="Tamaño de fuente"
      >
        {display}
      </button>
      {showDropdown && (
        <div
          className="absolute top-full left-0 z-50 mt-0.5 w-20 rounded-sm border border-zinc-200 bg-white py-1 shadow-lg"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* custom input */}
          <div className="flex items-center gap-0.5 px-1.5 pb-1">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  applySize(customInput)
                }
                if (e.key === 'Escape') setShowDropdown(false)
              }}
              placeholder="24"
              className="w-full border border-zinc-200 px-1 py-0.5 text-[10px] outline-none placeholder:text-zinc-300 focus:border-[#8ECAE6]"
              autoFocus
            />
            <button
              type="button"
              onClick={() => applySize(customInput)}
              className="rounded-sm bg-[#023047] px-1.5 py-0.5 text-[9px] font-bold text-white"
            >
              OK
            </button>
          </div>
          {/* presets */}
          <div className="max-h-32 overflow-y-auto border-t border-zinc-100 pt-1">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  applySize(size)
                }}
                className={`block w-full px-2 py-0.5 text-left text-[10px] transition-colors hover:bg-zinc-100 ${
                  display === size.replace(/^(\d+).*$/, '$1')
                    ? 'bg-[#8ECAE6]/20 font-bold text-[#023047]'
                    : 'text-zinc-600'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ToolBtn({
  icon: Icon,
  active,
  onClick,
  label,
}: {
  icon: React.ComponentType<{ size?: number }>
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex size-7 items-center justify-center rounded transition-colors ${
        active ? 'bg-[#023047] text-white' : 'text-zinc-500 hover:bg-zinc-200'
      }`}
    >
      <Icon size={13} />
    </button>
  )
}

function EditorInline({
  content,
  onSave,
  onCancel,
  placeholder,
}: {
  content: string
  onSave: (html: string) => void
  onCancel: () => void
  placeholder?: string
}) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextStyle,
      Color,
      FontSize,
      UnderlineExtension,
      HighlightExtension.configure({ multicolor: true }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'underline text-[#8ECAE6] hover:text-[#023047]' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: placeholder || 'Escribe aquí…',
        emptyEditorClass: 'is-editor-empty',
      }),
      BubbleMenuExtension.configure({
        shouldShow: ({ editor: e }) => !e.isActive('link') && !e.state.selection.empty,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'focus:outline-none [&_.is-editor-empty]:before:text-zinc-400 [&_.is-editor-empty]:before:content-[attr(data-placeholder)] [&_.is-editor-empty]:before:pointer-events-none [&_.is-editor-empty]:before:float-left [&_.is-editor-empty]:before:h-0',
      },
    },
    onUpdate: () => {},
  })

  useEffect(() => {
    if (editor) {
      editor.commands.focus()
    }
  }, [editor])

  useEffect(() => {
    if (editor && bubbleRef.current) {
      editor.extensionManager.extensions.forEach((ext) => {
        if (ext.name === 'bubbleMenu') {
          ext.options.element = bubbleRef.current
        }
      })
    }
  }, [editor])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        if (editor) {
          if (showLinkInput || showColorPicker) return
          onSave(editor.getHTML())
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [editor, onSave, showLinkInput, showColorPicker])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    },
    [onCancel]
  )

  if (!editor) return null

  const toggleLink = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
      setShowLinkInput(false)
    } else {
      const previousUrl = editor.getAttributes('link').href
      setLinkUrl(previousUrl || '')
      setShowLinkInput(true)
    }
  }

  const applyLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    }
    setShowLinkInput(false)
  }

  return (
    <div ref={wrapperRef} className="relative inline-block" onKeyDown={handleKeyDown}>
      {/* ── Floating Toolbar ── */}
      <div
        className="absolute bottom-full left-1/2 z-50 mb-2 flex -translate-x-1/2 flex-nowrap items-center gap-0.5 rounded-sm border border-zinc-200 bg-white px-2 py-1.5 shadow-lg"
        onMouseDown={(e) => e.preventDefault()}
      >
        <FontSizePicker editor={editor} />

        <span className="mx-0.5 h-4 w-px bg-zinc-200" />

        <ToolBtn
          icon={Bold}
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Negrita"
        />
        <ToolBtn
          icon={Italic}
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Cursiva"
        />
        <ToolBtn
          icon={Underline}
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          label="Subrayado"
        />
        <ToolBtn
          icon={Strikethrough}
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          label="Tachado"
        />

        <span className="mx-0.5 h-4 w-px bg-zinc-200" />

        <ToolBtn
          icon={Heading1}
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          label="Título 1"
        />
        <ToolBtn
          icon={Heading2}
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          label="Título 2"
        />
        <ToolBtn
          icon={Heading3}
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          label="Título 3"
        />
        <ToolBtn
          icon={Pilcrow}
          active={editor.isActive('paragraph')}
          onClick={() => editor.chain().focus().setParagraph().run()}
          label="Párrafo"
        />

        <span className="mx-0.5 h-4 w-px bg-zinc-200" />

        <ToolBtn
          icon={AlignLeft}
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          label="Izquierda"
        />
        <ToolBtn
          icon={AlignCenter}
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          label="Centro"
        />
        <ToolBtn
          icon={AlignRight}
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          label="Derecha"
        />
        <ToolBtn
          icon={AlignJustify}
          active={editor.isActive({ textAlign: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          label="Justificado"
        />

        <span className="mx-0.5 h-4 w-px bg-zinc-200" />

        <ToolBtn
          icon={List}
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="Lista"
        />
        <ToolBtn
          icon={ListOrdered}
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="Lista ordenada"
        />

        <span className="mx-0.5 h-4 w-px bg-zinc-200" />

        <ToolBtn
          icon={Quote}
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          label="Cita"
        />

        <div className="relative">
          <ToolBtn
            icon={editor.isActive('link') ? Unlink : Link}
            active={editor.isActive('link')}
            onClick={toggleLink}
            label={editor.isActive('link') ? 'Quitar enlace' : 'Enlace'}
          />
          {showLinkInput && (
            <div className="absolute top-full left-0 z-50 mt-1 flex gap-1 rounded-sm border border-zinc-200 bg-white p-1.5 shadow-lg">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://…"
                className="w-32 border border-zinc-200 px-2 py-0.5 text-[10px] outline-none focus:border-[#8ECAE6]"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applyLink()
                  if (e.key === 'Escape') setShowLinkInput(false)
                }}
              />
              <button
                type="button"
                onClick={applyLink}
                className="rounded-sm bg-[#023047] px-2 py-0.5 text-[9px] font-bold tracking-wider text-white"
              >
                OK
              </button>
            </div>
          )}
        </div>

        <span className="mx-0.5 h-4 w-px bg-zinc-200" />

        <ToolBtn
          icon={Highlighter}
          active={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          label="Resaltar"
        />

        <div className="relative">
          <ToolBtn
            icon={Palette}
            active={showColorPicker}
            onClick={() => setShowColorPicker(!showColorPicker)}
            label="Color"
          />
          {showColorPicker && (
            <ColorPopup editor={editor} onClose={() => setShowColorPicker(false)} />
          )}
        </div>

        <span className="mx-0.5 h-4 w-px bg-zinc-200" />

        <ToolBtn
          icon={Undo}
          active={false}
          onClick={() => editor.chain().focus().undo().run()}
          label="Deshacer"
        />
        <ToolBtn
          icon={Redo}
          active={false}
          onClick={() => editor.chain().focus().redo().run()}
          label="Rehacer"
        />
      </div>

      {/* ── Bubble Menu ── */}
      <div
        ref={bubbleRef}
        className="flex items-center gap-0.5 rounded-sm border border-zinc-200 bg-white p-1 shadow-lg"
        style={{ display: 'none' }}
      >
        <ToolBtn
          icon={Bold}
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Negrita"
        />
        <ToolBtn
          icon={Italic}
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Cursiva"
        />
        <ToolBtn
          icon={Underline}
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          label="Subrayado"
        />
        <span className="mx-0.5 h-4 w-px bg-zinc-200" />
        <ToolBtn icon={Link} active={editor.isActive('link')} onClick={toggleLink} label="Enlace" />
        <ToolBtn
          icon={Highlighter}
          active={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          label="Resaltar"
        />
        <span className="mx-0.5 h-4 w-px bg-zinc-200" />
        <input
          type="color"
          value="#000"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="h-5 w-5 cursor-pointer border-0 p-0"
          title="Color"
        />
      </div>

      {/* ── Editor Content (in-place, sin bordes) ── */}
      <div className="relative -m-1 rounded-sm p-1 ring-1 ring-transparent transition-all focus-within:ring-[#8ECAE6]/40">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export function EditableRichText({
  value,
  onSave,
  className = '',
  as: Tag = 'div',
  placeholder,
}: EditableRichTextProps) {
  const { isEditMode } = useEditMode()
  const [editing, setEditing] = useState(false)

  const handleSave = useCallback(
    (html: string) => {
      onSave(html)
      setEditing(false)
    },
    [onSave]
  )

  const handleCancel = useCallback(() => {
    setEditing(false)
  }, [])

  if (!isEditMode) {
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: value }} />
  }

  if (editing) {
    return (
      <EditorInline
        content={value}
        onSave={handleSave}
        onCancel={handleCancel}
        placeholder={placeholder}
        className={className}
      />
    )
  }

  return (
    <Tag
      className={`${className} cursor-text rounded-sm transition-all hover:ring-1 hover:ring-[#8ECAE6]/50`}
      dangerouslySetInnerHTML={{ __html: value }}
      onClick={(e) => {
        e.stopPropagation()
        setEditing(true)
      }}
    />
  )
}

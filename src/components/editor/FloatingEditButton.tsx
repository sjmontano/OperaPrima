'use client'

import { useAuthModal } from '@/components/auth/AuthModalProvider'
import { useEditMode } from '@/context/EditModeContext'
import { Pencil, X } from 'lucide-react'

export function FloatingEditButton() {
  const { currentUser } = useAuthModal()
  const { isEditMode, toggle } = useEditMode()

  if (currentUser?.rol !== 'ADMIN') return null

  return (
    <button
      type="button"
      onClick={toggle}
      className={`fixed right-6 bottom-6 z-100 flex h-12 w-12 items-center justify-center border-2 shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
        isEditMode
          ? 'border-[#E63946] bg-[#E63946] text-white'
          : 'border-[#023047] bg-[#8ECAE6] text-[#023047]'
      }`}
      title={isEditMode ? 'Cerrar editor' : 'Editar página'}
    >
      {isEditMode ? <X size={18} /> : <Pencil size={18} />}
      <span className="sr-only">{isEditMode ? 'Cerrar editor' : 'Editar página'}</span>
    </button>
  )
}

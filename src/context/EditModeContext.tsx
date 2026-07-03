'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface EditModeContextType {
  isEditMode: boolean
  toggle: () => void
}

const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false,
  toggle: () => {},
})

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false)
  const toggle = useCallback(() => setIsEditMode((v) => !v), [])
  return (
    <EditModeContext.Provider value={{ isEditMode, toggle }}>{children}</EditModeContext.Provider>
  )
}

export function useEditMode() {
  return useContext(EditModeContext)
}

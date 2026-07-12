'use client'

import { createClient } from '@/lib/supabaseClient'
import { useCallback, useEffect, useState } from 'react'

interface UseInlineCrudOptions<T extends { id: string }> {
  endpoint: string
  fetchOnInit?: boolean
  onError?: (err: Error) => void
}

interface UseInlineCrudReturn<T> {
  items: T[]
  loading: boolean
  error: string | null
  addItem: (data: Record<string, unknown>) => Promise<T | null>
  updateItem: (id: string, data: Record<string, unknown>) => Promise<T | null>
  deleteItem: (id: string) => Promise<boolean>
  refresh: () => Promise<void>
}

export function useInlineCrud<T extends { id: string }>({
  endpoint,
  fetchOnInit = true,
  onError,
}: UseInlineCrudOptions<T>): UseInlineCrudReturn<T> {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(fetchOnInit)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      const listKey = Object.keys(data).find((k) => Array.isArray(data[k]))
      if (listKey) {
        setItems(data[listKey])
      } else if (Array.isArray(data)) {
        setItems(data)
      } else {
        setItems([])
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar datos'
      setError(msg)
      onError?.(err instanceof Error ? err : new Error(msg))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint])

  useEffect(() => {
    if (fetchOnInit) refresh()
  }, [fetchOnInit, refresh])

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.access_token) return { 'Content-Type': 'application/json' }
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    }
  }, [])

  const addItem = useCallback(
    async (data: Record<string, unknown>): Promise<T | null> => {
      try {
        const headers = await getAuthHeaders()
        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const result = await res.json()
        const itemKey = Object.keys(result).find(
          (k) => k !== 'message' && typeof result[k] === 'object' && result[k] !== null
        )
        const created = itemKey ? result[itemKey] : result
        setItems((prev) => [...prev, created])
        return created
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error al crear'
        setError(msg)
        onError?.(err instanceof Error ? err : new Error(msg))
        return null
      }
    },
    [endpoint, getAuthHeaders, onError]
  )

  const updateItem = useCallback(
    async (id: string, data: Record<string, unknown>): Promise<T | null> => {
      try {
        const headers = await getAuthHeaders()
        const res = await fetch(`${endpoint}/${id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const result = await res.json()
        const itemKey = Object.keys(result).find(
          (k) => k !== 'message' && typeof result[k] === 'object' && result[k] !== null
        )
        const updated = itemKey ? result[itemKey] : result
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
        return updated
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error al actualizar'
        setError(msg)
        onError?.(err instanceof Error ? err : new Error(msg))
        return null
      }
    },
    [endpoint, getAuthHeaders, onError]
  )

  const deleteItem = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const headers = await getAuthHeaders()
        const res = await fetch(`${endpoint}/${id}`, {
          method: 'DELETE',
          headers,
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        setItems((prev) => prev.filter((item) => item.id !== id))
        return true
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error al eliminar'
        setError(msg)
        onError?.(err instanceof Error ? err : new Error(msg))
        return false
      }
    },
    [endpoint, getAuthHeaders, onError]
  )

  return { items, loading, error, addItem, updateItem, deleteItem, refresh }
}

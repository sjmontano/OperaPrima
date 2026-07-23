'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

type ApiOptions<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>

async function apiFetch<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`API ${res.status}: ${url}`)
  return res.json()
}

export function useApi<T>(key: string, url: string | null, options?: ApiOptions<T>) {
  return useQuery<T>({
    queryKey: [key, url],
    queryFn: ({ signal }) => apiFetch<T>(url!, signal),
    enabled: !!url,
    ...options,
  })
}

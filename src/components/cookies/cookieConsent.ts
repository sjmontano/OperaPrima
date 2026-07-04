const STORAGE_KEY = 'op-cookies-accepted'

export interface CookiePreferences {
  essential: boolean
  functional: boolean
  analytics: boolean
}

export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
}

export function getStoredConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && parsed.essential === true) {
      return { ...DEFAULT_PREFERENCES, ...parsed }
    }
    return null
  } catch {
    return null
  }
}

export function saveConsent(prefs: CookiePreferences): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

export function hasConsent(): boolean {
  return getStoredConsent() !== null
}

export function consentFor(category: keyof CookiePreferences): boolean {
  const prefs = getStoredConsent()
  if (!prefs) return false
  if (category === 'essential') return true
  return prefs[category] === true
}

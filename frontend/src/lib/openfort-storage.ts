const OPENFORT_AUTH_STORAGE_SUFFIXES = [
  '.openfort.authentication',
  '.openfort.session',
  '.openfort.account',
] as const

export function clearStaleOpenfortAuthStorage() {
  if (typeof window === 'undefined') return false

  let removedAny = false

  try {
    const keysToRemove: string[] = []

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index)
      if (!key) continue

      if (OPENFORT_AUTH_STORAGE_SUFFIXES.some((suffix) => key.endsWith(suffix))) {
        keysToRemove.push(key)
      }
    }

    for (const key of keysToRemove) {
      window.localStorage.removeItem(key)
      removedAny = true
    }
  } catch {
    return false
  }

  return removedAny
}

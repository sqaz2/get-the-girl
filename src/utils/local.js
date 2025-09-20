export function loadLocal(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch (error) {
    console.warn('Unable to read local storage', error)
    return fallback
  }
}

export function saveLocal(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Unable to write to local storage', error)
  }
}

export function removeLocal(key) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn('Unable to remove local storage key', error)
  }
}

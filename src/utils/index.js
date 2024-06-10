export function localstorageSet(key, obj = {}) {
  if (!key) return
  localStorage.setItem(key, JSON.stringify(obj))
}

export function localstorageGet(key) {
  if (!key) return {}

  try {
    return JSON.parse(localStorage.getItem(key) || '{}')
  } catch (error) {
    return {}
  }
}

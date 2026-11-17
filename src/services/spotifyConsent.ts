export const SPOTIFY_CONSENT_KEY = 'timsen.spotify-consent.v1'
export const SPOTIFY_CONSENT_TTL = 180 * 24 * 60 * 60 * 1000
const changeEvent = 'timsen:spotify-consent'
type Consent = { version: 1; grantedAt: number }
let volatileChoice: Consent | null | undefined

export function hasSpotifyConsent(): boolean {
  try {
    const choice: unknown = volatileChoice === undefined
      ? JSON.parse(localStorage.getItem(SPOTIFY_CONSENT_KEY) ?? 'null')
      : volatileChoice
    if (!choice || typeof choice !== 'object') return false
    const record = choice as Partial<Consent>
    const age = Date.now() - (record.grantedAt ?? NaN)
    return record.version === 1 && typeof record.grantedAt === 'number' && age >= 0 && age < SPOTIFY_CONSENT_TTL
  } catch { return false }
}

function updateConsent(choice: Consent | null) {
  volatileChoice = choice
  try {
    if (choice) localStorage.setItem(SPOTIFY_CONSENT_KEY, JSON.stringify(choice))
    else localStorage.removeItem(SPOTIFY_CONSENT_KEY)
    volatileChoice = undefined
  } catch { /* Keep the visitor's choice for this page if browser storage is blocked. */ }
  window.dispatchEvent(new Event(changeEvent))
}

export function allowSpotify() { updateConsent({ version: 1, grantedAt: Date.now() }) }
export function revokeSpotify() { updateConsent(null) }

export function subscribeSpotifyConsent(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== SPOTIFY_CONSENT_KEY) return
    volatileChoice = undefined
    notify()
  }
  window.addEventListener(changeEvent, notify)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(changeEvent, notify)
    window.removeEventListener('storage', onStorage)
  }
}

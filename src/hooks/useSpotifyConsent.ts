import { useSyncExternalStore } from 'react'
import { allowSpotify, hasSpotifyConsent, revokeSpotify, subscribeSpotifyConsent } from '../services/spotifyConsent'

export function useSpotifyConsent() {
  const allowed = useSyncExternalStore(subscribeSpotifyConsent, hasSpotifyConsent, () => false)
  return { allowed, allow: allowSpotify, revoke: revokeSpotify }
}

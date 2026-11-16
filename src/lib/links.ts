export function externalUrl(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch { return null }
}

export function githubProfile(username: string | null): string | null {
  return username && /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username)
    ? `https://github.com/${encodeURIComponent(username)}` : null
}

export function emailUrl(email: string | null): string | null {
  return email && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email)
    ? `mailto:${email}` : null
}

export function spotifyPlaylist(value: string | null): { url: string; embed: string } | null {
  if (!value) return null
  try {
    const url = new URL(value)
    const match = url.pathname.match(/^\/(?:embed\/)?playlist\/([a-zA-Z0-9]+)\/?$/)
    if (url.protocol !== 'https:' || url.hostname !== 'open.spotify.com' || !match) return null
    return {
      url: `https://open.spotify.com/playlist/${match[1]}`,
      embed: `https://open.spotify.com/embed/playlist/${match[1]}?utm_source=generator&theme=0`,
    }
  } catch { return null }
}

export function assetUrl(path: string): string {
  // Absolute external URLs remain intact; local assets respect GitHub Pages subpaths.
  return /^(https?:|data:)/.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

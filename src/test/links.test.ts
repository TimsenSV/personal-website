import { describe, expect, it } from 'vitest'
import { emailUrl, externalUrl, githubProfile, spotifyPlaylist } from '../lib/links'

describe('configured external destinations', () => {
  it('rejects empty and executable external URLs', () => {
    expect(externalUrl(null)).toBeNull()
    expect(externalUrl('javascript:alert(1)')).toBeNull()
    expect(externalUrl('not a link')).toBeNull()
    expect(externalUrl('https://example.com')).toBe('https://example.com/')
  })
  it('builds profiles only from a valid username', () => {
    expect(githubProfile(null)).toBeNull()
    expect(githubProfile('user/name')).toBeNull()
    expect(githubProfile('octocat')).toBe('https://github.com/octocat')
  })
  it('accepts Spotify playlist links and embed links without autoplay', () => {
    const plain = spotifyPlaylist('https://open.spotify.com/playlist/abc123?si=ignored')
    expect(plain).toEqual(spotifyPlaylist('https://open.spotify.com/embed/playlist/abc123'))
    expect(plain?.embed).not.toContain('autoplay')
    expect(spotifyPlaylist('https://open.spotify.com.evil.test/playlist/abc123')).toBeNull()
    expect(spotifyPlaylist('https://open.spotify.com/track/abc123')).toBeNull()
    expect(spotifyPlaylist(null)).toBeNull()
  })
  it('does not turn missing addresses or mail header injection into actions', () => {
    expect(emailUrl(null)).toBeNull()
    expect(emailUrl('me@example.com')).toBe('mailto:me@example.com')
    expect(emailUrl('me@example.com?bcc=someone@example.com')).toBeNull()
    expect(emailUrl('me@example.com\n')).toBeNull()
  })
})

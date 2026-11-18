import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { MusicDetail } from '../components/Widgets'
import { siteConfig } from '../content/site'
import { revokeSpotify, SPOTIFY_CONSENT_KEY, SPOTIFY_CONSENT_TTL } from '../services/spotifyConsent'

afterEach(() => {
  vi.restoreAllMocks()
  act(() => revokeSpotify())
})

describe('legal information and Spotify permission', () => {
  it('opens the legal app by keyboard, exposes readable contact details and returns focus', async () => {
    const user = userEvent.setup()
    render(<App/>)
    const trigger = within(screen.getByRole('contentinfo')).getByRole('button', { name: 'Impressum & Privacy' })
    trigger.focus()
    await user.keyboard('{Enter}')
    const dialog = screen.getByRole('dialog', { name: 'Impressum & Privacy' })
    expect(within(dialog).getByRole('button', { name: 'Impressum' })).toHaveFocus()
    expect(within(dialog).getByRole('heading', { name: 'Tim Hoffmann' })).toBeVisible()
    expect(dialog).toHaveTextContent('Renatastr. 32')
    expect(dialog).toHaveTextContent('80634 München')
    const email = `${siteConfig.legal.email.local.join('.')}@${siteConfig.legal.email.domain.join('.')}`
    expect(within(dialog).getByRole('link', { name: `${email} (opens your email app)` })).toHaveAttribute('href', `mailto:${email}`)
    await user.click(within(dialog).getByRole('button', { name: 'Privacy / Datenschutz' }))
    expect(within(dialog).getByRole('heading', { name: 'Privacy policy' })).toBeVisible()
    fireEvent(dialog, new Event('cancel', { cancelable: true }))
    expect(trigger).toHaveFocus()
  })

  it('keeps initial images local and does not load the Spotify player before consent', async () => {
    render(<App/>)
    const images = [...document.querySelectorAll('img')]
    expect(images.length).toBeGreaterThan(0)
    expect(images.every(image => !/^https?:/.test(image.getAttribute('src') ?? ''))).toBe(true)
    expect(screen.queryByRole('button', { name: 'Open current thought' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Open playlist' }))
    expect(screen.getByRole('button', { name: 'Allow Spotify' })).toBeVisible()
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
    expect(localStorage.getItem(SPOTIFY_CONSENT_KEY)).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Close window' }))
    expect(screen.queryByRole('button', { name: 'Playlist controls' })).not.toBeInTheDocument()
  })

  it('waits for a playlist visit even with a previously saved permission', () => {
    localStorage.setItem(SPOTIFY_CONSENT_KEY, JSON.stringify({ version: 1, grantedAt: Date.now() }))
    render(<App/>)
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Playlist controls' })).not.toBeInTheDocument()
  })

  it('can withdraw in Privacy and requires permission again on the next playlist visit', async () => {
    const user = userEvent.setup()
    render(<App/>)
    await user.click(screen.getByRole('button', { name: 'Open playlist' }))
    await user.click(screen.getByRole('button', { name: 'Allow Spotify' }))
    expect(document.querySelector('iframe')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close window' }))
    await user.click(screen.getByRole('button', { name: 'Impressum & Privacy' }))
    await user.click(screen.getByRole('button', { name: 'Privacy / Datenschutz' }))
    await user.click(screen.getByRole('button', { name: 'Withdraw Spotify permission' }))
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Spotify mini player' })).not.toBeInTheDocument()
    expect(within(screen.getByRole('dialog')).getByRole('status')).toHaveTextContent('Spotify player is disabled')
    expect(localStorage.getItem(SPOTIFY_CONSENT_KEY)).toBeNull()
    await user.click(screen.getByRole('button', { name: 'Close window' }))
    await user.click(screen.getByRole('button', { name: 'Open playlist' }))
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Privacy details' }))
    expect(screen.getByRole('heading', { name: 'Privacy policy' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Privacy / Datenschutz' })).toHaveFocus()
  })

  it.each([
    ['expired', () => JSON.stringify({ version: 1, grantedAt: Date.now() - SPOTIFY_CONSENT_TTL - 1 })],
    ['future-dated', () => JSON.stringify({ version: 1, grantedAt: Date.now() + 86400000 })],
    ['malformed', () => 'not-json'],
  ])('does not load Spotify with %s consent', (_, value) => {
    localStorage.setItem(SPOTIFY_CONSENT_KEY, value())
    render(<MusicDetail config={siteConfig.spotify}/>)
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Allow Spotify' })).toBeVisible()
  })

  it('still allows and revokes the player when browser storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked') })
    render(<MusicDetail config={siteConfig.spotify}/>)
    await userEvent.click(screen.getByRole('button', { name: 'Allow Spotify' }))
    expect(document.querySelector('iframe')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Disable Spotify' }))
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
  })

  it('removes an open player when consent is revoked in another tab', async () => {
    render(<MusicDetail config={siteConfig.spotify}/>)
    await userEvent.click(screen.getByRole('button', { name: 'Allow Spotify' }))
    expect(document.querySelector('iframe')).toBeInTheDocument()
    act(() => {
      localStorage.removeItem(SPOTIFY_CONSENT_KEY)
      window.dispatchEvent(new StorageEvent('storage', { key: SPOTIFY_CONSENT_KEY, newValue: null }))
    })
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
  })
})

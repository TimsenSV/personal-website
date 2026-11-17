import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../App'
import { MusicDetail } from '../components/Widgets'
import { siteConfig } from '../content/site'
import { revokeSpotify } from '../services/spotifyConsent'

afterEach(() => revokeSpotify())

describe('widget detail windows', () => {
  it('opens the repository detail from the header and returns focus there', async () => {
    const user = userEvent.setup()
    render(<App/>)
    const trigger = screen.getByRole('button', { name: 'Open GitHub and experiments' })
    await user.click(trigger)
    const detail = screen.getByRole('dialog', { name: 'Workbench / GitHub & experiments' })
    expect(detail).toHaveTextContent('personal-website')
    fireEvent(detail, new Event('cancel', { cancelable: true }))
    expect(trigger).toHaveFocus()
  })

  it('shows an honest playlist placeholder without a player or fake play action', () => {
    render(<MusicDetail config={{ ...siteConfig.spotify, url: null, cover: null }}/>)
    expect(screen.getByText('Playlist coming soon. Until then, a little quiet.')).toBeVisible()
    expect(screen.queryByRole('link', { name: /Open on Spotify/ })).not.toBeInTheDocument()
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
  })

  it('opens the playlist window directly by click or keyboard and restores focus', async () => {
    const user = userEvent.setup()
    render(<App/>)
    const trigger = screen.getByRole('button', { name: 'Open playlist' })
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
    await user.click(trigger)
    const detail = screen.getByRole('dialog', { name: 'On repeat / Spotify' })
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
    await user.click(within(detail).getByRole('button', { name: 'Allow Spotify' }))
    const player = within(detail).getByTitle(`Spotify playlist: ${siteConfig.spotify.title}`)
    expect(player).toBeVisible()
    expect(within(detail).getByRole('link', { name: /Open on Spotify/ })).toHaveAttribute('href', siteConfig.spotify.url)
    fireEvent(detail, new Event('cancel', { cancelable: true }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(document.querySelector('iframe')).toBe(player)
    expect(screen.getByRole('button', { name: 'Playlist controls' })).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', { name: 'On repeat / Spotify' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Allow Spotify' })).not.toBeInTheDocument()
    expect(document.querySelector('iframe')).toBe(player)
    await user.click(screen.getByRole('button', { name: 'Close window' }))
    expect(trigger).toHaveFocus()
  })

  it('retains one player through a project visit and a notch restore, then stops on dismissal', async () => {
    const user = userEvent.setup()
    render(<App/>)
    const tile = screen.getByRole('button', { name: 'Open playlist' })
    await user.click(tile)
    await user.click(screen.getByRole('button', { name: 'Allow Spotify' }))
    const player = document.querySelector('iframe')
    await user.click(screen.getByRole('button', { name: 'Close window' }))
    await user.click(screen.getByRole('button', { name: 'Work' }))
    expect(document.querySelectorAll('iframe')).toHaveLength(1)
    expect(document.querySelector('iframe')).toBe(player)
    await user.click(screen.getByRole('button', { name: 'Close window' }))
    const handle = screen.getByRole('button', { name: 'Playlist controls' })
    handle.focus()
    await user.keyboard('{Enter}')
    expect(handle).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(handle).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard(' ')
    await user.click(screen.getByRole('button', { name: 'Open full playlist' }))
    expect(within(screen.getByRole('dialog')).getByTitle(/Spotify playlist/)).toBe(player)
    await user.click(screen.getByRole('button', { name: 'Close window' }))
    const restored = screen.getByRole('button', { name: 'Playlist controls' })
    await user.hover(restored)
    await user.click(screen.getByRole('button', { name: 'Stop and close player' }))
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Spotify mini player' })).not.toBeInTheDocument()
    expect(tile).toHaveFocus()
  })
})

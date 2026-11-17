import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { MusicDetail } from '../components/Widgets'
import { siteConfig } from '../content/site'

describe('widget quick looks', () => {
  it('opens by keyboard and returns focus on Escape', async () => {
    const user = userEvent.setup()
    render(<App/>)
    const trigger = screen.getByRole('button', { name: 'Open current thought' })
    trigger.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', { name: 'On my mind' })).toBeVisible()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Close preview' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('allows Tab to leave a nonmodal preview and dismisses it', async () => {
    const user = userEvent.setup()
    render(<App/>)
    await user.click(screen.getByRole('button', { name: 'Open current thought' }))
    await user.tab()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open CV' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'shopvibes: open details' })).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('dismisses a thought preview on an outside click and when opening the playlist', async () => {
    const user = userEvent.setup()
    render(<App/>)
    await user.click(screen.getByRole('button', { name: 'Open current thought' }))
    await user.click(screen.getByRole('heading', { name: 'Tim.' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open current thought' }))
    await user.click(screen.getByRole('button', { name: 'Open playlist' }))
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(screen.getByRole('dialog', { name: 'On repeat / Spotify' })).toBeVisible()
  })

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
    expect(within(detail).getByTitle(`Spotify playlist: ${siteConfig.spotify.title}`)).toBeVisible()
    expect(within(detail).getByRole('link', { name: /Open on Spotify/ })).toHaveAttribute('href', siteConfig.spotify.url)
    fireEvent(detail, new Event('cancel', { cancelable: true }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', { name: 'On repeat / Spotify' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Close window' }))
    expect(trigger).toHaveFocus()
  })
})

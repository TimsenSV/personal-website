import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'
import { MusicWidget } from '../components/Widgets'
import { siteConfig } from '../content/site'

describe('widget quick looks', () => {
  it('opens by keyboard and returns focus on Escape', async () => {
    const user = userEvent.setup()
    render(<App/>)
    const trigger = screen.getByRole('button', { name: 'Aktuellen Gedanken aufklappen' })
    trigger.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', { name: 'Gerade im Kopf' })).toBeVisible()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Vorschau schließen' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('allows Tab to leave a nonmodal preview and dismisses it', async () => {
    const user = userEvent.setup()
    render(<App/>)
    await user.click(screen.getByRole('button', { name: 'Aktuellen Gedanken aufklappen' }))
    await user.tab()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lebenslauf öffnen' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'shopvibes: Details öffnen' })).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })

  it('keeps just one preview open and dismisses on an outside click', async () => {
    const user = userEvent.setup()
    render(<App/>)
    await user.click(screen.getByRole('button', { name: 'Aktuellen Gedanken aufklappen' }))
    await user.click(screen.getByRole('button', { name: 'Playlist-Vorschau öffnen' }))
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(screen.getByRole('dialog', { name: 'Eine Seite von mir' })).toBeVisible()
    await user.click(screen.getByRole('heading', { name: 'Tim.' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the repository detail from the header and returns focus there', async () => {
    const user = userEvent.setup()
    render(<App/>)
    const trigger = screen.getByRole('button', { name: 'GitHub und Experimente öffnen' })
    await user.click(trigger)
    const detail = screen.getByRole('dialog', { name: 'Werkbank / GitHub & Experimente' })
    expect(detail).toHaveTextContent('personal-website')
    fireEvent(detail, new Event('cancel', { cancelable: true }))
    expect(trigger).toHaveFocus()
  })

  it('shows an honest playlist placeholder without a player or fake play action', async () => {
    render(<App/>)
    await userEvent.click(screen.getByRole('button', { name: 'Playlist-Vorschau öffnen' }))
    const preview = screen.getByRole('dialog', { name: 'Eine Seite von mir' })
    expect(preview).toHaveTextContent('Cover ein Platzhalter')
    expect(within(preview).queryByRole('button', { name: 'Playlist öffnen' })).not.toBeInTheDocument()
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
  })

  it('only opens the configured playlist when the visitor chooses to', async () => {
    const onOpen = vi.fn()
    render(<MusicWidget config={{ ...siteConfig.spotify, url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M' }} onOpen={onOpen}/>)
    await userEvent.click(screen.getByRole('button', { name: 'Playlist-Vorschau öffnen' }))
    expect(onOpen).not.toHaveBeenCalled()
    expect(document.querySelector('iframe')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Playlist öffnen' }))
    expect(onOpen).toHaveBeenCalledOnce()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Playlist-Vorschau öffnen' })).toHaveFocus()
  })
})

import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { Dock } from '../components/Dock'
import { BoulderGame } from '../components/BoulderGame'
import { siteConfig } from '../content/site'

describe('canvas interactions', () => {
  it('shows all three products and hides unconfigured external dock actions', () => {
    render(<App/>)
    for (const name of ['shopvibes', 'showcase', 'Backlane']) expect(screen.getByRole('button', { name: `${name}: Details öffnen` })).toBeVisible()
    const dock = screen.getByRole('navigation', { name: 'Schnellnavigation' })
    expect(within(dock).getAllByRole('link')).toHaveLength(2)
    expect(within(dock).getByRole('link', { name: 'Arbeit' })).toHaveAttribute('href', '#work')
    expect(within(dock).queryByRole('link', { name: /LinkedIn/ })).not.toBeInTheDocument()
  })
  it('opens product windows by keyboard, switches products and returns focus after cancel', async () => {
    const user = userEvent.setup()
    render(<App/>)
    const trigger = screen.getByRole('button', { name: 'shopvibes: Details öffnen' })
    trigger.focus()
    await user.keyboard('{Enter}')
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeVisible()
    expect(screen.getByRole('button', { name: 'Fenster schließen' })).toHaveFocus()
    await user.click(within(dialog).getByRole('button', { name: 'showcase' }))
    expect(within(dialog).getByRole('heading', { name: 'Ein Produkt. Ein neuer Kontext.' })).toBeVisible()
    fireEvent(dialog, new Event('cancel', { cancelable: true }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
  })
  it('opens and closes the remaining available details', async () => {
    render(<App/>)
    for (const label of ['GitHub und Experimente öffnen', 'Ein paar Schritte raus', 'Boulder-Minispiel starten']) {
      await userEvent.click(screen.getByRole('button', { name: label }))
      expect(screen.getByRole('dialog')).toBeVisible()
      await userEvent.click(screen.getByRole('button', { name: 'Fenster schließen' }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    }
  })
  it('gives configured external actions valid and distinct destinations', () => {
    render(<Dock username="octocat" profile={{ ...siteConfig.profile, linkedinUrl: 'https://www.linkedin.com/in/example/', email: 'me@example.com' }} onPlay={() => {}}/>)
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/octocat')
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: /E-Mail/ })).toHaveAttribute('href', 'mailto:me@example.com')
    expect(screen.getByRole('link', { name: /E-Mail/ })).not.toHaveAttribute('target')
  })
  it('plays to a win, can restart and supports keyboard selection', async () => {
    render(<BoulderGame/>)
    for (const name of ['Griff 1, erreichbar', 'Griff 2, erreichbar', 'Griff 3, erreichbar', 'Griff 4, erreichbar', 'Top, erreichbar']) {
      const hold = screen.getByRole('button', { name })
      hold.focus()
      await userEvent.keyboard('{Enter}')
    }
    expect(screen.getByRole('status')).toHaveTextContent(/Top!.*5 Zügen/)
    expect(screen.getByRole('button', { name: 'Neu starten' })).toHaveFocus()
    await userEvent.click(screen.getByRole('button', { name: 'Neu starten' }))
    expect(screen.getByRole('button', { name: 'Start, du bist hier' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent(/Du bist am Start/)
  })
})

import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProductGallery } from '../components/ProductGallery'
import { Window } from '../components/Window'

const screenshots = [
  { src: 'test/first.png', alt: 'Test screenshot one', caption: 'First view' },
  { src: 'test/second.png', alt: 'Test screenshot two', caption: 'Second view' },
]

describe('project screenshots', () => {
  it('supports thumbnails, arrows and wraparound without opening a viewer', async () => {
    const user = userEvent.setup()
    render(<ProductGallery name="Test product" screenshots={screenshots}/>)
    await user.click(screen.getByRole('button', { name: 'Previous screenshot' }))
    expect(screen.getByRole('status')).toHaveTextContent('2 / 2Second view')
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('status')).toHaveTextContent('1 / 2First view')
    await user.click(screen.getByRole('button', { name: 'Show screenshot 2: Second view' }))
    expect(screen.getByRole('button', { name: 'Show screenshot 2: Second view' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
  it('closes only the enlarged image, preserving its project and restoring focus', async () => {
    const user = userEvent.setup()
    const closeProject = vi.fn()
    render(<Window title="Test project" onClose={closeProject}><ProductGallery name="Test product" screenshots={screenshots}/></Window>)
    const trigger = screen.getByRole('button', { name: 'Enlarge screenshot: Test screenshot one' })
    await user.click(trigger)
    const viewer = screen.getByRole('dialog', { name: 'Test product / Screenshots' })
    const project = screen.getByRole('dialog', { name: 'Test project' })
    expect(viewer.getAttribute('aria-labelledby')).not.toBe(project.getAttribute('aria-labelledby'))
    await user.click(within(viewer).getByRole('button', { name: 'Next screenshot' }))
    expect(within(viewer).getByRole('status')).toHaveTextContent('2 / 2')
    await user.keyboard('{ArrowRight}')
    expect(within(viewer).getByRole('status')).toHaveTextContent('1 / 2')
    fireEvent(viewer, new Event('cancel', { cancelable: true, bubbles: true }))
    expect(screen.queryByRole('dialog', { name: 'Test product / Screenshots' })).not.toBeInTheDocument()
    expect(closeProject).not.toHaveBeenCalled()
    expect(project).toBeVisible()
    expect(trigger).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')
  })
  it('handles an empty gallery, a single image and failed images honestly', () => {
    const { rerender, container } = render(<ProductGallery name="Test" screenshots={[]}/>)
    expect(container).toBeEmptyDOMElement()
    rerender(<ProductGallery name="Test" screenshots={[screenshots[0]]}/>)
    expect(screen.queryByRole('button', { name: 'Next screenshot' })).not.toBeInTheDocument()
    fireEvent.error(screen.getByRole('img', { name: 'Test screenshot one' }))
    expect(screen.getByText('Screenshot unavailable')).toBeVisible()
    rerender(<ProductGallery name="Test" screenshots={[screenshots[1]]}/>)
    expect(screen.getByRole('img', { name: 'Test screenshot two' })).toHaveAttribute('src', '/test/second.png')
  })
})

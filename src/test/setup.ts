import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

import { calendarFixture } from './fixtures/calendar'

// No test can accidentally reach a real GitHub account.
beforeEach(() => { vi.stubGlobal('fetch', vi.fn(async (url: string) => ({ ok: true, json: async () => url.includes('github-contributions.json') ? calendarFixture() : [] }))) })

// jsdom has no native dialog top layer. Focus containment is checked in a real browser.
HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

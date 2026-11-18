import { useEffect } from 'react'

export function useInputModality() {
  useEffect(() => {
    const root = document.documentElement
    const pointer = () => { root.dataset.inputModality = 'pointer' }
    const keyboard = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.altKey && !event.ctrlKey && event.key !== 'Shift') {
        root.dataset.inputModality = 'keyboard'
      }
    }
    // Capture before dialog handlers move focus, including delayed focus restoration.
    document.addEventListener('pointerdown', pointer, true)
    document.addEventListener('keydown', keyboard, true)
    return () => {
      document.removeEventListener('pointerdown', pointer, true)
      document.removeEventListener('keydown', keyboard, true)
      delete root.dataset.inputModality
    }
  }, [])
}

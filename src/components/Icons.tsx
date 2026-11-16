export function BacklaneMark({ className = '' }: { className?: string }) {
  // Original Backlane signet, supplied in the user's existing brand assets.
  return <svg className={className} viewBox="0 0 128 128" fill="none" aria-hidden="true"><path fill="currentColor" d="M17 1C25.284 1 32 7.716 32 16V71C32 77.627 37.373 83 44 83H81C86.523 83 91 87.477 91 93V107C95.418 107 99 103.418 99 99V89C99 80.163 91.837 73 83 73H46C42.686 73 40 70.314 40 67V41H83C106.748 41 126 60.252 126 84S106.748 127 83 127H50C23.49 127 2 105.51 2 79V16C2 7.716 8.716 1 17 1Z" /></svg>
}

export function SpotifyMark({ className = '' }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M6.4 8.6c3.7-1.2 7.7-.9 11.3 1M7.2 12c3.1-.9 6.4-.6 9.3.9M8 15.1c2.5-.6 5.1-.4 7.4.8" stroke="var(--spotify-line, #fff)" strokeWidth="1.6" strokeLinecap="round"/></svg>
}

export function RouteDrawing() {
  return <svg className="route-drawing" viewBox="0 0 440 190" fill="none" aria-hidden="true"><path className="route-ghost" d="M12 151C45 126 56 166 96 143S130 79 163 102s23 50 69 35S246 64 282 63s39 30 77 4S371 20 424 36"/><path className="route-path" d="M46 130c21 9 43 12 58-6s1-41 26-52 41 31 62 35 21-17 42-27 31 16 59-9 14-31 36-32 21 17 42 6"/><circle cx="46" cy="130" r="7" fill="var(--surface)" stroke="currentColor" strokeWidth="3"/><circle cx="371" cy="45" r="6" fill="currentColor"/><path d="M358 44h26m-13-13v26" stroke="currentColor" strokeWidth="1" opacity=".35"/></svg>
}

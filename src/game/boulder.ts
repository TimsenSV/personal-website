export type Hold = { id: string; x: number; y: number; label: string; rotation: number }
export const holds: Hold[] = [
  { id: 'start', x: 20, y: 90, label: 'Start', rotation: -15 },
  { id: 'a', x: 47, y: 75, label: 'Griff 1', rotation: 20 },
  { id: 'b', x: 23, y: 56, label: 'Griff 2', rotation: -30 },
  { id: 'c', x: 46, y: 40, label: 'Griff 3', rotation: 10 },
  { id: 'd', x: 62, y: 23, label: 'Griff 4', rotation: 40 },
  { id: 'top', x: 33, y: 8, label: 'Top', rotation: -12 },
  { id: 'e', x: 76, y: 59, label: 'Seitgriff 1', rotation: 32 },
  { id: 'f', x: 91, y: 82, label: 'Seitgriff 2', rotation: -22 },
]

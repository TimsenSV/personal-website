// Synthetic test data only. Never imported by the application.
export function calendarFixture(username = 'TimsenSV') {
  return {
    version: 1 as const, username, fetchedAt: '2026-11-16T12:00:00Z', source: 'Test fixture', total: 3, anonymousContributions: 0,
    days: Array.from({ length: 365 }, (_, index) => ({ date: new Date(Date.UTC(2025, 10, 16 + index)).toISOString().slice(0, 10), count: index === 300 ? 3 : 0, level: index === 300 ? 2 : 0 })),
  }
}

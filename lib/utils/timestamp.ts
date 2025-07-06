export function formatTimestamp(iso: string): string {
  const timezone = process.env.TIMEZONE || 'UTC'
  const date = new Date(iso)
  return date.toLocaleString('en-US', { 
    timeZone: timezone,
    weekday: 'short',
    day: '2-digit',
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })
} 
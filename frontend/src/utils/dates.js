// NFR-034: show times in Philippine time as "MMM DD, YYYY hh:mm AM/PM"
export function formatDateTime(isoString) {
  if (!isoString) return ''
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      month: 'short', day: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    })
      .formatToParts(new Date(isoString))
      .map((p) => [p.type, p.value]),
  )
  return `${parts.month} ${parts.day}, ${parts.year} ${parts.hour}:${parts.minute} ${parts.dayPeriod}`
}
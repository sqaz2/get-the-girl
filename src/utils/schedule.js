export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

function toMinutes(time = '18:00') {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function nextDay(day) {
  const index = DAYS_OF_WEEK.indexOf(day)
  if (index === -1) return DAYS_OF_WEEK[0]
  return DAYS_OF_WEEK[(index + 1) % DAYS_OF_WEEK.length]
}

export function normalizeLateNight(day, time) {
  const minutes = toMinutes(time)
  if (minutes >= 21 * 60 + 30) {
    return { day: nextDay(day), time: '18:30' }
  }
  if (minutes < 8 * 60) {
    return { day, time: '08:30' }
  }
  return { day, time }
}

export function suggestSendWindow(boundaries = []) {
  const prefersDaytime = boundaries.some((item) => /late-night/i.test(item))
  const preferWeekend = boundaries.some((item) => /weekend/i.test(item))
  if (preferWeekend) {
    return { day: 'Saturday', time: '10:30' }
  }
  if (prefersDaytime) {
    return { day: 'Wednesday', time: '18:30' }
  }
  return { day: 'Tuesday', time: '18:30' }
}

export function antiSpamFeedback(drafts = []) {
  if (!drafts.length) return null
  const upcoming = drafts.filter((draft) => draft.status !== 'sent')
  if (upcoming.length < 2) return null
  const sorted = [...upcoming].sort((a, b) => {
    const dayDiff = DAYS_OF_WEEK.indexOf(a.sendWindow?.dayOfWeek || '') - DAYS_OF_WEEK.indexOf(b.sendWindow?.dayOfWeek || '')
    if (dayDiff !== 0) return dayDiff
    return toMinutes(a.sendWindow?.timeLocal || '00:00') - toMinutes(b.sendWindow?.timeLocal || '00:00')
  })
  for (let i = 0; i < sorted.length - 1; i += 1) {
    const current = sorted[i]
    const next = sorted[i + 1]
    const dayDelta =
      (DAYS_OF_WEEK.indexOf(next.sendWindow?.dayOfWeek || '') -
        DAYS_OF_WEEK.indexOf(current.sendWindow?.dayOfWeek || '') +
        7) % 7
    const minutesCurrent = toMinutes(current.sendWindow?.timeLocal || '00:00')
    const minutesNext = toMinutes(next.sendWindow?.timeLocal || '00:00')
    const deltaMinutes = dayDelta * 24 * 60 + (minutesNext - minutesCurrent)
    if (deltaMinutes < 24 * 60) {
      return {
        level: 'caution',
        message:
          'Two drafts are queued within 24 hours. Space outreach to avoid pressure and give her room to reply.',
      }
    }
    if (deltaMinutes < 48 * 60) {
      return {
        level: 'watch',
        message: 'Consider stretching drafts beyond a 48-hour window to keep rhythm gentle.',
      }
    }
  }
  return null
}

export function formatSendWindow(sendWindow) {
  if (!sendWindow) return 'Flexible'
  return `${sendWindow.dayOfWeek || 'Any day'} · ${sendWindow.timeLocal || '18:30'}`
}

export function bucketDraftsByStatus(drafts = []) {
  return drafts.reduce(
    (acc, draft) => {
      const status = draft.status || 'new'
      acc[status] = acc[status] || []
      acc[status].push(draft)
      return acc
    },
    {},
  )
}

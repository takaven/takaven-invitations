import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    + '-' + Math.random().toString(36).substring(2, 8)
}

export function formatDate(date: string | Date, locale = 'tr-TR'): string {
  return new Date(date).toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  return `${hours}:${minutes}`
}

function getDateTimeParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date)

  return Object.fromEntries(parts
    .filter((part) => part.type !== 'literal')
    .map((part) => [part.type, Number(part.value)])) as Record<string, number>
}

export function getEventTimestamp(
  date: string | Date,
  time?: string | null,
  timeZone = 'UTC'
): number {
  if (date instanceof Date || !time) return new Date(date).getTime()

  const datePart = date.slice(0, 10)
  const timePart = time.length === 5 ? `${time}:00` : time
  const wallClockAsUtc = Date.parse(`${datePart}T${timePart}Z`)

  if (!Number.isFinite(wallClockAsUtc)) return new Date(date).getTime()

  try {
    let timestamp = wallClockAsUtc

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const parts = getDateTimeParts(new Date(timestamp), timeZone)
      const zonedAsUtc = Date.UTC(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
        parts.second
      )
      timestamp = wallClockAsUtc - (zonedAsUtc - timestamp)
    }

    return timestamp
  } catch {
    return new Date(`${datePart}T${timePart}`).getTime()
  }
}

export function getTimeUntil(
  date: string | Date,
  time?: string | null,
  timeZone?: string | null
): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const target = getEventTimestamp(date, time, timeZone || 'UTC')
  const now = Date.now()
  const diff = Math.max(0, target - now)

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
}

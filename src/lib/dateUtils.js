import { format, isToday, isYesterday, isBefore, startOfDay, endOfDay,
         startOfMonth, endOfMonth, eachDayOfInterval, getDay,
         addDays, subDays, isSameDay, parseISO, isWithinInterval,
         startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'

export { format, isToday, isYesterday, isBefore, startOfDay, endOfDay,
         startOfMonth, endOfMonth, eachDayOfInterval, getDay,
         addDays, subDays, isSameDay, parseISO, isWithinInterval,
         startOfWeek, endOfWeek, addMonths, subMonths }

export const fmtDate = (d) => format(parseISO(d), 'dd MMM', { locale: es })
export const fmtFull = (d) => format(parseISO(d), "EEE, dd MMM yyyy", { locale: es })
export const fmtMonthYear = (d) => format(d, "MMMM yyyy", { locale: es })
export const todayStr = () => format(new Date(), 'yyyy-MM-dd')
export const toDate = (s) => s ? parseISO(s) : null

// Is task active on a given date string?
export function taskOnDate(task, dateStr) {
  if (!task.startDate) return false
  const d = parseISO(dateStr)
  const start = parseISO(task.startDate)
  const end   = task.endDate ? parseISO(task.endDate) : start
  return isWithinInterval(d, { start: startOfDay(start), end: endOfDay(end) })
}

export function isOverdue(task) {
  if (task.done) return false
  if (!task.startDate) return false
  const end = task.endDate ? parseISO(task.endDate) : parseISO(task.startDate)
  return isBefore(endOfDay(end), startOfDay(new Date()))
}

export function taskDurationDays(task) {
  if (!task.startDate || !task.endDate) return 1
  const s = parseISO(task.startDate)
  const e = parseISO(task.endDate)
  return Math.round((e - s) / 86400000) + 1
}

export const PRIORITY_ORDER = { high: 0, medium: 1, low: 2, none: 3 }
export function sortByPriority(tasks) {
  return [...tasks].sort((a,b) => {
    const po = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    if (po !== 0) return po
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime)
    if (a.startTime) return -1
    if (b.startTime) return 1
    return 0
  })
}

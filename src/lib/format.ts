import { format, parseISO } from "date-fns";

// All dates use short month names (Jan, Feb ...) and put the day first,
// as dates are written in Thailand. Never 07/20/2026.

// "2026-12-26" -> "Sat 26 Dec 2026"
export function displayDate(date: string): string {
  return format(parseISO(date), "EEE d MMM yyyy");
}

// "2026-12-26" -> "26 Dec 2026"
export function shortDate(date: string): string {
  return format(parseISO(date), "d MMM yyyy");
}

// "2026-12-26" -> "26 Dec", for tight spaces like the journey track's axis.
export function dayMonth(date: string): string {
  return format(parseISO(date), "d MMM");
}

// A day count from daysBetween() -> words people actually say.
export function relativeDays(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  return days > 0 ? `in ${days} days` : `${-days} days ago`;
}

import { format, parseISO } from "date-fns";

// "2026-12-26" -> "Sat 26 Dec 2026". Day before month, as dates are written in Thailand.
export function displayDate(date: string): string {
  return format(parseISO(date), "EEE d MMM yyyy");
}

// A day count from daysBetween() -> words people actually say.
export function relativeDays(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  return days > 0 ? `in ${days} days` : `${-days} days ago`;
}

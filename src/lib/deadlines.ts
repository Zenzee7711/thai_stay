import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";

// The day you arrive counts as day 1, so the report is due on day 90,
// which is 89 days after arrival. If sources disagree, we choose the
// earlier date: reporting early is free, reporting late is a fine.
export function firstReportDue(arrivalDate: string): string {
  const arrival = parseISO(arrivalDate);
  return format(addDays(arrival, 89), "yyyy-MM-dd");
}

// You may report from 15 days before the due date until 7 days after it.
export function reportWindow(dueDate: string) {
  const due = parseISO(dueDate);
  return {
    opens: format(addDays(due, -15), "yyyy-MM-dd"),
    due: dueDate,
    lastDay: format(addDays(due, 7), "yyyy-MM-dd"),
  };
}

// After each report, Immigration prints the next due date on the TM.47 slip.
// That printed date beats our estimate, so we only estimate when there is no slip.
export function nextReportDue(arrivalDate: string, slipDueDate: string) {
  if (slipDueDate) return { date: slipDueDate, source: "slip" as const };
  if (arrivalDate) return { date: firstReportDue(arrivalDate), source: "estimate" as const };
  return null;
}

// How many calendar days from one date to another.
// Negative if "to" is before "from".
export function daysBetween(from: string, to: string): number {
  return differenceInCalendarDays(parseISO(to), parseISO(from));
}

// The four possible situations for a 90-day report.
export type ReportStatus = "not-open-yet" | "open" | "grace" | "late";

// "today" is passed in instead of read from the clock,
// so tests can pretend it is any day they like.
export function reportStatus(
  today: string,
  dates: { opens: string; due: string; lastDay: string },
): ReportStatus {
  if (today < dates.opens) return "not-open-yet";
  if (today <= dates.due) return "open";
  if (today <= dates.lastDay) return "grace";
  return "late";
}

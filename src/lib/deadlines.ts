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
//
// Leaving Thailand restarts the count, so a receipt from before the last arrival no longer
// applies. A receipt is only issued after a first report, so during the current stay its date
// is always later than the first report due from the arrival. If it isn't, it is out of date.
export type NextReport =
  | { date: string; source: "slip" }
  | { date: string; source: "estimate"; outdatedSlip?: string };

export function nextReportDue(arrivalDate: string, slipDueDate: string): NextReport | null {
  const fromArrival = arrivalDate ? firstReportDue(arrivalDate) : null;
  if (slipDueDate && fromArrival && slipDueDate <= fromArrival) {
    return { date: fromArrival, source: "estimate", outdatedSlip: slipDueDate };
  }
  if (slipDueDate) return { date: slipDueDate, source: "slip" };
  if (fromArrival) return { date: fromArrival, source: "estimate" };
  return null;
}

// After filing, the next report is usually about 90 days on. Only a suggestion:
// the user confirms the real date printed on their new receipt.
export function suggestNextDue(dueDate: string): string {
  return format(addDays(parseISO(dueDate), 90), "yyyy-MM-dd");
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

// Whether the next report can be filed online. Online filing only works once you have
// reported (in person) since your last arrival, and only up to the due date: the grace
// period after it is for in-person reports. A receipt from this stay means you have reported.
export type FilingMethod = { method: "in-person" | "online-or-in-person"; reason: string };

export function filingMethod(source: "slip" | "estimate", status: ReportStatus): FilingMethod {
  if (source === "estimate") {
    return {
      method: "in-person",
      reason: "It's your first report since you arrived.",
    };
  }
  if (status === "grace" || status === "late") {
    return {
      method: "in-person",
      reason: "Online closes on the due date.",
    };
  }
  return {
    method: "online-or-in-person",
    reason: "You've already reported since you arrived.",
  };
}

// How worried to be about the permission-to-stay date, which sets the card's colour.
export type StayLevel = "ok" | "soon" | "urgent" | "over";

export function stayLevel(daysLeft: number): StayLevel {
  if (daysLeft < 0) return "over";
  if (daysLeft <= 7) return "urgent";
  if (daysLeft <= 30) return "soon";
  return "ok";
}

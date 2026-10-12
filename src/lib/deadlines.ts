import { addDays, format, parseISO } from "date-fns";

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
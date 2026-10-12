import { addDays, format, parseISO } from "date-fns";
import { daysBetween } from "./deadlines";

export type Milestone = { key: string; label: string; date: string; estimated: boolean };

// Later reports are roughly every 90 days after the next one, until the stay ends.
// Only estimates: the real dates depend on when each report is filed and on travel.
export function laterReports(nextDue: string, permittedUntil: string): string[] {
  if (!permittedUntil) return [];
  const dates: string[] = [];
  let date = nextDue;
  for (let i = 0; i < 8; i++) {
    date = format(addDays(parseISO(date), 90), "yyyy-MM-dd");
    if (date > permittedUntil) break;
    dates.push(date);
  }
  return dates;
}

// Every point on the timeline, in date order: one dot per report, not one per deadline.
export function journeyMilestones(input: {
  arrivalDate: string;
  nextDue: string | null;
  permittedUntil: string;
}): Milestone[] {
  const { arrivalDate, nextDue, permittedUntil } = input;
  const milestones: Milestone[] = [];
  if (arrivalDate) {
    milestones.push({ key: "arrived", label: "Last arrival", date: arrivalDate, estimated: false });
  }
  if (nextDue) {
    milestones.push({ key: "report-0", label: "90-day report", date: nextDue, estimated: false });
    laterReports(nextDue, permittedUntil).forEach((date, index) => {
      milestones.push({ key: `report-${index + 1}`, label: "90-day report", date, estimated: true });
    });
  }
  if (permittedUntil) {
    milestones.push({ key: "stay", label: "Visa expires", date: permittedUntil, estimated: false });
  }
  return milestones.sort((a, b) => a.date.localeCompare(b.date));
}

// The first and last date the timeline has to show.
export function trackRange(dates: string[]): { start: string; end: string } {
  const sorted = [...dates].sort();
  return { start: sorted[0], end: sorted[sorted.length - 1] };
}

// Where a date sits along the timeline, from 0 (start) to 100 (end) percent.
export function trackPosition(date: string, range: { start: string; end: string }): number {
  const span = daysBetween(range.start, range.end);
  if (span === 0) return 50;
  const percent = (daysBetween(range.start, date) / span) * 100;
  return Math.min(100, Math.max(0, percent));
}

// 1 January of every new year inside the range, to mark where a year begins.
export function yearStarts(range: { start: string; end: string }): string[] {
  const starts: string[] = [];
  const first = Number(range.start.slice(0, 4)) + 1;
  const last = Number(range.end.slice(0, 4));
  for (let year = first; year <= last; year++) starts.push(`${year}-01-01`);
  return starts;
}

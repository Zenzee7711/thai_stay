import { daysBetween } from "./deadlines";

export type Milestone = { key: string; label: string; date: string };

// Every known date of the stay, in time order, for the journey track.
export function journeyMilestones(input: {
  arrivalDate: string;
  report: { opens: string; due: string; lastDay: string } | null;
  permittedUntil: string;
}): Milestone[] {
  const { arrivalDate, report, permittedUntil } = input;
  const milestones: Milestone[] = [];
  if (arrivalDate) milestones.push({ key: "arrived", label: "Arrived", date: arrivalDate });
  if (report) {
    milestones.push(
      { key: "opens", label: "Report window opens", date: report.opens },
      { key: "due", label: "Report due", date: report.due },
      { key: "last", label: "Last day before a fine", date: report.lastDay },
    );
  }
  if (permittedUntil) milestones.push({ key: "stay", label: "Stay ends", date: permittedUntil });
  return milestones.sort((a, b) => a.date.localeCompare(b.date));
}

// The first and last date the track has to show.
export function trackRange(dates: string[]): { start: string; end: string } {
  const sorted = [...dates].sort();
  return { start: sorted[0], end: sorted[sorted.length - 1] };
}

// Where a date sits along the track, from 0 (start) to 100 (end) percent.
export function trackPosition(date: string, range: { start: string; end: string }): number {
  const span = daysBetween(range.start, range.end);
  if (span === 0) return 50;
  const percent = (daysBetween(range.start, date) / span) * 100;
  return Math.min(100, Math.max(0, percent));
}

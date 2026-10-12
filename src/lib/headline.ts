import { daysBetween, type ReportStatus } from "./deadlines";
import { relativeDays, shortDate } from "./format";

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

// The one or two sentences at the top of the page that tell you where you stand.
export function headline(
  today: string,
  report: { status: ReportStatus; dates: { opens: string; due: string; lastDay: string } } | null,
  daysLeft: number | null,
): string[] {
  const lines: string[] = [];

  if (report) {
    const { status, dates } = report;
    const toDue = relativeDays(daysBetween(today, dates.due));
    if (status === "not-open-yet") {
      lines.push(`Your 90-day report window opens ${relativeDays(daysBetween(today, dates.opens))}.`);
    } else if (status === "open") {
      lines.push(`Your 90-day report is due ${toDue}.`);
    } else if (status === "grace") {
      lines.push(`Your 90-day report was due ${toDue}. File by ${shortDate(dates.lastDay)} to avoid a fine.`);
    } else {
      lines.push("Your 90-day report is late. Expect a fine when you file.");
    }
  }

  if (daysLeft !== null) {
    if (daysLeft < 0) lines.push(`You have overstayed by ${plural(-daysLeft, "day")}.`);
    else if (daysLeft === 0) lines.push("Today is your last permitted day.");
    else lines.push(`You can stay ${daysLeft} more ${daysLeft === 1 ? "day" : "days"}.`);
  }

  return lines;
}

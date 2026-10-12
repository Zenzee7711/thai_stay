import { daysBetween, type ReportStatus } from "./deadlines";
import { relativeDays, shortDate } from "./format";

function days(count: number): string {
  return `${count} ${count === 1 ? "day" : "days"}`;
}

// The sentences at the top of the page: what to do next, with the exact date.
export function headline(
  today: string,
  report: { status: ReportStatus; dates: { opens: string; due: string; lastDay: string } } | null,
  stay: { permittedUntil: string; daysLeft: number } | null,
): string[] {
  const lines: string[] = [];

  if (report) {
    const { status, dates } = report;
    const toDue = daysBetween(today, dates.due);
    if (status === "not-open-yet") {
      lines.push(`Your next 90-day report is due ${shortDate(dates.due)}.`);
    } else if (status === "open") {
      lines.push(
        toDue === 0
          ? "Your 90-day report is due today."
          : `File your 90-day report now. It's due ${relativeDays(toDue)} (${shortDate(dates.due)}).`,
      );
    } else if (status === "grace") {
      lines.push(`Your 90-day report is overdue. File by ${shortDate(dates.lastDay)} to avoid a fine.`);
    } else {
      lines.push("Your 90-day report is late. You may be fined 2,000 THB when you file.");
    }
  }

  if (stay) {
    const { permittedUntil, daysLeft } = stay;
    if (daysLeft < 0) lines.push(`You've overstayed by ${days(-daysLeft)}.`);
    else if (daysLeft === 0) lines.push("Today is the last day you can stay.");
    else lines.push(`You can stay until ${shortDate(permittedUntil)} (${days(daysLeft)} left).`);
  }

  return lines;
}

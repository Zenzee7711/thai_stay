import { addDays, format, parseISO } from "date-fns";
import type { CalendarEvent } from "./calendar";

// Calendar text treats \ ; , and newlines as special, so they need a backslash.
function escapeText(text: string): string {
  return text.replace(/[\\;,]/g, (char) => `\\${char}`).replace(/\n/g, "\\n");
}

// "2027-01-10" -> "20270110", the date format calendar files use.
function compactDate(date: string): string {
  return date.replaceAll("-", "");
}

// When to alert, counted from the start of the all-day event (midnight).
// "PT9H" = 9:00 on the day. N days before at 9:00 = minus (N-1) days and 15 hours.
function reminderTrigger(daysBefore: number): string {
  return daysBefore === 0 ? "PT9H" : `-P${daysBefore - 1}DT15H`;
}

function alarm(title: string, daysBefore: number): string[] {
  return [
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(title)}`,
    `TRIGGER:${reminderTrigger(daysBefore)}`,
    "END:VALARM",
  ];
}

// Builds an .ics file: plain text that Apple Calendar, Outlook and Google can import.
// "now" is passed in (like "today" in deadlines.ts) so tests get the same output every time.
export function buildCalendar(events: CalendarEvent[], now: Date): string {
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Thai Stay//EN", "CALSCALE:GREGORIAN"];

  events.forEach((event, index) => {
    // An all-day event ends at the start of the next day.
    const nextDay = format(addDays(parseISO(event.date), 1), "yyyy-MM-dd");
    lines.push(
      "BEGIN:VEVENT",
      `UID:${compactDate(event.date)}-${index}@thai-stay`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compactDate(event.date)}`,
      `DTEND;VALUE=DATE:${compactDate(nextDay)}`,
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${escapeText(event.details)}`,
      ...alarm(event.title, 0),
      ...event.remindDaysBefore.flatMap((days) => alarm(event.title, days)),
      "END:VEVENT",
    );
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

import { addDays, format, parseISO } from "date-fns";

export type CalendarEvent = { date: string; title: string };

// Calendar text treats \ ; , and newlines as special, so they need a backslash.
function escapeText(text: string): string {
  return text.replace(/[\\;,]/g, (char) => `\\${char}`).replace(/\n/g, "\\n");
}

// "2027-01-10" -> "20270110", the date format calendar files use.
function compactDate(date: string): string {
  return date.replaceAll("-", "");
}

// Builds an .ics file: plain text that Google, Apple and Outlook calendars can import.
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
      "END:VEVENT",
    );
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

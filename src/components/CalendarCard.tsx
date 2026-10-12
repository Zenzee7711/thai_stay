import Card from "@/components/Card";
import { googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";
import { shortDate } from "@/lib/format";
import { buildCalendar } from "@/lib/ics";

// Turns the events into a file and makes the browser download it.
function downloadCalendar(events: CalendarEvent[]) {
  const file = new Blob([buildCalendar(events, new Date())], { type: "text/calendar" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "thai-stay-deadlines.ics";
  link.click();
  URL.revokeObjectURL(url);
}

export default function CalendarCard({ events }: { events: CalendarEvent[] }) {
  return (
    <Card title="Add to calendar">
      <ul className="mt-5 divide-y divide-line border-y border-line">
        {events.map((event) => (
          <li key={event.title} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate">{event.title}</p>
              <p className="text-sm text-muted tabular-nums">{shortDate(event.date)}</p>
            </div>
            <a
              href={googleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Add "${event.title}" to Google Calendar`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm transition hover:border-accent hover:text-accent"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-3.5 w-3.5">
                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Google
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => downloadCalendar(events)}
        className="mt-6 w-full rounded-full bg-foreground px-5 py-3 font-medium text-background transition hover:opacity-85 sm:w-auto"
      >
        Download all for iPhone or Outlook
      </button>
      <p className="mt-3 text-xs text-muted">
        Includes reminders before each date.
      </p>
    </Card>
  );
}

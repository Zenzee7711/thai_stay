import Card from "@/components/Card";
import { googleCalendarUrl, type CalendarEvent } from "@/lib/calendar";
import { displayDate } from "@/lib/format";
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
    <Card title="Add to your calendar">
      <p className="mt-1 text-sm text-muted">
        Google Calendar: tap a date, then Save. iPhone and Outlook: download them all at once.
      </p>

      <ul className="mt-4 divide-y divide-line">
        {events.map((event) => (
          <li key={event.title} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-muted">{displayDate(event.date)}</p>
            </div>
            <a
              href={googleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-lg border border-line px-3 py-2 text-sm font-medium hover:border-accent hover:text-accent"
            >
              Google Calendar
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => downloadCalendar(events)}
        className="mt-4 w-full rounded-xl bg-accent px-5 py-3 font-semibold text-accent-foreground transition hover:opacity-90 focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:outline-none sm:w-auto"
      >
        Download all for iPhone / Outlook (.ics)
      </button>
      <p className="mt-2 text-xs text-muted">
        Includes reminders: 9:00 on each day, plus earlier alerts before the due date, the last day
        and the end of your stay.
      </p>
    </Card>
  );
}

import { addDays, format, parseISO } from "date-fns";

export type CalendarEvent = {
  date: string; // YYYY-MM-DD, an all-day event
  title: string;
  details: string;
  remindDaysBefore: number[]; // extra reminders on top of the one on the day itself
};

const footer = "From Thai Stay (thai-stay-one.vercel.app). Not legal advice: check with Immigration.";

// Turns the deadlines we know about into calendar events, with reminders.
export function deadlineEvents(
  report: { opens: string; due: string; lastDay: string } | null,
  permittedUntil: string,
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  if (report) {
    events.push(
      {
        date: report.opens,
        title: "90-day report: you can file from today",
        details: `Your 90-day report (TM.47) can be filed from today. ${footer}`,
        remindDaysBefore: [],
      },
      {
        date: report.due,
        title: "90-day report due",
        details: `Your 90-day report (TM.47) is due today. ${footer}`,
        remindDaysBefore: [3],
      },
      {
        date: report.lastDay,
        title: "90-day report: last day without a fine",
        details: `File today at the latest. After today the usual fine is 2000 THB. ${footer}`,
        remindDaysBefore: [2],
      },
    );
  }
  if (permittedUntil) {
    events.push({
      date: permittedUntil,
      title: "Last day of your permitted stay in Thailand",
      details: `Leave Thailand or get an extension by today. Overstaying costs 500 THB a day. ${footer}`,
      remindDaysBefore: [30, 7],
    });
  }
  return events;
}

// A link that opens Google Calendar with the event filled in, ready to save.
export function googleCalendarUrl(event: CalendarEvent): string {
  const start = event.date.replaceAll("-", "");
  const end = format(addDays(parseISO(event.date), 1), "yyyyMMdd"); // all-day events end the next day
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: event.details,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

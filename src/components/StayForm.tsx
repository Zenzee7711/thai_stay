"use client";

import { useState } from "react";
import { format } from "date-fns";
import Card from "@/components/Card";
import DateField from "@/components/DateField";
import ReportCard from "@/components/ReportCard";
import StayCard from "@/components/StayCard";
import { daysBetween, nextReportDue, reportStatus, reportWindow } from "@/lib/deadlines";
import { buildCalendar, type CalendarEvent } from "@/lib/ics";

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

// Holds every input's state, works out the deadlines, and hands them to the cards.
export default function StayForm() {
  const [arrivalDate, setArrivalDate] = useState("");
  const [slipDueDate, setSlipDueDate] = useState("");
  const [permittedUntil, setPermittedUntil] = useState("");
  const [hasReentryPermit, setHasReentryPermit] = useState(false);

  // The real "today", in the same YYYY-MM-DD text format as everything else.
  const today = format(new Date(), "yyyy-MM-dd");

  const due = nextReportDue(arrivalDate, slipDueDate);
  const reportDates = due ? reportWindow(due.date) : null;
  const status = reportDates ? reportStatus(today, reportDates) : null;
  const daysLeft = permittedUntil ? daysBetween(today, permittedUntil) : null;

  const calendarEvents: CalendarEvent[] = [];
  if (reportDates) {
    calendarEvents.push(
      { date: reportDates.opens, title: "90-day report window opens" },
      { date: reportDates.due, title: "90-day report due" },
      { date: reportDates.lastDay, title: "Last day to file 90-day report before a fine" },
    );
  }
  if (permittedUntil) {
    calendarEvents.push({ date: permittedUntil, title: "Permission to stay in Thailand ends" });
  }

  return (
    <div className="mt-8 space-y-6">
      <Card title="Your dates">
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <DateField
            id="arrival"
            label="Last arrival in Thailand"
            value={arrivalDate}
            onChange={setArrivalDate}
          />
          <DateField
            id="permitted"
            label="Permitted to stay until"
            value={permittedUntil}
            onChange={setPermittedUntil}
          />
          <div className="sm:col-span-2">
            <DateField
              id="slip"
              label="Next report due, from your TM.47 slip (optional)"
              hint="Leave empty for your first report, or if you've left Thailand since your last one. Leaving resets the 90-day count."
              value={slipDueDate}
              onChange={setSlipDueDate}
            />
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={hasReentryPermit}
            onChange={(event) => setHasReentryPermit(event.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          I have a re-entry permit or a multiple-entry visa
        </label>
      </Card>

      {!reportDates && daysLeft === null && (
        <p className="rounded-2xl border border-dashed border-line p-6 text-center text-muted">
          Enter your arrival date or your permitted-until date to see your deadlines.
        </p>
      )}

      {due && reportDates && status && (
        <ReportCard today={today} status={status} source={due.source} dates={reportDates} />
      )}

      {daysLeft !== null && (
        <StayCard
          permittedUntil={permittedUntil}
          daysLeft={daysLeft}
          hasReentryPermit={hasReentryPermit}
        />
      )}

      {calendarEvents.length > 0 && (
        <button
          type="button"
          onClick={() => downloadCalendar(calendarEvents)}
          className="w-full rounded-xl bg-accent px-5 py-3 font-semibold text-accent-foreground transition hover:opacity-90 focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:outline-none sm:w-auto"
        >
          Add {calendarEvents.length} dates to my calendar
        </button>
      )}
    </div>
  );
}

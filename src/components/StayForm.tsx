"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  daysBetween,
  nextReportDue,
  reportStatus,
  reportWindow,
  type ReportStatus,
} from "@/lib/deadlines";
import { buildCalendar, type CalendarEvent } from "@/lib/ics";

const statusMessages: Record<ReportStatus, string> = {
  "not-open-yet": "Not yet: your reporting window hasn't opened.",
  open: "Report now: your window is open.",
  grace: "Past the due date: report before the last day to avoid a fine.",
  late: "Late: you may have to pay a fine at the immigration office.",
};

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
    <section className="mt-8">
      <label htmlFor="arrival" className="block font-medium">
        When did you last arrive in Thailand?
      </label>
      <input
        id="arrival"
        type="date"
        value={arrivalDate}
        onChange={(event) => setArrivalDate(event.target.value)}
        className="mt-2 rounded border px-3 py-2"
      />

      <label htmlFor="slip" className="mt-6 block font-medium">
        Next report due, from your last TM.47 slip (optional)
      </label>
      <p className="text-sm">
        Leave empty if this is your first report, or if you have left Thailand since your last
        report. Leaving resets the 90-day count.
      </p>
      <input
        id="slip"
        type="date"
        value={slipDueDate}
        onChange={(event) => setSlipDueDate(event.target.value)}
        className="mt-2 rounded border px-3 py-2"
      />

      {due && reportDates && status && (
        <div className="mt-6">
          <p className="font-medium">{statusMessages[status]}</p>
          <ul className="mt-2 space-y-1">
            <li>Window opens: {reportDates.opens}</li>
            <li>
              Report due: {reportDates.due}{" "}
              {due.source === "slip" ? "(from your slip)" : "(estimated from your arrival date)"}
            </li>
            <li>Last day before a fine: {reportDates.lastDay}</li>
          </ul>
        </div>
      )}

      <label htmlFor="permitted" className="mt-8 block font-medium">
        Permitted to stay until (from your passport stamp)
      </label>
      <input
        id="permitted"
        type="date"
        value={permittedUntil}
        onChange={(event) => setPermittedUntil(event.target.value)}
        className="mt-2 rounded border px-3 py-2"
      />

      {daysLeft !== null && (
        <p className="mt-4 font-medium">
          {daysLeft >= 0
            ? `Your permission to stay ends in ${daysLeft} days.`
            : `You have overstayed by ${-daysLeft} days. Contact immigration now.`}
        </p>
      )}

      <label className="mt-8 flex items-center gap-2">
        <input
          type="checkbox"
          checked={hasReentryPermit}
          onChange={(event) => setHasReentryPermit(event.target.checked)}
        />
        I have a re-entry permit or a multiple-entry visa
      </label>

      {permittedUntil && !hasReentryPermit && (
        <p className="mt-2">
          If you leave Thailand without a re-entry permit, your current permission to stay ends.
          Get one before you travel.
        </p>
      )}

      {calendarEvents.length > 0 && (
        <button
          type="button"
          onClick={() => downloadCalendar(calendarEvents)}
          className="mt-8 block rounded border px-4 py-2 font-medium"
        >
          Add these dates to my calendar (.ics)
        </button>
      )}
    </section>
  );
}

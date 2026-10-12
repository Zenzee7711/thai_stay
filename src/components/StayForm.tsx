"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  daysBetween,
  firstReportDue,
  reportStatus,
  reportWindow,
  type ReportStatus,
} from "@/lib/deadlines";

const statusMessages: Record<ReportStatus, string> = {
  "not-open-yet": "Not yet: your reporting window hasn't opened.",
  open: "Report now: your window is open.",
  grace: "Past the due date: report before the last day to avoid a fine.",
  late: "Late: you may have to pay a fine at the immigration office.",
};

export default function StayForm() {
  const [arrivalDate, setArrivalDate] = useState("");
  const [permittedUntil, setPermittedUntil] = useState("");

  // The real "today", in the same YYYY-MM-DD text format as everything else.
  const today = format(new Date(), "yyyy-MM-dd");

  const dueDate = arrivalDate ? firstReportDue(arrivalDate) : null;
  const reportDates = dueDate ? reportWindow(dueDate) : null;
  const status = reportDates ? reportStatus(today, reportDates) : null;
  const daysLeft = permittedUntil ? daysBetween(today, permittedUntil) : null;

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

      {reportDates && status && (
        <div className="mt-6">
          <p className="font-medium">{statusMessages[status]}</p>
          <ul className="mt-2 space-y-1">
            <li>Window opens: {reportDates.opens}</li>
            <li>Report due: {reportDates.due}</li>
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
    </section>
  );
}

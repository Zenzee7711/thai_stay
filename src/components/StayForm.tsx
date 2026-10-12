"use client";

import { useState } from "react";
import { firstReportDue, reportWindow } from "@/lib/deadlines";

export default function StayForm() {
  const [arrivalDate, setArrivalDate] = useState("");

  const dueDate = arrivalDate ? firstReportDue(arrivalDate) : null;
  const reportDates = dueDate ? reportWindow(dueDate) : null;

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

      {reportDates && (
        <ul className="mt-6 space-y-1">
          <li>Window opens: {reportDates.opens}</li>
          <li>Report due: {reportDates.due}</li>
          <li>Last day before a fine: {reportDates.lastDay}</li>
        </ul>
      )}
    </section>
  );
}
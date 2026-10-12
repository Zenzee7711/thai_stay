"use client";

import { useState } from "react";
import { format } from "date-fns";
import CalendarCard from "@/components/CalendarCard";
import Card from "@/components/Card";
import DateField from "@/components/DateField";
import ReportCard from "@/components/ReportCard";
import StayCard from "@/components/StayCard";
import { daysBetween, nextReportDue, reportStatus, reportWindow } from "@/lib/deadlines";
import { useStoredProfile } from "@/hooks/useStoredProfile";
import { deadlineEvents } from "@/lib/calendar";
import { afterReentry, type Profile } from "@/lib/profile";

// Holds every input's state, works out the deadlines, and hands them to the cards.
export default function StayForm() {
  const { profile, save, clear } = useStoredProfile();
  const { arrivalDate, slipDueDate, permittedUntil, hasReentryPermit } = profile;

  // Change some fields, keep the rest, and save it all.
  function update(changes: Partial<Profile>) {
    save({ ...profile, ...changes });
  }

  const hasAnyDate = Boolean(arrivalDate || slipDueDate || permittedUntil);

  // A short confirmation after one of the quick-update buttons is used.
  const [notice, setNotice] = useState("");

  // The real "today", in the same YYYY-MM-DD text format as everything else.
  const today = format(new Date(), "yyyy-MM-dd");

  const due = nextReportDue(arrivalDate, slipDueDate);
  const reportDates = due ? reportWindow(due.date) : null;
  const status = reportDates ? reportStatus(today, reportDates) : null;
  const daysLeft = permittedUntil ? daysBetween(today, permittedUntil) : null;

  const calendarEvents = deadlineEvents(reportDates, permittedUntil);

  function cameBackToday() {
    save(afterReentry(profile, today));
    setNotice(
      "Your 90-day count restarted today. Check the new stamp in your passport and update \"Permitted to stay until\" if it changed.",
    );
  }

  function filedReport(nextDue: string) {
    update({ slipDueDate: nextDue });
    setNotice("Saved. Your next report is now counted from the date on your receipt.");
  }

  return (
    <div className="mt-8 space-y-6">
      <Card title="Your dates">
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <DateField
            id="arrival"
            label="Last arrival in Thailand"
            value={arrivalDate}
            onChange={(value) => update({ arrivalDate: value })}
          />
          <DateField
            id="permitted"
            label="Permitted to stay until"
            value={permittedUntil}
            onChange={(value) => update({ permittedUntil: value })}
          />
          <div className="sm:col-span-2">
            <DateField
              id="slip"
              label="Next report due, from your TM.47 slip (optional)"
              hint="Leave empty for your first report, or if you've left Thailand since your last one. Leaving resets the 90-day count."
              value={slipDueDate}
              onChange={(value) => update({ slipDueDate: value })}
            />
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={hasReentryPermit}
            onChange={(event) => update({ hasReentryPermit: event.target.checked })}
            className="h-4 w-4 accent-accent"
          />
          I have a re-entry permit or a multiple-entry visa
        </label>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={cameBackToday}
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium hover:border-accent hover:text-accent"
          >
            I just came back to Thailand
          </button>
          {hasAnyDate && (
            <button
              type="button"
              onClick={() => {
                clear();
                setNotice("");
              }}
              className="text-sm text-muted underline underline-offset-4 hover:text-foreground"
            >
              Clear my dates
            </button>
          )}
        </div>

        {notice && (
          <p role="status" className="mt-4 rounded-lg bg-background p-3 text-sm">
            {notice}
          </p>
        )}
      </Card>

      {!reportDates && daysLeft === null && (
        <p className="rounded-2xl border border-dashed border-line p-6 text-center text-muted">
          Enter your arrival date or your permitted-until date to see your deadlines.
        </p>
      )}

      {due && reportDates && status && (
        <ReportCard
          today={today}
          status={status}
          source={due.source}
          dates={reportDates}
          onFiled={filedReport}
        />
      )}

      {daysLeft !== null && (
        <StayCard
          permittedUntil={permittedUntil}
          daysLeft={daysLeft}
          hasReentryPermit={hasReentryPermit}
        />
      )}

      {calendarEvents.length > 0 && <CalendarCard events={calendarEvents} />}
    </div>
  );
}

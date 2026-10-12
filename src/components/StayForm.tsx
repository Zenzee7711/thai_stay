"use client";

import { useState } from "react";
import { format } from "date-fns";
import CalendarCard from "@/components/CalendarCard";
import DateField from "@/components/DateField";
import JourneyTrack from "@/components/JourneyTrack";
import ReportCard from "@/components/ReportCard";
import StayCard from "@/components/StayCard";
import Switch from "@/components/Switch";
import { useStoredProfile } from "@/hooks/useStoredProfile";
import { deadlineEvents } from "@/lib/calendar";
import { daysBetween, nextReportDue, reportStatus, reportWindow } from "@/lib/deadlines";
import { headline } from "@/lib/headline";
import { journeyMilestones } from "@/lib/journey";
import { shortDate } from "@/lib/format";
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

  const sentences = headline(
    today,
    reportDates && status ? { status, dates: reportDates } : null,
    daysLeft !== null ? { permittedUntil, daysLeft } : null,
  );
  const milestones = journeyMilestones({ arrivalDate, nextDue: due?.date ?? null, permittedUntil });
  const calendarEvents = deadlineEvents(reportDates, permittedUntil);

  function cameBackToday() {
    save(afterReentry(profile, today));
    setNotice(
      "Done. Your 90-day count now starts today. If you got a new stamp, update \"Allowed to stay until\".",
    );
  }

  function filedReport(nextDue: string) {
    update({ slipDueDate: nextDue });
    setNotice(`Saved. Your next report is due ${shortDate(nextDue)}.`);
  }

  return (
    <div className="mt-12 sm:mt-16">
      {/* The headline: where you stand, in one or two sentences. */}
      <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-balance sm:text-5xl">
        {sentences.length > 0 ? (
          sentences.map((sentence, index) => (
            <span key={sentence} className={index > 0 ? "text-muted" : ""}>
              {sentence}{" "}
            </span>
          ))
        ) : (
          <>
            Track your 90-day report and visa dates in Thailand.{" "}
            <span className="text-muted">Start by adding your dates below.</span>
          </>
        )}
      </h1>

      {milestones.length > 0 && (
        <div className="mt-12">
          <JourneyTrack today={today} milestones={milestones} report={reportDates} />
        </div>
      )}

      <section aria-labelledby="dates-heading" className="mt-14">
        <h2 id="dates-heading" className="sr-only">
          Your dates
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <DateField
            id="arrival"
            label="Last arrival"
            value={arrivalDate}
            onChange={(value) => update({ arrivalDate: value })}
          />
          <DateField
            id="permitted"
            label="Allowed to stay until"
            value={permittedUntil}
            onChange={(value) => update({ permittedUntil: value })}
          />
          <DateField
            id="slip"
            label="Next report due"
            value={slipDueDate}
            onChange={(value) => update({ slipDueDate: value })}
          />
        </div>
        <p className="mt-3 text-sm text-muted">
          The first two dates are on the latest entry stamp in your passport. The next report date
          is on your last TM.47 receipt. Leave it blank before your first report, or if you have
          travelled abroad since.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Switch
            checked={hasReentryPermit}
            onChange={(checked) => update({ hasReentryPermit: checked })}
            label="I have a re-entry permit"
          />
          <button
            type="button"
            onClick={cameBackToday}
            className="rounded-full border border-line px-4 py-2 text-sm transition hover:border-foreground/30"
          >
            I just re-entered Thailand
          </button>
          {hasAnyDate && (
            <button
              type="button"
              onClick={() => {
                clear();
                setNotice("");
              }}
              className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-foreground"
            >
              Clear dates
            </button>
          )}
        </div>

        {notice && (
          <p role="status" className="mt-5 rounded-2xl bg-accent/10 px-4 py-3 text-sm motion-safe:animate-rise">
            {notice}
          </p>
        )}
      </section>

      <div className="mt-12 space-y-5">
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
    </div>
  );
}

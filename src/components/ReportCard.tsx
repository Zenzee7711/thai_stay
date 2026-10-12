import { useState } from "react";
import Card from "@/components/Card";
import DateField from "@/components/DateField";
import GuideDetails from "@/components/GuideDetails";
import { daysBetween, suggestNextDue, type ReportStatus } from "@/lib/deadlines";
import { relativeDays, shortDate } from "@/lib/format";
import { reportGuide } from "@/lib/guides";

type ReportDates = { opens: string; due: string; lastDay: string };

// Per status: a short badge, its colours, and one clear instruction with the date that matters.
const statusStyles: Record<
  ReportStatus,
  { badge: string; colors: string; advice: (dates: ReportDates) => string }
> = {
  "not-open-yet": {
    badge: "Upcoming",
    colors: "bg-line/60 text-muted",
    advice: (dates) => `You can file from ${shortDate(dates.opens)}.`,
  },
  open: {
    badge: "File now",
    colors: "bg-accent/12 text-accent",
    advice: () => "You can file now, online or at your immigration office.",
  },
  grace: {
    badge: "Overdue",
    colors: "bg-amber-400/15 text-amber-700 dark:text-amber-300",
    advice: (dates) => `File by ${shortDate(dates.lastDay)} to avoid a 2,000 THB fine.`,
  },
  late: {
    badge: "Late",
    colors: "bg-red-500/12 text-red-700 dark:text-red-300",
    advice: () => "The grace period has ended. You may be fined 2,000 THB when you file.",
  },
};

type ReportCardProps = {
  today: string;
  status: ReportStatus;
  source: "slip" | "estimate";
  dates: ReportDates;
  onFiled: (nextDue: string) => void;
};

export default function ReportCard({ today, status, source, dates, onFiled }: ReportCardProps) {
  const style = statusStyles[status];
  const suggestion = suggestNextDue(dates.due);
  const rows = [
    { label: "Can file from", date: dates.opens },
    { label: "Due date", date: dates.due },
    { label: "Last day without a fine", date: dates.lastDay },
  ];

  // Whether the "mark as filed" box is open, and the date typed into it.
  const [filing, setFiling] = useState(false);
  const [nextDue, setNextDue] = useState("");

  function startFiling() {
    setNextDue(suggestion);
    setFiling(true);
  }

  function saveFiling() {
    if (!nextDue) return;
    onFiled(nextDue);
    setFiling(false);
  }

  return (
    <Card title="90-day report (TM.47)">
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-serif text-4xl sm:text-5xl">
          Due {relativeDays(daysBetween(today, dates.due))}
        </p>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${style.colors}`}>
          {style.badge}
        </span>
      </div>
      <p className="mt-2 text-muted">{style.advice(dates)}</p>

      <dl className="mt-6 divide-y divide-line border-y border-line">
        {rows.map((row) => {
          const days = daysBetween(today, row.date);
          return (
            <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
              <dt className={days < 0 ? "text-muted" : ""}>{row.label}</dt>
              <dd className="text-right tabular-nums">
                {shortDate(row.date)}
                <span className="ml-2 text-sm text-muted">{relativeDays(days)}</span>
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-3 text-sm text-muted">
        {source === "slip"
          ? "Dates based on the due date from your receipt."
          : "Estimated from your arrival date. After you file, use the date on your receipt."}
      </p>

      {status !== "not-open-yet" && !filing && (
        <button
          type="button"
          onClick={startFiling}
          className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-85"
        >
          Mark as filed
        </button>
      )}

      {filing && (
        <div className="mt-6 rounded-2xl bg-background p-5 motion-safe:animate-rise">
          <DateField
            id="next-due"
            label="Next report due (on your new receipt)"
            hint={`Usually 90 days later. We filled in ${shortDate(suggestion)}; change it if your receipt shows a different date.`}
            value={nextDue}
            onChange={setNextDue}
          />
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={saveFiling}
              disabled={!nextDue}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setFiling(false)}
              className="rounded-full px-5 py-2.5 text-sm text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <GuideDetails guide={reportGuide} />
      </div>
    </Card>
  );
}

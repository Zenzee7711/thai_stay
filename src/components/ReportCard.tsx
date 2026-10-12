import { useState } from "react";
import Card from "@/components/Card";
import DateField from "@/components/DateField";
import GuideDetails from "@/components/GuideDetails";
import { daysBetween, filingMethod, suggestNextDue, type ReportStatus } from "@/lib/deadlines";
import { displayDate, relativeDays, shortDate } from "@/lib/format";
import { reportGuide } from "@/lib/guides";
import { closedPhrase, lastOpenDayBy, officeClosedReason } from "@/lib/holidays";

type ReportDates = { opens: string; due: string; lastDay: string };

// Per status: a short badge, its colours, and one line saying what to do.
const statusStyles: Record<
  ReportStatus,
  { badge: string; colors: string; advice: (dates: ReportDates) => string }
> = {
  "not-open-yet": {
    badge: "Not yet",
    colors: "bg-line/60 text-muted",
    advice: (dates) => `You can do it from ${shortDate(dates.opens)}.`,
  },
  open: {
    badge: "Do it now",
    colors: "bg-accent/12 text-accent",
    advice: () => "You can do it now.",
  },
  grace: {
    badge: "Overdue",
    colors: "bg-amber-400/15 text-amber-700 dark:text-amber-300",
    advice: (dates) => `Do it by ${shortDate(dates.lastDay)} to avoid a fine.`,
  },
  late: {
    badge: "Late",
    colors: "bg-red-500/12 text-red-700 dark:text-red-300",
    advice: () => "You will likely pay a 2,000 THB fine.",
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
  const howToFile = filingMethod(source, status);
  const suggestion = suggestNextDue(dates.due);

  // Going in person? If the deadline that matters falls on a weekend or holiday, say when to go.
  const deadline = status === "grace" ? dates.lastDay : dates.due;
  const closedReason = howToFile.method === "in-person" ? officeClosedReason(deadline) : null;
  const rows = [
    { label: "Earliest day", date: dates.opens },
    { label: "Due", date: dates.due },
    { label: "Last day, no fine", date: dates.lastDay },
  ];

  // Whether the "I did my report" box is open, and the date typed into it.
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
    <Card title="90-day report">
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-serif text-4xl sm:text-5xl">
          Due {relativeDays(daysBetween(today, dates.due))}
        </p>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${style.colors}`}>
          {style.badge}
        </span>
      </div>
      <p className="mt-2 text-muted">
        {style.advice(dates)}{" "}
        <span className="text-foreground">
          {howToFile.method === "in-person" ? "Go in person." : "Online is OK."}
        </span>{" "}
        {howToFile.reason}{" "}
        {howToFile.method === "online-or-in-person" && (
          <a
            href="https://tm47.immigration.go.th/tm47/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2"
          >
            Report online
          </a>
        )}
      </p>

      {closedReason && status !== "late" && (
        <p className="mt-4 flex gap-3 rounded-2xl bg-amber-400/10 p-4 text-sm">
          <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          <span>
            {shortDate(deadline)} {closedPhrase(closedReason)}. Offices are closed, so go by{" "}
            <span className="font-medium">{displayDate(lastOpenDayBy(deadline))}</span>.
          </span>
        </p>
      )}

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

      {status !== "not-open-yet" && !filing && (
        <button
          type="button"
          onClick={startFiling}
          className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-85"
        >
          I did my report
        </button>
      )}

      {filing && (
        <div className="mt-6 rounded-2xl bg-background p-5 motion-safe:animate-rise">
          <DateField
            id="next-due"
            label="Next due date on your new receipt"
            hint="Usually 90 days later. Check your receipt."
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

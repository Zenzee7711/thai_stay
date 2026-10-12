import { useState } from "react";
import Card from "@/components/Card";
import DateField from "@/components/DateField";
import GuideDetails from "@/components/GuideDetails";
import { daysBetween, suggestNextDue, type ReportStatus } from "@/lib/deadlines";
import { displayDate, relativeDays, shortDate } from "@/lib/format";
import { reportGuide } from "@/lib/guides";

// One entry per status: the badge text, its colours, and what to do.
const statusStyles: Record<ReportStatus, { badge: string; colors: string; advice: string }> = {
  "not-open-yet": {
    badge: "Not open yet",
    colors: "bg-line/60 text-muted",
    advice: "Nothing to do yet. Your reporting window hasn't opened.",
  },
  open: {
    badge: "Report now",
    colors: "bg-accent/12 text-accent",
    advice: "Your window is open. Report online or at your immigration office.",
  },
  grace: {
    badge: "Overdue, no fine yet",
    colors: "bg-amber-400/15 text-amber-700 dark:text-amber-300",
    advice: "You're past the due date. Report before the last day to avoid a fine.",
  },
  late: {
    badge: "Late",
    colors: "bg-red-500/12 text-red-700 dark:text-red-300",
    advice: "The grace period is over. Expect a fine when you report at the immigration office.",
  },
};

type ReportCardProps = {
  today: string;
  status: ReportStatus;
  source: "slip" | "estimate";
  dates: { opens: string; due: string; lastDay: string };
  onFiled: (nextDue: string) => void;
};

export default function ReportCard({ today, status, source, dates, onFiled }: ReportCardProps) {
  const style = statusStyles[status];
  const suggestion = suggestNextDue(dates.due);
  const steps = [
    { label: "Window opens", date: dates.opens },
    { label: "Report due", date: dates.due },
    { label: "Last day before a fine", date: dates.lastDay },
  ];

  // Whether the "I've filed" box is open, and the date typed into it.
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
    <Card title="90-day report · TM.47">
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-serif text-4xl sm:text-5xl">
          Due {relativeDays(daysBetween(today, dates.due))}
        </p>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${style.colors}`}>
          {style.badge}
        </span>
      </div>
      <p className="mt-2 text-muted">{style.advice}</p>

      <dl className="mt-6 divide-y divide-line border-y border-line">
        {steps.map((step) => {
          const days = daysBetween(today, step.date);
          return (
            <div key={step.label} className="flex items-baseline justify-between gap-4 py-3">
              <dt className={days < 0 ? "text-muted line-through decoration-line" : ""}>{step.label}</dt>
              <dd className="text-right tabular-nums">
                {shortDate(step.date)}
                <span className="ml-2 text-sm text-muted">{relativeDays(days)}</span>
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-3 text-sm text-muted">
        {source === "slip"
          ? "Due date taken from your TM.47 slip."
          : "Estimated from your arrival date. After your first report, use the date on your slip."}
      </p>

      {status !== "not-open-yet" && !filing && (
        <button
          type="button"
          onClick={startFiling}
          className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-85"
        >
          I&apos;ve filed this report
        </button>
      )}

      {filing && (
        <div className="mt-6 rounded-2xl bg-background p-5 motion-safe:animate-rise">
          <DateField
            id="next-due"
            label="Next due date on your new receipt"
            hint={`Usually about 90 days later, around ${displayDate(suggestion)}. Use the date on your receipt.`}
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

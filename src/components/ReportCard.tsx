import { useState } from "react";
import Card from "@/components/Card";
import DateField from "@/components/DateField";
import { daysBetween, suggestNextDue, type ReportStatus } from "@/lib/deadlines";
import { displayDate, relativeDays } from "@/lib/format";

// One entry per status: the badge text, its colours, and what to do.
const statusStyles: Record<ReportStatus, { badge: string; colors: string; advice: string }> = {
  "not-open-yet": {
    badge: "Not open yet",
    colors: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    advice: "Nothing to do yet. Your reporting window hasn't opened.",
  },
  open: {
    badge: "Report now",
    colors: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    advice: "Your window is open. Report online or at your immigration office.",
  },
  grace: {
    badge: "Overdue, no fine yet",
    colors: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    advice: "You're past the due date. Report before the last day to avoid a fine.",
  },
  late: {
    badge: "Late",
    colors: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
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
  const steps = [
    { label: "Window opens", date: dates.opens },
    { label: "Report due", date: dates.due },
    { label: "Last day before a fine", date: dates.lastDay },
  ];

  return (
    <Card title="90-day report (TM.47)">
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${style.colors}`}>
          {style.badge}
        </span>
        <span className="text-2xl font-bold">
          Due {relativeDays(daysBetween(today, dates.due))}
        </span>
      </div>
      <p className="mt-2 text-muted">{style.advice}</p>

      {/* A vertical timeline: a dot per date, filled in once that date has arrived. */}
      <ol className="mt-6">
        {steps.map((step, index) => {
          const days = daysBetween(today, step.date);
          const reached = days <= 0;
          return (
            <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0">
              {index < steps.length - 1 && (
                <span aria-hidden="true" className="absolute top-5 left-[7px] h-full w-px bg-line" />
              )}
              <span
                aria-hidden="true"
                className={`relative mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                  reached ? "border-accent bg-accent" : "border-line bg-card"
                }`}
              />
              <div>
                <p className="font-medium">{step.label}</p>
                <p className="text-sm text-muted">
                  {displayDate(step.date)} · {relativeDays(days)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {status !== "not-open-yet" && !filing && (
        <button
          type="button"
          onClick={startFiling}
          className="mt-6 rounded-xl border border-line px-4 py-2.5 font-medium hover:border-accent hover:text-accent"
        >
          I&apos;ve filed this report
        </button>
      )}

      {filing && (
        <div className="mt-6 rounded-xl border border-line bg-background p-4">
          <DateField
            id="next-due"
            label="Next due date, printed on your new receipt"
            hint={`Usually about 90 days later, around ${displayDate(suggestion)}. Use the date on your receipt.`}
            value={nextDue}
            onChange={setNextDue}
          />
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={saveFiling}
              disabled={!nextDue}
              className="rounded-xl bg-accent px-4 py-2.5 font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setFiling(false)}
              className="rounded-xl px-4 py-2.5 text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <p className="mt-6 border-t border-line pt-4 text-sm text-muted">
        {source === "slip"
          ? "Due date taken from your TM.47 slip."
          : "Due date estimated from your arrival date. After your first report, use the date printed on your slip."}
      </p>
    </Card>
  );
}

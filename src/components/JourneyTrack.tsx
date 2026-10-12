import { useState } from "react";
import { daysBetween } from "@/lib/deadlines";
import { dayMonth, displayDate, relativeDays } from "@/lib/format";
import { trackPosition, trackRange, type Milestone } from "@/lib/journey";

type JourneyTrackProps = {
  today: string;
  milestones: Milestone[];
  report: { opens: string; due: string; lastDay: string } | null;
};

// Your whole stay on one line: shaded report window, today's dot, and a tappable dot per date.
export default function JourneyTrack({ today, milestones, report }: JourneyTrackProps) {
  const [chosenKey, setChosenKey] = useState<string | null>(null);

  const range = trackRange([today, ...milestones.map((m) => m.date)]);
  const at = (date: string) => trackPosition(date, range);

  // Until something is tapped, highlight the next thing coming up.
  const next = milestones.find((m) => m.date >= today) ?? milestones[milestones.length - 1];
  const chosen = milestones.find((m) => m.key === chosenKey) ?? next;

  return (
    <section aria-label="Your stay at a glance" className="motion-safe:animate-rise">
      {/* mx-3 leaves room for the dots at both ends. */}
      <div className="relative mx-3 h-16">
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
        <span
          className="absolute top-1/2 left-0 h-px -translate-y-1/2 bg-foreground/40"
          style={{ width: `${at(today)}%` }}
        />

        {report && (
          <>
            <span
              title="Report window"
              className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-accent/30"
              style={{ left: `${at(report.opens)}%`, width: `${at(report.due) - at(report.opens)}%` }}
            />
            <span
              title="Grace period"
              className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-amber-400/40"
              style={{ left: `${at(report.due)}%`, width: `${at(report.lastDay) - at(report.due)}%` }}
            />
          </>
        )}

        <span
          className="absolute top-0 -translate-x-1/2 text-[11px] font-semibold tracking-wider text-accent uppercase"
          style={{ left: `${at(today)}%` }}
        >
          Today
        </span>
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${at(today)}%` }}
        >
          <span className="absolute inset-0 rounded-full bg-accent opacity-40 motion-safe:animate-ping" />
          <span className="absolute inset-0 rounded-full bg-accent ring-4 ring-background" />
        </span>

        {milestones.map((milestone) => {
          const isChosen = milestone.key === chosen?.key;
          return (
            <button
              key={milestone.key}
              type="button"
              onClick={() => setChosenKey(milestone.key)}
              aria-pressed={isChosen}
              aria-label={`${milestone.label}, ${displayDate(milestone.date)}`}
              className="absolute top-1/2 z-10 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:ring-4 focus-visible:ring-accent/20 focus-visible:outline-none"
              style={{ left: `${at(milestone.date)}%` }}
            >
              <span
                className={`block rounded-full border-2 transition-all duration-200 ${
                  isChosen
                    ? "h-3.5 w-3.5 border-foreground bg-foreground"
                    : "h-2.5 w-2.5 border-foreground/50 bg-card hover:border-foreground"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-1 flex justify-between text-xs text-muted tabular-nums">
        <span>{dayMonth(range.start)}</span>
        <span>{dayMonth(range.end)}</span>
      </div>

      {chosen && (
        <p aria-live="polite" className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-serif text-3xl">{chosen.label}</span>
          <span className="text-muted">
            {displayDate(chosen.date)} · {relativeDays(daysBetween(today, chosen.date))}
          </span>
        </p>
      )}

      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-4 rounded-full bg-accent/30" /> Report window
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-4 rounded-full bg-amber-400/40" /> Grace period
        </span>
        <span>Tap a dot for details</span>
      </p>
    </section>
  );
}

import { useState } from "react";
import { daysBetween } from "@/lib/deadlines";
import { displayDate, relativeDays, shortDate } from "@/lib/format";
import { trackPosition, trackRange, yearStarts, type Milestone } from "@/lib/journey";

type JourneyTrackProps = {
  today: string;
  milestones: Milestone[];
  report: { opens: string; due: string; lastDay: string } | null;
};

// The whole stay on one line: a dot per report (later ones are estimates),
// the filing window around the next report, today, and year markers.
export default function JourneyTrack({ today, milestones, report }: JourneyTrackProps) {
  const [chosenKey, setChosenKey] = useState<string | null>(null);

  const range = trackRange([today, ...milestones.map((m) => m.date)]);
  const at = (date: string) => trackPosition(date, range);

  // Until a dot is tapped, show the next thing coming up.
  const next = milestones.find((m) => m.date >= today) ?? milestones[milestones.length - 1];
  const chosen = milestones.find((m) => m.key === chosenKey) ?? next;
  const estimates = milestones.filter((m) => m.estimated).length;

  return (
    <section aria-label="Timeline of your stay" className="motion-safe:animate-rise">
      {/* mx-3 leaves room for the dots at both ends. */}
      <div className="relative mx-3 h-16">
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
        <span
          className="absolute top-1/2 left-0 h-px -translate-y-1/2 bg-foreground/40"
          style={{ width: `${at(today)}%` }}
        />

        {yearStarts(range).map((date) => (
          <span key={date} className="absolute top-1/2 -translate-x-1/2" style={{ left: `${at(date)}%` }}>
            <span className="block h-3 w-px -translate-y-1/2 bg-muted/50" />
            <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[11px] text-muted tabular-nums">
              {date.slice(0, 4)}
            </span>
          </span>
        ))}

        {report && (
          <>
            <span
              className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-accent/35"
              style={{ left: `${at(report.opens)}%`, width: `${at(report.due) - at(report.opens)}%` }}
            />
            <span
              className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-amber-400/45"
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
          const dot = isChosen
            ? "h-3.5 w-3.5 border-foreground bg-foreground"
            : milestone.estimated
              ? "h-2.5 w-2.5 border-dashed border-foreground/40 bg-background"
              : "h-2.5 w-2.5 border-foreground/60 bg-card";
          return (
            <button
              key={milestone.key}
              type="button"
              onClick={() => setChosenKey(milestone.key)}
              aria-pressed={isChosen}
              aria-label={`${milestone.label}${milestone.estimated ? " (estimate)" : ""}, ${displayDate(milestone.date)}`}
              className="absolute top-1/2 z-10 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:ring-4 focus-visible:ring-accent/20 focus-visible:outline-none"
              style={{ left: `${at(milestone.date)}%` }}
            >
              <span className={`block rounded-full border-2 transition-all duration-200 ${dot}`} />
            </button>
          );
        })}
      </div>

      <div className="mt-1 flex justify-between text-xs text-muted tabular-nums">
        <span>{shortDate(range.start)}</span>
        <span>{shortDate(range.end)}</span>
      </div>

      {chosen && (
        <div aria-live="polite" className="mt-5">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-serif text-3xl">{chosen.label}</span>
            <span className="text-muted">
              {chosen.estimated ? "around " : ""}
              {displayDate(chosen.date)} · {relativeDays(daysBetween(today, chosen.date))}
            </span>
          </p>
          {chosen.estimated && (
            <p className="mt-1 text-sm text-muted">
              Estimate. The exact date will be on your receipt after the report before it.
            </p>
          )}
        </div>
      )}

      <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-4 rounded-full bg-accent/35" /> Filing window
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-4 rounded-full bg-amber-400/45" /> Late, no fine yet
        </span>
        {estimates > 0 && (
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-foreground/40" />
            Estimated report
          </span>
        )}
        <span>Tap a dot for its date</span>
      </p>
    </section>
  );
}

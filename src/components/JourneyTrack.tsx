import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { daysBetween } from "@/lib/deadlines";
import { displayDate, relativeDays, stopDate } from "@/lib/format";
import { trackPosition, trackRange, yearStarts, type Milestone } from "@/lib/journey";

type JourneyTrackProps = {
  today: string;
  milestones: Milestone[];
  report: { opens: string; due: string; lastDay: string } | null;
};

function stopName(milestone: Milestone): string {
  if (milestone.key === "arrived") return "Arrived";
  if (milestone.key === "stay") return "Visa ends";
  return "Report";
}

// Roughly how wide a stop's label is, in pixels, including a small gap.
// Labels with a year ("14 Aug 2025") are wider.
const labelWidth = 62;
const labelWidthWithYear = 80;

// Labels at the ends line up with the edge of the track so they stay inside the card.
function edge(position: number): "start" | "end" | "middle" {
  if (position < 8) return "start";
  if (position > 92) return "end";
  return "middle";
}

// The stay drawn like a transit line: every date is a labelled stop you can select.
export default function JourneyTrack({ today, milestones, report }: JourneyTrackProps) {
  const range = trackRange([today, ...milestones.map((m) => m.date)]);
  const at = (date: string) => trackPosition(date, range);

  // Until a stop is chosen, show the next one coming up.
  const nextIndex = Math.max(0, milestones.findIndex((m) => m.date >= today));
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const index = Math.min(chosenIndex ?? nextIndex, milestones.length - 1);
  const chosen = milestones[index];

  // Labels have a fixed width in pixels, but stops are placed in percent, so we need the
  // track's real width. ResizeObserver tells us, and again whenever the screen size changes.
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(320);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(([entry]) => setTrackWidth(entry.contentRect.width));
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Put each label on the first row unless it would overlap the label before it there.
  const rowEnds = [-Infinity, -Infinity];
  const rows = milestones.map((m) => {
    const x = (at(m.date) / 100) * trackWidth;
    const side = edge(at(m.date));
    const width = m.date.slice(0, 4) === today.slice(0, 4) ? labelWidth : labelWidthWithYear;
    const left = side === "start" ? x : side === "end" ? x - width : x - width / 2;
    const row = left >= rowEnds[0] ? 0 : 1;
    rowEnds[row] = left + width;
    return row;
  });

  // The summary line: how far into the stay you are, and how many reports remain.
  const arrived = milestones.find((m) => m.key === "arrived");
  const stayEnd = milestones.find((m) => m.key === "stay");
  const reportsToGo = milestones.filter((m) => m.key.startsWith("report") && m.date >= today).length;
  const summary: string[] = [];
  if (arrived && stayEnd && today >= arrived.date && today <= stayEnd.date) {
    summary.push(`Day ${daysBetween(arrived.date, today) + 1} of ${daysBetween(arrived.date, stayEnd.date) + 1}`);
  }
  if (reportsToGo > 0) summary.push(`${reportsToGo} ${reportsToGo === 1 ? "report" : "reports"} to go`);

  function choose(newIndex: number) {
    setChosenIndex(Math.min(Math.max(newIndex, 0), milestones.length - 1));
  }

  // Left and right arrow keys move between stops.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") choose(index + 1);
    else if (event.key === "ArrowLeft") choose(index - 1);
    else return;
    event.preventDefault();
  }

  return (
    <section aria-label="Timeline of your stay">
      {summary.length > 0 && (
        <p className="mb-6 text-sm text-muted tabular-nums">{summary.join(" · ")}</p>
      )}

      <div ref={trackRef} className="relative mx-6 h-32" onKeyDown={onKeyDown}>
        {/* The line: the part already lived is solid accent, the rest is grey. */}
        <span className="absolute inset-x-0 top-8 h-1 rounded-full bg-line" />
        <span className="absolute top-8 left-0 h-1 rounded-full bg-accent" style={{ width: `${at(today)}%` }} />

        {report && (
          <>
            <span
              className="absolute top-[26px] h-3 rounded-full bg-accent/30"
              style={{ left: `${at(report.opens)}%`, width: `${at(report.due) - at(report.opens)}%` }}
            />
            <span
              className="absolute top-[26px] h-3 rounded-full bg-amber-400/45"
              style={{ left: `${at(report.due)}%`, width: `${at(report.lastDay) - at(report.due)}%` }}
            />
          </>
        )}

        {yearStarts(range).map((date) => (
          <span
            key={date}
            className="absolute top-2 -translate-x-1/2 text-[11px] text-muted tabular-nums"
            style={{ left: `${at(date)}%` }}
          >
            {date.slice(0, 4)}
          </span>
        ))}

        <span
          aria-hidden="true"
          className="absolute top-[34px] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${at(today)}%` }}
        >
          <span className="absolute inset-0 rounded-full bg-accent ring-4 ring-background" />
        </span>
        <span
          className="absolute top-0 -translate-x-1/2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold tracking-wider text-accent-foreground uppercase"
          style={{ left: `${at(today)}%` }}
        >
          Today
        </span>

        {milestones.map((milestone, i) => {
          const position = at(milestone.date);
          const isChosen = i === index;
          const isPast = milestone.date < today;
          // Keep the first and last labels inside the card.
          const side = edge(position);
          const align = side === "start" ? "items-start" : side === "end" ? "items-end" : "items-center";
          const shift = side === "start" ? "" : side === "end" ? "-translate-x-full" : "-translate-x-1/2";
          const dot = isChosen
            ? "h-4 w-4 bg-foreground ring-4 ring-foreground/15"
            : milestone.estimated
              ? "h-3 w-3 border-2 border-dashed border-foreground/50 bg-background"
              : isPast
                ? "h-3 w-3 bg-foreground/40"
                : "h-3 w-3 border-2 border-foreground bg-card";

          return (
            <button
              key={milestone.key}
              type="button"
              onClick={() => choose(i)}
              aria-pressed={isChosen}
              aria-label={`${milestone.label}${milestone.estimated ? " (estimate)" : ""}, ${displayDate(milestone.date)}`}
              title={`${milestone.label}${milestone.estimated ? " (estimate)" : ""}: ${displayDate(milestone.date)}`}
              className={`group absolute top-[18px] z-10 flex cursor-pointer flex-col ${align} ${shift} rounded-lg focus-visible:ring-4 focus-visible:ring-accent/25 focus-visible:outline-none`}
              style={{ left: `${position}%` }}
            >
              {/* A 32px tap area around a small dot. Its centre sits on the line (18px + 16px = 34px). */}
              <span className="grid h-8 w-8 place-items-center">
                <span className={`block rounded-full transition-all duration-200 group-hover:scale-125 ${dot}`} />
              </span>
              <span
                className={`pointer-events-none flex flex-col whitespace-nowrap text-[11px] leading-tight ${
                  rows[i] === 1 ? "mt-9" : "mt-0.5"
                } ${align} ${isChosen ? "text-foreground" : "text-muted"}`}
              >
                <span className="font-medium">{stopName(milestone)}</span>
                <span className="tabular-nums">
                  {milestone.estimated ? "~" : ""}
                  {stopDate(milestone.date, today)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {chosen && (
        <div className="mt-4 flex items-start justify-between gap-4 border-t border-line pt-5">
          <div aria-live="polite">
            <p className="font-medium text-3xl">
              {chosen.label}
              {chosen.estimated ? <span className="text-muted"> (estimate)</span> : null}
            </p>
            <p className="mt-1 text-muted">
              {chosen.estimated ? "Around " : ""}
              {displayDate(chosen.date)} · {relativeDays(daysBetween(today, chosen.date))}
            </p>
            {chosen.key === "arrived" && (
              <p className="mt-2 text-sm text-muted">
                Your 90-day count starts here. A trip abroad restarts it.
              </p>
            )}
            {chosen.estimated && (
              <p className="mt-2 text-sm text-muted">
                Your receipt will show the exact date.
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={() => choose(index - 1)}
              disabled={index === 0}
              aria-label="Previous date"
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line transition hover:border-foreground/30 disabled:cursor-default disabled:opacity-30"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                <path d="M12.5 5l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => choose(index + 1)}
              disabled={index === milestones.length - 1}
              aria-label="Next date"
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line transition hover:border-foreground/30 disabled:cursor-default disabled:opacity-30"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                <path d="M7.5 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-4 rounded-full bg-accent/30" /> Time to report
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-4 rounded-full bg-amber-400/45" /> Late, no fine yet
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-foreground/50" />
          ~ Estimate
        </span>
      </p>
    </section>
  );
}

import { Fragment, useRef, useState, type KeyboardEvent } from "react";
import { daysBetween } from "@/lib/deadlines";
import { displayDate, relativeDays, shortDate } from "@/lib/format";
import type { Milestone } from "@/lib/journey";

type JourneyTrackProps = {
  today: string;
  milestones: Milestone[];
  report: { opens: string; due: string; lastDay: string } | null;
};

export default function JourneyTrack({ today, milestones, report }: JourneyTrackProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const upcoming = milestones.findIndex((m) => m.key !== "arrived" && m.date >= today);
  const selected = milestones.findIndex((m) => m.key === selectedKey);
  const index = selected >= 0 ? selected : upcoming >= 0 ? upcoming : milestones.length - 1;
  const chosen = milestones[index];
  const todayBefore = milestones.findIndex((m) => m.date >= today);
  const reportsToGo = milestones.filter((m) => m.key.startsWith("report") && m.date >= today).length;

  function choose(next: number, focus = false) {
    const bounded = Math.max(0, Math.min(next, milestones.length - 1));
    if (!milestones[bounded]) return;
    setSelectedKey(milestones[bounded].key);
    if (focus) buttons.current[bounded]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, i: number) {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") choose(i + 1, true);
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") choose(i - 1, true);
    else if (event.key === "Home") choose(0, true);
    else if (event.key === "End") choose(milestones.length - 1, true);
    else return;
    event.preventDefault();
  }

  if (!chosen) return null;
  const isNext = index === upcoming;
  const isReport = chosen.key.startsWith("report");
  const todayMarker = (
    <li className="stay-today">
      <span className="stay-today-dot" aria-hidden="true" />
      <span>Today <time dateTime={today}>{shortDate(today)}</time></span>
    </li>
  );

  return (
    <section className="stay-timeline" aria-label="Timeline of your stay">
      <header className="stay-timeline-heading">
        <div><h2>Your stay, at a glance</h2><p>Select a date to see the details.</p></div>
        {reportsToGo > 0 && <span className="stay-count">{reportsToGo} {reportsToGo === 1 ? "report" : "reports"} ahead</span>}
      </header>
      <div className="stay-timeline-grid">
        <ol className="stay-stops" aria-label="Stay milestones">
          {milestones.map((milestone, i) => (
            <Fragment key={milestone.key}>
              {i === todayBefore && todayMarker}
              <li className="stay-stop" data-past={milestone.date < today}>
                <button
                  ref={(element) => { buttons.current[i] = element; }}
                  type="button"
                  className="stay-stop-button"
                  aria-pressed={i === index}
                  aria-controls="stay-selected-date"
                  onClick={() => choose(i)}
                  onKeyDown={(event) => onKeyDown(event, i)}
                  aria-label={`${milestone.label}${milestone.estimated ? " (estimate)" : ""}, ${displayDate(milestone.date)}`}
                >
                  <span className="stay-stop-dot" data-estimated={milestone.estimated} aria-hidden="true" />
                  <span className="stay-stop-copy">
                    <span className="stay-stop-name">{milestone.key === "stay" ? "Permission to stay ends" : milestone.label}</span>
                    <time dateTime={milestone.date}>{shortDate(milestone.date)}</time>
                  </span>
                  <span className="stay-stop-status">{milestone.estimated ? "Estimate" : i === upcoming ? "Up next" : relativeDays(daysBetween(today, milestone.date))}</span>
                </button>
              </li>
            </Fragment>
          ))}
          {todayBefore === -1 && todayMarker}
        </ol>

        <div id="stay-selected-date" className="stay-date-detail" aria-live="polite" aria-atomic="true">
          <p className="stay-detail-label">{chosen.estimated ? "Estimated date" : isNext ? "Up next" : chosen.date < today ? "Past date" : "Selected date"}</p>
          <h3>{chosen.key === "stay" ? "Permission to stay ends" : chosen.label}</h3>
          <time className="stay-detail-date" dateTime={chosen.date}>{shortDate(chosen.date)}</time>
          <p className="stay-countdown">{chosen.estimated ? "Approximately " : ""}{relativeDays(daysBetween(today, chosen.date))}</p>

          {chosen.key === "report-0" && report && (
            <dl className="stay-window">
              <div><dt><span className="stay-window-dot" aria-hidden="true" />Reporting opens</dt><dd>{shortDate(report.opens)}</dd></div>
              <div><dt>Report due</dt><dd>{shortDate(report.due)}</dd></div>
              <div><dt>Last day, no fine</dt><dd>{shortDate(report.lastDay)}</dd></div>
            </dl>
          )}
          {chosen.key === "arrived" && <p className="stay-detail-note">Your 90-day count starts from this arrival. A trip abroad restarts it.</p>}
          {chosen.key === "stay" && <p className="stay-detail-note">Check the permitted-until date on your latest stamp. A 90-day report does not extend your stay.</p>}
          {chosen.estimated && <p className="stay-detail-note">A planning estimate. Your next receipt will show the exact reporting date.</p>}
          {isReport && !chosen.estimated && <p className="stay-detail-note">See the report section below for filing options and office closures.</p>}
          <div className="stay-date-navigation">
            <span>{index + 1} of {milestones.length} dates</span>
            <div>
              <button type="button" onClick={() => choose(index - 1)} disabled={index === 0} aria-label="Previous date">←</button>
              <button type="button" onClick={() => choose(index + 1)} disabled={index === milestones.length - 1} aria-label="Next date">→</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

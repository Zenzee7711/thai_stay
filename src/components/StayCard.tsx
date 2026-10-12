import Card from "@/components/Card";
import GuideDetails from "@/components/GuideDetails";
import { stayLevel, type StayLevel } from "@/lib/deadlines";
import { displayDate } from "@/lib/format";
import { extensionGuide, reentryGuide } from "@/lib/guides";
import { closedPhrase, lastOpenDayBy, officeClosedReason } from "@/lib/holidays";

// Per level: the colour of the big number, and what to do (nothing when there is plenty of time).
const levelStyles: Record<StayLevel, { number: string; advice: string }> = {
  ok: { number: "text-foreground", advice: "" },
  soon: {
    number: "text-amber-600 dark:text-amber-300",
    advice: "Less than a month left. Extend your visa or plan to leave.",
  },
  urgent: {
    number: "text-red-600 dark:text-red-400",
    advice: "A week or less. Extend your visa now or leave by this date.",
  },
  over: {
    number: "text-red-600 dark:text-red-400",
    advice: "The fine is 500 THB a day. Go to Immigration now.",
  },
};

type StayCardProps = {
  permittedUntil: string;
  daysLeft: number;
  hasReentryPermit: boolean;
};

export default function StayCard({ permittedUntil, daysLeft, hasReentryPermit }: StayCardProps) {
  const style = levelStyles[stayLevel(daysLeft)];
  // Extensions are done in person, so warn if the expiry date falls on a closed day.
  const closedReason = daysLeft >= 0 && daysLeft <= 60 ? officeClosedReason(permittedUntil) : null;

  return (
    <Card title="Visa">
      <p className="mt-4 flex items-baseline gap-3">
        <span className={`font-serif text-7xl leading-none tabular-nums sm:text-8xl ${style.number}`}>
          {Math.abs(daysLeft)}
        </span>
        <span className="text-lg">
          {daysLeft >= 0 ? (daysLeft === 1 ? "day left" : "days left") : "days overdue"}
        </span>
      </p>
      <p className="mt-3 text-muted">
        {daysLeft === 0 ? "Expires today." : `Expires ${displayDate(permittedUntil)}.`} {style.advice}
      </p>

      {closedReason && (
        <p className="mt-4 text-sm">
          That day {closedPhrase(closedReason)}, so to extend in person go by{" "}
          <span className="font-medium">{displayDate(lastOpenDayBy(permittedUntil))}</span>.
        </p>
      )}

      {!hasReentryPermit && daysLeft >= 0 && (
        <p className="mt-5 flex gap-3 rounded-2xl bg-amber-400/10 p-4 text-sm">
          <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          <span>
            <span className="font-medium">Leaving Thailand?</span> Get a re-entry permit first, or
            your visa ends when you leave.
          </span>
        </p>
      )}

      <div className="mt-6">
        <GuideDetails guide={extensionGuide} />
        <GuideDetails guide={reentryGuide} />
      </div>
    </Card>
  );
}

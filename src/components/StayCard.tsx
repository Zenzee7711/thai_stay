import Card from "@/components/Card";
import GuideDetails from "@/components/GuideDetails";
import { stayLevel, type StayLevel } from "@/lib/deadlines";
import { displayDate } from "@/lib/format";
import { extensionGuide, reentryGuide } from "@/lib/guides";

// Per level: the colour of the big number, and what to do (nothing when there is plenty of time).
const levelStyles: Record<StayLevel, { number: string; advice: string }> = {
  ok: {
    number: "text-foreground",
    advice: "",
  },
  soon: {
    number: "text-amber-600 dark:text-amber-300",
    advice: "Less than 30 days left. Apply for an extension or plan your departure.",
  },
  urgent: {
    number: "text-red-600 dark:text-red-400",
    advice: "7 days or less. Apply for an extension now, or leave by this date.",
  },
  over: {
    number: "text-red-600 dark:text-red-400",
    advice: "The fine is 500 THB per day, up to 20,000 THB. Contact Immigration now.",
  },
};

type StayCardProps = {
  permittedUntil: string;
  daysLeft: number;
  hasReentryPermit: boolean;
};

export default function StayCard({ permittedUntil, daysLeft, hasReentryPermit }: StayCardProps) {
  const style = levelStyles[stayLevel(daysLeft)];

  return (
    <Card title="Visa expiry (permitted stay)">
      <p className="mt-4 flex items-baseline gap-3">
        <span className={`font-serif text-7xl leading-none tabular-nums sm:text-8xl ${style.number}`}>
          {Math.abs(daysLeft)}
        </span>
        <span className="text-lg">
          {daysLeft >= 0 ? (daysLeft === 1 ? "day left" : "days left") : "days overstayed"}
        </span>
      </p>
      <p className="mt-3 text-muted">
        {daysLeft === 0 ? "Today is your last day." : `Until ${displayDate(permittedUntil)}.`} {style.advice}
      </p>

      {!hasReentryPermit && daysLeft >= 0 && (
        <p className="mt-5 flex gap-3 rounded-2xl bg-amber-400/10 p-4 text-sm">
          <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          <span>
            <span className="font-medium">No re-entry permit.</span> If you leave Thailand without
            one, your current permission to stay is cancelled.
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

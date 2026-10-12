import Card from "@/components/Card";
import GuideDetails from "@/components/GuideDetails";
import { stayLevel, type StayLevel } from "@/lib/deadlines";
import { displayDate } from "@/lib/format";
import { extensionGuide, reentryGuide } from "@/lib/guides";

const levelStyles: Record<StayLevel, { number: string; advice: string }> = {
  ok: {
    number: "text-foreground",
    advice: "Plenty of time left.",
  },
  soon: {
    number: "text-amber-600 dark:text-amber-300",
    advice: "Under a month left. Plan your extension or your departure now.",
  },
  urgent: {
    number: "text-red-600 dark:text-red-400",
    advice: "A week or less. Apply for an extension or leave on time.",
  },
  over: {
    number: "text-red-600 dark:text-red-400",
    advice: "You are overstaying. Overstay fines are charged for every day. Contact immigration now.",
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
    <Card title="Permission to stay">
      <p className="mt-4 flex items-baseline gap-3">
        <span className={`font-serif text-7xl leading-none tabular-nums sm:text-8xl ${style.number}`}>
          {Math.abs(daysLeft)}
        </span>
        <span className="text-lg">
          {daysLeft >= 0 ? (daysLeft === 1 ? "day left" : "days left") : "days overstayed"}
        </span>
      </p>
      <p className="mt-3 text-muted">
        {daysLeft === 0 ? "Today is your last permitted day." : `Permitted until ${displayDate(permittedUntil)}.`}{" "}
        {style.advice}
      </p>

      {!hasReentryPermit && daysLeft >= 0 && (
        <p className="mt-5 flex gap-3 rounded-2xl bg-amber-400/10 p-4 text-sm">
          <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          <span>
            <span className="font-medium">Travelling soon?</span> Leaving Thailand without a re-entry
            permit ends your current permission to stay. Get one before you go.
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

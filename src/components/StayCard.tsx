import Card from "@/components/Card";
import { stayLevel, type StayLevel } from "@/lib/deadlines";
import GuideDetails from "@/components/GuideDetails";
import { displayDate } from "@/lib/format";
import { extensionGuide, reentryGuide } from "@/lib/guides";

const levelStyles: Record<StayLevel, { number: string; advice: string }> = {
  ok: {
    number: "text-accent",
    advice: "Plenty of time left.",
  },
  soon: {
    number: "text-amber-600 dark:text-amber-400",
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
      <p className="mt-3 flex items-baseline gap-2">
        <span className={`text-5xl font-bold tabular-nums ${style.number}`}>
          {Math.abs(daysLeft)}
        </span>
        <span className="text-lg font-medium">
          {daysLeft >= 0 ? (daysLeft === 1 ? "day left" : "days left") : "days overstayed"}
        </span>
      </p>
      <p className="mt-1 text-sm text-muted">
        {daysLeft === 0 ? "Today is your last permitted day" : `Permitted until ${displayDate(permittedUntil)}`}
      </p>
      <p className="mt-3">{style.advice}</p>

      {!hasReentryPermit && daysLeft >= 0 && (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <span className="font-semibold">Travelling soon?</span> Leaving Thailand without a
          re-entry permit ends your current permission to stay. Get one before you go.
        </p>
      )}

      <GuideDetails guide={extensionGuide} />
      <GuideDetails guide={reentryGuide} />
    </Card>
  );
}

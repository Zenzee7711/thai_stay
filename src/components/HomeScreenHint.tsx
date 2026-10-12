import { useHomeScreenHint } from "@/hooks/useHomeScreenHint";

// Shown only on iPhone and iPad Safari: saved dates can be deleted after 7 days without a visit,
// unless the page is added to the Home Screen.
export default function HomeScreenHint() {
  const { show, dismiss } = useHomeScreenHint();
  if (!show) return null;

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-line bg-card p-4 text-sm motion-safe:animate-rise sm:flex-row sm:items-center sm:justify-between">
      <p>
        <span className="font-medium">Keep your dates on iPhone.</span>{" "}
        <span className="text-muted">
          Safari may delete them if you don&apos;t open this page for 7 days. Tap Share, then Add to
          Home Screen.
        </span>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 self-start rounded-full border border-line px-4 py-1.5 transition hover:border-foreground/30 sm:self-auto"
      >
        Got it
      </button>
    </div>
  );
}

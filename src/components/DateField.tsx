import { shortDate } from "@/lib/format";

type DateFieldProps = {
  id: string;
  label: string;
  hint?: string; // the ? means this prop is optional
  value: string;
  onChange: (value: string) => void;
};

// A date "pill" that reads "20 Jul 2026" instead of the browser's 07/20/2026.
// The real <input type="date"> lies invisibly on top of the pill, so a tap opens
// the phone's own date picker, and keyboards and screen readers still get a real input.
export default function DateField({ id, label, hint, value, onChange }: DateFieldProps) {
  const hintId = `${id}-hint`;

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium tracking-[0.12em] text-muted uppercase sm:min-h-9">
        {label}
      </label>

      <div className="relative mt-2">
        <input
          id={id}
          type="date"
          value={value}
          aria-describedby={hint ? hintId : undefined}
          onChange={(event) => onChange(event.target.value)}
          // On computers, clicking a date input only opens the calendar on its tiny icon.
          // showPicker() opens it wherever the pill is clicked.
          onClick={(event) => {
            try {
              event.currentTarget.showPicker();
            } catch {
              // Older browsers: the input still works by typing.
            }
          }}
          className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />
        <div
          aria-hidden="true"
          className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-card px-4 py-3.5 transition peer-hover:border-foreground/25 peer-focus-visible:border-accent peer-focus-visible:ring-4 peer-focus-visible:ring-accent/15"
        >
          <span className={value ? "text-lg" : "text-lg text-muted/70"}>
            {value ? shortDate(value) : "Add date"}
          </span>
          {!value && (
            <svg viewBox="0 0 20 20" className="h-5 w-5 text-muted">
              <rect x="3" y="4.5" width="14" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 8.5h14M7 3v3M13 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={`Clear ${label}`}
            className="absolute top-1/2 right-2.5 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-line hover:text-foreground"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {hint && (
        <p id={hintId} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

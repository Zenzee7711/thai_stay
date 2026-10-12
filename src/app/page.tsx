import StayForm from "@/components/StayForm";

const sources = [
  { label: "Immigration Bureau", href: "https://www.immigration.go.th/" },
  { label: "Online 90-day report", href: "https://tm47.immigration.go.th/tm47/" },
  { label: "Thai government portal", href: "https://thailand.go.th/event-detail/001_01_084" },
  { label: "Thaiger guide", href: "https://thethaiger.com/visas/services/90-day-reporting/" },
];

export default function Home() {
  return (
    // max-w-3xl keeps lines readable on wide screens; px-5 keeps a gap from phone edges.
    <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-12">
      <header className="flex items-center justify-between gap-4">
        <span className="font-serif text-2xl">Thai Stay</span>
        <span className="text-right text-xs text-muted">90-day report &amp; visa tracker</span>
      </header>

      <StayForm />

      <footer className="mt-20 space-y-3 border-t border-line pt-6 text-sm text-muted">
        <p>
          Your dates stay on this device. Not legal advice: rules change, so check with
          Immigration.
        </p>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          {sources.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line underline-offset-4 hover:text-accent"
            >
              {source.label}
            </a>
          ))}
        </p>
      </footer>
    </main>
  );
}

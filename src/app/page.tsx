import StayForm from "@/components/StayForm";

const sources = [
  { label: "Immigration Bureau (official)", href: "https://www.immigration.go.th/" },
  { label: "Online 90-day report, TM.47 (official)", href: "https://tm47.immigration.go.th/tm47/" },
  { label: "Thaiger: 90-day reporting guide", href: "https://thethaiger.com/visas/services/90-day-reporting/" },
  {
    label: "BAL: 90-day report requirements",
    href: "https://www.bal.com/immigration-news/thailand-additional-requirements-for-90-day-report-applications-announced/",
  },
];

export default function Home() {
  return (
    // max-w-2xl keeps lines readable on wide screens; px-4 keeps a gap from phone edges.
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <header>
        <p className="text-sm font-medium text-accent">Thailand · 90-day report &amp; stay tracker</p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight">Thai Stay</h1>
        <p className="mt-3 text-lg text-muted">
          Enter the dates from your passport and TM.47 slip. See every deadline at a glance, then
          add them to your calendar.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-sm text-muted">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
          Your dates never leave this browser
        </p>
      </header>

      <StayForm />

      <footer className="mt-10 rounded-2xl border border-line bg-card p-5 text-sm text-muted">
        <p>
          <span className="font-semibold text-foreground">Not legal advice.</span> Dates estimated
          from your arrival are estimates, and rules can change. Always check with the Immigration
          Bureau or your local immigration office.
        </p>
        <p className="mt-4 font-semibold text-foreground">Sources</p>
        <ul className="mt-2 space-y-1">
          {sources.map((source) => (
            <li key={source.href}>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-4 hover:text-accent"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </main>
  );
}

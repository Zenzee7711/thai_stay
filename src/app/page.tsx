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
    <main className="p-8">
      <h1 className="text-3xl font-bold">Thai Stay</h1>
      <p className="mt-2">Track your 90-day report and visa deadlines in Thailand.</p>
      <p className="mt-1 text-sm">Your dates stay in your browser. Nothing is sent or saved.</p>

      <StayForm />

      <footer className="mt-12 border-t pt-4 text-sm">
        <p>
          This is not legal advice. Dates calculated from your arrival are estimates, and rules
          can change. Always check with the Immigration Bureau or your local immigration office.
        </p>
        <p className="mt-2 font-medium">Sources</p>
        <ul className="mt-1 list-disc pl-5">
          {sources.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noopener noreferrer" className="underline">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </main>
  );
}

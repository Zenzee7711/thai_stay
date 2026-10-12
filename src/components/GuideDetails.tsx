import type { Guide } from "@/lib/guides";

// <details> is a built-in HTML fold-out: closed by default, opens on tap,
// works with the keyboard and screen readers, and needs no React state.
export default function GuideDetails({ guide }: { guide: Guide }) {
  return (
    <details className="group mt-4 rounded-xl border border-line bg-background">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-medium">
        {guide.title}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-5 w-5 shrink-0 text-muted transition group-open:rotate-180"
        >
          <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      <div className="space-y-4 px-4 pb-4 text-sm">
        {guide.sections.map((section) => (
          <div key={section.heading}>
            <p className="font-semibold">{section.heading}</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-muted">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <p className="border-t border-line pt-3 text-xs text-muted">
          Sources:{" "}
          {guide.sources.map((source, index) => (
            <span key={source.href}>
              {index > 0 && " · "}
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-accent"
              >
                {source.label}
              </a>
            </span>
          ))}
        </p>
      </div>
    </details>
  );
}

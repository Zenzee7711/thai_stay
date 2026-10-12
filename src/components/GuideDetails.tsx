import type { Guide } from "@/lib/guides";

// <details> is a built-in HTML fold-out: closed by default, opens on tap,
// works with the keyboard and screen readers, and needs no React state.
export default function GuideDetails({ guide }: { guide: Guide }) {
  return (
    <details className="group border-t border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium transition hover:text-accent">
        {guide.title}
        {/* A plus that turns into a cross when open. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
        >
          <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </summary>

      <div className="space-y-4 pb-5 text-sm">
        {guide.sections.map((section) => (
          <div key={section.heading}>
            <p className="font-medium">{section.heading}</p>
            <ul className="mt-1.5 space-y-1.5 text-muted">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p className="text-xs text-muted">
          Sources:{" "}
          {guide.sources.map((source, index) => (
            <span key={source.href}>
              {index > 0 && " · "}
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line underline-offset-2 hover:text-accent"
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

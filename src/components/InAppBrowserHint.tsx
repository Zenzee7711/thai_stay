import { useSyncExternalStore } from "react";
import { inAppBrowser, openInBrowserUrl } from "@/lib/device";

const noChanges = () => () => {};

// Shown inside LINE, Facebook, Instagram or TikTok, whose built-in browsers often lose saved data.
export default function InAppBrowserHint() {
  // The server can't know the browser, so it renders nothing and the browser decides.
  const app = useSyncExternalStore(noChanges, () => inAppBrowser(navigator.userAgent), () => null);
  if (!app) return null;

  return (
    <div className="mt-8 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm">
      <p>
        <span className="font-medium">Open this in Safari or Chrome.</span>{" "}
        <span className="text-muted">
          Dates saved inside {app} can be lost
          {app === "LINE" ? "." : ". Tap ••• then Open in browser."}
        </span>
      </p>
      {app === "LINE" && (
        <a
          href={openInBrowserUrl(window.location.href)}
          className="mt-3 inline-block rounded-full bg-foreground px-4 py-1.5 text-background"
        >
          Open in browser
        </a>
      )}
    </div>
  );
}

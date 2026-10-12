import { useCallback, useSyncExternalStore } from "react";
import { shouldSuggestHomeScreen } from "@/lib/device";

const dismissedKey = "thai-stay:home-screen-hint-dismissed";
const listeners = new Set<() => void>();
let dismissedThisVisit = false;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function read(): boolean {
  if (dismissedThisVisit) return false;
  try {
    if (window.localStorage.getItem(dismissedKey)) return false;
  } catch {
    // Storage blocked: still show the hint.
  }
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return shouldSuggestHomeScreen({
    userAgent: nav.userAgent,
    maxTouchPoints: nav.maxTouchPoints,
    standalone: nav.standalone === true || window.matchMedia("(display-mode: standalone)").matches,
  });
}

// Whether to show the "Add to Home Screen" hint. The server can't know the device,
// so it renders as "don't show" and the browser decides after loading.
export function useHomeScreenHint() {
  const show = useSyncExternalStore(subscribe, read, () => false);

  const dismiss = useCallback(() => {
    dismissedThisVisit = true;
    try {
      window.localStorage.setItem(dismissedKey, "1");
    } catch {
      // Storage blocked: hidden for this visit only.
    }
    listeners.forEach((listener) => listener());
  }, []);

  return { show, dismiss };
}

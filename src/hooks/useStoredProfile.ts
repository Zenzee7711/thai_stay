import { useCallback, useMemo, useSyncExternalStore } from "react";
import { parseProfile, type Profile } from "@/lib/profile";

const storageKey = "thai-stay:profile";
const listeners = new Set<() => void>();

// We keep our own copy as well, so the app still works when the browser blocks storage
// (some private-browsing modes do). It just won't be remembered next time.
let current: string | null = null;
let loaded = false;

function read(): string | null {
  if (!loaded) {
    loaded = true;
    try {
      current = window.localStorage.getItem(storageKey);
    } catch {
      current = null;
    }
  }
  return current;
}

function write(value: string | null) {
  current = value;
  try {
    if (value === null) window.localStorage.removeItem(storageKey);
    else window.localStorage.setItem(storageKey, value);
  } catch {
    // Storage blocked: keep working from memory.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  // Also follow changes made in another tab of the same site.
  function onStorage(event: StorageEvent) {
    if (event.key !== storageKey) return;
    current = event.newValue;
    listener();
  }
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// Like useState, but the profile is saved in this browser's localStorage.
// On the server there is no storage, so it renders as "nothing saved" (the third argument).
export function useStoredProfile() {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  const profile = useMemo(() => parseProfile(raw), [raw]);

  const save = useCallback((next: Profile) => write(JSON.stringify(next)), []);
  const clear = useCallback(() => write(null), []);

  return { profile, save, clear };
}

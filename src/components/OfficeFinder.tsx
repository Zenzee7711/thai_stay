import { useState } from "react";
import Card from "@/components/Card";
import { directionsUrl, nearestOffices, offices, type Office } from "@/lib/offices";

type Nearby = { office: Office; km: number }[];

// Finds the nearest immigration office from the phone's location, or from a list.
// The location is only used in the browser to compare distances. It is never sent anywhere.
export default function OfficeFinder() {
  const [nearby, setNearby] = useState<Nearby | null>(null);
  const [status, setStatus] = useState<"idle" | "locating" | "denied">("idle");
  const [picked, setPicked] = useState("");

  function locate() {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setNearby(nearestOffices({ lat: position.coords.latitude, lng: position.coords.longitude }));
        setStatus("idle");
      },
      () => setStatus("denied"),
      { timeout: 10000, maximumAge: 600000 },
    );
  }

  const pickedOffice = offices.find((office) => office.name === picked);

  return (
    <Card title="Immigration office">
      <p className="mt-3 text-muted">
        Reports that must be done in person, and extensions of stay, are done at the immigration
        office for the province where you live.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={locate}
          disabled={status === "locating"}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-85 disabled:opacity-50"
        >
          {status === "locating" ? "Finding your location…" : "Find the nearest office"}
        </button>
        <label htmlFor="office-picker" className="sr-only">
          Or choose an office
        </label>
        <select
          id="office-picker"
          value={picked}
          onChange={(event) => setPicked(event.target.value)}
          className="rounded-full border border-line bg-card px-4 py-2.5 text-sm"
        >
          <option value="">Or choose your area</option>
          {[...offices]
            .sort((a, b) => a.area.localeCompare(b.area))
            .map((office) => (
              <option key={office.name} value={office.name}>
                {office.area}
              </option>
            ))}
        </select>
      </div>

      {status === "denied" && (
        <p className="mt-3 text-sm text-muted">
          Location isn&apos;t available. Choose your area from the list instead.
        </p>
      )}

      {(nearby || pickedOffice) && (
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {(pickedOffice ? [{ office: pickedOffice, km: null }] : (nearby ?? [])).map(({ office, km }, i) => (
            <li key={office.name} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className={i === 0 ? "font-medium" : ""}>{office.name}</p>
                <p className="text-sm text-muted">
                  {office.area}
                  {km !== null && ` · about ${km} km away${i === 0 ? " (nearest)" : ""}`}
                </p>
              </div>
              <a
                href={directionsUrl(office)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full border border-line px-3.5 py-1.5 text-sm transition hover:border-accent hover:text-accent"
              >
                Directions
              </a>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-muted">
        Your location stays on your device. Distances are approximate, and the list covers major
        offices only. The office for your province may not be the closest one, so check your
        address if you live near a border between provinces.
      </p>
    </Card>
  );
}

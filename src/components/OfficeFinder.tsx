import { useState } from "react";
import { format } from "date-fns";
import Card from "@/components/Card";
import { officeClosedReason } from "@/lib/holidays";
import { directionsUrl, nearestOffices, offices, type Office } from "@/lib/offices";

type Nearby = { office: Office; km: number }[];

// Finds the nearest immigration office from the phone's location, or from a list.
// The location is only used in the browser to compare distances. It is never sent anywhere.
export default function OfficeFinder() {
  const [nearby, setNearby] = useState<Nearby | null>(null);
  const [status, setStatus] = useState<"idle" | "locating" | "denied">("idle");
  const [picked, setPicked] = useState("");

  const closedToday = officeClosedReason(format(new Date(), "yyyy-MM-dd"));

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
  const shown = pickedOffice ? [{ office: pickedOffice, km: null }] : (nearby ?? []);

  return (
    <Card title="Immigration office">
      <p className="mt-3 text-muted">
        For in-person reports and visa extensions. Usually open Monday to Friday, about 8:30 to
        16:30. Closed on weekends and public holidays.
      </p>
      {closedToday && (
        <p className="mt-2 text-sm font-medium">
          Closed today ({closedToday === "Saturday" || closedToday === "Sunday" ? "weekend" : closedToday}).
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={locate}
          disabled={status === "locating"}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        >
          {status === "locating" ? "Finding you…" : "Find the nearest office"}
        </button>
        <label htmlFor="office-picker" className="sr-only">
          Or choose your area
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
        <p className="mt-3 text-sm text-muted">Location is off. Choose your area instead.</p>
      )}

      {shown.length > 0 && (
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {shown.map(({ office, km }, i) => (
            <li key={office.name} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className={i === 0 ? "font-medium" : ""}>{office.name}</p>
                {km !== null && <p className="text-sm text-muted">About {km} km away</p>}
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
        Check the hours before you go. Your location stays on your phone.
      </p>
    </Card>
  );
}

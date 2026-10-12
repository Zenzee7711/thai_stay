import { describe, expect, it } from "vitest";
import { directionsUrl, distanceKm, nearestOffices, offices } from "./offices";

describe("distanceKm", () => {
  it("is zero for the same point", () => {
    expect(distanceKm({ lat: 13.75, lng: 100.5 }, { lat: 13.75, lng: 100.5 })).toBe(0);
  });

  it("is about 580 km from Bangkok to Chiang Mai in a straight line", () => {
    const km = distanceKm({ lat: 13.75, lng: 100.5 }, { lat: 18.79, lng: 98.98 });
    expect(km).toBeGreaterThan(560);
    expect(km).toBeLessThan(600);
  });
});

describe("nearestOffices", () => {
  it("sends Mae Fah Luang University students to Chiang Rai", () => {
    const [first] = nearestOffices({ lat: 20.045, lng: 99.894 });
    expect(first.office.area).toBe("Chiang Rai");
    expect(first.km).toBeLessThan(25);
  });

  it("sends someone in central Bangkok to the Bangkok office", () => {
    expect(nearestOffices({ lat: 13.75, lng: 100.5 })[0].office.area).toBe("Bangkok");
  });

  it("returns the requested number of offices, nearest first", () => {
    const list = nearestOffices({ lat: 20.045, lng: 99.894 }, 3);
    expect(list).toHaveLength(3);
    expect(list[0].km).toBeLessThanOrEqual(list[1].km);
    expect(list[1].km).toBeLessThanOrEqual(list[2].km);
  });
});

describe("directionsUrl", () => {
  it("asks Google Maps for directions to the office by name only", () => {
    const url = new URL(directionsUrl(offices[0]));
    expect(url.origin + url.pathname).toBe("https://www.google.com/maps/dir/");
    expect(url.searchParams.get("destination")).toBe("Chiang Rai Immigration Office, Thailand");
    expect(url.searchParams.has("origin")).toBe(false);
  });
});

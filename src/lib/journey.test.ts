import { describe, expect, it } from "vitest";
import { journeyMilestones, trackPosition, trackRange } from "./journey";

const report = { opens: "2026-10-02", due: "2026-10-17", lastDay: "2026-10-24" };

describe("journeyMilestones", () => {
  it("lists every known date in time order", () => {
    const keys = journeyMilestones({
      arrivalDate: "2026-07-20",
      report,
      permittedUntil: "2026-10-10",
    }).map((m) => m.key);
    expect(keys).toEqual(["arrived", "opens", "stay", "due", "last"]);
  });

  it("leaves out dates that were not entered", () => {
    const keys = journeyMilestones({ arrivalDate: "", report: null, permittedUntil: "2027-04-23" }).map(
      (m) => m.key,
    );
    expect(keys).toEqual(["stay"]);
  });
});

describe("trackRange", () => {
  it("runs from the earliest to the latest date", () => {
    expect(trackRange(["2026-10-13", "2026-07-20", "2027-04-23"])).toEqual({
      start: "2026-07-20",
      end: "2027-04-23",
    });
  });
});

describe("trackPosition", () => {
  const range = { start: "2026-01-01", end: "2026-01-11" }; // 10 days long

  it.each([
    ["2026-01-01", 0],
    ["2026-01-06", 50],
    ["2026-01-11", 100],
  ])("puts %s at %i%%", (date, expected) => {
    expect(trackPosition(date, range)).toBe(expected);
  });

  it("keeps dates outside the range on the track", () => {
    expect(trackPosition("2025-12-01", range)).toBe(0);
    expect(trackPosition("2026-03-01", range)).toBe(100);
  });

  it("centres everything when the track is a single day", () => {
    expect(trackPosition("2026-01-01", { start: "2026-01-01", end: "2026-01-01" })).toBe(50);
  });
});

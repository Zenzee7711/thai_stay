import { describe, expect, it } from "vitest";
import { journeyMilestones, laterReports, trackPosition, trackRange, yearStarts } from "./journey";

describe("laterReports", () => {
  it("estimates a report every 90 days until the stay ends", () => {
    expect(laterReports("2026-12-12", "2027-08-14")).toEqual(["2027-03-12", "2027-06-10"]);
  });

  it("estimates nothing when the end of the stay is unknown", () => {
    expect(laterReports("2026-12-12", "")).toEqual([]);
  });

  it("estimates nothing when the stay ends before the next report would be due", () => {
    expect(laterReports("2026-12-12", "2027-01-31")).toEqual([]);
  });
});

describe("journeyMilestones", () => {
  // A student who came back on 14 Sep 2026 with permission to stay until 14 Aug 2027.
  const milestones = journeyMilestones({
    arrivalDate: "2026-09-14",
    nextDue: "2026-12-12",
    permittedUntil: "2027-08-14",
  });

  it("shows one dot per report, plus arrival and the end of the stay", () => {
    expect(milestones.map((m) => m.key)).toEqual(["arrived", "report-0", "report-1", "report-2", "stay"]);
  });

  it("marks only the later reports as estimates", () => {
    expect(milestones.filter((m) => m.estimated).map((m) => m.date)).toEqual(["2027-03-12", "2027-06-10"]);
  });

  it("leaves out dates that were not entered", () => {
    const only = journeyMilestones({ arrivalDate: "", nextDue: null, permittedUntil: "2027-04-23" });
    expect(only.map((m) => m.key)).toEqual(["stay"]);
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

describe("yearStarts", () => {
  it("marks 1 January when the stay crosses into a new year", () => {
    expect(yearStarts({ start: "2026-09-14", end: "2027-08-14" })).toEqual(["2027-01-01"]);
  });

  it("marks nothing when the stay is within one year", () => {
    expect(yearStarts({ start: "2027-02-01", end: "2027-08-14" })).toEqual([]);
  });

  it("marks every new year on a long stay", () => {
    expect(yearStarts({ start: "2026-06-01", end: "2028-03-01" })).toEqual(["2027-01-01", "2028-01-01"]);
  });
});

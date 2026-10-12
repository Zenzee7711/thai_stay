import { describe, expect, it } from "vitest";
import { displayDate, relativeDays } from "./format";

describe("displayDate", () => {
  it("shows the weekday, day, month and year", () => {
    expect(displayDate("2026-12-26")).toBe("Sat 26 Dec 2026");
  });
});

describe("relativeDays", () => {
  it.each([
    [0, "today"],
    [1, "tomorrow"],
    [-1, "yesterday"],
    [74, "in 74 days"],
    [-3, "3 days ago"],
  ])("turns %i into %s", (days, expected) => {
    expect(relativeDays(days)).toBe(expected);
  });
});

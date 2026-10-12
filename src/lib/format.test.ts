import { describe, expect, it } from "vitest";
import { dayMonth, displayDate, relativeDays, shortDate } from "./format";

describe("date formats use short month names, day first", () => {
  it("displayDate shows the weekday, day, month and year", () => {
    expect(displayDate("2026-12-26")).toBe("Sat 26 Dec 2026");
  });

  it("shortDate drops the weekday", () => {
    expect(shortDate("2026-07-20")).toBe("20 Jul 2026");
  });

  it("dayMonth drops the year too", () => {
    expect(dayMonth("2027-02-03")).toBe("3 Feb");
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

import { describe, expect, it } from "vitest";
import { dayMonth, displayDate, relativeDays, shortDate, stopDate } from "./format";

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

describe("stopDate", () => {
  it("leaves out the year for dates in the current year", () => {
    expect(stopDate("2026-11-27", "2026-10-13")).toBe("27 Nov");
  });

  it("adds the year for dates in other years, so they can't be mixed up", () => {
    expect(stopDate("2025-08-14", "2026-10-13")).toBe("14 Aug 2025");
    expect(stopDate("2027-08-14", "2026-10-13")).toBe("14 Aug 2027");
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

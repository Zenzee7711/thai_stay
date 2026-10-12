import { describe, expect, it } from "vitest";
import { headline } from "./headline";

const dates = { opens: "2026-10-02", due: "2026-10-17", lastDay: "2026-10-24" };

describe("headline", () => {
  it("says nothing when no dates are known", () => {
    expect(headline("2026-10-13", null, null)).toEqual([]);
  });

  it("counts down to the window opening", () => {
    expect(headline("2026-09-28", { status: "not-open-yet", dates }, null)).toEqual([
      "Your 90-day report window opens in 4 days.",
    ]);
  });

  it("counts down to the due date while the window is open", () => {
    expect(headline("2026-10-13", { status: "open", dates }, null)).toEqual([
      "Your 90-day report is due in 4 days.",
    ]);
  });

  it("says 'today' on the due date", () => {
    expect(headline("2026-10-17", { status: "open", dates }, null)).toEqual([
      "Your 90-day report is due today.",
    ]);
  });

  it("names the last day during the grace period, with a short month", () => {
    expect(headline("2026-10-20", { status: "grace", dates }, null)).toEqual([
      "Your 90-day report was due 3 days ago. File by 24 Oct 2026 to avoid a fine.",
    ]);
  });

  it("warns when the report is late", () => {
    expect(headline("2026-10-30", { status: "late", dates }, null)).toEqual([
      "Your 90-day report is late. Expect a fine when you file.",
    ]);
  });

  it.each([
    [192, "You can stay 192 more days."],
    [1, "You can stay 1 more day."],
    [0, "Today is your last permitted day."],
    [-1, "You have overstayed by 1 day."],
    [-5, "You have overstayed by 5 days."],
  ])("with %i days left says %s", (daysLeft, expected) => {
    expect(headline("2026-10-13", null, daysLeft)).toEqual([expected]);
  });

  it("puts the report sentence before the stay sentence", () => {
    expect(headline("2026-10-13", { status: "open", dates }, 192)).toEqual([
      "Your 90-day report is due in 4 days.",
      "You can stay 192 more days.",
    ]);
  });
});

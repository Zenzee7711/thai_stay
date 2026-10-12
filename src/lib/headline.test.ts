import { describe, expect, it } from "vitest";
import { headline } from "./headline";

const dates = { opens: "2026-10-02", due: "2026-10-17", lastDay: "2026-10-24" };

describe("headline", () => {
  it("says nothing when no dates are known", () => {
    expect(headline("2026-10-13", null, null)).toEqual([]);
  });

  it("gives the due date before the window opens", () => {
    expect(headline("2026-09-28", { status: "not-open-yet", dates }, null)).toEqual([
      "Your next 90-day report is due 17 Oct 2026.",
    ]);
  });

  it("tells you to file now while the window is open", () => {
    expect(headline("2026-10-13", { status: "open", dates }, null)).toEqual([
      "File your 90-day report now. It's due in 4 days (17 Oct 2026).",
    ]);
  });

  it("keeps it short on the due date", () => {
    expect(headline("2026-10-17", { status: "open", dates }, null)).toEqual([
      "Your 90-day report is due today.",
    ]);
  });

  it("names the last day without a fine during the grace period", () => {
    expect(headline("2026-10-20", { status: "grace", dates }, null)).toEqual([
      "Your 90-day report is overdue. File by 24 Oct 2026 to avoid a fine.",
    ]);
  });

  it("states the usual fine when the report is late", () => {
    expect(headline("2026-10-30", { status: "late", dates }, null)).toEqual([
      "Your 90-day report is late. You may be fined 2,000 THB when you file.",
    ]);
  });

  it.each([
    [305, "You can stay until 14 Aug 2027 (305 days left)."],
    [1, "You can stay until 14 Aug 2027 (1 day left)."],
    [0, "Today is the last day you can stay."],
    [-1, "You've overstayed by 1 day."],
    [-5, "You've overstayed by 5 days."],
  ])("with %i days left says %s", (daysLeft, expected) => {
    expect(headline("2026-10-13", null, { permittedUntil: "2027-08-14", daysLeft })).toEqual([expected]);
  });

  it("puts the report sentence before the stay sentence", () => {
    expect(
      headline("2026-10-13", { status: "open", dates }, { permittedUntil: "2027-08-14", daysLeft: 305 }),
    ).toEqual([
      "File your 90-day report now. It's due in 4 days (17 Oct 2026).",
      "You can stay until 14 Aug 2027 (305 days left).",
    ]);
  });
});

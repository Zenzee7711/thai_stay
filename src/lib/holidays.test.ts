import { describe, expect, it } from "vitest";
import { lastOpenDayBy, officeClosedReason } from "./holidays";

describe("officeClosedReason", () => {
  it.each([
    ["2026-12-12", "Saturday"],
    ["2026-12-13", "Sunday"],
    ["2026-10-13", "King Bhumibol Memorial Day"],
    ["2027-04-14", "Songkran"],
  ])("says offices are closed on %s (%s)", (date, reason) => {
    expect(officeClosedReason(date)).toBe(reason);
  });

  it("says offices are open on a normal weekday", () => {
    expect(officeClosedReason("2026-12-11")).toBeNull();
  });
});

describe("lastOpenDayBy", () => {
  it("moves a Saturday deadline back to Friday", () => {
    expect(lastOpenDayBy("2026-12-12")).toBe("2026-12-11");
  });

  it("skips a holiday and the weekend before it", () => {
    // Mon 7 Dec 2026 is a substitute holiday, so the last open day is Fri 4 Dec.
    expect(lastOpenDayBy("2026-12-07")).toBe("2026-12-04");
  });

  it("skips the whole Songkran break", () => {
    expect(lastOpenDayBy("2027-04-15")).toBe("2027-04-12");
  });

  it("keeps a date when offices are open", () => {
    expect(lastOpenDayBy("2026-12-11")).toBe("2026-12-11");
  });
});

import { describe, expect, it } from "vitest";
import { daysBetween, firstReportDue, reportStatus, reportWindow } from "./deadlines";

describe("firstReportDue", () => {
  it("is day 90, counting the arrival day as day 1", () => {
    expect(firstReportDue("2026-10-13")).toBe("2027-01-10");
  });
});

describe("reportWindow", () => {
  it("opens 15 days before and closes 7 days after the due date", () => {
    expect(reportWindow("2027-01-10")).toEqual({
      opens: "2026-12-26",
      due: "2027-01-10",
      lastDay: "2027-01-17",
    });
  });
});

describe("daysBetween", () => {
  it("counts calendar days from the first date to the second", () => {
    expect(daysBetween("2026-10-13", "2026-10-20")).toBe(7);
  });

  it("is negative when the second date is earlier", () => {
    expect(daysBetween("2026-10-20", "2026-10-13")).toBe(-7);
  });

  it("is zero on the same day", () => {
    expect(daysBetween("2026-10-13", "2026-10-13")).toBe(0);
  });
});

describe("reportStatus", () => {
  const dates = { opens: "2026-12-26", due: "2027-01-10", lastDay: "2027-01-17" };

  it("is not open the day before the window opens", () => {
    expect(reportStatus("2026-12-25", dates)).toBe("not-open-yet");
  });

  it("is open from the first day of the window", () => {
    expect(reportStatus("2026-12-26", dates)).toBe("open");
  });

  it("is still open on the due date itself", () => {
    expect(reportStatus("2027-01-10", dates)).toBe("open");
  });

  it("is in the grace period the day after the due date", () => {
    expect(reportStatus("2027-01-11", dates)).toBe("grace");
  });

  it("is still in the grace period on the last day", () => {
    expect(reportStatus("2027-01-17", dates)).toBe("grace");
  });

  it("is late the day after the last day", () => {
    expect(reportStatus("2027-01-18", dates)).toBe("late");
  });
});

import { describe, expect, it } from "vitest";
import { firstReportDue, reportWindow } from "./deadlines";

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
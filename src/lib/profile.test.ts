import { describe, expect, it } from "vitest";
import { afterReentry, emptyProfile, parseProfile } from "./profile";

describe("parseProfile", () => {
  it("reads back a saved profile", () => {
    const saved = {
      arrivalDate: "2026-07-20",
      slipDueDate: "",
      permittedUntil: "2027-04-23",
      hasReentryPermit: true,
    };
    expect(parseProfile(JSON.stringify(saved))).toEqual(saved);
  });

  it("starts empty when nothing is saved", () => {
    expect(parseProfile(null)).toEqual(emptyProfile);
  });

  it("starts empty instead of crashing on broken data", () => {
    expect(parseProfile("{not json")).toEqual(emptyProfile);
  });

  it("ignores fields with the wrong shape", () => {
    const parsed = parseProfile(JSON.stringify({ arrivalDate: 42, permittedUntil: "13/10/2026" }));
    expect(parsed).toEqual(emptyProfile);
  });
});

describe("afterReentry", () => {
  it("restarts the 90-day count from today and drops the old slip date", () => {
    const before = {
      arrivalDate: "2026-07-20",
      slipDueDate: "2026-12-01",
      permittedUntil: "2027-04-23",
      hasReentryPermit: true,
    };
    expect(afterReentry(before, "2026-11-02")).toEqual({
      ...before,
      arrivalDate: "2026-11-02",
      slipDueDate: "",
    });
  });
});

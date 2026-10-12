import { describe, expect, it } from "vitest";
import { deadlineEvents, googleCalendarUrl } from "./calendar";

const report = { opens: "2026-12-26", due: "2027-01-10", lastDay: "2027-01-17" };

describe("deadlineEvents", () => {
  it("makes three report events and one stay event when everything is known", () => {
    const titles = deadlineEvents(report, "2027-04-23").map((event) => event.title);
    expect(titles).toEqual([
      "90-day report window opens",
      "90-day report due",
      "Last day to file 90-day report before a fine",
      "Permission to stay in Thailand ends",
    ]);
  });

  it("makes only the stay event when there is no report date", () => {
    expect(deadlineEvents(null, "2027-04-23")).toHaveLength(1);
  });

  it("makes nothing when no dates are known", () => {
    expect(deadlineEvents(null, "")).toEqual([]);
  });

  it("reminds a month and a week before permission to stay ends", () => {
    const stay = deadlineEvents(null, "2027-04-23")[0];
    expect(stay.remindDaysBefore).toEqual([30, 7]);
  });
});

describe("googleCalendarUrl", () => {
  const [, due] = deadlineEvents(report, "");
  const url = new URL(googleCalendarUrl(due));

  it("opens Google Calendar's new-event page", () => {
    expect(url.origin + url.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
  });

  it("fills in an all-day event on the due date", () => {
    expect(url.searchParams.get("text")).toBe("90-day report due");
    expect(url.searchParams.get("dates")).toBe("20270110/20270111");
  });
});

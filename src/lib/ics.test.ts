import { describe, expect, it } from "vitest";
import type { CalendarEvent } from "./calendar";
import { buildCalendar } from "./ics";

const now = new Date("2026-10-13T08:30:00Z");

function event(changes: Partial<CalendarEvent> = {}): CalendarEvent {
  return { date: "2027-01-10", title: "90-day report due", details: "Report today.", remindDaysBefore: [], ...changes };
}

describe("buildCalendar", () => {
  const ics = buildCalendar([event()], now);

  it("wraps everything in one calendar", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  it("makes an all-day event on the given date", () => {
    expect(ics).toContain("DTSTART;VALUE=DATE:20270110");
    expect(ics).toContain("DTEND;VALUE=DATE:20270111");
    expect(ics).toContain("SUMMARY:90-day report due");
    expect(ics).toContain("DESCRIPTION:Report today.");
  });

  it("stamps the event with the time the file was made", () => {
    expect(ics).toContain("DTSTAMP:20261013T083000Z");
  });

  it("uses Windows-style line endings, as the calendar format requires", () => {
    expect(ics.replaceAll("\r\n", "")).not.toContain("\n");
  });

  it("escapes commas and semicolons in titles", () => {
    const escaped = buildCalendar([event({ title: "Report; bring passport, slip" })], now);
    expect(escaped).toContain("SUMMARY:Report\\; bring passport\\, slip");
  });

  it("makes one event per deadline", () => {
    const two = buildCalendar([event(), event({ date: "2027-02-01" })], now);
    expect(two.match(/BEGIN:VEVENT/g)).toHaveLength(2);
  });
});

describe("reminders", () => {
  it("always alerts at 9:00 on the day", () => {
    const ics = buildCalendar([event()], now);
    expect(ics.match(/BEGIN:VALARM/g)).toHaveLength(1);
    expect(ics).toContain("TRIGGER:PT9H");
  });

  it("adds an alert at 9:00 a few days before when asked", () => {
    const ics = buildCalendar([event({ remindDaysBefore: [3] })], now);
    expect(ics.match(/BEGIN:VALARM/g)).toHaveLength(2);
    expect(ics).toContain("TRIGGER:-P2DT15H"); // midnight minus 2 days 15 hours = 9:00, 3 days earlier
  });

  it("can remind a month ahead", () => {
    const ics = buildCalendar([event({ remindDaysBefore: [30] })], now);
    expect(ics).toContain("TRIGGER:-P29DT15H");
  });
});

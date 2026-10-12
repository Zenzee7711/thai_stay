import { describe, expect, it } from "vitest";
import { buildCalendar } from "./ics";

const now = new Date("2026-10-13T08:30:00Z");

describe("buildCalendar", () => {
  const ics = buildCalendar([{ date: "2027-01-10", title: "90-day report due" }], now);

  it("wraps everything in one calendar", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  it("makes an all-day event on the given date", () => {
    expect(ics).toContain("DTSTART;VALUE=DATE:20270110");
    expect(ics).toContain("DTEND;VALUE=DATE:20270111");
    expect(ics).toContain("SUMMARY:90-day report due");
  });

  it("stamps the event with the time the file was made", () => {
    expect(ics).toContain("DTSTAMP:20261013T083000Z");
  });

  it("uses Windows-style line endings, as the calendar format requires", () => {
    expect(ics.replaceAll("\r\n", "")).not.toContain("\n");
  });

  it("escapes commas and semicolons in titles", () => {
    const escaped = buildCalendar([{ date: "2027-01-10", title: "Report; bring passport, slip" }], now);
    expect(escaped).toContain("SUMMARY:Report\\; bring passport\\, slip");
  });

  it("makes one event per deadline", () => {
    const two = buildCalendar(
      [
        { date: "2027-01-10", title: "Report due" },
        { date: "2027-02-01", title: "Permission ends" },
      ],
      now,
    );
    expect(two.match(/BEGIN:VEVENT/g)).toHaveLength(2);
  });
});

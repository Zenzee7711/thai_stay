import { addDays, format, parseISO } from "date-fns";

// Days when government offices (including immigration) are closed, from Oct 2026 to Dec 2027.
// Fixed-date holidays are reliable. Buddhist holidays follow the lunar calendar, and the 2027
// dates are provisional until the government announces them. When a holiday falls on a weekend,
// the next working day is usually given off instead ("substitute day").
const holidays: Record<string, string> = {
  "2026-10-13": "King Bhumibol Memorial Day",
  "2026-10-23": "Chulalongkorn Day",
  "2026-12-07": "Father's Day (substitute day)",
  "2026-12-10": "Constitution Day",
  "2026-12-31": "New Year's Eve",
  "2027-01-01": "New Year's Day",
  "2027-02-22": "Makha Bucha (substitute day)",
  "2027-04-06": "Chakri Day",
  "2027-04-13": "Songkran",
  "2027-04-14": "Songkran",
  "2027-04-15": "Songkran",
  "2027-05-04": "Coronation Day",
  "2027-05-20": "Visakha Bucha",
  "2027-06-03": "Queen Suthida's Birthday",
  "2027-07-19": "Khao Phansa (Buddhist Lent)",
  "2027-07-20": "Asarnha Bucha (substitute day)",
  "2027-07-28": "King Vajiralongkorn's Birthday",
  "2027-08-12": "Mother's Day",
  "2027-10-13": "King Bhumibol Memorial Day",
  "2027-10-25": "Chulalongkorn Day (substitute day)",
  "2027-12-06": "Father's Day (substitute day)",
  "2027-12-10": "Constitution Day",
  "2027-12-31": "New Year's Eve",
};

// Why offices are closed on a date ("Saturday", a holiday's name), or null if they are open.
export function officeClosedReason(date: string): string | null {
  const day = parseISO(date).getDay();
  if (day === 6) return "Saturday";
  if (day === 0) return "Sunday";
  return holidays[date] ?? null;
}

// "is a Saturday" / "is a public holiday (Songkran)", for warning sentences.
export function closedPhrase(reason: string): string {
  return reason === "Saturday" || reason === "Sunday" ? `is a ${reason}` : `is a public holiday (${reason})`;
}

// The last day on or before a date when offices are open. Used to warn that a deadline
// falling on a weekend or holiday really means going earlier.
export function lastOpenDayBy(date: string): string {
  let current = date;
  for (let i = 0; i < 14 && officeClosedReason(current); i++) {
    current = format(addDays(parseISO(current), -1), "yyyy-MM-dd");
  }
  return current;
}

# Thai Stay

**Track your 90-day report and visa dates in Thailand.**

Live: **https://thai-stay-one.vercel.app**

## Who it's for

I built this for the international students at my university, Mae Fah Luang University in
Chiang Rai, especially juniors who are new to Thailand and have never done a 90-day report. It
works for anyone on a long-stay visa, such as a student visa valid for a year.

## The problem it solves

Counting 90 days is easy, and anyone can do it in their head. The hard part is the rules
around the count, which confuse almost every student at some point:

- **Which date do I count from after a trip?** You fly home for the holidays with a 90-day
  receipt that says your next report is due on a certain date. Is that still your deadline, or
  do you count from the day you came back? (From the day you came back. Leaving Thailand
  restarts the count, and the old receipt no longer applies.)
- **Can I do it online, or do I have to go in person?** The first report after every arrival
  must be done in person. After that, if you stay in Thailand, you can file online. But after any
  trip abroad, it's back to in person.
- **Where do I go?** The immigration office for the province where you live. For students at
  my university that's Chiang Rai.
- **When does my visa actually expire?** The date that counts is the "admitted until" date on
  your latest stamp, not necessarily the date printed on the visa sticker.

Getting these wrong costs money. A late 90-day report usually means a 2,000 THB fine, and
overstaying costs 500 THB a day. Thai Stay takes the dates from your passport stamp and your
latest receipt and answers these questions for you.

## What it does

- **Tells you what to do next, with the date.** For example: "Your next 90-day report is due
  12 Dec 2026. You can stay until 14 Aug 2027 (305 days left)."
- **Tells you whether to go in person or file online.** It works this out from your dates: the
  first report after arriving is in person, later ones can be online (with a link to the
  official site), and a report past its due date is in person.
- **Handles trips abroad.** A trip restarts the 90-day count. The date field, the report card,
  the timeline and the guide all explain this, and a receipt from before a trip is detected
  automatically, ignored and explained, with a button to remove it.
- **Warns about weekends and public holidays.** Immigration offices are closed then. If your
  in-person deadline falls on one, the app tells you the last day they are open. For example:
  "12 Dec 2026 is a Saturday. Offices are closed, so go by Fri 11 Dec 2026." It covers Thai
  public holidays from October 2026 to December 2027. Lunar holiday dates for 2027 are provisional
  until the government announces them.
- **Finds your immigration office.** "Find the nearest office" uses your phone's location to
  list the closest immigration offices with Google Maps directions, or you can pick your area
  from a list, with the usual opening hours and a "closed today" notice. Your location never
  leaves your device.
- **Timeline of your whole stay**, drawn like a transit line from your last arrival to your
  visa expiry. Every stop is labelled ("Report 12 Dec", "Report ~12 Mar", "Leave by 15 Aug"),
  and reports further ahead are marked as estimates. It shows "Day 30 of 336 · 3 reports to go",
  the filing window and grace period, and a marker at each new year. Select a stop by tapping it,
  with Previous and Next, or with the arrow keys.
- **Visa expiry countdown** that turns amber under 30 days and red at 7, plus a warning if you
  have no re-entry permit.
- **Quick updates:** "Mark as filed" asks for the next due date from your new receipt, and
  "I just re-entered Thailand" restarts the 90-day count.
- **Calendar:** one-tap Google Calendar links, or one `.ics` file for Apple Calendar and Outlook
  with reminders built in.
- **Guides** for filing the report, trips abroad, extending your stay and getting a re-entry
  permit, each with its sources.
- **Private:** your dates are saved only in your browser (`localStorage`). There is no server,
  no account, and nothing is sent anywhere.

### Keeping the saved dates safe

Browser storage can be cleared, so the app takes three steps to keep it:

- It asks the browser for **persistent storage** after the first save, so the browser doesn't
  delete the data when the device runs low on space.
- On **iPhone and iPad**, Safari may delete a site's data if it isn't opened for 7 days, so the
  app suggests adding it to the Home Screen, where the data is kept. It has its own icon and
  opens full-screen like an app.
- Links shared in **LINE, Facebook or Instagram** open in those apps' built-in browsers, which
  often lose saved data. The app recognises them and offers to open the page in Safari or
  Chrome. In LINE this is one tap, using LINE's `openExternalBrowser` link option.

## How it was built

I started with a **plain prototype**: one form, the 90-day date maths and a calendar-file
download. It worked, but using it showed that calculating dates isn't the hard part for people.
Remembering them, and knowing which rule applies, is. So I reworked it in stages:

1. **Prototype.** Date logic written test-first, a basic form, and a `.ics` export.
2. **Assistant features.** Saved dates, one-tap calendar links with reminders, quick updates
   after filing or travelling, and sourced guides.
3. **Redesign.** A summary headline, the interactive timeline, date fields that read
   "20 Jul 2026" instead of `07/20/2026`, and a minimal light and dark theme.
4. **Testing with my own dates.** Entering my real student-visa dates showed several problems.
   The timeline had no years and showed only the first report. My old receipt from before a trip
   to Indonesia made the app say I was late when I wasn't. The wording was too vague. I fixed
   each one, and added the in person or online answer and the office finder, because those
   confused me too when I was new. Then I cut the text down so every message is one short line
   in plain words, for students who have never dealt with immigration before.

The commit history follows these stages.

## Design decisions

- **Your paperwork beats my estimate.** After each report, Immigration prints the next due date
  on your receipt. When you enter it, the app uses that date and labels anything it calculated
  itself as an estimate.
- **A trip abroad cancels an old receipt.** A receipt is only issued after a first report, so
  during the current stay its date is always later than the first report due from your arrival.
  If it isn't, the receipt is from before a trip. The app then counts from your arrival instead
  and explains why. (My own case: a receipt due 16 Sep, but a trip from 1 to 14 Sep.)
- **In person or online is worked out, not asked.** A receipt from the current stay means you
  have already reported since arriving, so online filing is open. No receipt means this is the
  first report since arriving, so it's in person. A report past its due date is in person,
  because online filing closes on the due date.
- **Only the next report is treated as certain.** Later reports depend on when you file and
  whether you travel, so they appear on the timeline as estimates and are left out of the
  calendar export.
- **When sources disagree, pick the earlier date.** Guides differ on whether day 90 is
  "arrival + 89" or "arrival + 90". The app uses the earlier one, because reporting a day early
  is free and reporting late is a fine.
- **Location stays on the device.** The nearest office is worked out in the browser. The
  directions link contains only the office's name, and Google Maps uses the phone's own location
  as the starting point.
- **No guessing visa rules.** Rules depend on nationality and visa type and they change, so the
  app never infers them. It only calculates from the dates you enter.
- **Logic is separate from the screen.** All rules live in `src/lib/` as plain functions. They
  take "today" as an input instead of reading the clock, so the tests can pretend it is any day
  and stay deterministic.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · date-fns · Vitest ·
deployed on Vercel

## Project structure

```
src/
├── app/            page, layout, global styles, web app manifest, generated icons
├── components/     DateField, JourneyTrack, ReportCard, StayCard, OfficeFinder, CalendarCard,
│                   HomeScreenHint, InAppBrowserHint ...
├── hooks/          useStoredProfile (saved dates), useHomeScreenHint (iPhone tip)
│                   both use useSyncExternalStore to avoid server/browser mismatches
└── lib/            pure logic, each file with its own tests
    ├── deadlines.ts    90-day window, report status, in person or online, visa countdown
    ├── headline.ts     the summary sentences
    ├── journey.ts      timeline: milestones, estimated later reports, positions, year markers
    ├── offices.ts      immigration offices, distances, nearest office, directions links
    ├── holidays.ts     weekends and public holidays when offices are closed
    ├── calendar.ts     calendar events and Google Calendar links
    ├── ics.ts          .ics file builder with reminders
    ├── profile.ts      validating saved data
    ├── device.ts       iPhone/iPad and in-app browser detection
    └── guides.ts       the guides and their sources
```

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests in watch mode
npm run build    # production build
```

## Tests

The date rules are tested at their boundaries: the day before the filing window opens and the
day it opens, the due date and the day after, the last day and the day after, leap years, and
year ends. Other tests cover receipts from before a trip, in person or online, the summary
sentences, the estimated later reports and year markers, the nearest office (a test checks that
Mae Fah Luang University is sent to Chiang Rai), the `.ics` output, corrupted saved data,
iPhone, iPad and in-app browser detection, and a check that every guide cites a source.

## What's next

- **Email reminders.** Calendar reminders only work if you add the dates to a calendar, and
  browser storage can be cleared. The more useful version would email you when your filing
  window opens, a few days before the due date, and a month before your visa expires. I designed
  this but haven't built it. It needs a database, a scheduled job that runs daily, and an
  email-sending service, which usually means owning a verified domain, with costs that grow with
  users. That moves the project from free to something with running costs, so it's not in this
  version. It's the first thing I would add.
- **Every immigration office.** The office finder covers major offices, with the north
  (Chiang Rai, Phayao, Chiang Mai) covered for my university. Adding every provincial office
  with exact locations is next.

## Sources and disclaimer

Rules and fees come from the Thai government portal, the Immigration Bureau, the Board of
Investment FAQ, university international offices, and several expat guides. Each guide in the
app links its sources. **This is not legal advice.** Fees and procedures change, so always check
with Immigration.

# Thai Stay

**Track your 90-day report and visa dates in Thailand.**

Live: **https://thai-stay-one.vercel.app**

Foreigners living in Thailand have to keep track of several immigration deadlines at once: the
90-day address report (TM.47), the last day of their permitted stay, and whether leaving the
country will cancel that permission. Missing one costs money. A late 90-day report usually means
a 2,000 THB fine, and overstaying costs 500 THB a day. The arithmetic is easy. Remembering the
dates, and knowing what to do about each one, is not.

Thai Stay takes the dates from your own passport stamp and TM.47 receipt and turns them into a
plain summary, a timeline of your whole stay, calendar reminders, and a short guide for each step.

## What it does

- **Tells you what to do next, with the date.** For example: "Your next 90-day report is due
  12 Dec 2026. You can stay until 14 Aug 2027 (305 days left)."
- **Timeline of your whole stay**, from your last arrival to your last permitted day. It has one
  dot per 90-day report, and reports further ahead are drawn as estimates. It also shades the
  filing window and grace period, shows the year at both ends and at each new year, and lets
  you tap any dot to see its date.
- **90-day report status:** upcoming, file now, overdue (no fine yet) or late, each with a
  single instruction such as "You can file from 27 Nov 2026."
- **Permitted-stay countdown** that turns amber under 30 days and red at 7, plus a warning if
  you have no re-entry permit.
- **Quick updates:** "Mark as filed" asks for the next due date from your new receipt, and
  "I just re-entered Thailand" restarts the 90-day count.
- **Calendar:** one-tap Google Calendar links, or one `.ics` file for Apple Calendar and Outlook
  with reminders built in.
- **Guides** for filing the report, extending your stay and getting a re-entry permit, each with
  its sources.
- **Private:** dates are saved only in your browser (`localStorage`). There is no server, no
  account, and nothing is sent anywhere.
- **Works as a Home Screen app.** On iPhone, Safari may delete a site's saved data if the site
  isn't opened for 7 days, so iPhone users get a one-time tip to add the page to their Home
  Screen, where the data is kept.

## How it was built

I started with a **plain prototype**: one form, the 90-day date maths and a calendar-file
download. It worked, but using it showed that calculating dates isn't the hard part for people.
Remembering them and knowing the next step is. So I reworked it in stages:

1. **Prototype.** Date logic written test-first, a basic form, and a `.ics` export.
2. **Assistant features.** Saved dates, one-tap calendar links with reminders, quick updates
   after filing or travelling, and sourced guides.
3. **Redesign.** A summary headline, the interactive timeline, date fields that read
   "20 Jul 2026" instead of `07/20/2026`, and a minimal light and dark theme.
4. **Testing with my own dates.** Entering my real student-visa dates showed two problems: the
   timeline had no years, which is confusing for a stay of almost a year, and it only showed the
   first report. I added year markers and estimated later reports. I also rewrote all the
   wording so each message gives one instruction and one date, and used the same word for the
   same thing everywhere (always "receipt", never "slip").

The commit history follows these stages.

## Design decisions

- **Your paperwork beats my estimate.** After each report, Immigration prints the next due date
  on your TM.47 receipt. When you enter it, the app uses that date and labels anything it
  calculated itself as an estimate.
- **A trip abroad cancels an old receipt.** Leaving Thailand restarts the 90-day count. A
  receipt is only issued after a first report, so during the current stay its date is always
  later than the first report due from your arrival. If it isn't, the receipt is from before
  your trip. The app then counts from your arrival instead and explains why. (I found this
  case with my own dates: a receipt due 16 Sep, but a trip from 1 to 14 Sep.)
- **Only the next report is treated as certain.** Later reports depend on when you file and
  whether you travel, so they appear on the timeline as estimates and are left out of the
  calendar export.
- **When sources disagree, pick the earlier date.** Guides differ on whether day 90 is
  "arrival + 89" or "arrival + 90". The app uses the earlier one, because reporting a day early
  is free and reporting late is a fine.
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
├── components/     DateField, JourneyTrack, ReportCard, StayCard, CalendarCard, HomeScreenHint ...
├── hooks/          useStoredProfile (saved dates), useHomeScreenHint (iPhone tip)
│                   both use useSyncExternalStore to avoid server/browser mismatches
└── lib/            pure logic, each file with its own tests
    ├── deadlines.ts    90-day window, report status, stay countdown
    ├── headline.ts     the summary sentences
    ├── journey.ts      timeline: milestones, estimated later reports, positions, year markers
    ├── calendar.ts     calendar events and Google Calendar links
    ├── ics.ts          .ics file builder with reminders
    ├── profile.ts      validating saved data
    ├── device.ts       detecting iPhone and iPad for the Home Screen tip
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
year ends. Other tests cover the summary sentences, the estimated later reports and year
markers, the `.ics` output (line endings, escaping, reminder times), the handling of corrupted
saved data, iPhone and iPad detection (including iPads that report themselves as Macs), and a
check that every guide cites a source.

## What's next: email reminders

Calendar reminders only work if you add the dates to a calendar, and browser storage can be
cleared. The more useful version would **email you** when your filing window opens, a few days
before the due date, and a month before your stay ends. I designed this, but it is not built
yet. It needs:

- a **database** to store who to remind and when,
- a **scheduled job** that runs daily to send due reminders, and
- an **email-sending service**. Sending to other people's addresses usually means owning a
  verified domain, and costs grow with the number of users.

That moves the project from free and serverless to something with running costs, so I left it
out of this version. It is the first thing I would add.

## Sources and disclaimer

Rules and fees come from the Thai government portal, the Immigration Bureau, the Board of
Investment FAQ and several university and expat guides. Each guide in the app links its sources.
**This is not legal advice.** Fees and procedures change, so always check with Immigration.

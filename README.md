# Thai Stay

**Every deadline of your stay in Thailand, on one quiet page.**

Live: **https://thai-stay-one.vercel.app**

Foreigners living in Thailand have to keep track of several immigration deadlines at once: the
90-day address report (TM.47), the date their permission to stay ends, and whether leaving the
country will cancel that permission. Missing one costs money. A late 90-day report usually
means a 2,000 THB fine, and overstaying costs 500 THB a day. The arithmetic is easy. Remembering
the dates, and knowing what to do about each one, is not.

Thai Stay takes the dates printed on your own paperwork and turns them into a plain-language
summary, a timeline and calendar reminders, along with a short guide for each step.

## What it does

- **Tells you where you stand in one sentence:** "Your 90-day report is due in 4 days. You
  can stay 23 more days."
- **Journey track:** your stay on one line, from arrival to the end of your permission to stay.
  It shows today, the reporting window and the grace period, and you can tap any date for details.
- **90-day report status:** not open yet, report now, overdue (still no fine), or late.
- **Permission-to-stay countdown** that changes colour as the date gets close, plus a warning
  if you have no re-entry permit.
- **Keeps itself up to date:** "I've filed this report" and "I just came back to Thailand"
  update the dates in one tap.
- **Calendar:** one-tap Google Calendar links, or a single `.ics` file for iPhone and Outlook
  with reminders built in.
- **What-to-do guides** for filing the report, extending your stay and getting a re-entry
  permit. Every guide links its sources.
- **Private by design:** dates are saved only in your browser (`localStorage`). There is no
  server, no account, and nothing is sent anywhere.

## How it was built

I started with a **plain prototype**: one form, the 90-day date maths and a calendar-file
download. It worked, but using it showed that calculating dates is not the hard part for
people. Remembering them and knowing the next step is. So I reworked it in stages:

1. **Prototype.** Date logic written test-first, a basic form, and a `.ics` export.
2. **Assistant features.** Saved dates, one-tap calendar links with reminders, quick updates
   after filing or travelling, and sourced guides.
3. **Redesign.** A summary headline, the interactive journey track, custom date fields that
   read "20 Jul 2026" instead of `07/20/2026`, and a minimal light and dark theme.

The commit history follows these stages.

## Design decisions

- **Your paperwork beats my estimate.** After your first report, Immigration prints the next
  due date on your TM.47 slip. When you enter it, the app uses that date and labels anything it
  calculated itself as an estimate.
- **When sources disagree, pick the earlier date.** Guides differ on whether day 90 is
  "arrival + 89" or "arrival + 90". The app uses the earlier one, because reporting a day early
  is free and reporting late is a fine.
- **No guessing visa rules.** Rules depend on nationality and visa type and they change, so
  the app never infers them. It only calculates from the dates you enter.
- **Logic is separate from the screen.** All rules live in `src/lib/` as plain functions.
  They take "today" as an input instead of reading the clock, so the tests can pretend it is any
  day and stay deterministic.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · date-fns · Vitest ·
deployed on Vercel

## Project structure

```
src/
├── app/            page, layout and global styles (design tokens)
├── components/     screen pieces: DateField, JourneyTrack, ReportCard, StayCard, CalendarCard ...
├── hooks/          useStoredProfile: saves dates in localStorage without hydration mismatches
└── lib/            pure logic, each file with its own tests
    ├── deadlines.ts    90-day window, report status, stay countdown
    ├── headline.ts     the summary sentence
    ├── journey.ts      positions on the journey track
    ├── calendar.ts     calendar events and Google Calendar links
    ├── ics.ts          .ics file builder with reminders
    ├── profile.ts      validating saved data
    └── guides.ts       the what-to-do guides and their sources
```

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests in watch mode
npm run build    # production build
```

## Tests

The date rules are tested at their boundaries: the day before the reporting window opens and the
day it opens, the due date and the day after, the last day and the day after, leap years, and
year ends. Other tests check the summary sentences, the `.ics` output (line endings, escaping,
reminder times), the handling of corrupted saved data, and that every guide cites a source.

## What's next: email reminders

Calendar reminders only work if you add the dates to a calendar. The more useful version would
**email you** when your window opens, a few days before the due date, and a month before your
stay ends. I designed this, but it is not built yet. It needs:

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

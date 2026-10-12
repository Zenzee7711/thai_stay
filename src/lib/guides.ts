// Plain-language "what to do" guides. Kept as data, apart from the components,
// so a rule change means editing this list only. Every guide must cite its sources.
export type Guide = {
  title: string;
  sections: { heading: string; items: string[] }[];
  sources: { label: string; href: string }[];
};

export const reportGuide: Guide = {
  title: "How to do the 90-day report",
  sections: [
    {
      heading: "In person or online?",
      items: [
        "Your first report after arriving in Thailand: in person, at the immigration office for your province.",
        "After that, if you don't leave Thailand: online is OK.",
        "Online only works up to the due date. If you're late, go in person.",
      ],
    },
    {
      heading: "If you travel abroad",
      items: [
        "Your 90-day count restarts on the day you come back. Your old receipt no longer counts.",
        "Your next report is in person again.",
        "Tap \"I just came back to Thailand\" to update your dates.",
      ],
    },
    {
      heading: "What to bring (in person)",
      items: [
        "Your passport, plus copies of the photo page, visa and latest entry stamp",
        "Form TM.47 (the 90-day report form), top half filled in and signed",
        "Your last 90-day receipt, if you have one",
      ],
    },
    {
      heading: "Cost",
      items: ["Free. Late usually means a 2,000 THB fine."],
    },
  ],
  sources: [
    { label: "Thai government portal", href: "https://thailand.go.th/event-detail/001_01_084" },
    { label: "Online report (official)", href: "https://tm47.immigration.go.th/tm47/" },
    { label: "Thaiger", href: "https://thethaiger.com/visas/services/90-day-reporting/" },
    { label: "Thailand Starter Kit", href: "https://www.thailandstarterkit.com/visas/90-day-notification-thailand/" },
    { label: "ExpatDen", href: "https://expatden.com/thailand/90-day-notification-thailand/" },
  ],
};

export const extensionGuide: Guide = {
  title: "Extending your visa",
  sections: [
    {
      heading: "Before it expires",
      items: [
        "Apply at your immigration office before the date, if your visa type can be extended. The form is TM.7 and the fee is 1,900 THB.",
        "Ask your office (or your university's international office) which documents you need.",
        "If you can't extend, leave Thailand by the date.",
      ],
    },
    {
      heading: "If you stay too long",
      items: ["500 THB a day, up to 20,000 THB. Long overstays can get you banned from Thailand."],
    },
  ],
  sources: [
    { label: "Immigration Bureau", href: "https://www.immigration.go.th/" },
    { label: "Board of Investment FAQ", href: "https://osos.boi.go.th/EN/faq-main/" },
    { label: "PSU Phuket", href: "https://www.psu.ac.th/phuket/en/56113/" },
  ],
};

export const reentryGuide: Guide = {
  title: "Re-entry permit",
  sections: [
    {
      heading: "Do you need one?",
      items: [
        "Yes, if you leave Thailand and want your visa to still work when you come back.",
        "Not if you have a multiple-entry visa that's still valid. Ask Immigration if unsure.",
      ],
    },
    {
      heading: "How to get it",
      items: [
        "Before you leave: at your immigration office, or at the airport's re-entry counter.",
        "Bring your passport, a photo and form TM.8.",
        "1,000 THB for one trip, 3,800 THB for many. Check the fee before you go.",
      ],
    },
  ],
  sources: [
    { label: "Thai government portal", href: "https://thailand.go.th/guide-book-detail/001_01_118" },
    { label: "Board of Investment FAQ", href: "https://osos.boi.go.th/EN/faq-group/28/About-Re-entry-Permit/" },
  ],
};

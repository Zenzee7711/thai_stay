// Plain-language "what to do" guides. Kept as data, apart from the components,
// so a rule change means editing this list only. Every guide must cite its sources.
export type Guide = {
  title: string;
  sections: { heading: string; items: string[] }[];
  sources: { label: string; href: string }[];
};

export const reportGuide: Guide = {
  title: "How to file the 90-day report",
  sections: [
    {
      heading: "Ways to report",
      items: [
        "In person at the immigration office for the area you live in. Several guides say your first report must be done in person.",
        "Online on the TM.47 website, usually from your second report on. Online filing generally only works inside the window, not during the 7-day grace period.",
        "By registered mail, or through someone you authorise, such as an agent.",
      ],
    },
    {
      heading: "What to bring (in person)",
      items: [
        "Your passport",
        "Form TM.47 with the top half filled in and signed. The officer completes the rest and returns it as your receipt.",
        "Copies of your passport photo page, your visa and your latest entry stamp",
        "Your previous 90-day receipt, if you have one",
      ],
    },
    {
      heading: "Cost",
      items: ["Reporting is free. Reporting late usually means a 2,000 THB fine."],
    },
  ],
  sources: [
    { label: "Thai government portal: 90-day notification", href: "https://thailand.go.th/event-detail/001_01_084" },
    { label: "Online TM.47 report (official)", href: "https://tm47.immigration.go.th/tm47/" },
    { label: "Thaiger: 90-day reporting guide", href: "https://thethaiger.com/visas/services/90-day-reporting/" },
  ],
};

export const extensionGuide: Guide = {
  title: "Extending your stay",
  sections: [
    {
      heading: "Before your last day",
      items: [
        "Apply for an extension of stay at your local immigration office before your permission ends, if your visa type allows one. The form is TM.7 and the fee is 1,900 THB.",
        "The documents needed depend on why you are staying (work, study, marriage, retirement and so on). Ask your office for its checklist.",
        "If you can't extend, leave Thailand on or before your last day.",
      ],
    },
    {
      heading: "If you overstay",
      items: [
        "The fine is 500 THB for each day, up to 20,000 THB.",
        "Long overstays can lead to deportation and a ban on coming back.",
      ],
    },
  ],
  sources: [
    { label: "Immigration Bureau (official)", href: "https://www.immigration.go.th/" },
    { label: "Board of Investment FAQ: extension fees", href: "https://osos.boi.go.th/EN/faq-main/" },
    { label: "PSU Phuket: visa extension and overstay", href: "https://www.psu.ac.th/phuket/en/56113/" },
  ],
};

export const reentryGuide: Guide = {
  title: "Re-entry permit",
  sections: [
    {
      heading: "Do you need one?",
      items: [
        "Yes, if you want to keep your current permission to stay (for example an extension) when you leave Thailand and come back. Without one, that permission ends when you leave.",
        "If you have a multiple-entry visa that is still valid, you usually don't. Ask immigration if you are unsure.",
      ],
    },
    {
      heading: "How to get it",
      items: [
        "Apply before you leave, at your local immigration office or at the re-entry counter of a major international airport.",
        "Bring your passport, form TM.8 and a passport photo.",
        "Fee: 1,000 THB for a single re-entry, 3,800 THB for multiple. Check the current fee before you go.",
      ],
    },
  ],
  sources: [
    { label: "Thai government portal: re-entry permit", href: "https://thailand.go.th/guide-book-detail/001_01_118" },
    { label: "Board of Investment FAQ: re-entry permit", href: "https://osos.boi.go.th/EN/faq-group/28/About-Re-entry-Permit/" },
  ],
};

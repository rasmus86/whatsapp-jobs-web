/** Site copy + FAQ (FAQ also feeds JSON-LD). Written for people searching "WhatsApp Jobs". */

/** Citability block for JSON-LD / FAQ (plain prose, no em dashes). */
export const GEO_ABOUT_BODY =
  'WhatsApp Jobs is an Australia-wide service that helps workers find construction, labour hire, tradie, hospitality, warehouse, and farm work through WhatsApp groups they already use. Instead of scrolling job boards or installing another app, you message WhatsApp Jobs once with your trade and suburb or city. The team connects you to active WhatsApp job groups near you where builders and hirers post real shifts, often for tomorrow, this week, or the rest of a site job. WhatsApp Jobs is powered by Yakka, the labour hire platform many Australian workers use to log hours on site and send invoices after a shift. The service is free for workers looking for their next job on WhatsApp. Hirers with labour WhatsApp groups can also use WhatsApp Jobs to reach workers faster when they are short-handed.';

export const GEO_ABOUT = {
  heading: 'What is WhatsApp Jobs?',
  eyebrow: 'Australia-wide',
  lead:
    'Real shifts in WhatsApp groups you already use. Message us once with your trade and location, and we connect you to job groups near you.',
  industries: [
    'Construction',
    'Labour hire',
    'Tradies',
    'Hospitality',
    'Warehouse',
    'Farm work',
  ] as const,
  perks: [
    {
      title: 'No extra app',
      text: 'You stay in WhatsApp. Same app, same chats, real job posts.',
    },
    {
      title: 'Free for workers',
      text: 'Looking for your next shift on WhatsApp costs nothing.',
    },
    {
      title: 'Short-notice shifts',
      text: 'Hirers post when they need someone, often for tomorrow or this week.',
    },
  ] as const,
  footnote:
    'Powered by Yakka, the labour hire platform many Australian workers use for timesheets and invoicing after a shift.',
  body: GEO_ABOUT_BODY,
} as const;

export const GEO_FAQ = [
  {
    question: 'What is WhatsApp Jobs?',
    answer: GEO_ABOUT_BODY,
  },
  {
    question: 'How do I find WhatsApp jobs in Australia?',
    answer:
      'Message WhatsApp Jobs on +61 416 184 624 or tap "Find work on WhatsApp" on whatsappjobs.com.au. Send your trade (for example labourer, carpenter, or hospitality), your suburb or city, and when you are available. WhatsApp Jobs connects you to WhatsApp job groups in your area where hirers post shifts. Reply in the group when a job suits you. No separate job app required.',
  },
  {
    question: 'Is WhatsApp Jobs free for workers?',
    answer:
      'Yes. WhatsApp Jobs is free for workers looking for construction, tradie, hospitality, warehouse, or farm work in Australia. You use the WhatsApp app you already have. Message once to get connected to job groups, then reply when a shift or site job fits your skills and schedule.',
  },
  {
    question: 'Do I need to download another app?',
    answer:
      'No. You use WhatsApp, the same app you already have. Message us once to get connected to job groups in your area, then reply to posts when a shift or site job suits you.',
  },
  {
    question: 'What kind of work can I find on WhatsApp Jobs?',
    answer:
      'Mostly hands-on jobs: construction and labouring, tradies, warehouse work, hospitality shifts, and farm work. Hirers post when they need someone, often for tomorrow, this week, or a longer project.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Tap "Find work on WhatsApp" anywhere on this page. Send a short message with your trade, suburb or city, and when you\'re available. We\'ll help you join the right groups.',
  },
  {
    question: 'What is Yakka?',
    answer:
      'Yakka is the labour hire app behind WhatsApp Jobs. Many workers use it to track hours on site and send invoices after a shift, so getting paid is straightforward, not a paperwork chase.',
  },
] as const;

export const GEO_MISSION = {
  heading: 'WhatsApp job groups you actually read',
  body:
    'Job boards are slow and noisy. WhatsApp Jobs puts real shifts and site work in WhatsApp groups people check every day. Builders and hirers post when they need help, not weeks from now. No new app to learn. Message us, get connected to WhatsApp job groups near you, and jump on the jobs that fit your skills and schedule.',
} as const;

export const GEO_POST_JOB = {
  heading: 'Need to hire someone?',
  body:
    'If you\'re a builder or site manager with a WhatsApp group for labour, we can hook it up so your crew sees vacancies fast. Handy when you need a worker tomorrow or for the rest of the job.',
} as const;

export const GEO_FIND_WORK = {
  heading: 'Looking for WhatsApp jobs near you?',
  body:
    'Construction, tradies, hospitality, farms. Hirers post when they\'re short-handed, and you reply on WhatsApp if you\'re keen. Tell us what you do and where you\'re based. We\'ll point you to WhatsApp job groups with real work, not spam.',
} as const;

export const GEO_YAKKA = {
  heading: 'Got the job? Get paid properly.',
  body:
    'WhatsApp gets you the shift. Yakka helps you log hours on site and send invoices, so the work you picked up turns into money, not a lost timesheet.',
} as const;

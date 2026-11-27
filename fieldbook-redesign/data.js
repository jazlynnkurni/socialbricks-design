/* Shared sample data for every Fieldbook redesign variant. Pulled from the real
   seeded demo (Jaden Hinton's caseload; Andre Baptiste open). window.FOSTR. */
window.FOSTR = {
  worker: { name: "Jaden Hinton", first: "Jaden" },
  counts: { all: 20, review: 12, queue: 5, done: 3, safety: 1 },
  overview: { toReview: 12, flaggedSafety: 1 },
  tools: ["Start next", "Review queue", "Verify a seal"],

  // ranked caseload (subset). status: review | queue | done | safety
  cases: [
    { name: "Andre Baptiste", age: 19, care: "Extended (18-22)", status: "review", label: "Needs review", fromRecord: 4 },
    { name: "Cameron Reyes",  age: 17, care: "In care",         status: "review", label: "Needs review", fromRecord: 4 },
    { name: "Devin Okafor",   age: 16, care: "In care",         status: "review", label: "Needs review", fromRecord: 4 },
    { name: "Elijah Carter",  age: 21, care: "Aged out",        status: "review", label: "Needs review", fromRecord: 4 },
    { name: "Hannah Kowalski",age: 19, care: "Extended (18-22)",status: "review", label: "Needs review", fromRecord: 4 },
    { name: "Isaiah Freeman", age: 18, care: "Extended (18-22)",status: "review", label: "Needs review", fromRecord: 4 },
    { name: "Kayla Nunez",    age: 18, care: "Extended (18-22)",status: "review", label: "Needs review", fromRecord: 4 },
    { name: "Leah Goldstein", age: 18, care: "Extended (18-22)",status: "review", label: "Needs review", fromRecord: 4 },
    { name: "Marcus Alvarez", age: 14, care: "In care",         status: "queue",  label: "In queue",     fromRecord: 7, safety: true },
    { name: "Priya Desai",    age: 6,  care: "In care",         status: "queue",  label: "In queue",     fromRecord: 6 },
    { name: "Sofia Herrera",  age: 7,  care: "In care",         status: "done",   label: "Up to date",   fromRecord: 6 },
    { name: "Lucia Romano",   age: 8,  care: "In care",         status: "done",   label: "Up to date",   fromRecord: 7 },
  ],

  open: {
    name: "Andre Baptiste",
    age: 19,
    care: "Extended (18-22)",
    caseId: "FCH-2026-0009",
    status: "review",
    statusLabel: "Needs review",
    lastRecorded: "2026-07-09",
    sealedCount: 5,
    aiSummary:
      "Andre has this month's visit prepared and waiting to be documented. Due now: Monthly home visit contact note · Confirm current-term enrollment. Last recorded visit 2026-07-09. Latest note: “Home visit. Health and wellbeing check — Andre is keeping appointments and sleeping better. Seen privately. Bunker Hill Community College en…” No safety flags on record. 5 sealed, court-ready records on file.",
    tasks: ["Monthly home visit contact note", "Confirm current-term enrollment"],

    // composer
    composer: {
      consent: "No recording consent on file — MA requires all-party consent before any conversation is recorded.",
      placeholder: "Jot what you saw or heard — a call, a school update, a worry. No required fields.",
      helper: "Saved straight onto the open visit. Notes stack up until you post the formal visit.",
    },

    // reverse-chronological history. kind: visit | note
    history: [
      { kind: "visit", date: "Aug 9, 2026", status: "review", statusLabel: "Current visit — Needs review", current: true, meter: 4 },
      { kind: "visit", date: "Jul 10, 2026", status: "done", statusLabel: "Visit — Up to date", sealed: "7baf7968c716", sor: "SOR-81A27268CC", delivered: true, meter: 4, amend: true },
      { kind: "note", noteType: "Visit note", author: "Jaden Hinton", date: "Jul 10, 2026",
        text: "Home visit. Health and wellbeing check — Andre is keeping appointments and sleeping better. Seen privately. Bunker Hill Community College enrollment confirmed for next term. No concerns." },
      { kind: "note", noteType: "Quick note", author: "Jaden Hinton", date: "Jul 5, 2026",
        text: "Reminder sent for the Education & Training Voucher (ETV) paperwork; Andre will bring the documents to the visit." },
      { kind: "visit", date: "Jun 9, 2026", status: "done", statusLabel: "Visit — Up to date", sealed: "52c8957acf02", sor: "SOR-207564ECFC", delivered: true, meter: 4, amend: true },
      { kind: "note", noteType: "Visit note", author: "Jaden Hinton", date: "Jun 9, 2026",
        text: "Monthly home visit at the Okafor household placement. Andre was seen privately; coursework at Bunker Hill Community College is on track and the Education & Training Voucher (ETV) award is being used as planned. Placement stable, no safety concerns. Next monthly visit scheduled." },
      { kind: "note", noteType: "Quick note", author: "Jaden Hinton", date: "Jun 4, 2026",
        text: "Andre texted — picked up more hours at work, wants to talk budgeting at the next visit." },
      { kind: "note", noteType: "Quick note", author: "Jaden Hinton", date: "Jun 4, 2026",
        text: "Checked in by phone. Andre sounded upbeat; placement routines going smoothly." },
      { kind: "visit", date: "May 9, 2026", status: "done", statusLabel: "Visit — Up to date", sealed: "e0322d79cde0", sor: "SOR-51EDE12ED4", delivered: true, meter: 4, amend: true },
    ],
  },
};

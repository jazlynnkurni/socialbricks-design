/* ============================================================================
   Fostr Chronicle — Case Ledger  ·  shared demo dataset (all 5 prototypes use this)
   ----------------------------------------------------------------------------
   THE MINUTES-SAVED MODEL (designed net-new — does not exist in the codebase yet):
   A visit note has 11 fields. The system pre-fills fields it already knows "from
   the record" (source: "system"); the worker only types what's new ("dictated"),
   a few get flagged "needs a look", some stay blank. Every auto-filled field is a
   field the worker DIDN'T retype. Time returned =
        (fields auto-filled + narrative grounded + no system-switching)
   Concretely we model it as:  baselineMinutes - chronicleMinutes  per note,
   where the baseline is retyping everything into the old system of record.
   ========================================================================== */
window.LEDGER = {
  worker: { name: "Jaden Hinton", first: "Jaden", role: "Caseworker", team: "Region 4 · Foster Care", caseload: 20 },

  // the model knobs (tunable — surface these in prototypes that let you "tinker")
  model: {
    fieldsPerNote: 11,
    perFieldSeconds: 35,      // avg time to look up + retype ONE known field in the old SOR
    baselineMinutes: 16,      // a full note done the old way (context lookup + retype + narrative + file)
    chronicleMinutes: 5,      // same note in Chronicle (confirm pre-fills + capture what's new + sign)
    get perNoteSavedMin() { return this.baselineMinutes - this.chronicleMinutes; } // = 11
  },

  // hero numbers (kept consistent across every prototype)
  month: {
    label: "July 2026",
    filed: 12,              // notes filed this month
    inQueue: 5,             // verified, waiting to submit
    prepared: 3,            // opened, not yet captured
    notesCompleted: 12,
    minutesSaved: 132,      // 12 filed × 11 min  → 2h 12m
    fieldsAutofilled: 73,   // ~6.1 of 11 per note × 12
    corrections: 4,         // NoteEdit rows: times auto-fill was wrong (accuracy signal)
    completionRate: 0.6     // updated / total
  },
  allTime: { minutesSaved: 484, hours: 8, mins: 4, notes: 44, fieldsAutofilled: 268 },

  // avg source breakdown per note, out of 11 (drives the "reuse" viz)
  sources: { system: 6.1, dictated: 3.0, needs_look: 1.1, blank: 0.8 },
  sourceMeta: {
    system:     { label: "From the record", verb: "auto-filled", color: "#3F7E6E", note: "already known — not retyped" },
    dictated:   { label: "Worker entry",    verb: "you captured", color: "#B4802E", note: "what was new this visit" },
    needs_look: { label: "Needs a look",    verb: "to confirm",   color: "#C0632F", note: "inferred, low confidence" },
    blank:      { label: "Not provided",    verb: "blank",        color: "#9AA0A6", note: "left empty" }
  },

  // minutes saved per working day this month (for sparklines / the ledger tape). Sums ≈ 132.
  daily: [
    { d: "Jul 1", m: 11 }, { d: "Jul 2", m: 0 }, { d: "Jul 3", m: 22 }, { d: "Jul 7", m: 11 },
    { d: "Jul 8", m: 0 }, { d: "Jul 9", m: 11 }, { d: "Jul 10", m: 22 }, { d: "Jul 11", m: 0 },
    { d: "Jul 14", m: 11 }, { d: "Jul 15", m: 11 }, { d: "Jul 16", m: 0 }, { d: "Jul 17", m: 22 },
    { d: "Jul 18", m: 0 }, { d: "Jul 21", m: 11 }, { d: "Jul 22", m: 0 }, { d: "Jul 23", m: 0 }
  ],

  // the 11 fields of a check-in note (schema check-in-v1). manualSec = time to do it the old way.
  fields: [
    { key: "contact_date",         label: "Contact date",         type: "date",   manualSec: 20, source: "system",     highRisk: false, req: true },
    { key: "contact_type",         label: "Contact type",         type: "choice", manualSec: 25, source: "system",     highRisk: false, req: true },
    { key: "participants",         label: "Who was present",      type: "text",   manualSec: 45, source: "dictated",   highRisk: false, req: true },
    { key: "child_seen_privately", label: "Child seen privately", type: "bool",   manualSec: 30, source: "system",     highRisk: false, req: true },
    { key: "placement_stability",  label: "Placement stability",  type: "choice", manualSec: 40, source: "system",     highRisk: false, req: false },
    { key: "safety_concerns",      label: "Safety concerns",      type: "bool",   manualSec: 60, source: "dictated",   highRisk: true,  req: true },
    { key: "wellbeing",            label: "Wellbeing",            type: "text",   manualSec: 55, source: "needs_look", highRisk: false, req: false },
    { key: "education",            label: "Education",            type: "text",   manualSec: 50, source: "system",     highRisk: false, req: false },
    { key: "services",             label: "Services in place",    type: "text",   manualSec: 45, source: "system",     highRisk: false, req: false },
    { key: "next_visit_date",      label: "Next visit date",      type: "date",   manualSec: 25, source: "dictated",   highRisk: false, req: true },
    { key: "narrative",            label: "Narrative",            type: "text",   manualSec: 180, source: "needs_look", highRisk: false, req: true }
  ],

  // the caseload. status: needs_review | in_progress | in_queue | updated  (sort rank in that order)
  // sc = source_counts for that note, sums to 11. saved = minutes returned on that note.
  cases: [
    { id: "c01", name: "Aaliyah Nguyen",  age: 9,  status: "needs_review", sc: { system: 5, dictated: 3, needs_look: 2, blank: 1 }, saved: 11, lastVisit: "Jun 28", due: "overdue", safety: true },
    { id: "c02", name: "Marcus Alvarez",  age: 14, status: "needs_review", sc: { system: 7, dictated: 2, needs_look: 1, blank: 1 }, saved: 12, lastVisit: "Jun 30", due: "Jul 29" },
    { id: "c03", name: "Priya Desai",     age: 6,  status: "in_progress",  sc: { system: 6, dictated: 3, needs_look: 1, blank: 1 }, saved: 11, lastVisit: "Jul 2",  due: "Jul 30" },
    { id: "c04", name: "DeShawn Carter",  age: 12, status: "in_progress",  sc: { system: 6, dictated: 4, needs_look: 1, blank: 0 }, saved: 11, lastVisit: "Jul 3",  due: "Aug 1" },
    { id: "c05", name: "Lucia Romano",    age: 8,  status: "in_queue",     sc: { system: 7, dictated: 3, needs_look: 1, blank: 0 }, saved: 12, lastVisit: "Jul 5",  due: "Aug 3" },
    { id: "c06", name: "Noah Whitefeather",age: 11,status: "in_queue",     sc: { system: 6, dictated: 3, needs_look: 1, blank: 1 }, saved: 11, lastVisit: "Jul 6",  due: "Aug 4" },
    { id: "c07", name: "Emma Sullivan",   age: 5,  status: "in_queue",     sc: { system: 8, dictated: 2, needs_look: 1, blank: 0 }, saved: 13, lastVisit: "Jul 8",  due: "Aug 6" },
    { id: "c08", name: "Kai Tanaka",      age: 15, status: "in_queue",     sc: { system: 5, dictated: 4, needs_look: 1, blank: 1 }, saved: 10, lastVisit: "Jul 9",  due: "Aug 7" },
    { id: "c09", name: "Sofia Herrera",   age: 7,  status: "updated",      sc: { system: 6, dictated: 3, needs_look: 1, blank: 1 }, saved: 11, lastVisit: "Jul 10", due: "Aug 9" },
    { id: "c10", name: "Jamal Robinson",  age: 13, status: "updated",      sc: { system: 7, dictated: 3, needs_look: 0, blank: 1 }, saved: 12, lastVisit: "Jul 11", due: "Aug 10" },
    { id: "c11", name: "Mei Lin",         age: 10, status: "updated",      sc: { system: 6, dictated: 3, needs_look: 1, blank: 1 }, saved: 11, lastVisit: "Jul 14", due: "Aug 13" },
    { id: "c12", name: "Isaiah Brooks",   age: 4,  status: "updated",      sc: { system: 5, dictated: 4, needs_look: 1, blank: 1 }, saved: 10, lastVisit: "Jul 15", due: "Aug 14" },
    { id: "c13", name: "Ava Thompson",    age: 16, status: "updated",      sc: { system: 7, dictated: 2, needs_look: 1, blank: 1 }, saved: 12, lastVisit: "Jul 16", due: "Aug 15" },
    { id: "c14", name: "Diego Morales",   age: 9,  status: "updated",      sc: { system: 6, dictated: 3, needs_look: 1, blank: 1 }, saved: 11, lastVisit: "Jul 17", due: "Aug 16" },
    { id: "c15", name: "Hannah Cohen",    age: 6,  status: "updated",      sc: { system: 6, dictated: 3, needs_look: 2, blank: 0 }, saved: 11, lastVisit: "Jul 21", due: "Aug 20" },
    { id: "c16", name: "Tyler Jackson",   age: 12, status: "updated",      sc: { system: 7, dictated: 3, needs_look: 1, blank: 0 }, saved: 12, lastVisit: "Jul 22", due: "Aug 21" }
  ],

  // the 5-stage pipeline (Chronicle's core loop)
  pipeline: [
    { key: "prepare",     label: "Prepare",     blurb: "record opens already filled" },
    { key: "capture",     label: "Capture",     blurb: "record only what's new" },
    { key: "verify",      label: "Verify",      blurb: "gaps inferred, nothing invented" },
    { key: "review",      label: "Review",      blurb: "confirm each field's source" },
    { key: "synchronize", label: "Synchronize", blurb: "filed without retyping" }
  ]
};

// tiny helpers many prototypes will want
window.LEDGER.fmt = {
  hm(min) { const h = Math.floor(min / 60), m = Math.round(min % 60); return h ? `${h}h ${m}m` : `${m}m`; },
  clock(min) { const h = Math.floor(min / 60), m = Math.round(min % 60); return `${h}:${String(m).padStart(2, "0")}`; }
};

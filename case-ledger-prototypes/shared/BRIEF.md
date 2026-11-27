# Case Ledger — prototype brief (read before building)

You are building ONE self-contained HTML prototype of a productivity concept for **Fostr
Chronicle's "Case Ledger"**. Five prototypes are being built in parallel from this brief;
each is a distinct design POV. Yours is specified in your task.

## What the product actually is (from a code read of the real feature)
A **caseworker's contact-note tool for foster-care home visits.** Each month a caseworker
must document a required visit with a youth in care. The old way = retype everything a
known form into the state "system of record." Chronicle replaces that with a 5-stage loop:

**Prepare → Capture → Verify → Review → Synchronize**
- *Prepare*: the note opens **already pre-filled** with what the agency already knows.
- *Capture*: the worker records **only what's new** (a short dictation).
- *Verify*: blank low-risk fields are inferred; **nothing is ever invented**; high-risk
  safety fields are manual-only.
- *Review*: every field shows a **provenance chip** — where it came from — and the worker
  confirms/edits, then signs.
- *Synchronize*: filed into records **without retyping**.

The soul of it is a **trust grammar**: every field traces to a source —
`From the record` (auto-filled) · `Worker entry` (typed) · `Needs a look` (low-confidence
inference) · `Not provided`. A note has **11 fields**.

## The minutes-saved mechanic (you are DESIGNING this — it doesn't exist yet)
The whole point of these prototypes: **show the worker how much time the Case Ledger gave
back.** The engine is auto-fill reuse — of 11 fields, ~6 come "from the record" so the
worker never retypes them. Model = `baselineMinutes(16) − chronicleMinutes(5) = 11 min
saved per note`. All numbers live in `shared/data.js` (`window.LEDGER`): 132 min saved this
month, 12 notes filed, ~6.1/11 fields auto-filled, all-time 8h 4m. **Use that data — do not
invent different hero numbers.** Include `../shared/data.js` via a `<script>` tag and read
`window.LEDGER`.

## The vibe (Abraham, founder — non-negotiable feeling)
> "It should feel like you're someone working with all the tools already on your desk, so
> you can tinker away to your heart's content."

Translate that to: **calm, tactile, in-control productivity.** The tools are already laid
out; the worker isn't fighting a form, they're *arranging what's already there*. Minimal,
unhurried, precise. Fostr's world is **roots / earth / load-bearing / reliable** — warm
neutrals, ink, a considered accent, never corporate-SaaS-blue, never cutesy, never bleak.
Serious empathy. The minutes-saved moment should feel *earned and quietly satisfying*, not
a gamified confetti pop.

## Craft bar (act as a senior design engineer + HCI/UX expert)
- **Load the `artifact-design` skill first** and follow its fundamentals (type pairing via
  inlined/system fonts, chosen neutrals, real hierarchy, `tabular-nums` for all figures,
  layout via grid/flex + gap, accessible focus states, `prefers-reduced-motion`).
- Self-contained single `.html` file: inline all CSS/JS, no external requests except
  `../shared/data.js`. No frameworks — vanilla JS. Draw any charts/sparklines with inline
  SVG or canvas (no libraries).
- **Design *around data*** — figures are the material. Make the minutes-saved number the
  hero of the page, tied visibly to the reuse mechanic (which fields were auto-filled).
- **Tinkerable**: at least one genuinely interactive moment (hover a field to see its
  source + seconds saved; a model slider that recomputes minutes; confirm a "needs a look"
  field and watch the tally move; etc.). Interactivity should reveal the data story.
- Commit hard to your direction's single look — these are distinct concepts, not one
  template reskinned. Avoid the generic-AI defaults (cream+serif+terracotta, lone
  acid-green on near-black, purple gradient hero, everything centered + rounded-lg).
- Responsive, no horizontal body scroll; wide tables/charts scroll inside their own box.

## Output
Write your file to the EXACT path given in your task (e.g.
`/Users/jazlynnkurniandra/Desktop/case-ledger-prototypes/proto-1-ledger.html`). Set a real
`<title>`. Return a 2-sentence description of the direction you built. Do not start a
server — that's handled centrally.

## The 5 directions (yours is named in your task)
1. **The Ledger** — double-entry accounting made literal. Every auto-filled field is a
   *credit* of time; a running **balance of minutes saved** at the top. Monospace numerics,
   ledger rules, a "tape" of entries. Precise, data-forward. ("Case Ledger" taken literally.)
2. **The Workbench** — Abraham's metaphor rendered directly: a tactile desk surface with
   tool-trays and a faint grid canvas (the real screen uses this), the note assembling from
   parts already on the bench, and a physical **stopwatch/tally of time returned**. Warm,
   analog, hand-on-tools.
3. **Quiet Capture** — the calm, minimal *flow*. One field at a time; the system has already
   filled most; you just confirm what's new. Generous whitespace, keyboard-friendly, and a
   restrained end-of-note **"you got 11 minutes back"** reveal. Zen productivity.
4. **The Instrument Panel** — a data-dense productivity cockpit / dashboard. Minutes-saved
   **hero KPI** + sparkline of saved-over-time + the 11-field reuse breakdown + the 5-stage
   pipeline funnel + corrections. Glanceable, HCI-forward, everything at a glance.
5. **The Command Deck** — keyboard-first power tool. A ⌘K-style command palette, dense rows,
   fast filtering of the caseload, and a **live ticking minutes-saved counter** as you move.
   Minimal chrome, high information density, monospace accents.

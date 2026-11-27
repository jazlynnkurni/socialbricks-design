# Fostr Fieldbook Redesign — Research & Principles

**Goal:** A calm, minimalist, ONE-canvas surface for child-welfare social workers on iPad. Everything visible, everything editable in place, all data preserved. This report replaces the current failure mode (boxes-in-boxes, detached side-by-side shells, a cramped case-history list) with evidence-based rules.

**Date:** 2026-08-12 · Method: NN/g, GOV.UK Design System, Apple HIG, design-system docs (Carbon, PatternFly, Material), typographic research, and social-work documentation guidance. Claims verified across ≥2 sources where marked.

---

## A. Principles (each actionable, each sourced)

1. **Attention is the budget — spend it on content, not chrome.** Redundant links, decorative flourishes, and container noise slow users down; treat every non-content pixel as a tax on comprehension. *(NN/g, "Minimize Cognitive Load to Maximize Usability")*

2. **Group with space and type, not with borders.** Elements placed close together read as related (Gestalt proximity), so whitespace and a clear type scale can replace most boxes; borders and shadows add visual weight and reduce scannability when overused. Pick ONE separation method per group — never a box inside a box inside a box. *(NN/g cognitive-load + Carbon/Material card guidance; verified across 2 sources)*

3. **One border does the work of three.** When every item has a border, every section a line, every card a shadow, the UI becomes "a cage of rectangles." Nested containers double the visual weight without adding information — flatten to a single surface with indentation and spacing carrying hierarchy. *(UI card/divider best-practice consensus; Material's "elevated OR filled OR outlined, pick one")*

4. **Respect the ~7-item working-memory limit — chunk the canvas.** People hold only ~5–9 items at once (Miller), so break long content into a few labeled chunks rather than one dense wall or many competing panels. *(Miller's Law, widely cited in UX law references)*

5. **Fewer visible choices = faster action (Hick's Law).** Decision time grows with the number of options; show the essential action/field now and defer the rest. Progressive disclosure is Hick's Law applied as a pattern. *(Hick's Law + progressive-disclosure references; verified across 2 sources)*

6. **Progressive disclosure: reveal complexity only when relevant.** Defer advanced/rare fields to a secondary reveal so the primary surface stays calm — but any expand/collapse state change must also be announced to assistive tech. *(GOV.UK Design System; Nielsen progressive disclosure)*

7. **One thing per view beats many detached shells.** GOV.UK's "one thing per page" reduces error and cognitive load for low-confidence users and works better on touch — the anti-pattern is several parallel panels each demanding attention. Consolidate to one primary canvas with a single focus. *(GOV.UK "One thing per page")*

8. **Inline edit only works if edit-mode is visibly distinct and the text is information, not action.** Edit-in-place is more intuitive than a separate edit page, but the field must change appearance on focus/hover so users see what is editable and avoid accidental edits; reserve it for information text, not for things that look like links/verbs. *(PatternFly & Carbon inline-edit guidelines; "soft forms" borderless pattern; verified across 2 sources)*

9. **Signal editability without chrome: borderless-until-focus.** Style fields so borders/background appear only on hover or focus — the field reads as plain text at rest and becomes an editable field on interaction, keeping the resting canvas clean. *(Borderless "soft form" pattern; PatternFly inline edit)*

10. **Keep history reverse-chronological, grouped, and scannable.** Newest first; keep identity + object + action close enough to scan as one line; use light date grouping and consistent per-entry meta (who/when/type) instead of dense cards. Progressive disclosure expands an entry only when the reader wants detail. *(Activity-feed/timeline pattern guidance; NN/g "Data Tables")*

11. **Touch-first sizing: 44×44 pt minimum, arm's-length type, Dynamic Type.** Apple HIG sets a 44×44 pt minimum tap target; smaller targets raise tap-error rates ~25%+. Support Dynamic Type and keep body text large enough to read on an iPad held at arm's length. *(Apple HIG; verified across 2 sources)*

12. **Hold the reading measure to ~50–75 characters.** Bringhurst's 45–75 CPL (≈66 ideal) governs comfortable reading; on a wide iPad canvas, constrain note/body text width rather than letting it run the full screen. *(Bringhurst / Baymard / UXPin line-length research; verified across 2 sources)*

13. **Provenance must be present but quiet — never a new box.** Court-defensible practice requires that finalized notes are never silently overwritten: corrections are new dated entries referencing the original, and author/time/seal metadata stays visible. Render this as quiet inline meta (small, secondary text; a subtle "sealed" marker) rather than another wrapping panel. *(Social-work documentation best practice: contemporaneous, append-only, defensible records)*

---

## B. Apply to Fostr Fieldbook

| Principle | Concrete Fieldbook decision |
|---|---|
| Space over borders (2, 3) | Delete the note→card→panel nesting. A note becomes plain text on the shared canvas, separated from neighbors by whitespace + a type-weight change, not by three borders. Max one visual container depth anywhere. |
| One canvas, not shells (7) | Collapse the side-by-side detached shells into a single scrolling canvas with one focus column. Secondary info (case meta) sits as quiet inline text or a single lightweight rail, not a competing panel. |
| Chunk + progressive disclosure (4, 5, 6) | Case view = a few labeled chunks (e.g. Summary · Timeline · People). Rare fields collapse behind a quiet "more" reveal; default view shows only what's needed to read and add a note. |
| Inline edit, borderless-until-focus (8, 9) | Every field on the canvas is tap-to-edit in place. At rest it looks like clean text; on hover/focus it shows a subtle background/border and caret. No "Edit" mode toggle, no modal editor. |
| Scannable history (10) | Case history = reverse-chron single-line entries grouped by date, each showing author · time · type inline. Tap an entry to expand full text. Kill the cramped multi-border list. |
| Touch + legibility (11, 12) | 44 pt minimum for every interactive element; generous line-height; constrain note body to ~60–70 char measure even on a wide iPad; support Dynamic Type. |
| Quiet provenance (13) | Finalized notes are append-only: editing creates a new dated, attributed entry. Show sealed/author/timestamp as small secondary text inline under the entry — never as a bordered "metadata card." |

---

## C. Reference products — the one thing to steal from each

- **Apple Notes** — *The editing surface IS the reading surface.* No edit mode, no field chrome; you tap and type. Steal: a single canvas where reading and editing are the same state.
- **Linear** — *Calm through restraint + speed.* Minimal chrome, no busy sidebars/pop-ups, keyboard-first, instant local-first feedback. Steal: "do less, but better," and the sense of a fast, quiet surface.
- **Notion** — *Everything is an editable block on one page.* Uniform inline blocks with disclosure via toggles instead of separate screens. Steal: block-level inline editing and toggle-based progressive disclosure.
- **Craft** — *Typographic hierarchy carries structure.* Depth comes from type scale, spacing, and soft indentation rather than borders. Steal: hierarchy without boxes.
- **Things** — *Whitespace and grouping as the entire structure.* Generous margins, light date/section grouping, almost no visible containers. Steal: calm density for a long list (the case timeline).
- **Basecamp** — *Plain, chunked, human message/timeline layout.* Content-first blocks, one clear column, minimal ornamentation. Steal: the readable single-column activity stream.
- **GOV.UK / gov design systems** — *One thing per page; plain, high-legibility defaults.* Steal: reduce parallel demands on attention; accessible type and clear focus states as the baseline, not an afterthought.

---

## Sources

- NN/g — Minimize Cognitive Load to Maximize Usability: https://www.nngroup.com/articles/minimize-cognitive-load/
- NN/g — 4 Principles to Reduce Cognitive Load in Forms: https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/
- NN/g — Data Tables: Four Major User Tasks: https://www.nngroup.com/articles/data-tables/
- GOV.UK — One thing per page: https://designnotes.blog.gov.uk/2015/07/03/one-thing-per-page/
- GOV.UK Design System / Government Design Principles: https://www.gov.uk/guidance/government-design-principles
- Apple Human Interface Guidelines (touch targets, Dynamic Type, SF): https://developer.apple.com/design/human-interface-guidelines
- PatternFly — Inline edit design guidelines: https://www.patternfly.org/components/inline-edit/design-guidelines/
- Carbon Design System — Forms pattern: https://carbondesignsystem.com/patterns/forms-pattern/
- UI Patterns — Inplace Editor: https://ui-patterns.com/patterns/InplaceEditor
- Line length / reading measure (Bringhurst 45–75 CPL): https://baymard.com/blog/line-length-readability · https://www.uxpin.com/studio/blog/optimal-line-length-for-readability/
- Laws of UX (Miller's Law, Hick's Law): https://nulab.com/learn/design-and-ux/laws-of-ux/
- Cards vs dividers / border overuse: https://blog.tubikstudio.com/visual-dividers-user-interface/ · Material card guidance
- Timeline / activity-feed patterns: https://www.aubergine.co/insights/a-guide-to-designing-chronological-activity-feeds · https://uxpatterns.dev/patterns/data-display/timeline
- Linear design/performance: https://performance.dev/how-is-linear-so-fast-a-technical-breakdown
- Social-work defensible documentation (append-only corrections, court record): https://www.socialworkportal.com/social-work-case-notes/ · https://caseworthy.com/articles/social-work-case-note-templates-and-best-practices/

// Registry of all prototypes. The index page (/) and the dynamic route
// (/prototypes/[slug]) both read from this list, so adding an entry here is
// the only wiring a new prototype needs.
//
// Convention: each prototype lives in src/components/prototypes/<slug>/ and
// its slug matches the folder name.

export interface PrototypeMeta {
  slug: string;
  title: string;
  description: string;
}

export const prototypes: PrototypeMeta[] = [
  // Example entry, uncomment when the first prototype lands:
  // {
  //   slug: "case-queue",
  //   title: "Case Queue",
  //   description: "Animated triage queue for a social worker caseload.",
  // },
];

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
  {
    slug: "app-shell",
    title: "App Shell",
    description:
      "Collapsible sidebar shell for the casework app. Spring motion, full keyboard support, WCAG 2.1 AA tokens.",
  },
];

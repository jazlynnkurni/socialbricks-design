// Time-of-day logic and copy for the dashboard greeting card.

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export const GREETINGS: Record<TimeOfDay, string> = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
  night: "Working late",
};

// Small rotating one-liners, cycled by the sparkle button when the queue is
// clear. Text swap on click only, no timers.
export const QUIPS: Record<TimeOfDay, string[]> = {
  morning: [
    "Coffee first. Forms second.",
    "Fresh day, fresh queue.",
    "The forms are still asleep. Sneak up on them.",
  ],
  afternoon: [
    "Halfway there. The queue knows it too.",
    "A good hour to clear two quick ones.",
    "Lunch is done. The paperwork is not.",
  ],
  evening: [
    "Almost done. Dinner is waiting.",
    "Wrap up the easy ones first.",
    "The queue dims with the sky.",
  ],
  night: [
    "Working late? Keep it short.",
    "The forms will still be here tomorrow.",
    "Quiet queue, quick wins.",
  ],
};

// Full-bleed, low-saturation gradient per time state. Each is multi-stop
// with visible light-to-deeper movement (never a flat tone), built from the
// brand teal ramp plus one accent, mixed toward surface-0 or ink so it stays
// quiet. Pure CSS, no motion. The text zone (left ~half) is deliberately
// held light on day scenes (<= ~16% brand) and dark on night, so the
// adaptive text color passes 4.5:1; the deeper movement lives to the right,
// past the text.
export const CARD_GRADIENTS: Record<TimeOfDay, string> = {
  // Pale cool dawn easing into soft teal, faint warm highlight top right.
  morning:
    "radial-gradient(120% 140% at 88% 0%, color-mix(in srgb, var(--amber-100) 55%, transparent) 0%, transparent 45%), linear-gradient(112deg, color-mix(in srgb, var(--brand-400) 8%, var(--surface-0)) 0%, color-mix(in srgb, var(--brand-400) 16%, var(--surface-0)) 55%, color-mix(in srgb, var(--brand-400) 40%, var(--surface-0)) 100%)",
  // Light airy teal with a gentle brightness shift, clean highlight.
  afternoon:
    "radial-gradient(120% 120% at 85% 6%, color-mix(in srgb, var(--surface-0) 72%, transparent) 0%, transparent 50%), linear-gradient(112deg, color-mix(in srgb, var(--brand-400) 10%, var(--surface-0)) 0%, color-mix(in srgb, var(--brand-400) 18%, var(--surface-0)) 55%, color-mix(in srgb, var(--brand-400) 34%, var(--surface-0)) 100%)",
  // Warm muted amber easing into teal, glow low in the sky.
  evening:
    "radial-gradient(120% 130% at 80% 100%, color-mix(in srgb, var(--amber-100) 60%, transparent) 0%, transparent 55%), linear-gradient(112deg, color-mix(in srgb, var(--amber-100) 42%, var(--surface-0)) 0%, color-mix(in srgb, var(--brand-400) 16%, var(--surface-0)) 55%, color-mix(in srgb, var(--brand-400) 40%, var(--surface-0)) 100%)",
  // Deep dusk-lit teal: dark ink-teal base with a lighter cool glow band on
  // the right so it reads as dusk, not a black rectangle. Text zone (left)
  // stays deep for light text.
  night:
    "radial-gradient(85% 120% at 86% 18%, color-mix(in srgb, var(--brand-400) 40%, var(--brand-700)) 0%, transparent 55%), linear-gradient(112deg, color-mix(in srgb, var(--ink-900) 82%, var(--brand-700)) 0%, color-mix(in srgb, var(--brand-700) 55%, var(--ink-900)) 60%, color-mix(in srgb, var(--brand-700) 92%, var(--ink-900)) 100%)",
};

export interface GreetingTheme {
  /** Tailwind color class for the greeting text. */
  greeting: string;
  /** Tailwind color class for the name. */
  name: string;
  /** Tailwind color class for the digest / quip text. */
  digest: string;
  /** Tailwind classes for the digest link (color + underline). */
  link: string;
  /** Tailwind classes for the quip sparkle button. */
  accentButton: string;
  /** Soft text scrim behind the text region, fading out to the right with
      no hard edge, so contrast holds without a visible boundary. */
  scrim: string;
}

const LIGHT_SCRIM =
  "linear-gradient(to right, color-mix(in srgb, var(--surface-0) 55%, transparent) 0%, color-mix(in srgb, var(--surface-0) 30%, transparent) 40%, transparent 68%)";

const DARK_SCRIM =
  "linear-gradient(to right, color-mix(in srgb, var(--ink-900) 55%, transparent) 0%, color-mix(in srgb, var(--ink-900) 30%, transparent) 40%, transparent 68%)";

// Text colors are derived from the time state, never hardcoded to one set.
// Day scenes use dark text on the light gradient; night flips to light text.
// Every pairing is verified >= 4.5:1 against the darkest point of its own
// text zone (see greeting_contrast checks).
const LIGHT_THEME: GreetingTheme = {
  greeting: "text-ink-900",
  name: "text-brand-700",
  digest: "text-ink-600",
  link: "text-brand-700 underline",
  accentButton: "text-brand-700 hover:bg-surface-50",
  scrim: LIGHT_SCRIM,
};

const NIGHT_THEME: GreetingTheme = {
  greeting: "text-surface-50",
  name: "text-brand-200",
  digest: "text-on-dark-muted",
  link: "text-brand-200 underline",
  accentButton: "text-brand-200 hover:bg-white/10",
  scrim: DARK_SCRIM,
};

export const GREETING_THEMES: Record<TimeOfDay, GreetingTheme> = {
  morning: LIGHT_THEME,
  afternoon: LIGHT_THEME,
  evening: LIGHT_THEME,
  night: NIGHT_THEME,
};

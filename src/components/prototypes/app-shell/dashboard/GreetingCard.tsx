"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { MOCK_USER } from "@/lib/mock/user";
import { useUploads } from "../upload/UploadProvider";
import { APPLICATIONS_PATH } from "../nav";
import { getCaseloadCounts, getReadyUploads, reviewPath } from "./stats";
import {
  CARD_GRADIENTS,
  GREETING_THEMES,
  GREETINGS,
  QUIPS,
  getTimeOfDay,
  type TimeOfDay,
} from "./greeting";

// The time state is fixed on mount and only changes via the ?time= query
// override (no interval, no timers). popstate keeps the override in sync
// across browser back and forward navigation.
function subscribeToClock(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function readTimeOfDay(): TimeOfDay {
  const preview = new URLSearchParams(window.location.search).get("time");
  if (
    preview === "morning" ||
    preview === "afternoon" ||
    preview === "evening" ||
    preview === "night"
  ) {
    return preview;
  }
  return getTimeOfDay(new Date().getHours());
}

function serverTimeOfDay(): TimeOfDay {
  return getTimeOfDay(new Date().getHours());
}

// Hero card: one full-bleed gradient per time state with the greeting h1
// and single digest line on top. A soft text scrim (light veil on day
// scenes, ink veil at night) sits behind the text and fades out to the
// right with no hard seam. Text color adapts to the scene and every pairing
// is verified >= 4.5:1 against the darkest point of its own text zone. No
// motion anywhere.
export function GreetingCard() {
  const timeOfDay = useSyncExternalStore(
    subscribeToClock,
    readTimeOfDay,
    serverTimeOfDay,
  );
  const { uploads } = useUploads();
  const [quipIndex, setQuipIndex] = useState(0);

  const theme = GREETING_THEMES[timeOfDay];
  const ready = getReadyUploads(uploads);
  const { dueThisWeek } = getCaseloadCounts(uploads);
  const hasWork = ready.length > 0 || dueThisWeek > 0;

  const quips = QUIPS[timeOfDay];
  const quip = quips[quipIndex % quips.length];

  const readyPhrase = `${ready.length} document${ready.length === 1 ? "" : "s"} ready to review`;
  const duePhrase = `${dueThisWeek} deadline${dueThisWeek === 1 ? "" : "s"} this week`;

  return (
    <section
      aria-label="Greeting"
      className="relative overflow-hidden rounded-xl border border-border"
    >
      {/* Full-bleed decorative gradient. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: CARD_GRADIENTS[timeOfDay] }}
      />
      {/* Soft text scrim, fading out to the right (no hard boundary). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: theme.scrim }}
      />
      {/* max-w-96 keeps the text in the scrimmed, contrast-verified zone. */}
      <div className="relative flex min-h-40 max-w-96 flex-col p-6">
        <h1
          className={`font-heading text-2xl font-semibold ${theme.greeting}`}
        >
          {GREETINGS[timeOfDay]},{" "}
          <span className={theme.name}>{MOCK_USER.firstName}</span>
        </h1>
        {hasWork ? (
          <p className={`mt-2 text-base ${theme.digest}`}>
            You have{" "}
            {ready.length > 0 && (
              <Link href={reviewPath(ready[0].id)} className={theme.link}>
                {readyPhrase}
              </Link>
            )}
            {ready.length > 0 && dueThisWeek > 0 && " and "}
            {dueThisWeek > 0 && (
              <Link
                href={`${APPLICATIONS_PATH}?filter=due-week`}
                className={theme.link}
              >
                {duePhrase}
              </Link>
            )}
            .
          </p>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <p aria-live="polite" className={`text-base ${theme.digest}`}>
              {quip}
            </p>
            <button
              type="button"
              onClick={() => setQuipIndex((index) => index + 1)}
              aria-label="Show another note"
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${theme.accentButton}`}
            >
              <Sparkles size={14} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

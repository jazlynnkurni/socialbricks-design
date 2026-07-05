"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion, type Transition } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./Dashboard";
import { NAV_SECTIONS } from "./nav";
import { UploadProvider } from "./upload/UploadProvider";
import { UploadButton } from "./upload/UploadButton";
import { GlobalDropOverlay } from "./upload/GlobalDropOverlay";
import motion from "./motion.module.css";

const STORAGE_KEY = "sb-app-shell-collapsed";
const CHANGE_EVENT = "sb-app-shell-collapsed-change";

// Collapsed state lives in localStorage and is read through
// useSyncExternalStore, so it survives reloads without a hydration mismatch
// or an effect-driven state swap. The storage listener also syncs tabs.
function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot() {
  return false;
}

const SPRING: Transition = { type: "spring", stiffness: 260, damping: 28 };
const INSTANT: Transition = { duration: 0 };

export function AppShell({ children }: { children?: ReactNode }) {
  const collapsed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  // Routed items (Dashboard, Applications) derive their active state from
  // the URL; placeholder items override it locally until navigation resets.
  const pathname = usePathname();
  const routeId = pathname?.includes("/applications")
    ? "applications"
    : pathname?.includes("/people")
      ? "people"
      : pathname?.includes("/documents")
        ? "documents"
        : "dashboard";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeId = selectedId ?? routeId;
  const reduceMotion = useReducedMotion();
  // Until the user toggles, width changes (like restoring a collapsed
  // sidebar right after hydration) swap instantly instead of springing.
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggle = () => {
    setHasInteracted(true);
    window.localStorage.setItem(STORAGE_KEY, String(!collapsed));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  const transition = reduceMotion || !hasInteracted ? INSTANT : SPRING;

  const activeLabel =
    NAV_SECTIONS.flatMap((section) => section.items).find(
      (item) => item.id === activeId,
    )?.label ?? "Dashboard";

  return (
    <UploadProvider>
      <div className="flex h-dvh overflow-hidden bg-surface-0 font-sans text-base text-ink-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:border-border focus:bg-surface-0 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-700"
        >
          Skip to content
        </a>
        <Sidebar
          collapsed={collapsed}
          activeId={activeId}
          transition={transition}
          onToggle={toggle}
          onSelect={setSelectedId}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-8">
            <span className="font-heading text-sm font-semibold text-ink-600">
              {activeLabel}
            </span>
            <UploadButton />
          </header>
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 overflow-y-auto focus:outline-none"
          >
            {/* Keyed by route so the content settles in on navigation while
                the sidebar stays put. */}
            <div key={pathname} className={motion.contentIn}>
              {children ?? <Dashboard />}
            </div>
          </main>
        </div>
        <GlobalDropOverlay />
      </div>
    </UploadProvider>
  );
}

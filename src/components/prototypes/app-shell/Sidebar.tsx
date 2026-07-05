"use client";

import { useState } from "react";
import { motion, type Transition } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { NAV_SECTIONS } from "./nav";
import { NavItem } from "./NavItem";
import { ProfileMenu } from "./ProfileMenu";
import { BrandMark } from "./BrandMark";

interface SidebarProps {
  collapsed: boolean;
  activeId: string;
  transition: Transition;
  onToggle: () => void;
  onSelect: (id: string) => void;
}

export function Sidebar({
  collapsed,
  activeId,
  transition,
  onToggle,
  onSelect,
}: SidebarProps) {
  // Which nav item the pointer or keyboard focus is on: drives the shared
  // layout blob. Exactly one item carries the green at a time: the hovered
  // one, or the active one when nothing is hovered, so the highlight slides
  // away from the active item and back.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const highlightId = hoveredId ?? activeId;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 264 }}
      transition={transition}
      className="relative z-10 flex h-full shrink-0 flex-col border-r border-border bg-surface-50"
    >
      <BrandMark collapsed={collapsed} transition={transition} />

      {/* Toggle: a folder-style tab bulging out of the sidebar edge. The
          1px negative margin overlaps the aside border so the edge line
          flows into the tab instead of cutting through it. The ::before
          pseudo-element pads the hit area to 44px+ without enlarging the
          visible tab. */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!collapsed}
        aria-controls="primary-nav"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute left-full top-1/2 z-20 -ml-px flex h-12 w-5 -translate-y-1/2 items-center justify-center rounded-r-lg border border-l-0 border-border bg-surface-50 text-ink-600 transition-colors before:absolute before:inset-y-0 before:-left-2 before:-right-6 before:content-[''] hover:bg-[color-mix(in_srgb,var(--border)_45%,var(--surface-50))] hover:text-brand-700"
      >
        <motion.span
          initial={false}
          animate={{ rotate: collapsed ? 180 : 0 }}
          transition={transition}
          className="flex"
        >
          <ChevronLeft size={14} aria-hidden="true" />
        </motion.span>
      </button>

      {/* Not a scroll container: collapsed-state tooltips overhang the
          sidebar and would be clipped. If the nav ever outgrows the
          viewport, move tooltips to a portal first. */}
      <nav
        id="primary-nav"
        aria-label="Primary"
        onPointerLeave={() => setHoveredId(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setHoveredId(null);
          }
        }}
        className="flex-1 px-3 py-4"
      >
        {NAV_SECTIONS.map((section, index) => (
          <div
            key={section.label ?? `section-${index}`}
            className={
              // Every group after the first is set apart with the same
              // divider and spacing. Items keep full ink-600 contrast.
              index > 0 ? "mt-6 border-t border-border pt-3" : undefined
            }
          >
            {section.label && (
              <motion.p
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1 }}
                transition={transition}
                aria-hidden={collapsed}
                className="flex h-6 items-center whitespace-nowrap px-2 text-xs font-semibold uppercase tracking-wider text-ink-600"
              >
                {section.label}
              </motion.p>
            )}
            <ul aria-label={section.label} className="flex flex-col gap-1">
              {section.items.map((entry) => (
                <NavItem
                  key={entry.id}
                  entry={entry}
                  active={entry.id === activeId}
                  highlighted={entry.id === highlightId}
                  collapsed={collapsed}
                  transition={transition}
                  onSelect={onSelect}
                  onHover={setHoveredId}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <ProfileMenu collapsed={collapsed} transition={transition} />
    </motion.aside>
  );
}

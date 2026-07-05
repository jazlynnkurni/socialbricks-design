"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { NavEntry } from "./nav";

interface NavItemProps {
  entry: NavEntry;
  active: boolean;
  highlighted: boolean;
  collapsed: boolean;
  transition: Transition;
  onSelect: (id: string) => void;
  onHover: (id: string) => void;
}

// Snappier than the sidebar collapse spring: the blob should trail the
// pointer, not lag behind it.
const BLOB_SPRING: Transition = { type: "spring", stiffness: 500, damping: 35 };

export function NavItem({
  entry,
  active,
  highlighted,
  collapsed,
  transition,
  onSelect,
  onHover,
}: NavItemProps) {
  const Icon = entry.icon;
  const reduceMotion = useReducedMotion();

  const className =
    "group relative flex h-10 w-full items-center gap-3 rounded-lg px-2 text-sm transition-colors " +
    (active
      ? "font-medium text-brand-700"
      : "text-ink-600 hover:text-ink-900");

  const content = (
    <>
      {/* The single green blob, shared across all items via layoutId. It
          sits on the hovered item (falling back to the active one), so it
          slides with the cursor instead of two items holding green. */}
      {highlighted && (
        <motion.span
          layoutId="nav-hover-blob"
          aria-hidden="true"
          transition={reduceMotion ? { duration: 0 } : BLOB_SPRING}
          className="absolute inset-0 rounded-lg bg-[color-mix(in_srgb,var(--brand-400)_12%,transparent)]"
        />
      )}
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand-700"
        />
      )}
      <span className="relative flex w-6 shrink-0 items-center justify-center">
        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <motion.span
        initial={false}
        animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
        transition={transition}
        className="relative overflow-hidden whitespace-nowrap text-left"
      >
        {entry.label}
      </motion.span>
      {collapsed && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full top-1/2 z-30 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink-900 px-3 py-1 text-xs font-medium text-surface-0 opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          {entry.label}
        </span>
      )}
    </>
  );

  return (
    <li className="relative">
      {entry.href ? (
        <Link
          href={entry.href}
          onPointerEnter={() => onHover(entry.id)}
          onFocus={() => onHover(entry.id)}
          aria-current={active ? "page" : undefined}
          aria-label={entry.label}
          className={className}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => onSelect(entry.id)}
          onPointerEnter={() => onHover(entry.id)}
          onFocus={() => onHover(entry.id)}
          aria-current={active ? "page" : undefined}
          aria-label={entry.label}
          className={className}
        >
          {content}
        </button>
      )}
    </li>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Transition } from "framer-motion";
import {
  Accessibility,
  CircleHelp,
  Globe,
  LogOut,
  Plug,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { MOCK_USER as USER } from "@/lib/mock/user";

interface MenuEntry {
  label: string;
  icon: LucideIcon;
}

const FLYOUT_ITEMS: MenuEntry[] = [
  { label: "Accessibility", icon: Accessibility },
  { label: "Connectors", icon: Plug },
];

const MENU_ITEMS: MenuEntry[] = [
  { label: "Settings", icon: Settings },
  { label: "Language", icon: Globe },
  { label: "Get help", icon: CircleHelp },
];

interface ProfileMenuProps {
  collapsed: boolean;
  transition: Transition;
}

export function ProfileMenu({ collapsed, transition }: ProfileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pointerOver, setPointerOver] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  // The hover flyout also opens on keyboard focus so its items are reachable
  // without a pointer. It yields to the click menu.
  const flyoutOpen = (pointerOver || focusWithin) && !menuOpen;

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      menuRef.current?.querySelector<HTMLElement>("[role='menuitem']")?.focus();
    }
  }, [menuOpen]);

  const moveFocus = (
    event: React.KeyboardEvent,
    root: HTMLElement | null,
  ) => {
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[role='menuitem']"),
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1) % items.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    buttonRef.current?.focus();
  };

  const menuItemClass =
    "flex h-9 w-full items-center gap-2 rounded-lg px-2 text-sm text-ink-900 hover:bg-surface-50";

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => setPointerOver(true)}
      onPointerLeave={() => setPointerOver(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          setFocusWithin(false);
        }
      }}
      className="relative shrink-0 border-t border-border p-3"
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="profile-account-menu"
        aria-label={`Account menu for ${USER.fullName}, ${USER.role}`}
        onClick={() => setMenuOpen((open) => !open)}
        className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--border)_45%,var(--surface-50))]"
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-surface-0"
        >
          {USER.initials}
        </span>
        <motion.span
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
          transition={transition}
          aria-hidden={collapsed}
          className="overflow-hidden whitespace-nowrap"
        >
          <span className="block text-sm font-medium text-ink-900">
            {USER.fullName}
          </span>
          <span className="block text-xs text-ink-600">{USER.role}</span>
        </motion.span>
      </button>

      {flyoutOpen && (
        <div
          ref={flyoutRef}
          role="menu"
          aria-label="Quick options"
          onKeyDown={(event) => {
            moveFocus(event, flyoutRef.current);
            if (event.key === "Escape") buttonRef.current?.focus();
          }}
          className="absolute bottom-3 left-full z-30 ml-2 w-44 rounded-lg border border-border bg-surface-0 p-1 shadow-lg"
        >
          {FLYOUT_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={menuItemClass}
            >
              <item.icon size={16} className="text-ink-600" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </div>
      )}

      {menuOpen && (
        <div
          id="profile-account-menu"
          ref={menuRef}
          role="menu"
          aria-label="Account"
          onKeyDown={(event) => {
            moveFocus(event, menuRef.current);
            if (event.key === "Escape") closeMenu();
            if (event.key === "Tab") setMenuOpen(false);
          }}
          className="absolute bottom-full left-3 z-30 mb-2 w-52 rounded-lg border border-border bg-surface-0 p-1 shadow-lg"
        >
          {MENU_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={closeMenu}
              className={menuItemClass}
            >
              <item.icon size={16} className="text-ink-600" aria-hidden="true" />
              {item.label}
            </button>
          ))}
          <div role="separator" className="mx-2 my-1 h-px bg-border" />
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            onClick={closeMenu}
            className={menuItemClass}
          >
            <LogOut size={16} className="text-ink-600" aria-hidden="true" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

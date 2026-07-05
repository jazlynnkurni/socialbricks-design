"use client";

import { useRef } from "react";
import { Search, X } from "lucide-react";

// Targeted table lookup: a labelled search box with a leading icon and a
// clear button. Controlled by the parent, which owns the debounce and the
// filtering. Reused by the Applications and People filter rows.
export function TableSearch({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs text-ink-600">
        {label}
      </label>
      <div className="relative w-[280px]">
        <Search
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-600"
        />
        <input
          ref={inputRef}
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-9 w-full rounded-lg border border-border bg-surface-0 pl-9 pr-9 text-sm text-ink-900 placeholder:text-ink-600 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-ink-600 transition-colors hover:bg-surface-50 hover:text-ink-900"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

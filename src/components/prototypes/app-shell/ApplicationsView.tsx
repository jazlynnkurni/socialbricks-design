"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, TriangleAlert } from "lucide-react";
import {
  ACTIVE_STATUSES,
  daysUntilDue,
  formatDueDate,
  getPersonForApplication,
  isDueThisWeek,
  mockApplications,
} from "@/lib/mock/applications";
import { documentsForApplication } from "@/lib/mock/documents";
import type { Application } from "@/lib/types/contract";
import { APPLICATIONS_PATH, PEOPLE_PATH } from "./nav";
import { StatusBadge } from "./StatusBadge";
import { Pagination } from "./Pagination";
import { TableSearch } from "./TableSearch";
import motion from "./motion.module.css";

const PAGE_SIZE = 25;

// Filter tests. The five pills are shown; the rest are kept so older links
// (dashboard chips) keep working. "Needs review" means the application has a
// document that needs a person's attention, not the workflow status.
const FILTER_TESTS: Record<string, (a: Application) => boolean> = {
  all: () => true,
  "in-progress": (a) => a.status === "in-progress",
  "pending-review": (a) => a.status === "pending-review",
  "needs-review": (a) =>
    documentsForApplication(a.id).some(
      (d) => d.status === "needs-attention" || d.status === "flagged",
    ),
  approved: (a) => a.status === "approved",
  // Backward-compatible aliases (not shown as pills).
  "pending-approval": (a) => a.status === "pending-review",
  "ready-review": (a) => a.status === "pending-review",
  "due-week": isDueThisWeek,
  active: (a) => ACTIVE_STATUSES.includes(a.status),
};

const FILTER_LABELS: Record<string, string> = {
  "pending-approval": "Pending approval",
  "ready-review": "Ready to review",
  "due-week": "Due this week",
  active: "Active",
};

const PILLS = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In progress" },
  { id: "pending-review", label: "Pending review" },
  { id: "needs-review", label: "Needs review" },
  { id: "approved", label: "Approved" },
];

const headerCellClass =
  "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-600";

export function ApplicationsView({ filter }: { filter?: string }) {
  const initial = filter && FILTER_TESTS[filter] ? filter : "all";
  const [activeFilter, setActiveFilter] = useState(initial);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Debounce the search so filtering and the announcement settle after
  // typing pauses. Store the trimmed original text so the empty state can
  // echo it back; matching lowercases inline.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 150);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const searchFiltered = useMemo(() => {
    if (!search) return mockApplications;
    const q = search.toLowerCase();
    return mockApplications.filter((a) => {
      const person = getPersonForApplication(a);
      return (
        (person?.fullName.toLowerCase().includes(q) ?? false) ||
        a.caseNumber.toLowerCase().includes(q)
      );
    });
  }, [search]);

  const counts = PILLS.map(
    (pill) => searchFiltered.filter(FILTER_TESTS[pill.id]).length,
  );

  const rows = useMemo(() => {
    const test = FILTER_TESTS[activeFilter] ?? (() => true);
    return [...searchFiltered.filter(test)].sort((a, b) => {
      const diff =
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      return sortDir === "asc" ? diff : -diff;
    });
  }, [searchFiltered, activeFilter, sortDir]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = rows.slice(start, start + PAGE_SIZE);

  const activePillIndex = PILLS.findIndex((p) => p.id === activeFilter);
  const aliasActive = activePillIndex === -1;

  const selectFilter = (index: number) => {
    const id = PILLS[index].id;
    setActiveFilter(id);
    setPage(1);
    tabRefs.current[index]?.focus();
    const url = id === "all" ? APPLICATIONS_PATH : `${APPLICATIONS_PATH}?filter=${id}`;
    window.history.replaceState(null, "", url);
  };

  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectFilter((index + 1) % PILLS.length);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectFilter((index - 1 + PILLS.length) % PILLS.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectFilter(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectFilter(PILLS.length - 1);
    }
  };

  const toggleSort = () => {
    setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-8">
      <h1 className="font-heading text-2xl font-semibold text-ink-900">
        Applications
      </h1>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
        <p className="text-sm text-ink-600">
          Every application assigned to you, {mockApplications.length} in total.
        </p>
        <TableSearch
          id="app-search"
          label="Search"
          placeholder="Name or case number"
          value={searchInput}
          onChange={(next) => {
            setSearchInput(next);
            setPage(1);
          }}
        />
      </div>

      <div
        role="tablist"
        aria-label="Filter applications"
        className="mt-6 flex flex-wrap gap-2"
      >
        {PILLS.map((pill, index) => {
          const selected = pill.id === activeFilter;
          const focusable = selected || (aliasActive && index === 0);
          return (
            <button
              key={pill.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={focusable ? 0 : -1}
              onClick={() => selectFilter(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={
                "flex h-9 items-center rounded-lg border px-3 text-sm font-medium transition-[transform,background-color,border-color] duration-[130ms] active:scale-[0.97] " +
                (selected
                  ? "border-brand-700 bg-brand-700 text-surface-0"
                  : "border-border bg-surface-0 text-ink-900 hover:bg-surface-50")
              }
            >
              {pill.label} ({counts[index]})
            </button>
          );
        })}
      </div>

      {aliasActive && (
        <div className="mt-4 flex">
          <span className="flex items-center gap-2 rounded-lg border border-border bg-surface-50 px-3 py-1 text-sm text-ink-900">
            Filtered: {FILTER_LABELS[activeFilter] ?? activeFilter}
            <Link
              href={APPLICATIONS_PATH}
              className="font-medium text-brand-700 underline"
              aria-label="Clear the filter"
            >
              Clear
            </Link>
          </span>
        </div>
      )}

      <div aria-live="polite" className="sr-only">
        {rows.length} {rows.length === 1 ? "result" : "results"} shown
      </div>

      <div
        key={`${activeFilter}-${search}-${sortDir}-${current}`}
        className={`mt-4 overflow-hidden rounded-xl border border-border bg-surface-0 ${motion.panelIn}`}
      >
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Applications assigned to you</caption>
          <thead>
            <tr className="border-b border-border bg-surface-50">
              <th scope="col" className={headerCellClass}>Person</th>
              <th scope="col" className={headerCellClass}>Case number</th>
              <th scope="col" className={headerCellClass}>Program</th>
              <th scope="col" className={headerCellClass}>Status</th>
              <th scope="col" className={headerCellClass}>Pending items</th>
              <th
                scope="col"
                aria-sort={sortDir === "asc" ? "ascending" : "descending"}
                className="px-4 py-3"
              >
                <button
                  type="button"
                  onClick={toggleSort}
                  className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-ink-600 hover:text-brand-700"
                >
                  Due date
                  {sortDir === "asc" ? (
                    <ChevronUp size={14} aria-hidden="true" />
                  ) : (
                    <ChevronDown size={14} aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {sortDir === "asc"
                      ? "sorted soonest first, activate to reverse"
                      : "sorted latest first, activate to reverse"}
                  </span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((application) => {
              const person = getPersonForApplication(application);
              const overdue = daysUntilDue(application) < 0;
              return (
                <tr
                  key={application.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium">
                    {person ? (
                      <Link
                        href={`${PEOPLE_PATH}/${person.id}`}
                        className="text-brand-700 underline"
                      >
                        {person.fullName}
                      </Link>
                    ) : (
                      <span className="text-ink-900">Unknown</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`${APPLICATIONS_PATH}/${application.id}`}
                      className="text-ink-600 underline"
                    >
                      {application.caseNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-600">
                    {application.program}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={application.status} />
                  </td>
                  <td className="px-4 py-3 text-ink-600">
                    {application.pendingItems.length > 0
                      ? application.pendingItems.join(", ")
                      : "None"}
                  </td>
                  <td className="px-4 py-3">
                    {overdue ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                        <TriangleAlert size={12} aria-hidden="true" />
                        Overdue {formatDueDate(application.dueDate)}
                      </span>
                    ) : (
                      <span className="text-ink-600">
                        {formatDueDate(application.dueDate)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-600">
                  {search
                    ? `No applications match '${search}'. Try a different name or case number.`
                    : "No applications match this view."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        total={rows.length}
        pageSize={PAGE_SIZE}
        page={current}
        onPageChange={setPage}
      />
    </div>
  );
}

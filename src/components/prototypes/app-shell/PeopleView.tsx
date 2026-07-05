"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { mockPeople, formatShortDate } from "@/lib/mock/people";
import {
  activeApplicationsForPerson,
  primaryProgramForPerson,
} from "@/lib/mock/applications";
import { getStaffName } from "@/lib/mock/user";
import { PEOPLE_PATH } from "./nav";
import { Pagination } from "./Pagination";
import { TableSearch } from "./TableSearch";

const PAGE_SIZE = 25;

const headerCellClass =
  "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-600";

export function PeopleView() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 150);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const rows = useMemo(() => {
    if (!search) return mockPeople;
    const q = search.toLowerCase();
    return mockPeople.filter((p) => p.fullName.toLowerCase().includes(q));
  }, [search]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = rows.slice(start, start + PAGE_SIZE);

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-8">
      <h1 className="font-heading text-2xl font-semibold text-ink-900">
        People
      </h1>
      <p className="mt-1 text-sm text-ink-600">
        Everyone you work with, {mockPeople.length} in total.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <TableSearch
          id="people-search"
          label="Search"
          placeholder="Name"
          value={searchInput}
          onChange={(next) => {
            setSearchInput(next);
            setPage(1);
          }}
        />
      </div>

      <div aria-live="polite" className="sr-only">
        {rows.length} {rows.length === 1 ? "result" : "results"} shown
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface-0">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">People assigned to you</caption>
          <thead>
            <tr className="border-b border-border bg-surface-50">
              <th scope="col" className={headerCellClass}>Name</th>
              <th scope="col" className={headerCellClass}>Active cases</th>
              <th scope="col" className={headerCellClass}>Primary program</th>
              <th scope="col" className={headerCellClass}>Last contact</th>
              <th scope="col" className={headerCellClass}>Assigned to</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((person) => (
              <tr
                key={person.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`${PEOPLE_PATH}/${person.id}`}
                    className="text-brand-700 underline"
                  >
                    {person.fullName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {activeApplicationsForPerson(person.id).length}
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {primaryProgramForPerson(person.id)}
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {formatShortDate(person.lastContact)}
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {getStaffName(person.assignedTo)}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-600">
                  {search
                    ? `No people match '${search}'. Try a different name.`
                    : "No people to show."}
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

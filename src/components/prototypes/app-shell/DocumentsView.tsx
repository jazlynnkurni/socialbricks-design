"use client";

import { useMemo, useRef, useState } from "react";
import type { Document } from "@/lib/types/contract";
import { mockDocuments } from "@/lib/mock/documents";
import { DropZone } from "./upload/DropZone";
import { useUploads } from "./upload/UploadProvider";
import { DocumentRow } from "./DocumentRow";
import { Pagination } from "./Pagination";
import motion from "./motion.module.css";

const PAGE_SIZE = 25;

type FilterId = "needs-review" | "all" | "confirmed" | "flagged";

interface FilterDef {
  id: FilterId;
  label: string;
  test: (doc: Document) => boolean;
  empty: string;
}

const FILTERS: FilterDef[] = [
  {
    id: "needs-review",
    label: "Needs review",
    test: (d) => d.status === "ready" || d.status === "needs-attention",
    empty: "Nothing needs your review right now.",
  },
  { id: "all", label: "All", test: () => true, empty: "No files yet." },
  {
    id: "confirmed",
    label: "Confirmed",
    test: (d) => d.status === "confirmed",
    empty: "No confirmed files yet.",
  },
  {
    id: "flagged",
    label: "Flagged",
    test: (d) => d.status === "flagged",
    empty: "No flagged files.",
  },
];

export function DocumentsView() {
  const { uploads } = useUploads();
  const [activeId, setActiveId] = useState<FilterId>("needs-review");
  const [page, setPage] = useState(1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Merge documents already on file with live uploads, newest first.
  const allDocuments = useMemo(() => {
    const byId = new Map<string, Document>();
    for (const doc of mockDocuments) byId.set(doc.id, doc);
    for (const doc of uploads) byId.set(doc.id, doc);
    return [...byId.values()].sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
  }, [uploads]);

  const counts = useMemo(
    () => FILTERS.map((filter) => allDocuments.filter(filter.test).length),
    [allDocuments],
  );

  const activeIndex = FILTERS.findIndex((f) => f.id === activeId);
  const activeFilter = FILTERS[activeIndex];
  const rows = allDocuments.filter(activeFilter.test);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = rows.slice(start, start + PAGE_SIZE);

  const selectFilter = (index: number) => {
    setActiveId(FILTERS[index].id);
    setPage(1);
    tabRefs.current[index]?.focus();
  };

  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectFilter((index + 1) % FILTERS.length);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectFilter((index - 1 + FILTERS.length) % FILTERS.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectFilter(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectFilter(FILTERS.length - 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-8">
      <h1 className="font-heading text-2xl font-semibold text-ink-900">
        Documents
      </h1>
      <p className="mt-1 text-sm text-ink-600">
        Uploaded files and their extraction status.
      </p>

      <DropZone forceCompact compactLabel="Upload documents" />

      <div
        role="tablist"
        aria-label="Filter documents by review state"
        className="mt-6 flex flex-wrap gap-2"
      >
        {FILTERS.map((filter, index) => {
          const selected = filter.id === activeId;
          return (
            <button
              key={filter.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`doc-tab-${filter.id}`}
              aria-selected={selected}
              aria-controls="doc-tabpanel"
              tabIndex={selected ? 0 : -1}
              onClick={() => selectFilter(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={
                "flex h-9 items-center rounded-lg border px-3 text-sm font-medium transition-[transform,background-color,border-color] duration-[130ms] active:scale-[0.97] " +
                (selected
                  ? "border-brand-700 bg-brand-700 text-surface-0"
                  : "border-border bg-surface-0 text-ink-900 hover:bg-surface-50")
              }
            >
              {filter.label} ({counts[index]})
            </button>
          );
        })}
      </div>

      <div
        key={activeId}
        role="tabpanel"
        id="doc-tabpanel"
        aria-labelledby={`doc-tab-${activeId}`}
        className={`mt-4 ${motion.panelIn}`}
      >
        <h2 className="sr-only">Documents</h2>
        {visible.length > 0 ? (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface-0">
            {visible.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface-50 px-4 py-10 text-center text-sm text-ink-600">
            {activeFilter.empty}
          </div>
        )}
      </div>

      {rows.length > PAGE_SIZE && (
        <Pagination
          total={rows.length}
          pageSize={PAGE_SIZE}
          page={current}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

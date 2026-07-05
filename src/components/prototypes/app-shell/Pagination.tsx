"use client";

// Shared pagination footer for the People and Applications tables: a
// "Showing X-Y of N" summary on the left and Previous / numbered / Next
// controls on the right. Real buttons, keyboard operable, current page
// marked with aria-current. Disabled controls use ink-600 on surface-50
// (about 6.8:1, above the 3:1 component minimum).

const buttonClass =
  "flex h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-surface-0 px-3 text-sm text-ink-900 transition-[transform,background-color] duration-[130ms] enabled:active:scale-[0.97] hover:bg-surface-50 disabled:bg-surface-50 disabled:text-ink-600 disabled:hover:bg-surface-50";

interface PaginationProps {
  total: number;
  pageSize: number;
  page: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  total,
  pageSize,
  page,
  onPageChange,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * pageSize;

  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <p className="text-sm text-ink-600">
        Showing {total === 0 ? 0 : start + 1}-
        {Math.min(start + pageSize, total)} of {total}
      </p>
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          disabled={current === 1}
          onClick={() => onPageChange(current - 1)}
          className={buttonClass}
        >
          Previous
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            aria-current={n === current ? "page" : undefined}
            aria-label={`Page ${n}`}
            className={
              n === current
                ? "flex h-9 min-w-9 items-center justify-center rounded-lg border border-brand-700 bg-brand-700 px-3 text-sm font-medium text-surface-0"
                : buttonClass
            }
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          disabled={current === pageCount}
          onClick={() => onPageChange(current + 1)}
          className={buttonClass}
        >
          Next
        </button>
      </nav>
    </div>
  );
}

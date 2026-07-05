import { STATUS_LABELS } from "@/lib/mock/applications";
import type { ApplicationStatus } from "@/lib/types/contract";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const done = status === "submitted" || status === "approved";
  return (
    <span
      className={
        "inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium " +
        (done
          ? "border border-border bg-surface-50 text-ink-600"
          : "bg-[color-mix(in_srgb,var(--brand-400)_12%,var(--surface-0))] text-brand-700")
      }
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

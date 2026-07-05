"use client";

import Link from "next/link";
import { ChevronRight, FileText, TriangleAlert } from "lucide-react";
import { formatFileSize } from "@/lib/mock/uploads";
import type { Document } from "@/lib/types/contract";
import { LoadingSphere } from "@/components/ui/LoadingSphere";
import { useUploads } from "./UploadProvider";

function StatusChip({ upload }: { upload: Document }) {
  if (upload.status === "uploading") {
    return (
      <span className="flex items-center gap-2">
        <span
          role="progressbar"
          aria-label={`Uploading ${upload.fileName}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={upload.progress}
          className="h-1 w-24 overflow-hidden rounded-full bg-border"
        >
          <span
            className="block h-full rounded-full bg-brand-700 transition-[width] duration-150 motion-reduce:transition-none"
            style={{ width: `${upload.progress}%` }}
          />
        </span>
        <span className="text-xs font-medium text-ink-600">Uploading</span>
      </span>
    );
  }
  if (upload.status === "parsing") {
    return <LoadingSphere size={18} label="Parsing" showLabel />;
  }
  if (upload.status === "ready") {
    return (
      <span className="inline-flex items-center rounded-lg bg-[color-mix(in_srgb,var(--brand-400)_12%,var(--surface-0))] px-2 py-1 text-xs font-medium text-brand-700">
        Ready for review
      </span>
    );
  }
  if (upload.status === "confirmed") {
    return (
      <span className="inline-flex items-center rounded-lg border border-border bg-surface-50 px-2 py-1 text-xs font-medium text-ink-600">
        Confirmed
      </span>
    );
  }
  if (upload.status === "flagged") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
        <TriangleAlert size={12} aria-hidden="true" />
        Flagged
      </span>
    );
  }
  // needs-attention
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
      <TriangleAlert size={12} aria-hidden="true" />
      Needs attention
    </span>
  );
}

function RowContent({ upload }: { upload: Document }) {
  const isError = upload.status === "error";
  return (
    <>
      {isError ? (
        <TriangleAlert
          size={20}
          className="shrink-0 text-amber-800"
          aria-hidden="true"
        />
      ) : (
        <FileText size={20} className="shrink-0 text-ink-600" aria-hidden="true" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink-900">
          {upload.fileName}
        </span>
        <span
          className={
            "block text-xs " + (isError ? "text-amber-800" : "text-ink-600")
          }
        >
          {isError
            ? upload.errorMessage
            : formatFileSize(upload.sizeBytes) +
              (upload.status === "needs-attention"
                ? ` · ${upload.lowConfidenceFields} low-confidence fields`
                : "")}
        </span>
      </span>
      {!isError && <StatusChip upload={upload} />}
    </>
  );
}

export function RecentUploads() {
  const { uploads } = useUploads();
  if (uploads.length === 0) return null;

  const newestFirst = [...uploads].reverse();
  const rowClass = "flex items-center gap-3 px-4 py-3";

  return (
    <section aria-label="Recent uploads" className="mt-6">
      <h2 className="font-heading text-base font-semibold text-ink-900">
        Recent uploads
      </h2>
      <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface-0">
        {newestFirst.map((upload) => (
          <li key={upload.id}>
            {upload.status === "ready" ||
            upload.status === "needs-attention" ||
            upload.status === "flagged" ||
            upload.status === "confirmed" ? (
              <Link
                href={`/prototypes/app-shell/review/${upload.id}`}
                className={`${rowClass} transition-colors hover:bg-surface-50`}
              >
                <RowContent upload={upload} />
                <ChevronRight
                  size={16}
                  className="shrink-0 text-ink-600"
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <div className={rowClass}>
                <RowContent upload={upload} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

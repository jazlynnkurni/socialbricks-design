"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, TriangleAlert } from "lucide-react";
import { MOCK_EXTRACTED_FIELDS } from "@/lib/mock/uploads";
import { getMockDocument } from "@/lib/mock/documents";
import { LoadingSphere } from "@/components/ui/LoadingSphere";
import { useUploads } from "./UploadProvider";

// Review page for the parse pipeline: file name, the mock extracted-fields
// sheet, and Confirm / Flag actions that write real state so the Dashboard
// digest, chips, and attention list update. A document already on file
// (mock, not a runtime upload) resolves for display and shows read-only.
export function ReviewSheet({ id }: { id: string }) {
  const { uploads, confirmUpload, flagUpload } = useUploads();
  const upload = uploads.find((u) => u.id === id);
  const doc = upload ?? getMockDocument(id);
  const fileName = doc?.fileName ?? "Uploaded document";
  const confirmed = doc?.status === "confirmed";

  // Confirm runs through a brief mock "Saving" state so the loading sphere
  // shows the write is in flight before the data commits.
  const [saving, setSaving] = useState(false);
  const savingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (savingTimer.current) clearTimeout(savingTimer.current);
    },
    [],
  );
  const handleConfirm = () => {
    if (saving || confirmed) return;
    setSaving(true);
    savingTimer.current = setTimeout(() => {
      confirmUpload(id);
      setSaving(false);
    }, 800);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-8">
      <Link
        href="/prototypes/app-shell"
        className="text-sm text-ink-600 transition-colors hover:text-brand-700"
      >
        &larr; Back to dashboard
      </Link>
      <h1 className="mt-4 font-heading text-2xl font-semibold text-ink-900">
        {fileName}
      </h1>
      <p className="mt-1 text-sm text-ink-600">
        Check the fields we read from this document. Fields we are not sure
        about are marked.
      </p>

      <div className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface-0">
        {MOCK_EXTRACTED_FIELDS.map((field) => (
          <div key={field.label} className="grid grid-cols-[200px_1fr]">
            <div className="border-r border-border bg-surface-50 px-4 py-3 text-sm text-ink-600">
              {field.label}
            </div>
            <div
              className={
                "flex items-center gap-2 px-4 py-3 text-sm text-ink-900 " +
                (field.lowConfidence ? "bg-amber-100" : "")
              }
            >
              {field.value}
              {field.lowConfidence && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800">
                  <TriangleAlert size={14} aria-hidden="true" />
                  Low confidence
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          disabled={!upload || confirmed || saving}
          onClick={handleConfirm}
          className="flex h-10 items-center gap-2 rounded-lg bg-brand-700 px-4 text-sm font-medium text-surface-0 transition-[transform,background-color] duration-[130ms] enabled:active:scale-[0.98] hover:bg-[color-mix(in_srgb,var(--ink-900)_25%,var(--brand-700))] disabled:bg-surface-50 disabled:text-ink-600 disabled:hover:bg-surface-50"
        >
          {saving ? (
            <LoadingSphere size={16} label="Saving" showLabel />
          ) : confirmed ? (
            <>
              <Check size={16} aria-hidden="true" />
              Confirmed
            </>
          ) : (
            "Confirm extracted data"
          )}
        </button>
        <button
          type="button"
          disabled={!upload || confirmed || saving}
          onClick={() => flagUpload(id)}
          className="flex h-10 items-center rounded-lg border border-border bg-surface-0 px-4 text-sm font-medium text-ink-900 transition-[transform,background-color] duration-[130ms] enabled:active:scale-[0.98] hover:bg-surface-50 disabled:bg-surface-50 disabled:text-ink-600"
        >
          Flag for review
        </button>
      </div>
    </div>
  );
}

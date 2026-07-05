"use client";

import Link from "next/link";
import { ChevronRight, FileText, TriangleAlert } from "lucide-react";
import type { Document } from "@/lib/types/contract";
import { getApplication } from "@/lib/mock/applications";
import { getPerson, formatShortDate } from "@/lib/mock/people";
import { formatFileSize } from "@/lib/mock/uploads";
import { LoadingSphere } from "@/components/ui/LoadingSphere";
import { APP_SHELL_PATH, APPLICATIONS_PATH, PEOPLE_PATH } from "./nav";

export function documentReviewPath(id: string) {
  return `${APP_SHELL_PATH}/review/${id}`;
}

// A document is clickable to review once it has finished parsing.
export function isReviewable(status: Document["status"]) {
  return (
    status === "ready" ||
    status === "needs-attention" ||
    status === "flagged" ||
    status === "confirmed"
  );
}

function StatusChip({ doc }: { doc: Document }) {
  if (doc.status === "ready") {
    return (
      <span className="inline-flex items-center rounded-lg bg-[color-mix(in_srgb,var(--brand-400)_12%,var(--surface-0))] px-2 py-1 text-xs font-medium text-brand-700">
        Ready for review
      </span>
    );
  }
  if (doc.status === "needs-attention") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
        <TriangleAlert size={12} aria-hidden="true" />
        Needs attention: {doc.lowConfidenceFields ?? 1} low-confidence
        {(doc.lowConfidenceFields ?? 1) === 1 ? " field" : " fields"}
      </span>
    );
  }
  if (doc.status === "flagged") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
        <TriangleAlert size={12} aria-hidden="true" />
        Flagged
      </span>
    );
  }
  if (doc.status === "confirmed") {
    return (
      <span className="inline-flex items-center rounded-lg bg-[color-mix(in_srgb,var(--brand-400)_12%,var(--surface-0))] px-2 py-1 text-xs font-medium text-brand-700">
        Confirmed
      </span>
    );
  }
  if (doc.status === "error") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
        <TriangleAlert size={12} aria-hidden="true" />
        Could not read file
      </span>
    );
  }
  if (doc.status === "parsing") {
    return <LoadingSphere size={18} label="Parsing" showLabel />;
  }
  // uploading: determinate progress bar (real progress), no aria-live here.
  return (
    <span className="flex items-center gap-2">
      <span
        role="progressbar"
        aria-label={`Uploading ${doc.fileName}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={doc.progress}
        className="h-1 w-16 overflow-hidden rounded-full bg-border"
      >
        <span
          className="block h-full rounded-full bg-brand-700"
          style={{ width: `${doc.progress}%` }}
        />
      </span>
      <span className="text-xs font-medium text-ink-600">Uploading</span>
    </span>
  );
}

function SecondaryLine({ doc }: { doc: Document }) {
  const application = doc.applicationId
    ? getApplication(doc.applicationId)
    : undefined;
  const person = application ? getPerson(application.personId) : undefined;

  return (
    <span className="relative z-10 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-600">
      {person && application ? (
        <>
          <Link
            href={`${PEOPLE_PATH}/${person.id}`}
            className="text-brand-700 underline"
          >
            {person.fullName}
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            href={`${APPLICATIONS_PATH}/${application.id}`}
            className="text-brand-700 underline"
          >
            {application.caseNumber}
          </Link>
        </>
      ) : (
        <span>Not attached yet</span>
      )}
      <span aria-hidden="true">·</span>
      <span>{formatFileSize(doc.sizeBytes)}</span>
      <span aria-hidden="true">·</span>
      <span>Uploaded {formatShortDate(doc.uploadedAt)}</span>
    </span>
  );
}

// One file, as a roomy list row. The whole row links to review via a
// block-link overlay (the file-name anchor's ::after covers the row), so
// the person and case links layered above stay clickable without nesting
// anchors. Pass hideMeta to drop the person/case line (e.g. inside an
// application detail where that context is already the page).
export function DocumentRow({
  doc,
  hideMeta = false,
}: {
  doc: Document;
  hideMeta?: boolean;
}) {
  const reviewable = isReviewable(doc.status);
  return (
    <li className="relative flex items-center gap-3 px-4 py-4 transition-colors hover:bg-surface-50 focus-within:bg-surface-50">
      <FileText size={20} className="shrink-0 text-ink-600" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        {reviewable ? (
          <Link
            href={documentReviewPath(doc.id)}
            className="text-sm font-medium text-ink-900 underline after:absolute after:inset-0 after:content-['']"
          >
            {doc.fileName}
          </Link>
        ) : (
          <span className="block text-sm font-medium text-ink-900">
            {doc.fileName}
          </span>
        )}
        {!hideMeta && <SecondaryLine doc={doc} />}
      </span>
      <StatusChip doc={doc} />
      {reviewable && (
        <ChevronRight
          size={16}
          className="shrink-0 text-ink-600"
          aria-hidden="true"
        />
      )}
    </li>
  );
}

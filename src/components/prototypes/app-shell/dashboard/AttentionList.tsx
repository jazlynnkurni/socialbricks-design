"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import {
  daysUntilDue,
  formatDueDate,
  getPersonForApplication,
  mockApplications,
} from "@/lib/mock/applications";
import { useUploads } from "../upload/UploadProvider";
import { APPLICATIONS_PATH } from "../nav";
import { reviewPath } from "./stats";

interface AttentionItem {
  key: string;
  name: string;
  action: string;
  chip: { label: string; amber: boolean };
  href: string;
  /** [bucket, tiebreak]: overdue, due soon, flagged, waiting. */
  rank: [number, number];
}

function buildItems(flagged: { id: string; fileName: string; fields: number }[]) {
  const items: AttentionItem[] = [];

  for (const application of mockApplications) {
    const person = getPersonForApplication(application);
    if (!person) continue;
    const days = daysUntilDue(application);
    const action = `${application.dueLabel} ${formatDueDate(application.dueDate)}`;
    const href = `${APPLICATIONS_PATH}/${application.id}`;
    if (days < 0) {
      items.push({
        key: application.id,
        name: person.fullName,
        action,
        chip: { label: "Overdue", amber: true },
        href,
        rank: [0, days],
      });
    } else if (days <= 7) {
      items.push({
        key: application.id,
        name: person.fullName,
        action,
        chip: { label: `Due ${formatDueDate(application.dueDate)}`, amber: true },
        href,
        rank: [1, days],
      });
    } else if (application.waitingOn) {
      items.push({
        key: application.id,
        name: person.fullName,
        action: `Waiting on ${application.waitingOn.charAt(0).toLowerCase()}${application.waitingOn.slice(1)}`,
        chip: { label: "Waiting", amber: false },
        href,
        rank: [3, days],
      });
    }
  }

  flagged.forEach((upload, index) => {
    items.push({
      key: upload.id,
      name: upload.fileName,
      action: `${upload.fields} field${upload.fields === 1 ? "" : "s"} flagged in review`,
      chip: { label: "In review", amber: false },
      href: reviewPath(upload.id),
      rank: [2, index],
    });
  });

  return items
    .sort((a, b) => a.rank[0] - b.rank[0] || a.rank[1] - b.rank[1])
    .slice(0, 5);
}

export function AttentionList() {
  const { uploads } = useUploads();
  const flagged = uploads
    .filter((u) => u.status === "needs-attention")
    .map((u) => ({
      id: u.id,
      fileName: u.fileName,
      fields: u.lowConfidenceFields ?? 1,
    }));
  const items = buildItems(flagged);

  return (
    <section aria-label="Needs your attention" className="mt-6">
      <h2 className="font-heading text-base font-semibold text-ink-900">
        Needs your attention
      </h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-border bg-surface-0">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-50"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink-900">
                    {item.name}
                  </span>
                  <span className="block text-xs text-ink-600">
                    {item.action}
                  </span>
                </span>
                <span
                  className={
                    "inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium " +
                    (item.chip.amber
                      ? "bg-amber-100 text-amber-800"
                      : "border border-border bg-surface-50 text-ink-600")
                  }
                >
                  {item.chip.amber && (
                    <TriangleAlert size={12} aria-hidden="true" />
                  )}
                  {item.chip.label}
                </span>
              </Link>
            </li>
          ))}
          {items.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-ink-600">
              Nothing needs your attention right now.
            </li>
          )}
        </ul>
        <div className="border-t border-border">
          <Link
            href={APPLICATIONS_PATH}
            className="block px-4 py-3 text-sm font-medium text-brand-700 underline transition-colors hover:bg-surface-50"
          >
            View all applications
          </Link>
        </div>
      </div>
    </section>
  );
}

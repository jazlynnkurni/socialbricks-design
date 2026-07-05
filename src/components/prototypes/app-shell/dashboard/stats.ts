import {
  ACTIVE_STATUSES,
  isDueThisWeek,
  mockApplications,
} from "@/lib/mock/applications";
import type { Document } from "@/lib/types/contract";
import { APP_SHELL_PATH } from "../nav";

// Shared caseload math for the digest line, stat chips, and attention list,
// so every surface counts the same way and updates together.

/** Parsed uploads still waiting on a person: ready or needs attention. */
export function getReadyUploads(uploads: Document[]): Document[] {
  return uploads.filter(
    (u) => u.status === "ready" || u.status === "needs-attention",
  );
}

export function getCaseloadCounts(uploads: Document[]) {
  return {
    ready: getReadyUploads(uploads).length,
    pendingApproval: mockApplications.filter(
      (a) => a.status === "pending-review",
    ).length,
    dueThisWeek: mockApplications.filter(isDueThisWeek).length,
    active: mockApplications.filter((a) => ACTIVE_STATUSES.includes(a.status))
      .length,
  };
}

export function reviewPath(uploadId: string): string {
  return `${APP_SHELL_PATH}/review/${uploadId}`;
}

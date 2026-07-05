// Mock Document records already on file, attached to applications. The live
// upload pipeline (UploadProvider) produces additional Documents at runtime;
// these are the ones that exist before any upload. The Documents page merges
// both. Dates are relative to load time so "newest first" stays stable.

import type { Document } from "@/lib/types/contract";
import { applicationsForPerson } from "./applications";

function uploadedDaysAgo(days: number, hour: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    applicationId: "app-1",
    fileName: "Vega-intake-assessment.pdf",
    sizeBytes: 2_411_000,
    status: "confirmed",
    progress: 100,
    uploadedAt: uploadedDaysAgo(6, 9),
  },
  {
    id: "doc-2",
    applicationId: "app-1",
    fileName: "Vega-consent.pdf",
    sizeBytes: 640_000,
    status: "ready",
    progress: 100,
    uploadedAt: uploadedDaysAgo(1, 8),
  },
  {
    id: "doc-3",
    applicationId: "app-3",
    fileName: "Raghunathan-closure-summary.pdf",
    sizeBytes: 1_180_000,
    status: "needs-attention",
    progress: 100,
    lowConfidenceFields: 2,
    uploadedAt: uploadedDaysAgo(0, 10),
  },
  {
    id: "doc-4",
    applicationId: "app-4",
    fileName: "Lindqvist-incident-report.pdf",
    sizeBytes: 3_050_000,
    status: "flagged",
    progress: 100,
    uploadedAt: uploadedDaysAgo(2, 14),
  },
  {
    id: "doc-5",
    applicationId: "app-6",
    fileName: "Delgado-recertification.pdf",
    sizeBytes: 900_000,
    status: "confirmed",
    progress: 100,
    uploadedAt: uploadedDaysAgo(8, 11),
  },
  {
    id: "doc-6",
    applicationId: "app-2",
    fileName: "Okafor-service-plan.pdf",
    sizeBytes: 1_540_000,
    status: "ready",
    progress: 100,
    uploadedAt: uploadedDaysAgo(0, 8),
  },
  {
    id: "doc-7",
    applicationId: "app-7",
    fileName: "income-verification-scan.jpg",
    sizeBytes: 2_050_000,
    status: "needs-attention",
    progress: 100,
    lowConfidenceFields: 3,
    uploadedAt: uploadedDaysAgo(1, 15),
  },
  {
    id: "doc-8",
    applicationId: "app-10",
    fileName: "home-visit-photos.png",
    sizeBytes: 4_120_000,
    status: "ready",
    progress: 100,
    uploadedAt: uploadedDaysAgo(3, 13),
  },
  {
    id: "doc-9",
    applicationId: "app-12",
    fileName: "referral-form-signed.pdf",
    sizeBytes: 780_000,
    status: "parsing",
    progress: 45,
    uploadedAt: uploadedDaysAgo(0, 16),
  },
  {
    id: "doc-10",
    applicationId: "app-8",
    fileName: "eligibility-worksheet.pdf",
    sizeBytes: 1_260_000,
    status: "flagged",
    progress: 100,
    uploadedAt: uploadedDaysAgo(4, 10),
  },
  {
    id: "doc-11",
    applicationId: "app-14",
    fileName: "progress-notes-march.pdf",
    sizeBytes: 610_000,
    status: "confirmed",
    progress: 100,
    uploadedAt: uploadedDaysAgo(9, 9),
  },
  {
    id: "doc-12",
    applicationId: "app-9",
    fileName: "energy-bill-statement.jpg",
    sizeBytes: 1_890_000,
    status: "needs-attention",
    progress: 100,
    lowConfidenceFields: 1,
    uploadedAt: uploadedDaysAgo(2, 12),
  },
  {
    // Not attached to an application yet.
    id: "doc-13",
    applicationId: null,
    fileName: "unlabeled-scan-0421.pdf",
    sizeBytes: 970_000,
    status: "ready",
    progress: 100,
    uploadedAt: uploadedDaysAgo(0, 17),
  },
  {
    // Not attached to an application yet, still parsing.
    id: "doc-14",
    applicationId: null,
    fileName: "phone-photo-document.png",
    sizeBytes: 3_400_000,
    status: "parsing",
    progress: 72,
    uploadedAt: uploadedDaysAgo(0, 17),
  },
];

const DOCUMENTS_BY_ID: Record<string, Document> = Object.fromEntries(
  mockDocuments.map((doc) => [doc.id, doc]),
);

export function getMockDocument(id: string): Document | undefined {
  return DOCUMENTS_BY_ID[id];
}

export function documentsForApplication(applicationId: string): Document[] {
  return mockDocuments.filter((d) => d.applicationId === applicationId);
}

export function documentsForPerson(personId: string): Document[] {
  const appIds = new Set(applicationsForPerson(personId).map((a) => a.id));
  return mockDocuments.filter(
    (d) => d.applicationId !== null && appIds.has(d.applicationId),
  );
}

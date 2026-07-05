// Mock upload pipeline constants and helpers. No network calls anywhere:
// files are accepted as File objects and the pipeline is faked with timers
// in UploadProvider. The runtime upload store holds contract Document
// records, so the Documents page can list live uploads and mock documents
// together.

import { MOCK_USER } from "./user";

export interface ExtractedField {
  label: string;
  value: string;
  lowConfidence?: boolean;
}

export const UPLOAD_LIMIT_BYTES = 20 * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = [".pdf", ".jpg", ".jpeg", ".png"];

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

// The mock extracted-fields sheet shown on the review page for every upload.
export const MOCK_EXTRACTED_FIELDS: ExtractedField[] = [
  { label: "Client name", value: "Marisol Vega" },
  { label: "Case ID", value: "SB-2026-0142" },
  { label: "Date of birth", value: "March 14, 1988" },
  { label: "Phone", value: "(555) 014-2213" },
  { label: "Street address", value: "482 Alder Court, Apt 3B", lowConfidence: true },
  { label: "Household size", value: "4" },
  { label: "Monthly income", value: "$2,340" },
  { label: "Program", value: "Housing assistance" },
  { label: "Signature date", value: "June 28, 2026" },
  { label: "Caseworker", value: MOCK_USER.fullName },
];

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

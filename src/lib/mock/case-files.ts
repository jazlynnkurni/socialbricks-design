// Mock data only. This repo has no backend; every prototype reads from
// src/lib/mock/ and nowhere else.

export type CaseStatus =
  | "intake"
  | "in-progress"
  | "pending-review"
  | "submitted";

export interface CaseFile {
  caseId: string;
  clientName: string;
  status: CaseStatus;
  formsPending: string[];
}

export const mockCaseFiles: CaseFile[] = [
  {
    caseId: "SB-2026-0142",
    clientName: "Marisol Vega",
    status: "intake",
    formsPending: ["Intake Assessment", "Consent for Services"],
  },
  {
    caseId: "SB-2026-0143",
    clientName: "Darnell Okafor",
    status: "in-progress",
    formsPending: ["Home Visit Report", "Service Plan Update"],
  },
  {
    caseId: "SB-2026-0144",
    clientName: "Priya Raghunathan",
    status: "pending-review",
    formsPending: ["Case Closure Summary"],
  },
  {
    caseId: "SB-2026-0145",
    clientName: "Tommy Lindqvist",
    status: "in-progress",
    formsPending: ["Incident Report", "Referral Form", "Progress Notes"],
  },
  {
    caseId: "SB-2026-0146",
    clientName: "Aisha Bello",
    status: "submitted",
    formsPending: [],
  },
  {
    caseId: "SB-2026-0147",
    clientName: "Rosa Delgado",
    status: "pending-review",
    formsPending: ["Eligibility Recertification"],
  },
];

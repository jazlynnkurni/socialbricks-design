// Shared data contract for the app-shell prototype. These types are the
// source of truth for the mock layer and every page that reads it.
//
// Relationships:
//   Person 1 --- * Application   (Application.personId -> Person.id)
//   Application 1 --- * Document  (Document.applicationId -> Application.id)
//   StaffUser 1 --- * Person      (Person.assignedTo -> StaffUser.id)

export type ApplicationStatus =
  | "intake"
  | "in-progress"
  | "pending-review"
  | "submitted"
  | "approved";

export type DocumentStatus =
  | "uploading"
  | "parsing"
  | "ready"
  | "needs-attention"
  | "flagged"
  | "confirmed"
  | "error";

export interface Money {
  /** Whole cents, to avoid floating-point money. */
  amountCents: number;
  currency: string;
}

export interface Award {
  program: string;
  monthlyAmount: Money;
  durationMonths: number;
  /** ISO date the award starts. */
  startDate: string;
}

export interface Person {
  id: string;
  fullName: string;
  /** ISO date. */
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  preferredLanguage: string;
  householdSize: number;
  monthlyIncome: Money;
  /** ISO date of the most recent contact. */
  lastContact: string;
  /** StaffUser.id of the assigned worker. */
  assignedTo: string;
}

export interface Application {
  id: string;
  caseNumber: string;
  /** Person.id this application belongs to. */
  personId: string;
  program: string;
  status: ApplicationStatus;
  /** Forms or tasks still owed on this application. */
  pendingItems: string[];
  /** ISO date. */
  dueDate: string;
  dueLabel: string;
  waitingOn: string | null;
}

export interface Document {
  id: string;
  /** Application.id this document attaches to. Null while an upload is not
      yet attached to an application (runtime uploads before review). */
  applicationId: string | null;
  fileName: string;
  sizeBytes: number;
  status: DocumentStatus;
  /** 0 to 100 while status is "uploading" or "parsing". */
  progress: number;
  /** ISO date-time the file was uploaded. */
  uploadedAt: string;
  /** Set when status is "needs-attention". */
  lowConfidenceFields?: number;
  errorMessage?: string;
}

export interface StaffUser {
  id: string;
  fullName: string;
  firstName: string;
  role: string;
  initials: string;
}

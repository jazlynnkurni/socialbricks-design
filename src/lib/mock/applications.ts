// Mock Application records. 40 applications across the 25 mock people,
// linked by personId. Generated deterministically (no Math.random) so
// server and client renders agree.

import type {
  Application,
  ApplicationStatus,
  Award,
  Money,
} from "@/lib/types/contract";
import { getPerson, mockPeople } from "./people";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  intake: "Intake",
  "in-progress": "In progress",
  "pending-review": "Pending review",
  submitted: "Submitted",
  approved: "Approved",
};

export const ACTIVE_STATUSES: ApplicationStatus[] = [
  "intake",
  "in-progress",
  "pending-review",
];

const PROGRAMS = [
  "Housing assistance",
  "Food assistance",
  "Cash assistance",
  "Medical assistance",
  "Child care subsidy",
  "Energy assistance",
];

function dueIn(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

/** Whole days until an application is due; negative when overdue. */
export function daysUntilDue(application: Application): number {
  return Math.ceil(
    (new Date(application.dueDate).getTime() - Date.now()) / 86_400_000,
  );
}

/** Due within the next 7 days, or already overdue. */
export function isDueThisWeek(application: Application): boolean {
  return daysUntilDue(application) <= 7;
}

export function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// The six named applications carry their original case numbers and states.
const fixed: Application[] = [
  {
    id: "app-1",
    caseNumber: "SB-2026-0142",
    personId: "person-1",
    program: "Housing assistance",
    status: "intake",
    pendingItems: ["Intake Assessment", "Consent for Services"],
    dueDate: dueIn(3),
    dueLabel: "Recertification due",
    waitingOn: null,
  },
  {
    id: "app-2",
    caseNumber: "SB-2026-0143",
    personId: "person-2",
    program: "Food assistance",
    status: "in-progress",
    pendingItems: ["Home Visit Report", "Service Plan Update"],
    dueDate: dueIn(12),
    dueLabel: "Application deadline",
    waitingOn: null,
  },
  {
    id: "app-3",
    caseNumber: "SB-2026-0144",
    personId: "person-3",
    program: "Medical assistance",
    status: "pending-review",
    pendingItems: ["Case Closure Summary"],
    dueDate: dueIn(5),
    dueLabel: "Eligibility review due",
    waitingOn: null,
  },
  {
    id: "app-4",
    caseNumber: "SB-2026-0145",
    personId: "person-4",
    program: "Housing assistance",
    status: "in-progress",
    pendingItems: ["Incident Report", "Referral Form", "Progress Notes"],
    dueDate: dueIn(-2),
    dueLabel: "Home visit report due",
    waitingOn: null,
  },
  {
    id: "app-5",
    caseNumber: "SB-2026-0146",
    personId: "person-5",
    program: "Child care subsidy",
    status: "submitted",
    pendingItems: [],
    dueDate: dueIn(28),
    dueLabel: "Recertification due",
    waitingOn: null,
  },
  {
    id: "app-6",
    caseNumber: "SB-2026-0147",
    personId: "person-6",
    program: "Food assistance",
    status: "pending-review",
    pendingItems: ["Eligibility Recertification"],
    dueDate: dueIn(6),
    dueLabel: "Recertification due",
    waitingOn: "Client documents, 9 days",
  },
];

const FORM_POOL = [
  "Intake Assessment",
  "Consent for Services",
  "Home Visit Report",
  "Service Plan Update",
  "Eligibility Recertification",
  "Income Verification",
  "Referral Form",
  "Progress Notes",
];

const STATUS_CYCLE: ApplicationStatus[] = [
  "intake",
  "in-progress",
  "pending-review",
  "submitted",
  "approved",
];

const DUE_LABELS = [
  "Recertification due",
  "Application deadline",
  "Home visit report due",
  "Eligibility review due",
];

const WAITING_CYCLE: (string | null)[] = [
  null, null, null,
  "Client documents, 9 days",
  null,
  "Landlord verification, 4 days",
  null, null,
  "Employer letter, 12 days",
  null,
];

// personId for each of the 40 applications by index. First six are the
// named people; the remaining 34 spread so most people have one application
// and a dozen have two or three. Person indices are zero-based here.
const PERSON_INDEX_FOR_APP = [
  0, 1, 2, 3, 4, 5,
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  0, 0, 6, 6, 12, 12, 2, 3, 7, 9, 14, 17, 20, 22, 24,
];

const generated: Application[] = PERSON_INDEX_FOR_APP.slice(6).map((personIndex, j) => {
  const i = j + 6;
  const status = STATUS_CYCLE[i % STATUS_CYCLE.length];
  const formCount =
    status === "approved" ? 0 : (i % 3) + (status === "submitted" ? 0 : 1);
  return {
    id: `app-${i + 1}`,
    caseNumber: `SB-2026-${String(148 + j).padStart(4, "0")}`,
    personId: mockPeople[personIndex].id,
    program: PROGRAMS[i % PROGRAMS.length],
    status,
    pendingItems: FORM_POOL.slice(i % 6, (i % 6) + formCount),
    dueDate: dueIn(8 + ((i * 7) % 53)),
    dueLabel: DUE_LABELS[i % DUE_LABELS.length],
    waitingOn: WAITING_CYCLE[i % WAITING_CYCLE.length],
  };
});

export const mockApplications: Application[] = [...fixed, ...generated];

const APPLICATIONS_BY_ID: Record<string, Application> = Object.fromEntries(
  mockApplications.map((application) => [application.id, application]),
);

export function getApplication(id: string): Application | undefined {
  return APPLICATIONS_BY_ID[id];
}

export function applicationsForPerson(personId: string): Application[] {
  return mockApplications.filter((a) => a.personId === personId);
}

export function activeApplicationsForPerson(personId: string): Application[] {
  return applicationsForPerson(personId).filter((a) =>
    ACTIVE_STATUSES.includes(a.status),
  );
}

/** The program shown as a person's primary: their first active application,
    or their first application if none are active. */
export function primaryProgramForPerson(personId: string): string {
  const apps = applicationsForPerson(personId);
  const active = apps.find((a) => ACTIVE_STATUSES.includes(a.status));
  return (active ?? apps[0])?.program ?? "None";
}

export function getPersonForApplication(application: Application) {
  return getPerson(application.personId);
}

export function formatMoney(money: Money): string {
  const whole = Math.round(money.amountCents / 100);
  return `$${whole.toLocaleString("en-US")}`;
}

// Monthly award base per program, in cents. Approved applications get a
// deterministic award derived from the program plus the case number.
const AWARD_BASE_CENTS: Record<string, number> = {
  "Housing assistance": 120000,
  "Food assistance": 45000,
  "Cash assistance": 78000,
  "Medical assistance": 60000,
  "Child care subsidy": 95000,
  "Energy assistance": 32000,
};

function awardStartDate(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() - offsetDays);
  return date.toISOString();
}

/** The award for an approved application, or undefined otherwise. Never a
    denial: applications that are not approved simply have no award yet. */
export function getAward(application: Application): Award | undefined {
  if (application.status !== "approved") return undefined;
  const seq = Number(application.caseNumber.slice(-2)) || 0;
  const base = AWARD_BASE_CENTS[application.program] ?? 50000;
  return {
    program: application.program,
    monthlyAmount: { amountCents: base + (seq % 6) * 2500, currency: "USD" },
    durationMonths: seq % 2 === 0 ? 12 : 6,
    startDate: awardStartDate(seq % 25),
  };
}

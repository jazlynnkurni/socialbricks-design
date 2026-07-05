// Mock program rulebook: the criteria each program checks, the documents
// each needs, and a deterministic eligibility result per application. There
// is no failed or denied result anywhere. When a criterion is not met or is
// uncertain, it is "needs-review" and routes to a person's review queue.

import type { Application } from "@/lib/types/contract";

export interface ProgramCriterion {
  key: string;
  label: string;
  description: string;
  requiredDocuments: string[];
}

export type CriterionResult = "met" | "needs-review";

export interface EligibilityRow {
  criterion: ProgramCriterion;
  result: CriterionResult;
  resultLine: string;
}

const INCOME: ProgramCriterion = {
  key: "income",
  label: "Income within program limit",
  description:
    "Monthly income is at or below the program limit for the household size.",
  requiredDocuments: ["Income Verification"],
};
const HOUSEHOLD: ProgramCriterion = {
  key: "household",
  label: "Household size verified",
  description: "The household members match the documents on file.",
  requiredDocuments: ["Intake Assessment"],
};
const RESIDENCY: ProgramCriterion = {
  key: "residency",
  label: "Residency documented",
  description: "The current address is confirmed with a recent document.",
  requiredDocuments: ["Lease or utility bill"],
};

const PROGRAM_CRITERIA: Record<string, ProgramCriterion[]> = {
  "Housing assistance": [
    INCOME,
    HOUSEHOLD,
    RESIDENCY,
    {
      key: "housing-need",
      label: "Housing need established",
      description: "The current housing situation qualifies for help.",
      requiredDocuments: ["Home Visit Report"],
    },
  ],
  "Food assistance": [INCOME, HOUSEHOLD, RESIDENCY],
  "Cash assistance": [
    INCOME,
    HOUSEHOLD,
    {
      key: "work",
      label: "Work requirement reviewed",
      description: "Work status or an exemption is documented.",
      requiredDocuments: ["Employment record"],
    },
    RESIDENCY,
  ],
  "Medical assistance": [INCOME, HOUSEHOLD, RESIDENCY],
  "Child care subsidy": [
    INCOME,
    {
      key: "activity",
      label: "Work or school activity verified",
      description: "A work or school schedule is on file for the caregiver.",
      requiredDocuments: ["Employment or school record"],
    },
    {
      key: "child-ages",
      label: "Child ages confirmed",
      description: "Each child is within the eligible age range.",
      requiredDocuments: ["Birth records"],
    },
    RESIDENCY,
  ],
  "Energy assistance": [
    INCOME,
    RESIDENCY,
    {
      key: "energy-cost",
      label: "Energy cost documented",
      description: "A recent energy bill shows the household cost.",
      requiredDocuments: ["Energy bill statement"],
    },
  ],
};

const DEFAULT_CRITERIA: ProgramCriterion[] = [INCOME, HOUSEHOLD, RESIDENCY];

export function criteriaForProgram(program: string): ProgramCriterion[] {
  return PROGRAM_CRITERIA[program] ?? DEFAULT_CRITERIA;
}

// Deterministic per-application results. Approved (and submitted)
// applications read as fully met; others have exactly one criterion that
// still needs review, chosen from the case number so it is stable.
export function eligibilityResults(application: Application): EligibilityRow[] {
  const criteria = criteriaForProgram(application.program);
  const settled =
    application.status === "approved" || application.status === "submitted";
  const seq = Number(application.caseNumber.slice(-2)) || 0;
  const needsReviewIndex = seq % criteria.length;

  return criteria.map((criterion, i) => {
    const result: CriterionResult =
      settled || i !== needsReviewIndex ? "met" : "needs-review";
    return {
      criterion,
      result,
      resultLine:
        result === "met"
          ? "Confirmed from the documents on file."
          : "Waiting on review. This routes to a person's review queue.",
    };
  });
}

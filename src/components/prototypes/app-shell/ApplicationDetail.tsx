"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Check, Download, TriangleAlert } from "lucide-react";
import {
  daysUntilDue,
  formatDueDate,
  formatMoney,
  getApplication,
  getAward,
  getPersonForApplication,
} from "@/lib/mock/applications";
import { formatShortDate } from "@/lib/mock/people";
import { getStaffName } from "@/lib/mock/user";
import { documentsForApplication } from "@/lib/mock/documents";
import {
  criteriaForProgram,
  eligibilityResults,
} from "@/lib/mock/program-rules";
import type { Application, Person } from "@/lib/types/contract";
import { APPLICATIONS_PATH, PEOPLE_PATH } from "./nav";
import { StatusBadge } from "./StatusBadge";
import { DocumentRow } from "./DocumentRow";
import motion from "./motion.module.css";

const TABS = [
  { id: "intake", label: "Intake" },
  { id: "eligibility", label: "Eligibility" },
  { id: "awards", label: "Awards" },
  { id: "criteria", label: "Criteria" },
];

function normalizeTab(tab?: string): string {
  return TABS.some((t) => t.id === tab) ? (tab as string) : "intake";
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-600">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-ink-900">{value}</dd>
    </div>
  );
}

function IntakePanel({
  application,
  person,
}: {
  application: Application;
  person: Person;
}) {
  const documents = documentsForApplication(application.id);
  return (
    <>
      <h2 className="font-heading text-base font-semibold text-ink-900">
        Application details
      </h2>
      <dl className="mt-3 grid grid-cols-2 gap-4 rounded-xl border border-border bg-surface-0 p-5 sm:grid-cols-3">
        <Field label="Date of birth" value={formatShortDate(person.dateOfBirth)} />
        <Field label="Phone" value={person.phone} />
        <Field label="Address" value={person.address} />
        <Field label="Household size" value={String(person.householdSize)} />
        <Field label="Monthly income" value={formatMoney(person.monthlyIncome)} />
        <Field label="Preferred language" value={person.preferredLanguage} />
      </dl>

      <h3 className="mt-6 font-heading text-base font-semibold text-ink-900">
        Documents
      </h3>
      {documents.length > 0 ? (
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface-0">
          {documents.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} hideMeta />
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-ink-600">No documents yet.</p>
      )}
    </>
  );
}

function EligibilityPanel({ application }: { application: Application }) {
  const rows = eligibilityResults(application);
  const metCount = rows.filter((r) => r.result === "met").length;
  const reviewCount = rows.length - metCount;

  return (
    <>
      <h2 className="font-heading text-base font-semibold text-ink-900">
        Eligibility criteria
      </h2>
      <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface-0">
        {rows.map((row) => (
          <li
            key={row.criterion.key}
            className="flex items-start justify-between gap-3 px-4 py-3"
          >
            <span className="min-w-0">
              <span className="block text-sm font-medium text-ink-900">
                {row.criterion.label}
              </span>
              <span className="mt-0.5 block text-xs text-ink-600">
                {row.resultLine}
              </span>
            </span>
            {row.result === "met" ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[color-mix(in_srgb,var(--brand-400)_12%,var(--surface-0))] px-2 py-1 text-xs font-medium text-brand-700">
                <Check size={12} aria-hidden="true" />
                Met
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                <TriangleAlert size={12} aria-hidden="true" />
                Needs review
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-ink-600">
        {reviewCount === 0
          ? `All ${rows.length} criteria met.`
          : `${metCount} of ${rows.length} criteria met, ${reviewCount} needs review.`}
      </p>
    </>
  );
}

function AwardsPanel({ application }: { application: Application }) {
  const award = getAward(application);
  if (!award) {
    return (
      <>
        <h2 className="font-heading text-base font-semibold text-ink-900">
          Award
        </h2>
        <p className="mt-2 rounded-xl border border-dashed border-border bg-surface-50 px-4 py-6 text-sm text-ink-600">
          No award yet. Eligibility review has to finish first.
        </p>
      </>
    );
  }
  return (
    <>
      <h2 className="font-heading text-base font-semibold text-ink-900">
        Award
      </h2>
      <div className="mt-3 rounded-xl border border-border bg-surface-0 p-5">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Program" value={award.program} />
          <Field
            label="Monthly amount"
            value={formatMoney(award.monthlyAmount)}
          />
          <Field label="Duration" value={`${award.durationMonths} months`} />
          <Field label="Start date" value={formatShortDate(award.startDate)} />
        </dl>
        <button
          type="button"
          className="mt-5 flex h-10 items-center gap-2 rounded-lg bg-brand-700 px-4 text-sm font-medium text-surface-0 transition-[transform,background-color] duration-[130ms] active:scale-[0.98] hover:bg-[color-mix(in_srgb,var(--ink-900)_25%,var(--brand-700))]"
        >
          <Download size={16} aria-hidden="true" />
          Download award letter
        </button>
      </div>
    </>
  );
}

function CriteriaPanel({ application }: { application: Application }) {
  const criteria = criteriaForProgram(application.program);
  return (
    <>
      <h2 className="font-heading text-base font-semibold text-ink-900">
        {application.program} requirements
      </h2>
      <p className="mt-1 text-sm text-ink-600">
        What this program checks and the documents it asks for.
      </p>
      <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface-0">
        {criteria.map((criterion) => (
          <li key={criterion.key} className="px-4 py-3">
            <span className="block text-sm font-medium text-ink-900">
              {criterion.label}
            </span>
            <span className="mt-0.5 block text-xs text-ink-600">
              {criterion.description}
            </span>
            <span className="mt-1 block text-xs text-ink-600">
              Documents: {criterion.requiredDocuments.join(", ")}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function ApplicationDetail({
  id,
  initialTab,
}: {
  id: string;
  initialTab?: string;
}) {
  const application = getApplication(id);
  const [activeTab, setActiveTab] = useState(normalizeTab(initialTab));
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (!application) {
    return (
      <div className="mx-auto w-full max-w-4xl px-8 py-8">
        <Link
          href={APPLICATIONS_PATH}
          className="text-sm text-ink-600 underline hover:text-brand-700"
        >
          &larr; Back to applications
        </Link>
        <p className="mt-6 text-sm text-ink-600">
          That application could not be found.
        </p>
      </div>
    );
  }

  const person = getPersonForApplication(application);
  const overdue = daysUntilDue(application) < 0;
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  const selectTab = (index: number) => {
    const tab = TABS[index].id;
    setActiveTab(tab);
    tabRefs.current[index]?.focus();
    window.history.replaceState(
      null,
      "",
      `${APPLICATIONS_PATH}/${id}?tab=${tab}`,
    );
  };

  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectTab((index + 1) % TABS.length);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectTab((index - 1 + TABS.length) % TABS.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectTab(TABS.length - 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-8">
      <Link
        href={APPLICATIONS_PATH}
        className="text-sm text-ink-600 underline hover:text-brand-700"
      >
        &larr; Back to applications
      </Link>

      {person ? (
        <h1 className="mt-4 font-heading text-2xl font-semibold text-ink-900">
          <Link href={`${PEOPLE_PATH}/${person.id}`} className="underline">
            {person.fullName}
          </Link>
        </h1>
      ) : (
        <h1 className="mt-4 font-heading text-2xl font-semibold text-ink-900">
          Application
        </h1>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-600">
        <span>{application.caseNumber}</span>
        <span aria-hidden="true">·</span>
        <span>{application.program}</span>
        <StatusBadge status={application.status} />
        {overdue ? (
          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
            <TriangleAlert size={12} aria-hidden="true" />
            Overdue {formatDueDate(application.dueDate)}
          </span>
        ) : (
          <span>Due {formatDueDate(application.dueDate)}</span>
        )}
      </div>
      <p className="mt-1 text-sm text-ink-600">
        Assigned to {getStaffName(person?.assignedTo ?? "")}
      </p>

      <div
        role="tablist"
        aria-label="Application sections"
        className="mt-6 flex gap-1 border-b border-border"
      >
        {TABS.map((tab, index) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`app-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls="app-tabpanel"
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors " +
                (selected
                  ? "border-brand-700 text-brand-700"
                  : "border-transparent text-ink-600 hover:text-ink-900")
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        key={activeTab}
        role="tabpanel"
        id="app-tabpanel"
        aria-labelledby={`app-tab-${activeTab}`}
        tabIndex={0}
        className={`mt-6 focus:outline-none ${motion.panelIn}`}
      >
        {activeIndex === 0 && person && (
          <IntakePanel application={application} person={person} />
        )}
        {activeTab === "eligibility" && (
          <EligibilityPanel application={application} />
        )}
        {activeTab === "awards" && <AwardsPanel application={application} />}
        {activeTab === "criteria" && <CriteriaPanel application={application} />}
      </div>
    </div>
  );
}

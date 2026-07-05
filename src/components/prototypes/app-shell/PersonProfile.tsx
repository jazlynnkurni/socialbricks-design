"use client";

import Link from "next/link";
import {
  applicationsForPerson,
  formatDueDate,
} from "@/lib/mock/applications";
import { getPerson, formatShortDate } from "@/lib/mock/people";
import { documentsForPerson } from "@/lib/mock/documents";
import { formatFileSize } from "@/lib/mock/uploads";
import { APPLICATIONS_PATH, PEOPLE_PATH } from "./nav";
import { StatusBadge } from "./StatusBadge";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-600">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-ink-900">{value}</dd>
    </div>
  );
}

export function PersonProfile({ id }: { id: string }) {
  const person = getPerson(id);

  if (!person) {
    return (
      <div className="mx-auto w-full max-w-4xl px-8 py-8">
        <Link
          href={PEOPLE_PATH}
          className="text-sm text-ink-600 underline hover:text-brand-700"
        >
          &larr; Back to people
        </Link>
        <p className="mt-6 text-sm text-ink-600">
          That person could not be found.
        </p>
      </div>
    );
  }

  const applications = applicationsForPerson(person.id);
  const documents = documentsForPerson(person.id);

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-8">
      <Link
        href={PEOPLE_PATH}
        className="text-sm text-ink-600 underline hover:text-brand-700"
      >
        &larr; Back to people
      </Link>

      <h1 className="mt-4 font-heading text-2xl font-semibold text-ink-900">
        {person.fullName}
      </h1>

      <dl className="mt-4 grid grid-cols-2 gap-4 rounded-xl border border-border bg-surface-0 p-5 sm:grid-cols-3">
        <DetailField
          label="Date of birth"
          value={formatShortDate(person.dateOfBirth)}
        />
        <DetailField label="Phone" value={person.phone} />
        <DetailField label="Email" value={person.email} />
        <DetailField
          label="Preferred language"
          value={person.preferredLanguage}
        />
        <DetailField
          label="Household size"
          value={String(person.householdSize)}
        />
        <DetailField
          label="Last contact"
          value={formatShortDate(person.lastContact)}
        />
      </dl>

      <section aria-labelledby="apps-heading" className="mt-8">
        <h2
          id="apps-heading"
          className="font-heading text-base font-semibold text-ink-900"
        >
          Applications
        </h2>
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface-0">
          {applications.map((application) => (
            <li key={application.id}>
              <Link
                href={`${APPLICATIONS_PATH}/${application.id}`}
                className="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-50"
              >
                <span className="text-sm font-medium text-brand-700 underline">
                  {application.caseNumber}
                </span>
                <span className="text-sm text-ink-600">
                  {application.program}
                </span>
                <StatusBadge status={application.status} />
                <span className="ml-auto text-sm text-ink-600">
                  Due {formatDueDate(application.dueDate)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="person-docs-heading" className="mt-8">
        <h2
          id="person-docs-heading"
          className="font-heading text-base font-semibold text-ink-900"
        >
          Documents
        </h2>
        {documents.length > 0 ? (
          <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface-0">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="text-ink-900">{doc.fileName}</span>
                <span className="text-ink-600">
                  {formatFileSize(doc.sizeBytes)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink-600">No documents yet.</p>
        )}
      </section>

      <section aria-labelledby="comms-heading" className="mt-8">
        <h2
          id="comms-heading"
          className="font-heading text-base font-semibold text-ink-900"
        >
          Communications
        </h2>
        <p className="mt-2 rounded-xl border border-dashed border-border bg-surface-50 px-4 py-4 text-sm text-ink-600">
          A log of calls, messages, and notes with {person.fullName} will live
          here in a later prototype.
        </p>
      </section>
    </div>
  );
}

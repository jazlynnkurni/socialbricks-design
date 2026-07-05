"use client";

import Link from "next/link";
import { useUploads } from "../upload/UploadProvider";
import { APPLICATIONS_PATH } from "../nav";
import { getCaseloadCounts, getReadyUploads, reviewPath } from "./stats";

const cardClass =
  "block rounded-xl border border-border bg-surface-0 p-4 transition-[transform,box-shadow,border-color,background-color] duration-[130ms]";

const cardLinkClass =
  "hover:-translate-y-0.5 hover:border-brand-400 hover:bg-surface-50 hover:shadow-sm";

function CardBody({ count, label }: { count: number; label: string }) {
  return (
    <>
      {/* Empty cards mute the number to ink-600 so occupied cards, which
          carry an actionable count, visually outrank them. */}
      <span
        className={
          "block font-heading text-2xl font-semibold " +
          (count === 0 ? "text-ink-600" : "text-ink-900")
        }
      >
        {count}
      </span>
      <span className="mt-1 block text-[13px] text-ink-600">{label}</span>
    </>
  );
}

export function StatChips() {
  const { uploads } = useUploads();
  const ready = getReadyUploads(uploads);
  const counts = getCaseloadCounts(uploads);

  const cards = [
    {
      label: "Ready to review",
      count: counts.ready,
      // Straight to the first waiting document; a plain card when none wait.
      href: ready.length > 0 ? reviewPath(ready[0].id) : null,
    },
    {
      label: "Pending approval",
      count: counts.pendingApproval,
      href: `${APPLICATIONS_PATH}?filter=pending-approval`,
    },
    {
      label: "Due this week",
      count: counts.dueThisWeek,
      href: `${APPLICATIONS_PATH}?filter=due-week`,
    },
    {
      label: "Active cases",
      count: counts.active,
      href: `${APPLICATIONS_PATH}?filter=active`,
    },
  ];

  return (
    <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <li key={card.label}>
          {card.href ? (
            <Link href={card.href} className={`${cardClass} ${cardLinkClass}`}>
              <CardBody count={card.count} label={card.label} />
            </Link>
          ) : (
            <div className={cardClass}>
              <CardBody count={card.count} label={card.label} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

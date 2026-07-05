"use client";

import { DropZone } from "./upload/DropZone";
import { RecentUploads } from "./upload/RecentUploads";
import { GreetingCard } from "./dashboard/GreetingCard";
import { StatChips } from "./dashboard/StatChips";
import { AttentionList } from "./dashboard/AttentionList";

// Triage surface: greeting card (with digest), stat chips, upload, then
// the short attention list. The full queue lives on the Applications page.
export function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-8">
      <GreetingCard />
      <StatChips />
      <DropZone />
      <RecentUploads />
      <AttentionList />
    </div>
  );
}

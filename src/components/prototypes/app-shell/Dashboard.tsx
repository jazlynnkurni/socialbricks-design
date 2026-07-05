"use client";

import { DropZone } from "./upload/DropZone";
import { RecentUploads } from "./upload/RecentUploads";
import { GreetingCard } from "./dashboard/GreetingCard";
import { StatChips } from "./dashboard/StatChips";
import { AttentionList } from "./dashboard/AttentionList";
import motion from "./motion.module.css";

// Triage surface: greeting card (with digest), stat chips, upload, then
// the short attention list. The full queue lives on the Applications page.
// dashStagger cascades the modules in on load.
export function Dashboard() {
  return (
    <div className={`mx-auto w-full max-w-4xl px-8 py-8 ${motion.dashStagger}`}>
      <GreetingCard />
      <StatChips />
      <DropZone />
      <RecentUploads />
      <AttentionList />
    </div>
  );
}

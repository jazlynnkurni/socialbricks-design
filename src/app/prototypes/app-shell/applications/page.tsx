import { AppShell } from "@/components/prototypes/app-shell/AppShell";
import { ApplicationsView } from "@/components/prototypes/app-shell/ApplicationsView";

// filter comes in server-side so the client view needs no useSearchParams
// Suspense boundary.
export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  return (
    <AppShell>
      <ApplicationsView filter={filter} />
    </AppShell>
  );
}

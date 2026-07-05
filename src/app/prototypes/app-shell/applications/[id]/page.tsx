import { AppShell } from "@/components/prototypes/app-shell/AppShell";
import { ApplicationDetail } from "@/components/prototypes/app-shell/ApplicationDetail";

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  return (
    <AppShell>
      <ApplicationDetail id={id} initialTab={tab} />
    </AppShell>
  );
}

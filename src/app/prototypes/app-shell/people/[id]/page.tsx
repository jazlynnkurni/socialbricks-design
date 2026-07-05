import { AppShell } from "@/components/prototypes/app-shell/AppShell";
import { PersonProfile } from "@/components/prototypes/app-shell/PersonProfile";

export default async function PersonProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AppShell>
      <PersonProfile id={id} />
    </AppShell>
  );
}

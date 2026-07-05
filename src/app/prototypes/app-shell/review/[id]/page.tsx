import { AppShell } from "@/components/prototypes/app-shell/AppShell";
import { ReviewSheet } from "@/components/prototypes/app-shell/upload/ReviewSheet";

// Static "app-shell" segment takes precedence over /prototypes/[slug], so
// review pages render inside the same shell at their own URL.
export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AppShell>
      <ReviewSheet id={id} />
    </AppShell>
  );
}

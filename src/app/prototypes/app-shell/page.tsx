import { AppShell } from "@/components/prototypes/app-shell/AppShell";

// Explicit route for the app-shell dashboard so /prototypes/app-shell is a
// first-class page alongside its sub-routes (applications, people, etc.),
// instead of resolving through the dynamic [slug] route. That ambiguity
// broke client-side navigation into the shell.
export default function AppShellPage() {
  return <AppShell />;
}

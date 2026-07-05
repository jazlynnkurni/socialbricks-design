import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prototypes } from "@/lib/prototypes";
import { AppShell } from "@/components/prototypes/app-shell/AppShell";

// Each prototype renders full-bleed and owns its whole viewport.
const PROTOTYPE_COMPONENTS: Record<string, ComponentType> = {
  "app-shell": AppShell,
};

export function generateStaticParams() {
  return prototypes.map((proto) => ({ slug: proto.slug }));
}

export default async function PrototypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proto = prototypes.find((p) => p.slug === slug);
  if (!proto) notFound();

  const Prototype = PROTOTYPE_COMPONENTS[slug];
  if (Prototype) return <Prototype />;

  // Registered but not yet implemented: show its metadata.
  return (
    <div className="flex flex-1 flex-col px-6 py-12">
      <header className="mx-auto w-full max-w-2xl">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          &larr; All prototypes
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          {proto.title}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {proto.description}
        </p>
      </header>
    </div>
  );
}

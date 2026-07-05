import Link from "next/link";
import { prototypes } from "@/lib/prototypes";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 py-24">
      <main className="w-full max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          SocialBricks Design
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Frontend design and animation prototypes. Each entry below opens a
          standalone prototype at its own route.
        </p>

        <ul className="mt-12 flex flex-col gap-4">
          {prototypes.map((proto) => (
            <li key={proto.slug}>
              <Link
                href={`/prototypes/${proto.slug}`}
                className="block rounded-lg border border-zinc-200 p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <h2 className="font-medium">{proto.title}</h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {proto.description}
                </p>
              </Link>
            </li>
          ))}
          {prototypes.length === 0 && (
            <li className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
              No prototypes yet. Register the first one in
              src/lib/prototypes.ts.
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}

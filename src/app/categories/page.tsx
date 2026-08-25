import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { getAllAgents, getCategoryCounts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Categories",
  description: "Every category in the marketplace and what lives in it.",
};

export default function CategoriesPage() {
  const counts = getCategoryCounts();
  const agents = getAllAgents();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Uploads are classified from their name, tagline, tags and skills.
          Nothing that scores below the confidence floor is forced into a
          category — it waits in Uncategorized for a human.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((category) => {
          const count = counts[category.id] ?? 0;
          const examples = agents
            .filter((agent) => agent.category === category.id)
            .slice(0, 3);

          return (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group flex flex-col rounded border border-line bg-surface p-6 transition-colors hover:border-line-strong hover:bg-surface-raised"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="font-medium tracking-tight group-hover:text-accent-soft">
                    {category.name}
                  </h2>
                </div>
                <span className="shrink-0 rounded-full bg-surface-raised px-2.5 py-1 font-mono text-xs text-subtle ring-1 ring-inset ring-line">
                  {count}
                </span>
              </div>

              {examples.length > 0 ? (
                <p className="mt-4 text-xs text-subtle">
                  {examples.map((agent) => agent.name).join(" · ")}
                  {count > examples.length && ` · +${count - examples.length} more`}
                </p>
              ) : (
                <p className="mt-4 text-xs text-subtle">Nothing here yet.</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

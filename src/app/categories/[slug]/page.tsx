import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentGrid } from "@/components/agent-grid";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getAgentsByCategory } from "@/lib/store";
import type { CategoryId } from "@/lib/types";

const VALID = new Set<string>(CATEGORIES.map((c) => c.id));

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!VALID.has(slug)) return { title: "Category not found" };
  const category = getCategory(slug as CategoryId);
  return {
    title: category.name,
    description: `Agents filed under ${category.name}.`,
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  if (!VALID.has(slug)) notFound();

  const category = getCategory(slug as CategoryId);
  const agents = getAgentsByCategory(category.id).sort(
    (a, b) => b.installs - a.installs,
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <nav className="mb-6 text-sm text-subtle">
        <Link href="/categories" className="hover:text-foreground">
          Categories
        </Link>
      </nav>

      <header className="mb-8 flex items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {category.name}
          </h1>
          <p className="mt-2 text-xs text-subtle">
            {agents.length} {agents.length === 1 ? "agent" : "agents"}
          </p>
        </div>
      </header>

      {agents.length > 0 ? (
        <AgentGrid agents={agents.map((agent) => ({ agent }))} />
      ) : (
        <div className="rounded border border-dashed border-line-strong bg-surface p-12 text-center">
          <p className="font-medium tracking-tight">Nothing here yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            No agent has been classified into {category.name} so far.
          </p>
          <Link
            href="/upload"
            className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Publish the first one
          </Link>
        </div>
      )}

      <div className="mt-10">
        <Link
          href={`/agents?category=${category.id}`}
          className="text-sm text-accent-soft hover:underline"
        >
          Search within {category.name} →
        </Link>
      </div>
    </div>
  );
}

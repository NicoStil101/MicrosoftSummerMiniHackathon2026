import type { Metadata } from "next";
import Link from "next/link";
import { AgentGrid } from "@/components/agent-grid";
import { CategorySidebar } from "@/components/category-sidebar";
import { SearchControls } from "@/components/search-controls";
import { CATEGORIES } from "@/lib/categories";
import { searchAgents, type SortKey } from "@/lib/search";
import { getAllAgents } from "@/lib/store";
import type { CategoryId } from "@/lib/types";

export const metadata: Metadata = {
  title: "Bazaar",
  description: "Search the catalogue by capability, skill, tool or author.",
};

const VALID_SORTS = new Set<string>([
  "relevance",
  "installs",
  "rating",
  "newest",
]);
const VALID_CATEGORIES = new Set<string>(CATEGORIES.map((c) => c.id));

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function AgentsPage({ searchParams }: PageProps<"/agents">) {
  const params = await searchParams;
  const query = first(params.q);
  const categoryParam = first(params.category);
  const sortParam = first(params.sort);

  const category: CategoryId | "all" = VALID_CATEGORIES.has(categoryParam)
    ? (categoryParam as CategoryId)
    : "all";
  const sort: SortKey = VALID_SORTS.has(sortParam)
    ? (sortParam as SortKey)
    : query
      ? "relevance"
      : "installs";

  const agents = getAllAgents();

  // Counts reflect the query but not the category filter, so the rail keeps
  // showing where else the current search has results.
  const countsSource = searchAgents(agents, { query, category: "all", sort });
  const counts: Partial<Record<CategoryId, number>> = {};
  for (const { agent } of countsSource) {
    counts[agent.category] = (counts[agent.category] ?? 0) + 1;
  }

  const results = searchAgents(agents, { query, category, sort });

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-6">
      <h1 className="text-[28px] font-semibold tracking-tight">Bazaar</h1>

      <div className="mt-6 grid gap-x-10 gap-y-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-16 lg:self-start">
          <CategorySidebar
            counts={counts}
            total={countsSource.length}
            activeCategory={category}
            query={query}
            sort={sort}
          />
        </aside>

        <div className="min-w-0">
          <SearchControls query={query} category={category} sort={sort} />

          <p className="mt-6 text-[13px] text-muted" aria-live="polite">
            Showing {results.length}{" "}
            {results.length === 1 ? "result" : "results"}
            {query && (
              <>
                {" "}
                for <strong className="font-semibold">“{query}”</strong>.{" "}
                <Link href="/agents" className="text-accent-soft hover:underline">
                  Clear search
                </Link>
              </>
            )}
          </p>

          <div className="mt-4">
            {results.length > 0 ? (
              <AgentGrid
                agents={results.map((r) => ({
                  agent: r.agent,
                  matchedSkills: query ? r.matchedSkills : [],
                }))}
              />
            ) : (
              <EmptyState query={query} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="border border-line bg-surface p-12 text-center">
      <p className="text-[15px] font-semibold">No agents matched</p>
      <p className="mx-auto mt-2 max-w-md text-[13px] text-muted">
        {query
          ? `Nothing in the catalogue covers “${query}” yet. Every search term has to match, so try dropping one.`
          : "Nothing here yet."}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/agents"
          className="border border-line-strong px-4 py-2 text-[13px] text-muted transition-colors hover:border-foreground hover:text-foreground"
        >
          Clear filters
        </Link>
        <Link
          href="/upload"
          className="bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Publish it yourself
        </Link>
      </div>
    </div>
  );
}

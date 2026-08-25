import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import type { SortKey } from "@/lib/search";
import type { CategoryId } from "@/lib/types";

export interface CategorySidebarProps {
  counts: Partial<Record<CategoryId, number>>;
  total: number;
  activeCategory: CategoryId | "all";
  query: string;
  sort: SortKey;
}

/** Builds an /agents URL, carrying the current search across nav clicks. */
function href(params: {
  query: string;
  category: CategoryId | "all";
  sort: SortKey;
}): string {
  const search = new URLSearchParams();
  if (params.query.trim()) search.set("q", params.query.trim());
  if (params.category !== "all") search.set("category", params.category);
  if (params.sort !== "relevance") search.set("sort", params.sort);
  const qs = search.toString();
  return qs ? `/agents?${qs}` : "/agents";
}

const VIEWS: Array<{ label: string; sort: SortKey }> = [
  { label: "Most installed", sort: "installs" },
  { label: "Recently added", sort: "newest" },
  { label: "Best rated", sort: "rating" },
  { label: "Highest eval score", sort: "eval" },
];

export function CategorySidebar({
  counts,
  total,
  activeCategory,
  query,
  sort,
}: CategorySidebarProps) {
  return (
    <nav aria-label="Filter agents" className="text-[13px]">
      <SectionHeading>Get started</SectionHeading>
      <ul>
        <li>
          <SidebarLink
            href={href({ query, category: "all", sort })}
            active={activeCategory === "all"}
          >
            Browse all agents
            <Count value={total} />
          </SidebarLink>
        </li>
        <li>
          <SidebarLink href="/upload" active={false}>
            Publish an agent
          </SidebarLink>
        </li>
      </ul>

      <SectionHeading>My marketplace</SectionHeading>
      <ul>
        {VIEWS.map((view) => (
          <li key={view.sort}>
            <SidebarLink
              href={href({ query, category: activeCategory, sort: view.sort })}
              active={sort === view.sort}
            >
              {view.label}
            </SidebarLink>
          </li>
        ))}
      </ul>

      <SectionHeading>Categories</SectionHeading>
      <ul>
        {CATEGORIES.map((category) => {
          const count = counts[category.id] ?? 0;
          if (count === 0 && category.id !== activeCategory) return null;
          return (
            <li key={category.id}>
              <SidebarLink
                href={href({ query, category: category.id, sort })}
                active={activeCategory === category.id}
              >
                {category.name}
                <Count value={count} />
              </SidebarLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-7 border-b border-line pb-2 text-[15px] font-semibold first:mt-0">
      {children}
    </h2>
  );
}

function SidebarLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`block border-l-2 py-2 pl-3 pr-2 transition-colors ${
        active
          ? "border-accent bg-surface-raised font-semibold text-foreground"
          : "border-transparent text-muted hover:bg-surface hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

function Count({ value }: { value: number }) {
  return <span className="text-subtle"> ({value})</span>;
}

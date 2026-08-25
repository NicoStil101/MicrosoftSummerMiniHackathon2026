"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getCategory } from "@/lib/categories";
import type { SortKey } from "@/lib/search";
import type { CategoryId } from "@/lib/types";

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: "relevance", label: "Relevance" },
  { value: "installs", label: "Most installed" },
  { value: "rating", label: "Highest rated" },
  { value: "newest", label: "Newest" },
];

export interface SearchControlsProps {
  query: string;
  category: CategoryId | "all";
  sort: SortKey;
}

export function SearchControls({ query, category, sort }: SearchControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState(query);
  // Tracks the query the URL already reflects, so typing debounces but a
  // back/forward navigation still resets the input.
  const committed = useRef(query);

  useEffect(() => {
    if (query !== committed.current) {
      committed.current = query;
      setDraft(query);
    }
  }, [query]);

  function push(next: { query?: string; category?: string; sort?: string }) {
    const params = new URLSearchParams();
    const q = next.query ?? draft;
    const c = next.category ?? category;
    const s = next.sort ?? sort;
    if (q.trim()) params.set("q", q.trim());
    if (c !== "all") params.set("category", c);
    if (s !== "relevance") params.set("sort", s);
    committed.current = q.trim();
    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/agents?${qs}` : "/agents", { scroll: false });
    });
  }

  useEffect(() => {
    if (draft.trim() === committed.current) return;
    const timer = setTimeout(() => push({ query: draft }), 250);
    return () => clearTimeout(timer);
    // `push` is recreated each render; the draft value is the real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const sortLabel = SORTS.find((s) => s.value === sort)?.label ?? "Relevance";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start gap-3">
        <div className="relative min-w-0 flex-1 basis-80">
          <span
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          >
            <SearchIcon />
          </span>
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Search agents, skills, tools or authors"
            aria-label="Search agents"
            className="h-8 w-full border border-line-strong bg-background pl-9 pr-8 text-[13px] placeholder:text-subtle focus:border-accent focus:outline-none"
          />
          {draft && (
            <button
              type="button"
              onClick={() => {
                setDraft("");
                push({ query: "" });
              }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <CloseIcon />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Pill
            label="Category"
            value={category === "all" ? "All" : getCategory(category).name}
            onClear={
              category === "all" ? undefined : () => push({ category: "all" })
            }
          />
          <Pill
            label="Sort"
            value={sortLabel}
            onClear={
              sort === "relevance" ? undefined : () => push({ sort: "relevance" })
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="sort" className="text-[13px] text-muted">
          Sort by
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(event) => push({ sort: event.target.value })}
          className="h-8 border border-line-strong bg-background px-2 text-[13px] focus:border-accent focus:outline-none"
        >
          {SORTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-live="polite"
          className={`text-xs text-subtle transition-opacity ${
            isPending ? "opacity-100" : "opacity-0"
          }`}
        >
          Updating…
        </span>
      </div>
    </div>
  );
}

function Pill({
  label,
  value,
  onClear,
}: {
  label: string;
  value: string;
  onClear?: () => void;
}) {
  return (
    <span className="inline-flex h-8 items-center gap-2 rounded-full bg-pill px-3.5 text-[13px] text-pill-fg">
      <span>
        {label} : <strong className="font-semibold">{value}</strong>
      </span>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label={`Clear ${label.toLowerCase()} filter`}
          className="opacity-70 hover:opacity-100"
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="6.8" cy="6.8" r="4.6" />
      <path d="m10.3 10.3 3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="m2.5 2.5 7 7M9.5 2.5l-7 7" />
    </svg>
  );
}

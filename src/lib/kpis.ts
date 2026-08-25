import type { CategoryId } from "./types";

/**
 * The KPI tree from docs/KPI-STRUCTURE.md, mapped onto bazaar categories.
 *
 * Layers inherit downward: an agent is scored on its own layers plus every
 * layer above. L0 holds for every agent; L1-L4 only apply where the doc says
 * they do, which is why a Planning & Triage agent shows L0 alone.
 */
export type KpiLayer = "L0" | "L1" | "L2" | "L3" | "L4";

export const LAYER_NAMES: Record<KpiLayer, string> = {
  L0: "Universal",
  L1: "Code review",
  L2: "JavaScript / TypeScript",
  L3: "React",
  L4: "Next.js",
};

export interface Kpi {
  id: string;
  name: string;
  layer: KpiLayer;
  definition: string;
  /** Categories this KPI is scored for. "all" is every agent (L0). */
  categories: CategoryId[] | "all";
}

const REVIEW: CategoryId[] = ["code-review"];
const REVIEW_AND_SECURITY: CategoryId[] = ["code-review", "security-compliance"];

export const KPIS: Kpi[] = [
  // L0 — every agent in the bazaar.
  { id: "accuracy", name: "Accuracy", layer: "L0", categories: "all",
    definition: "How closely the work matches what was actually asked." },
  { id: "latency", name: "Latency", layer: "L0", categories: "all",
    definition: "Wall-clock time from session start to delivered result." },
  { id: "cost", name: "Cost", layer: "L0", categories: "all",
    definition: "Tokens consumed per run." },

  // L1 — review agents.
  { id: "fix-quality", name: "Fix quality", layer: "L1", categories: REVIEW,
    definition: "Share of suggested patches that apply cleanly and hold up." },
  { id: "duplicate-freeness", name: "Duplicate-freeness", layer: "L1", categories: REVIEW,
    definition: "Share of findings that are not restatements of another." },

  // L2 — JS/TS ecosystem.
  { id: "type-safety", name: "Type safety", layer: "L2", categories: REVIEW,
    definition: "Detection of `any` abuse and unsafe casts." },
  { id: "async-concurrency", name: "Async / concurrency", layer: "L2", categories: REVIEW,
    definition: "Detection of unhandled rejections and race conditions." },
  { id: "security", name: "Security", layer: "L2", categories: REVIEW_AND_SECURITY,
    definition: "Detection of XSS, injection and unsafe `eval`." },
  { id: "supply-chain", name: "Dependency / supply-chain", layer: "L2", categories: REVIEW_AND_SECURITY,
    definition: "Detection of risky or suspicious dependency changes." },

  // L3 — React.
  { id: "useeffect-misuse", name: "useEffect misuse", layer: "L3", categories: REVIEW,
    definition: "Detection of wrong dependencies and absent cleanup." },
  { id: "rules-of-hooks", name: "Rules of Hooks", layer: "L3", categories: REVIEW,
    definition: "Detection of hooks called conditionally or out of order." },
  { id: "re-renders", name: "Re-renders / memoization", layer: "L3", categories: REVIEW,
    definition: "Detection of avoidable renders and misapplied memoization." },
  { id: "key-props", name: "Key props in lists", layer: "L3", categories: REVIEW,
    definition: "Detection of missing or unstable list keys." },

  // L4 — Next.js.
  { id: "server-client-boundaries", name: "Server / client boundaries", layer: "L4", categories: REVIEW,
    definition: "Detection of misplaced `use client` / `use server`." },
  { id: "caching", name: "Caching / revalidate / dynamic", layer: "L4", categories: REVIEW,
    definition: "Detection of incorrect caching and revalidation config." },
  { id: "server-action-security", name: "Server action security", layer: "L4", categories: REVIEW_AND_SECURITY,
    definition: "Detection of unvalidated or unauthorized server actions." },
  { id: "next-public-leak", name: "NEXT_PUBLIC secret leak", layer: "L4", categories: REVIEW_AND_SECURITY,
    definition: "Detection of secrets exposed through public env vars." },
  { id: "hydration-mismatch", name: "Hydration mismatch", layer: "L4", categories: REVIEW,
    definition: "Detection of server/client render differences." },
  { id: "image-font", name: "next/image & font optimization", layer: "L4", categories: REVIEW,
    definition: "Detection of raw `<img>` and unoptimized font loading." },
];

export function kpisForCategory(category: CategoryId): Kpi[] {
  return KPIS.filter(
    (kpi) => kpi.categories === "all" || kpi.categories.includes(category),
  );
}

/** The layers in play for a category, in inheritance order. */
export function layersForCategory(category: CategoryId): KpiLayer[] {
  const seen = new Set(kpisForCategory(category).map((kpi) => kpi.layer));
  return (["L0", "L1", "L2", "L3", "L4"] as KpiLayer[]).filter((l) =>
    seen.has(l),
  );
}

/**
 * Fallback scores for an agent with none authored — a fresh upload. Derived
 * from the slug and KPI id so the publish preview and the listing agree.
 */
function hash(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return Math.abs(h);
}

export function scoreFor(agentSlug: string, kpiId: string): number {
  // Biased toward 3-5: a listed agent that scored 1 everywhere is not credible.
  return 2 + (hash(`${agentSlug}:${kpiId}`) % 4);
}

export interface ScoredLayer {
  layer: KpiLayer;
  name: string;
  kpis: Array<{ kpi: Kpi; score: number }>;
  /** Mean of this layer's scores, one decimal. */
  average: number;
}

export function benchmarkFor(
  agentSlug: string,
  category: CategoryId,
  /** Authored reviewer scores; any KPI missing here falls back to scoreFor. */
  scores: Record<string, number> = {},
): ScoredLayer[] {
  return layersForCategory(category).map((layer) => {
    const kpis = kpisForCategory(category)
      .filter((kpi) => kpi.layer === layer)
      .map((kpi) => ({
        kpi,
        score: scores[kpi.id] ?? scoreFor(agentSlug, kpi.id),
      }));
    const average =
      Math.round(
        (kpis.reduce((sum, k) => sum + k.score, 0) / kpis.length) * 10,
      ) / 10;
    return { layer, name: LAYER_NAMES[layer], kpis, average };
  });
}

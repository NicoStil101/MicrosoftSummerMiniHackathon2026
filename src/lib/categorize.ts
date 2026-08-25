import { CATEGORIES } from "./categories";
import type { AgentDraft, CategoryId } from "./types";

export interface CategoryScore {
  category: CategoryId;
  /** Raw weighted hit count. */
  score: number;
  /** Share of total signal, 0-1. */
  confidence: number;
  /** Which keywords fired, for the "why this category" explainer. */
  matched: string[];
}

export interface Classification {
  category: CategoryId;
  confidence: number;
  ranked: CategoryScore[];
}

/** Below this share of the total signal we refuse to guess. */
const CONFIDENCE_FLOOR = 0.18;

/**
 * Everything the classifier reads, with the fields that describe intent
 * repeated so they outweigh a passing mention in a long description.
 */
function haystack(draft: AgentDraft): string {
  const skillText = draft.skills
    .map((s) => `${s.name} ${s.description} ${s.tools.join(" ")}`)
    .join(" ");
  const weighted = [
    draft.name,
    draft.name,
    draft.tagline,
    draft.tagline,
    draft.tags.join(" "),
    draft.tags.join(" "),
    skillText,
    draft.description,
  ];
  return weighted.join(" ").toLowerCase();
}

function countOccurrences(text: string, term: string): number {
  // Word-boundary match so "ci" doesn't fire inside "precision".
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = text.match(new RegExp(`\\b${escaped}\\b`, "g"));
  return matches ? matches.length : 0;
}

export function classify(draft: AgentDraft): Classification {
  const text = haystack(draft);

  const ranked: CategoryScore[] = CATEGORIES.filter(
    (c) => c.keywords.length > 0,
  )
    .map((category) => {
      const matched: string[] = [];
      let score = 0;
      for (const keyword of category.keywords) {
        const hits = countOccurrences(text, keyword);
        if (hits === 0) continue;
        matched.push(keyword);
        // Multi-word phrases are far more specific, so they count for more,
        // and repeats give diminishing returns instead of dominating.
        const specificity = keyword.includes(" ") ? 3 : 1;
        score += specificity * (1 + Math.log2(hits));
      }
      return { category: category.id, score, confidence: 0, matched };
    })
    .sort((a, b) => b.score - a.score);

  const total = ranked.reduce((sum, r) => sum + r.score, 0);
  for (const entry of ranked) {
    entry.confidence = total > 0 ? entry.score / total : 0;
  }

  const top = ranked[0];
  if (!top || top.score === 0 || top.confidence < CONFIDENCE_FLOOR) {
    return { category: "uncategorized", confidence: 0, ranked };
  }
  return { category: top.category, confidence: top.confidence, ranked };
}

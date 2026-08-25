import type { Agent, CategoryId } from "./types";

export type SortKey = "relevance" | "installs" | "rating" | "newest" | "eval";

export interface SearchParams {
  query: string;
  category: CategoryId | "all";
  sort: SortKey;
}

export interface SearchResult {
  agent: Agent;
  score: number;
  /** Which skills matched the query, so the card can show why it's here. */
  matchedSkills: string[];
}

const FIELD_WEIGHTS = {
  name: 12,
  tag: 6,
  tagline: 4,
  skillName: 3,
  author: 3,
  skillTool: 2,
  skillDescription: 1,
  description: 1,
} as const;

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9.+#-]+/)
    .filter((token) => token.length > 1);
}

/** Substring match — good enough for a catalogue this size, and forgiving of plurals. */
function hits(haystack: string, token: string): boolean {
  return haystack.toLowerCase().includes(token);
}

function scoreAgent(agent: Agent, tokens: string[]): SearchResult | null {
  if (tokens.length === 0) {
    return { agent, score: 0, matchedSkills: [] };
  }

  let score = 0;
  const matchedSkills = new Set<string>();

  for (const token of tokens) {
    let tokenScore = 0;

    if (hits(agent.name, token)) tokenScore += FIELD_WEIGHTS.name;
    if (agent.tags.some((tag) => hits(tag, token))) tokenScore += FIELD_WEIGHTS.tag;
    if (hits(agent.tagline, token)) tokenScore += FIELD_WEIGHTS.tagline;
    if (hits(agent.author, token)) tokenScore += FIELD_WEIGHTS.author;
    if (hits(agent.description, token)) tokenScore += FIELD_WEIGHTS.description;

    for (const skill of agent.skills) {
      if (hits(skill.name, token)) {
        tokenScore += FIELD_WEIGHTS.skillName;
        matchedSkills.add(skill.name);
      }
      if (skill.tools.some((tool) => hits(tool, token))) {
        tokenScore += FIELD_WEIGHTS.skillTool;
        matchedSkills.add(skill.name);
      }
      if (hits(skill.description, token)) {
        tokenScore += FIELD_WEIGHTS.skillDescription;
        matchedSkills.add(skill.name);
      }
    }

    // Every token has to land somewhere — an AND search, so "email python"
    // doesn't surface every agent that merely mentions email.
    if (tokenScore === 0) return null;
    score += tokenScore;
  }

  return { agent, score, matchedSkills: [...matchedSkills] };
}

export function searchAgents(agents: Agent[], params: SearchParams): SearchResult[] {
  const tokens = tokenize(params.query);

  const results = agents
    .filter((agent) => params.category === "all" || agent.category === params.category)
    .map((agent) => scoreAgent(agent, tokens))
    .filter((result): result is SearchResult => result !== null);

  const sorters: Record<SortKey, (a: SearchResult, b: SearchResult) => number> = {
    relevance: (a, b) => b.score - a.score || b.agent.installs - a.agent.installs,
    installs: (a, b) => b.agent.installs - a.agent.installs,
    rating: (a, b) => b.agent.rating - a.agent.rating || b.agent.installs - a.agent.installs,
    newest: (a, b) => Date.parse(b.agent.createdAt) - Date.parse(a.agent.createdAt),
    eval: (a, b) => b.agent.evalScore - a.agent.evalScore,
  };

  return results.sort(sorters[params.sort] ?? sorters.relevance);
}

/** Query suggestions for the empty search state. */
export function popularQueries(): string[] {
  return ["email", "sql", "code review", "support ticket", "invoice", "research", "self-healing"];
}

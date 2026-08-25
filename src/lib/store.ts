import { classify } from "./categorize";
import { SEED_AGENTS, type Seed } from "./seed-data";
import type { Agent, AgentDraft, CategoryId } from "./types";

/**
 * In-memory catalogue. This is a frontend prototype: uploads live for as long
 * as the server process does and are not shared between instances. Swap this
 * module for a database client and the rest of the app is unchanged.
 *
 * Held on globalThis so the seed data survives dev-server hot reloads instead
 * of duplicating on every edit.
 */
const globalForStore = globalThis as unknown as {
  __agentStore?: Agent[];
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function uniqueSlug(base: string, taken: Set<string>): string {
  const root = base || "agent";
  if (!taken.has(root)) return root;
  let n = 2;
  while (taken.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function buildFromSeed(seed: Seed, taken: Set<string>): Agent {
  const { stats, ...draft } = seed;
  const classification = classify(draft);
  const slug = uniqueSlug(slugify(draft.name), taken);
  taken.add(slug);

  return {
    id: slug,
    slug,
    name: draft.name,
    tagline: draft.tagline,
    description: draft.description,
    author: stats.author,
    version: draft.version,
    runtime: draft.runtime,
    license: draft.license,
    category: classification.category,
    categorySource: "auto",
    categoryConfidence: classification.confidence,
    tags: draft.tags,
    skills: draft.skills.map((skill, i) => ({ ...skill, id: `${slug}-skill-${i}` })),
    installs: stats.installs,
    rating: stats.rating,
    evalScore: stats.evalScore,
    health: stats.health,
    lastEvaluatedAt: daysAgo(stats.daysSinceEval),
    createdAt: daysAgo(stats.daysSincePublish),
  };
}

function seedStore(): Agent[] {
  const taken = new Set<string>();
  return SEED_AGENTS.map((seed) => buildFromSeed(seed, taken));
}

function store(): Agent[] {
  globalForStore.__agentStore ??= seedStore();
  return globalForStore.__agentStore;
}

export function getAllAgents(): Agent[] {
  return store();
}

export function getAgentBySlug(slug: string): Agent | undefined {
  return store().find((agent) => agent.slug === slug);
}

export function getAgentsByCategory(category: CategoryId): Agent[] {
  return store().filter((agent) => agent.category === category);
}

/** Agent counts per category, including categories with nothing in them. */
export function getCategoryCounts(): Record<CategoryId, number> {
  const counts = {} as Record<CategoryId, number>;
  for (const agent of store()) {
    counts[agent.category] = (counts[agent.category] ?? 0) + 1;
  }
  return counts;
}

export function getAuthors(): string[] {
  return [...new Set(store().map((a) => a.author))].sort();
}

/**
 * Publishes an upload. The category is decided by the classifier unless the
 * uploader picked one explicitly.
 */
export function publishAgent(draft: AgentDraft): Agent {
  const agents = store();
  const taken = new Set(agents.map((a) => a.slug));
  const slug = uniqueSlug(slugify(draft.name), taken);
  const classification = classify(draft);

  const manual = draft.category && draft.category !== "auto";
  const now = new Date().toISOString();

  const agent: Agent = {
    id: slug,
    slug,
    name: draft.name,
    tagline: draft.tagline,
    description: draft.description,
    author: draft.author,
    version: draft.version,
    runtime: draft.runtime,
    license: draft.license,
    category: manual ? (draft.category as CategoryId) : classification.category,
    categorySource: manual ? "manual" : "auto",
    categoryConfidence: manual ? 1 : classification.confidence,
    tags: draft.tags,
    skills: draft.skills.map((skill, i) => ({ ...skill, id: `${slug}-skill-${i}` })),
    installs: 0,
    rating: 0,
    evalScore: 0,
    health: "unevaluated",
    lastEvaluatedAt: null,
    createdAt: now,
  };

  agents.unshift(agent);
  return agent;
}

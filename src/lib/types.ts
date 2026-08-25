export type CategoryId =
  | "planning-triage"
  | "code-review"
  | "ci-automation"
  | "docs-onboarding"
  | "insights-metrics"
  | "security-compliance"
  | "uncategorized";

export interface Skill {
  id: string;
  name: string;
  description: string;
  /** Tools / APIs the skill reaches for, e.g. "gmail.send", "sql.query". */
  tools: string[];
}

export interface Agent {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  author: string;
  version: string;
  runtime: string;
  license: string;
  category: CategoryId;
  /** How the category was decided: the classifier or the uploader. */
  categorySource: "auto" | "manual";
  /** 0-1 score from the classifier for the chosen category. */
  categoryConfidence: number;
  tags: string[];
  skills: Skill[];
  installs: number;
  rating: number;
  createdAt: string;
}

/** The shape accepted by the upload form and the JSON manifest importer. */
export interface AgentDraft {
  name: string;
  tagline: string;
  description: string;
  author: string;
  version: string;
  runtime: string;
  license: string;
  tags: string[];
  skills: Array<Omit<Skill, "id">>;
  /** Omitted or "auto" means: let the classifier pick. */
  category?: CategoryId | "auto";
}

/** A comment left on an agent's page. */
export interface AgentComment {
  id: string;
  /** Slug of the agent the comment belongs to. */
  agentSlug: string;
  author: string;
  body: string;
  createdAt: string;
}

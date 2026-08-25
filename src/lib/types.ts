export type CategoryId =
  | "email-productivity"
  | "customer-support"
  | "data-analytics"
  | "developer-tools"
  | "sales-marketing"
  | "research-web"
  | "finance-ops"
  | "security-compliance"
  | "content-creative"
  | "automation-workflow"
  | "uncategorized";

export type HealthStatus = "healthy" | "degraded" | "failing" | "unevaluated";

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
  /** Latest eval suite pass rate, 0-100. */
  evalScore: number;
  health: HealthStatus;
  lastEvaluatedAt: string | null;
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

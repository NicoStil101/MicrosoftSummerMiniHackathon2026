import type { CategoryId } from "./types";

export interface Category {
  id: CategoryId;
  name: string;
  /** Two-letter tile label, in place of an icon asset. */
  abbr: string;
  /** Weighted terms the classifier looks for. Longer phrases score higher. */
  keywords: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: "planning-triage",
    name: "Planning & Triage",
    abbr: "PT",
    keywords: [
      "issue", "issues", "triage", "backlog", "grooming", "estimation",
      "estimate", "story point", "roadmap", "milestone", "sprint", "epic",
      "sub-issue", "subtask", "duplicate", "prioritise", "prioritize",
      "planning", "kanban", "project board", "assignee", "label", "scope",
    ],
  },
  {
    id: "code-review",
    name: "Code & Review",
    abbr: "CR",
    keywords: [
      "pull request", "code review", "reviewer", "refactor", "refactoring",
      "test generation", "unit test", "test suite", "lint", "linter", "diff",
      "merge conflict", "codebase", "patch", "commit", "static analysis",
      "coverage", "bug", "stack trace", "regression", "snippet", "codemod",
    ],
  },
  {
    id: "ci-automation",
    name: "CI & Automation",
    abbr: "CI",
    keywords: [
      "ci", "cd", "github actions", "actions", "workflow", "webhook",
      "release", "deploy", "deployment", "pipeline", "build", "artifact",
      "runner", "cron", "automation", "automate", "bot", "rollback",
      "staging", "publish", "queue", "retry", "scheduler",
    ],
  },
  {
    id: "docs-onboarding",
    name: "Docs & Onboarding",
    abbr: "DO",
    keywords: [
      "readme", "docs", "documentation", "contributor guide", "changelog",
      "onboarding", "knowledge base", "tutorial", "walkthrough", "guide",
      "api reference", "wiki", "glossary", "docstring", "translate",
      "translation", "example", "getting started", "handbook",
    ],
  },
  {
    id: "insights-metrics",
    name: "Insights & Metrics",
    abbr: "IM",
    keywords: [
      "velocity", "dashboard", "analytics", "metric", "metrics", "kpi",
      "insight", "chart", "trend", "throughput", "cycle time", "lead time",
      "burndown", "contributor stats", "project analytics", "forecast",
      "anomaly", "report", "reporting", "query", "sql", "warehouse",
    ],
  },
  {
    id: "security-compliance",
    name: "Security & Compliance",
    abbr: "SC",
    keywords: [
      "security", "vulnerability", "vulnerabilities", "cve", "dependency",
      "dependencies", "dependency audit", "dependabot", "secret scanning",
      "secret", "policy", "compliance", "sast", "license check", "advisory",
      "exploit", "permission", "permissions", "audit", "soc 2", "soc2",
      "threat", "supply chain", "reachability", "sca", "access review",
    ],
  },
  {
    id: "uncategorized",
    name: "Uncategorized",
    abbr: "UN",
    keywords: [],
  },
];

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: CategoryId): Category {
  return BY_ID.get(id) ?? BY_ID.get("uncategorized")!;
}

/** Categories offered in pickers — every real one, minus the fallback bucket. */
export const SELECTABLE_CATEGORIES = CATEGORIES.filter(
  (c) => c.id !== "uncategorized",
);

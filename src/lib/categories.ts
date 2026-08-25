import type { CategoryId } from "./types";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  /** Two-letter tile label, in place of an icon asset. */
  abbr: string;
  /** Weighted terms the classifier looks for. Longer phrases score higher. */
  keywords: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: "email-productivity",
    name: "Email & Productivity",
    blurb: "Inbox triage, drafting, scheduling and everyday desk work.",
    abbr: "EP",
    keywords: [
      "email", "inbox", "gmail", "outlook", "calendar", "scheduling", "schedule",
      "meeting", "reminder", "todo", "task list", "notes", "draft", "reply",
      "responder", "follow up", "rsvp", "agenda", "triage",
    ],
  },
  {
    id: "customer-support",
    name: "Customer Support",
    blurb: "Ticket deflection, replies, escalation and CSAT recovery.",
    abbr: "CS",
    keywords: [
      "support", "ticket", "helpdesk", "zendesk", "intercom", "faq", "customer",
      "escalation", "live chat", "csat", "refund", "complaint", "sla",
      "knowledge base", "macro", "first response",
    ],
  },
  {
    id: "data-analytics",
    name: "Data & Analytics",
    blurb: "Querying, modelling, reporting and turning tables into answers.",
    abbr: "DA",
    keywords: [
      "data", "sql", "analytics", "dashboard", "report", "etl", "warehouse",
      "bigquery", "snowflake", "databricks", "pandas", "chart", "metric", "kpi",
      "forecast", "anomaly", "cohort", "dbt", "query",
    ],
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    blurb: "Code review, tests, migrations, CI triage and repo chores.",
    abbr: "DT",
    keywords: [
      "code", "codebase", "repo", "repository", "github", "gitlab",
      "pull request", "code review", "lint", "unit test", "test suite", "ci",
      "cd", "deploy", "bug", "stack trace", "refactor", "typescript", "python",
      "debug", "migration", "compiler", "sdk", "api client",
    ],
  },
  {
    id: "sales-marketing",
    name: "Sales & Marketing",
    blurb: "Pipeline research, outreach, campaigns and CRM hygiene.",
    abbr: "SM",
    keywords: [
      "sales", "lead", "crm", "salesforce", "hubspot", "outreach", "campaign",
      "seo", "ads", "ad copy", "funnel", "prospect", "pipeline", "newsletter",
      "cold email", "icp", "churn", "upsell", "landing page",
    ],
  },
  {
    id: "research-web",
    name: "Research & Web",
    blurb: "Browsing, scraping, synthesis and cited deep dives.",
    abbr: "RW",
    keywords: [
      "research", "web search", "browse", "browser", "scrape", "crawl",
      "summarize", "summarise", "citation", "paper", "arxiv", "competitor",
      "market research", "wikipedia", "literature", "fact check", "source",
    ],
  },
  {
    id: "finance-ops",
    name: "Finance & Ops",
    blurb: "Invoices, expenses, procurement and back-office reconciliation.",
    abbr: "FO",
    keywords: [
      "invoice", "expense", "accounting", "payroll", "budget", "procurement",
      "vendor", "contract", "reconcile", "reconciliation", "ledger", "tax",
      "spend", "purchase order", "receipt", "erp", "sap", "netsuite",
    ],
  },
  {
    id: "security-compliance",
    name: "Security & Compliance",
    blurb: "Vulnerability triage, audits, policy checks and incident work.",
    abbr: "SC",
    keywords: [
      "security", "vulnerability", "vulnerabilities", "cve", "audit",
      "compliance", "gdpr", "soc 2", "soc2", "threat", "phishing", "incident",
      "policy", "pentest", "penetration test", "secret scanning", "iam",
      "access review", "malware", "advisory", "exploit", "dependency",
      "dependencies", "supply chain", "reachability", "sca",
    ],
  },
  {
    id: "content-creative",
    name: "Content & Creative",
    blurb: "Long-form writing, translation, media and brand voice.",
    abbr: "CC",
    keywords: [
      "content", "blog", "article", "image", "video", "design", "translate",
      "translation", "transcribe", "transcript", "caption", "social media",
      "copywriting", "writing", "brand", "tone of voice", "podcast", "thumbnail",
    ],
  },
  {
    id: "automation-workflow",
    name: "Automation & Workflow",
    blurb: "Orchestration, triggers, integrations and long-running jobs.",
    abbr: "AW",
    keywords: [
      "workflow", "automation", "automate", "orchestrate", "orchestration",
      "trigger", "webhook", "integration", "zapier", "cron", "batch job",
      "retry", "queue", "pipeline run", "sync", "scheduler", "state machine",
    ],
  },
  {
    id: "uncategorized",
    name: "Uncategorized",
    blurb: "Nothing matched confidently yet — a human can reassign these.",
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

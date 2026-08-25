import type { AgentDraft } from "./types";

/** Marketplace stats that don't come from the uploader. */
export interface SeedStats {
  author: string;
  installs: number;
  rating: number;
  daysSincePublish: number;
  /** Reviewer scores, 1-5, keyed by KPI id. Only the agent's own layers. */
  benchmark: Record<string, number>;
}

export interface Seed extends AgentDraft {
  stats: SeedStats;
}

export const SEED_AGENTS: Seed[] = [
  {
    name: "API Architect",
    tagline: "Help mentor the engineer by providing guidance, support, and working code.",
    description: "Acts on mandatory and optional API aspects and generates a design and working code for connectivity from a client service to an external service.",
    author: "Sarah Connor",
    version: "1.2.0",
    runtime: "Node 24",
    license: "MIT",
    tags: ["api", "architect", "design", "planning"],
    skills: [
      { name: "Architecture Blueprint", description: "Generates foundational architecture diagrams and patterns.", tools: [] },
      { name: "Database Schema Design", description: "Designs data models for APIs.", tools: [] }
    ],
    stats: { author: "Sarah Connor", installs: 840, rating: 4.8, daysSincePublish: 120 , benchmark: { "accuracy": 4, "latency": 3, "cost": 2 } }
  },
  {
    name: "AI Team Dev",
    tagline: "AI development team (Nova, Sage, Milo).",
    description: "Use when implementing features, fixing bugs, writing tests, improving user experience, or preparing a pull request across the project's actual stack.",
    author: "Robert Smith",
    version: "2.1.1",
    runtime: "Python 3.12",
    license: "Apache-2.0",
    tags: ["ai", "team", "development", "planning"],
    skills: [
      { name: "AI Team Orchestration", description: "Coordinates tasks between different AI personas.", tools: [] },
      { name: "Acquire Codebase Knowledge", description: "Scans repository for context.", tools: [] }
    ],
    stats: { author: "Robert Smith", installs: 532, rating: 4.5, daysSincePublish: 300 , benchmark: { "accuracy": 4, "latency": 2, "cost": 2, "fix-quality": 4, "duplicate-freeness": 3, "type-safety": 4, "async-concurrency": 3, "security": 3, "supply-chain": 3, "useeffect-misuse": 3, "rules-of-hooks": 3, "re-renders": 3, "key-props": 3, "server-client-boundaries": 3, "caching": 3, "server-action-security": 3, "next-public-leak": 3, "hydration-mismatch": 3, "image-font": 3 } }
  },
  {
    name: "Context Architect",
    tagline: "Helps developers manage and organize project context.",
    description: "Maintains a structured context graph for large codebases to assist other agents and developers in understanding project dependencies and requirements.",
    author: "Michael Chang",
    version: "0.9.4",
    runtime: "Node 24",
    license: "MIT",
    tags: ["context", "architect", "planning", "structure"],
    skills: [
      { name: "Build Evidence Map", description: "Maps out code dependencies and architectural decisions.", tools: [] },
      { name: "Agent Governance", description: "Ensures agents follow project standards.", tools: [] }
    ],
    stats: { author: "Michael Chang", installs: 215, rating: 4.2, daysSincePublish: 45 , benchmark: { "accuracy": 4, "latency": 2, "cost": 2 } }
  },
  {
    name: "PR Reviewer",
    tagline: "Reviews code diffs, finds bugs, and leaves inline comments.",
    description: "Reads every pull request diff to find logical errors, null pointers, and missing tests before a human looks at it. Leaves actionable inline comments.",
    author: "Sarah Connor",
    version: "3.5.0",
    runtime: "Go 1.22",
    license: "MIT",
    tags: ["code review", "pr", "diff", "analysis"],
    skills: [
      { name: "Code Review Guidelines", description: "Enforces repository review standards.", tools: [] },
      { name: "Error Handling Reviewer", description: "Checks for unhandled exceptions.", tools: [] }
    ],
    stats: { author: "Sarah Connor", installs: 950, rating: 4.9, daysSincePublish: 400 , benchmark: { "accuracy": 5, "latency": 4, "cost": 4, "fix-quality": 5, "duplicate-freeness": 5, "type-safety": 5, "async-concurrency": 4, "security": 4, "supply-chain": 4, "useeffect-misuse": 5, "rules-of-hooks": 5, "re-renders": 4, "key-props": 5, "server-client-boundaries": 5, "caching": 4, "server-action-security": 4, "next-public-leak": 4, "hydration-mismatch": 4, "image-font": 4 } }
  },
  {
    name: "Bug Reproduction",
    tagline: "Helps identify and reproduce bugs from issue descriptions.",
    description: "Generates a reproduction environment and test script based on bug reports.",
    author: "David Wilson",
    version: "1.0.2",
    runtime: "Node 24",
    license: "MIT",
    tags: ["bug", "reproduction", "code review"],
    skills: [
      { name: "Bug Reproduction", description: "Creates scripts to replicate bugs.", tools: [] },
      { name: "Debug Error Trace", description: "Analyzes stack traces.", tools: [] }
    ],
    stats: { author: "David Wilson", installs: 180, rating: 4.1, daysSincePublish: 20 , benchmark: { "accuracy": 4, "latency": 3, "cost": 3, "fix-quality": 3, "duplicate-freeness": 4, "type-safety": 3, "async-concurrency": 5, "security": 2, "supply-chain": 2, "useeffect-misuse": 4, "rules-of-hooks": 3, "re-renders": 2, "key-props": 2, "server-client-boundaries": 3, "caching": 2, "server-action-security": 2, "next-public-leak": 2, "hydration-mismatch": 5, "image-font": 2 } }
  },
  {
    name: "Refactor Legacy Code",
    tagline: "Modernizes and refactors legacy codebases.",
    description: "Scans your codebase for outdated API usage and suggests automated pull requests to update your dependencies and modernize syntax.",
    author: "Jessica Davis",
    version: "4.2.0",
    runtime: "Python 3.12",
    license: "Apache-2.0",
    tags: ["refactor", "legacy", "code review"],
    skills: [
      { name: "Refactor Legacy Code", description: "Applies modern patterns to old code.", tools: [] },
      { name: "Migration Assistant", description: "Helps migrate between framework versions.", tools: [] }
    ],
    stats: { author: "Jessica Davis", installs: 720, rating: 4.6, daysSincePublish: 210 , benchmark: { "accuracy": 4, "latency": 3, "cost": 3, "fix-quality": 4, "duplicate-freeness": 3, "type-safety": 5, "async-concurrency": 3, "security": 2, "supply-chain": 2, "useeffect-misuse": 4, "rules-of-hooks": 4, "re-renders": 5, "key-props": 4, "server-client-boundaries": 4, "caching": 3, "server-action-security": 2, "next-public-leak": 2, "hydration-mismatch": 3, "image-font": 4 } }
  },
  {
    name: "DevOps Expert",
    tagline: "Assists with CI/CD pipelines, containerization, and automation.",
    description: "Expert in writing GitHub Actions, Dockerfiles, and automation scripts for CI/CD.",
    author: "Emily Chen",
    version: "2.8.1",
    runtime: "Node 24",
    license: "MIT",
    tags: ["ci", "actions", "automation", "devops"],
    skills: [
      { name: "Deployment Preflight", description: "Checks environments before deployment.", tools: [] },
      { name: "Infrastructure As Code", description: "Generates Terraform or ARM templates.", tools: [] }
    ],
    stats: { author: "Emily Chen", installs: 610, rating: 4.7, daysSincePublish: 150 , benchmark: { "accuracy": 4, "latency": 3, "cost": 3 } }
  },
  {
    name: "Docker Expert",
    tagline: "Assists with Docker containerization and troubleshooting.",
    description: "Creates optimal Dockerfiles and docker-compose configurations, and helps troubleshoot container issues.",
    author: "William Thomas",
    version: "5.1.0",
    runtime: "Go 1.22",
    license: "MIT",
    tags: ["docker", "container", "automation", "ci"],
    skills: [
      { name: "Docker Compose Generator", description: "Builds multi-container orchestration files.", tools: [] },
      { name: "Container Troubleshooting", description: "Diagnoses container runtime issues.", tools: [] }
    ],
    stats: { author: "William Thomas", installs: 890, rating: 4.8, daysSincePublish: 365 , benchmark: { "accuracy": 4, "latency": 4, "cost": 4 } }
  },
  {
    name: "Azure IaC Generator",
    tagline: "Generates Infrastructure as Code for Azure.",
    description: "Writes Bicep, ARM, or Terraform configurations for deploying applications to Microsoft Azure.",
    author: "Amanda Miller",
    version: "1.3.4",
    runtime: "Python 3.12",
    license: "Proprietary",
    tags: ["azure", "iac", "automation", "cloud"],
    skills: [
      { name: "Azure Resource Visualizer", description: "Visualizes Azure resource deployments.", tools: [] },
      { name: "Infrastructure As Code", description: "Creates Azure deployment templates.", tools: [] }
    ],
    stats: { author: "Amanda Miller", installs: 320, rating: 4.4, daysSincePublish: 90 , benchmark: { "accuracy": 3, "latency": 3, "cost": 3 } }
  },
  {
    name: "Code Tour",
    tagline: "Generates codebase tours and onboarding materials.",
    description: "Creates guided tours of large codebases to help new engineers quickly onboard and understand the architecture.",
    author: "John Smith",
    version: "1.0.0",
    runtime: "Node 24",
    license: "MIT",
    tags: ["docs", "tour", "documentation", "onboarding"],
    skills: [
      { name: "Acquire Codebase Knowledge", description: "Understands repository structure.", tools: [] },
      { name: "Add Educational Comments", description: "Inserts explanatory comments for beginners.", tools: [] }
    ],
    stats: { author: "John Smith", installs: 999, rating: 4.9, daysSincePublish: 400 , benchmark: { "accuracy": 4, "latency": 4, "cost": 4 } }
  },
  {
    name: "API Doc Sync",
    tagline: "Automatically generates and syncs API documentation.",
    description: "Continuously watches your controllers and route handlers, automatically updating your OpenAPI specs.",
    author: "Ashley Jackson",
    version: "0.8.5",
    runtime: "Node 24",
    license: "MIT",
    tags: ["onboarding", "api", "docs", "swagger"],
    skills: [
      { name: "Generate API Docs", description: "Extracts documentation from source code.", tools: [] },
      { name: "Swagger Spec Generator", description: "Generates OpenAPI specifications.", tools: [] }
    ],
    stats: { author: "Ashley Jackson", installs: 150, rating: 4.3, daysSincePublish: 60 , benchmark: { "accuracy": 5, "latency": 4, "cost": 5 } }
  },
  {
    name: "Design System Checker",
    tagline: "Ensures UI components match design system guidelines.",
    description: "Audits frontend code for consistency, accessibility, and adherence to the design system.",
    author: "James Anderson",
    version: "2.4.0",
    runtime: "Go 1.22",
    license: "Apache-2.0",
    tags: ["ui", "design", "onboarding", "docs"],
    skills: [
      { name: "Design System Checker", description: "Validates components against style guides.", tools: [] },
      { name: "UI Accessibility", description: "Checks for WCAG compliance.", tools: [] }
    ],
    stats: { author: "James Anderson", installs: 410, rating: 4.6, daysSincePublish: 180 , benchmark: { "accuracy": 4, "latency": 4, "cost": 4 } }
  },
  {
    name: "BigQuery Pipeline Audit",
    tagline: "Audits BigQuery data pipelines and SQL performance.",
    description: "Analyzes SQL queries and data pipelines for cost optimization and performance bottlenecks.",
    author: "Robert Taylor",
    version: "1.1.2",
    runtime: "Python 3.12",
    license: "MIT",
    tags: ["metrics", "bigquery", "sql", "insights"],
    skills: [
      { name: "Bigquery Pipeline Audit", description: "Reviews data pipelines.", tools: [] },
      { name: "SQL Query Optimizer", description: "Optimizes SQL queries for speed and cost.", tools: [] }
    ],
    stats: { author: "Robert Taylor", installs: 275, rating: 4.2, daysSincePublish: 110 , benchmark: { "accuracy": 4, "latency": 2, "cost": 2 } }
  },
  {
    name: "Ad Campaign Analyzer",
    tagline: "Analyzes ad campaign performance and metrics.",
    description: "Provides insights into marketing campaigns, highlighting ROAS, CTR, and conversion metrics.",
    author: "Alice Johnson",
    version: "3.0.0",
    runtime: "Node 24",
    license: "Proprietary",
    tags: ["analytics", "campaigns", "metrics", "insights"],
    skills: [
      { name: "Ad Campaign Analyzer", description: "Analyzes ad performance data.", tools: [] },
      { name: "Log Analysis", description: "Parses logs for conversion events.", tools: [] }
    ],
    stats: { author: "Alice Johnson", installs: 340, rating: 4.5, daysSincePublish: 250 , benchmark: { "accuracy": 3, "latency": 3, "cost": 3 } }
  },
  {
    name: "Memory Leak Detector",
    tagline: "Detects and analyzes memory leaks in production.",
    description: "Monitors application memory usage over time and analyzes heap dumps to find memory leaks.",
    author: "Emily Chen",
    version: "1.5.0",
    runtime: "Python 3.12",
    license: "Apache-2.0",
    tags: ["metrics", "performance", "memory", "insights"],
    skills: [
      { name: "Memory Leak Detector", description: "Analyzes heap dumps.", tools: [] },
      { name: "Performance Profiler", description: "Profiles CPU and memory usage.", tools: [] }
    ],
    stats: { author: "Emily Chen", installs: 190, rating: 4.4, daysSincePublish: 85 , benchmark: { "accuracy": 4, "latency": 2, "cost": 3 } }
  },
  {
    name: "Cloud SaaS Outage Triage",
    tagline: "Triages and investigates cloud SaaS outages.",
    description: "Helps incident response teams quickly identify the root cause of outages across distributed cloud systems.",
    author: "David Wilson",
    version: "4.1.2",
    runtime: "Go 1.22",
    license: "MIT",
    tags: ["security", "incident", "triage", "compliance"],
    skills: [
      { name: "Network Topology", description: "Visualizes network traffic and outages.", tools: [] },
      { name: "Log Analysis", description: "Searches logs for errors during outages.", tools: [] }
    ],
    stats: { author: "David Wilson", installs: 880, rating: 4.8, daysSincePublish: 310 , benchmark: { "accuracy": 4, "latency": 5, "cost": 4, "security": 3, "supply-chain": 2, "server-action-security": 2, "next-public-leak": 2 } }
  },
  {
    name: "Agent Governance Reviewer",
    tagline: "Ensures AI agents follow safety and security guidelines.",
    description: "Reviews AI agent prompts and logic for safety, bias, and compliance with organizational policies.",
    author: "Sarah Connor",
    version: "2.0.0",
    runtime: "Rust",
    license: "Apache-2.0",
    tags: ["security", "governance", "ai", "compliance"],
    skills: [
      { name: "Agent Governance", description: "Audits AI agent behavior.", tools: [] },
      { name: "AI Prompt Engineering", description: "Reviews prompts for injection vulnerabilities.", tools: [] }
    ],
    stats: { author: "Sarah Connor", installs: 999, rating: 4.9, daysSincePublish: 390 , benchmark: { "accuracy": 4, "latency": 3, "cost": 3, "security": 4, "supply-chain": 3, "server-action-security": 5, "next-public-leak": 5 } }
  },
  {
    name: "Accessibility Runtime Tester",
    tagline: "Tests applications for accessibility compliance.",
    description: "Runs automated checks and simulated interactions to ensure web applications are accessible to everyone.",
    author: "James Anderson",
    version: "1.1.0",
    runtime: "Node 24",
    license: "Proprietary",
    tags: ["compliance", "accessibility", "testing", "security"],
    skills: [
      { name: "UI Accessibility", description: "Checks for a11y standards.", tools: [] },
      { name: "AC Readiness Assess", description: "Assesses acceptance criteria.", tools: [] }
    ],
    stats: { author: "James Anderson", installs: 450, rating: 4.7, daysSincePublish: 130 , benchmark: { "accuracy": 4, "latency": 3, "cost": 3, "security": 2, "supply-chain": 1, "server-action-security": 1, "next-public-leak": 1 } }
  },
  {
    name: "Next.js Reviewer",
    tagline: "Reviews Next.js pull requests for App Router and Server Component mistakes.",
    description: "Reads every pull request against a Next.js codebase and reviews it on the defects the framework makes easy to introduce: a 'use client' or 'use server' directive on the wrong side of the boundary, a revalidate or dynamic setting that quietly disables caching or serves stale data, a Server Action reachable without validation or an authorization check, a secret placed behind NEXT_PUBLIC where it ships to the browser, markup that renders differently on server and client, and raw img or font loading where the Next.js primitives apply. Findings are ranked by confidence and left as inline review comments; it stays silent on style so the comments it does leave get read.",
    author: "Sarah Connor",
    version: "1.0.0",
    runtime: "Node 24",
    license: "MIT",
    tags: ["code review", "pull request", "next.js", "react", "app router", "diff"],
    skills: [
      { name: "Boundary Check", description: "Flags misplaced 'use client' and 'use server' directives across the server/client boundary.", tools: ["github.pulls.get", "ast.parse"] },
      { name: "Cache Config Review", description: "Reviews revalidate, dynamic and 'use cache' settings for stale or disabled caching.", tools: ["ast.parse"] },
      { name: "Server Action Audit", description: "Checks every Server Action for input validation and an authorization guard.", tools: ["ast.parse", "github.pulls.createReviewComment"] },
      { name: "Public Env Scan", description: "Detects secrets exposed through NEXT_PUBLIC environment variables.", tools: ["repo.grep", "secrets.classify"] },
      { name: "Hydration Diff", description: "Finds markup that renders differently on the server and the client.", tools: ["ast.parse"] },
      { name: "Asset Optimization", description: "Flags raw img tags and unoptimized font loading where next/image and next/font apply.", tools: ["ast.parse"] }
    ],
    stats: { author: "Sarah Connor", installs: 612, rating: 4.8, daysSincePublish: 38 , benchmark: { "accuracy": 5, "latency": 3, "cost": 3, "fix-quality": 5, "duplicate-freeness": 4, "type-safety": 4, "async-concurrency": 4, "security": 4, "supply-chain": 3, "useeffect-misuse": 5, "rules-of-hooks": 5, "re-renders": 4, "key-props": 4, "server-client-boundaries": 5, "caching": 5, "server-action-security": 5, "next-public-leak": 5, "hydration-mismatch": 5, "image-font": 4 } }
  }
];

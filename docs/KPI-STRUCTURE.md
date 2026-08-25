# KPI structure for the code-agent marketplace

## Introduction

This document defines how agents are evaluated in our internal code-agent marketplace, where different code agents are compared against each other on the same terms. Evaluation happens at the end of a session: a separate, independent reviewer assesses the agent's work against a defined set of KPIs. The agent never scores itself — the reviewer is a distinct component, so the score reflects an outside judgment rather than the agent's own confidence. Each KPI is rated on a **1-to-5 scale**, where 1 is poor and 5 is excellent.

KPIs are organized as an inheritance tree that runs from generic at the top to concrete at the bottom. An agent is measured against its own layer and every layer above it, so a Next.js reviewer is judged on Next.js-specific checks as well as on the universal expectations shared by all agents. This lets us reuse the top of the tree across the whole marketplace and swap only the bottom layers to evaluate a different agent type. The first concrete agent evaluated here is a **Next.js Reviewer Agent** — an agent that reviews Next.js pull requests.

Head-to-head comparison happens in a **sandbox** at the lower, agent-specific layers (L2–L4): competing agents of the same type are run against identical inputs there, so their KPI results are directly comparable. The shared upper layers (L0–L1) are not benchmarked in the sandbox — they hold for every agent and carry no comparative signal.

## Layer tree

```
L0  Universal      every code agent          ┐ shared upper layers
 └─ L1  Code review    every review agent     ┘ (not benchmarked)
     └─ L2  JS / TS      JS ecosystem          ┐
         └─ L3  React      React layer          │ agent-specific lower layers
             └─ L4  Next.js    concrete target  ┘ benchmarked in the sandbox
```

An agent inherits every layer above it. The Next.js Reviewer Agent (L4) is measured against L0, L1, L2, L3, and L4 together. The sandbox benchmark compares competing agents only on the lower layers (L2–L4).

## Reuse across the marketplace

- **L0–L1 are shared.** They apply to every agent (L0) and every review agent (L1), and are reused unchanged across the marketplace.
- **L2–L4 are agent-specific.** They encode the ecosystem, framework, and concrete target being reviewed. To evaluate a different agent — for example a Python reviewer — keep L0–L1 and replace L2–L4.

## Sandbox benchmark (lower layers only)

The sandbox is a controlled environment where competing agents of the same type are compared head-to-head. It operates **only on the lower, agent-specific layers (L2–L4)** — the layers that actually distinguish one agent from another.

- **Same inputs for everyone.** Each agent under comparison is run against the identical set of pull requests and seeded issues, so differences in their KPI results come from the agents, not from what they were asked to review.
- **Scored by the same independent reviewer.** The end-of-session reviewer applies the L2–L4 KPIs uniformly across agents, producing directly comparable results.
- **Upper layers are excluded.** L0–L1 hold for every agent and carry no comparative signal, so they are not part of the sandbox benchmark.

This keeps the comparison meaningful: agents are ranked on the concrete, framework-level work that sets them apart, on a level playing field.

---

## L0 — Universal

Applies to every code agent in the marketplace.

| KPI | Definition | Why it matters / how to measure |
|---|---|---|
| Accuracy | How well the agent follows the instructions it was given. | An agent that drifts from its task is unreliable regardless of how good its output looks. Measure how closely the work matches what was actually asked of it. |
| Latency | How long the agent took to produce its output. | End-to-end speed decides whether the agent fits into a real workflow. Measure wall-clock time from session start to delivered result. |
| Cost | Tokens per run. | Cost decides whether the agent is viable at scale. Measure tokens consumed per run. |

## L1 — Code review

Applies to every review agent. Reused across the marketplace.

| KPI | Definition | Why it matters / how to measure |
|---|---|---|
| Fix quality | Share of suggested patches that apply cleanly and are correct. | A patch that does not apply or introduces a new defect is worse than none. Measure the share of suggested patches that apply and hold up under review or tests. |
| Duplicate-freeness | Share of non-redundant findings. | Repeated findings pad the output and obscure distinct issues. Measure the share of findings that are not restatements of another. |

## L2 — JavaScript / TypeScript

Ecosystem layer. Agent-specific.

| KPI | Definition | Why it matters / how to measure |
|---|---|---|
| Type safety | Detection of `any` abuse and unsafe casts. | Escaping the type system silently reintroduces the bugs types are meant to prevent. Measure how reliably the agent flags weakened or bypassed typing. |
| Async / concurrency | Detection of unhandled rejections and race conditions. | These defects pass locally and surface in production under load. Measure detection against known async hazards in the diff. |
| Security | Detection of XSS, injection, and unsafe `eval`. | These are the common, high-impact vulnerability classes in JS/TS code. Measure detection against a seeded set of security issues. |
| Dependency / supply-chain | Detection of risky or suspicious dependency changes. | Added or bumped dependencies are a frequent attack and breakage vector. Measure whether the agent flags questionable dependency changes in the diff. |

## L3 — React

React layer. Agent-specific.

| KPI | Definition | Why it matters / how to measure |
|---|---|---|
| useEffect misuse | Detection of missing or incorrect dependencies and absent cleanup. | Effect mistakes cause stale data, leaks, and infinite loops. Measure detection against known effect defects in the diff. |
| Rules of Hooks | Detection of hooks called conditionally or out of order. | Violating hook rules breaks React's state model in ways that are easy to miss. Measure detection of conditional or misplaced hook calls. |
| Unnecessary re-renders / memoization | Detection of avoidable re-renders and missing or misapplied memoization. | Needless re-renders degrade UI performance quietly. Measure how well the agent identifies avoidable renders and questionable memoization. |
| Key props in lists | Detection of missing or unstable list keys. | Bad keys cause subtle rendering and state bugs in lists. Measure detection of absent or non-stable keys. |

## L4 — Next.js

Concrete target for the Next.js Reviewer Agent. Agent-specific.

| KPI | Definition | Why it matters / how to measure |
|---|---|---|
| Server/client boundaries | Detection of misplaced `use client` / `use server` directives. | A wrong boundary can leak server code to the client or break rendering. Measure detection against known boundary mistakes in the diff. |
| Caching / `revalidate` / `dynamic` | Detection of incorrect caching and revalidation configuration. | Wrong caching serves stale data or silently disables caching. Measure detection of misconfigured `revalidate` / `dynamic` and related settings. |
| Server action security | Detection of unvalidated or unauthorized server actions. | Server actions are callable entry points and are dangerous when unguarded. Measure detection of missing validation or authorization. |
| `NEXT_PUBLIC` secret leak | Detection of secrets exposed through `NEXT_PUBLIC` variables. | Anything under `NEXT_PUBLIC` ships to the browser, so a secret there is public. Measure detection of sensitive values placed in public env vars. |
| Hydration mismatch | Detection of server/client render differences that break hydration. | Hydration mismatches cause visible glitches and runtime errors. Measure detection of patterns that render differently on server and client. |
| `next/image` & font optimization | Detection of missed image and font optimization. | Skipping these regresses performance and Core Web Vitals. Measure detection of raw `<img>` usage and unoptimized font loading where the Next.js primitives apply. |

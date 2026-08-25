# MicrosoftSummerMiniHackathon2026

- https://github.com/reneexeener/msft-hackathon-2026
- https://github.com/redeem/msft-summer-hackathon-munich
- https://canva.link/vdwj74pual5xtfb

- agent marketplace
	- import / export agents for different tasks
- evaluating agents
- production, continous
- feedback loop
- e.g. email responder stopped working
- self healing

---

## Agent Exchange — the marketplace frontend

A Next.js 16 (App Router) frontend for an agent marketplace: publish agents
together with the skills they ship, search the catalogue by capability, and let
every upload land in a category automatically.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

### What's in it

| Route | What it does |
| --- | --- |
| `/` | Hero search, category grid, most-installed and newest agents |
| `/agents` | Search + category filter + sort, all driven by the URL |
| `/agents/[slug]` | Detail page: skills, tools each skill calls, eval health, manifest export |
| `/categories` | Every category with counts and example agents |
| `/categories/[slug]` | One category's agents |
| `/upload` | Publish an agent and its skills, with live category prediction |

### Auto-categorization

`src/lib/categorize.ts` scores an upload against weighted keyword sets defined
per category in `src/lib/categories.ts`. The fields that state intent — name,
tagline, tags — are weighted above the long description, multi-word phrases
count for more than single words, repeated hits give diminishing returns, and a
match below an 18% share of the total signal falls through to **Uncategorized**
rather than being forced into a bucket.

It is a plain module with no server dependencies, so the upload form runs the
*same* classifier in the browser as you type. The prediction you see in the
sidebar is the one the server will apply.

The uploader can always override the result; the detail page records whether a
category was chosen by the classifier (with its confidence) or by the author.

### Search

`src/lib/search.ts` scores across name, tags, tagline, author, skill names,
skill descriptions and the tools each skill calls, with per-field weights.
Multiple terms are ANDed — every token has to land somewhere — so `email
python` returns nothing rather than everything mentioning email. Result cards
show which skills matched.

### Import / export

Every agent page exports a `.json` manifest, and the upload page accepts one
back by drag-and-drop or file picker — skills included. That's the round trip
for moving an agent between environments.

### Data

`src/lib/store.ts` is an **in-memory** catalogue seeded from
`src/lib/seed-data.ts` (20 agents, 54 skills), held on `globalThis` so it
survives hot reloads. Uploads live as long as the server process does and are
not shared between instances — swap this one module for a database client and
nothing else in the app changes.

Seeded agents carry an eval pass rate and a health badge (healthy / degraded /
failing), which is where the hackathon's evaluation and self-healing threads
would plug in.

### Layout

```
src/
  app/           routes (App Router, server components by default)
  components/    UI — client components only where interaction demands it
  lib/
    types.ts       Agent, Skill, AgentDraft
    categories.ts  category definitions + keyword sets
    categorize.ts  the classifier
    search.ts      scoring, filtering, sorting
    store.ts       in-memory catalogue (swap for a DB)
    actions.ts     the upload server action
```

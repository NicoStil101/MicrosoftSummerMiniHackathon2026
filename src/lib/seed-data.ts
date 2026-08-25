import type { AgentDraft } from "./types";

/** Marketplace stats that don't come from the uploader. */
export interface SeedStats {
  author: string;
  installs: number;
  rating: number;
  daysSincePublish: number;
}

export interface Seed extends AgentDraft {
  stats: SeedStats;
}

export const SEED_AGENTS: Seed[] = [
  {
    name: "Inbox Responder",
    tagline: "Drafts and sends replies to routine email so your inbox stays at zero.",
    description:
      "Inbox Responder watches a mailbox, classifies every incoming email by intent, and drafts a reply in your own voice. Routine threads — scheduling, status pings, RSVP, out-of-office follow up — are answered automatically; anything ambiguous is left as a draft with a short note explaining what it could not decide. It keeps a rolling summary of each thread so long conversations stay coherent, and hands off to a human the moment a message mentions pricing, legal or an escalation keyword.",
    author: "workmail-labs",
    version: "2.4.1",
    runtime: "Node 24",
    license: "MIT",
    tags: ["email", "inbox zero", "drafting", "gmail"],
    skills: [
      {
        name: "Classify intent",
        description: "Sorts each new email into reply-now, schedule, ignore or escalate.",
        tools: ["gmail.list", "gmail.get"],
      },
      {
        name: "Draft reply",
        description: "Writes a reply in the user's tone using the thread history as context.",
        tools: ["gmail.drafts.create"],
      },
      {
        name: "Schedule follow up",
        description: "Books a calendar reminder when a thread needs a nudge later.",
        tools: ["calendar.events.insert"],
      },
    ],
    stats: {
      author: "workmail-labs",
      installs: 18422,
      rating: 4.6,
      daysSincePublish: 214,
    },
  },
  {
    name: "Meeting Scribe",
    tagline: "Turns a calendar meeting into notes, decisions and a task list.",
    description:
      "Joins a scheduled meeting, transcribes it, then produces a structured set of notes: decisions taken, open questions, and a task list with owners. Notes are filed back onto the calendar event and posted to the channel the meeting was booked from, so the agenda and the outcome live in the same place.",
    author: "clearly",
    version: "1.9.0",
    runtime: "Python 3.14",
    license: "Apache-2.0",
    tags: ["meeting", "notes", "calendar", "agenda"],
    skills: [
      {
        name: "Capture transcript",
        description: "Records and transcribes the meeting audio stream.",
        tools: ["meet.join", "speech.transcribe"],
      },
      {
        name: "Extract decisions",
        description: "Pulls decisions and open questions out of the transcript.",
        tools: [],
      },
      {
        name: "File notes",
        description: "Attaches the notes to the calendar event and posts a summary.",
        tools: ["calendar.events.patch", "slack.postMessage"],
      },
    ],
    stats: {
      author: "clearly",
      installs: 9310,
      rating: 4.4,
      daysSincePublish: 128,
    },
  },
  {
    name: "Ticket Triage",
    tagline: "Reads every new support ticket, tags it, and answers the easy ones.",
    description:
      "Ticket Triage sits on the front of a helpdesk queue. It reads each new customer ticket, assigns a category and priority, links the matching knowledge base article, and answers directly when the knowledge base fully covers the question. Anything touching a refund, an SLA breach or an angry customer is escalated with a summary attached so the human picking it up starts informed.",
    author: "helpline",
    version: "3.1.2",
    runtime: "Node 24",
    license: "MIT",
    tags: ["support", "helpdesk", "triage", "zendesk"],
    skills: [
      {
        name: "Categorize ticket",
        description: "Assigns category, priority and product area to a new support ticket.",
        tools: ["zendesk.tickets.list"],
      },
      {
        name: "Answer from knowledge base",
        description: "Replies with a cited knowledge base answer when coverage is high.",
        tools: ["kb.search", "zendesk.tickets.comment"],
      },
      {
        name: "Escalate",
        description: "Routes refund, SLA and complaint tickets to a human with a summary.",
        tools: ["zendesk.tickets.assign"],
      },
    ],
    stats: {
      author: "helpline",
      installs: 24187,
      rating: 4.7,
      daysSincePublish: 331,
    },
  },
  {
    name: "CSAT Rescue",
    tagline: "Spots unhappy customers mid-conversation and recovers the thread.",
    description:
      "Watches live chat and ticket threads for the language that precedes a bad CSAT score — repeated follow ups, a stalled SLA, a complaint escalating in tone — and intervenes. It drafts a recovery message, offers the remedy the policy allows, and flags the account to the support lead when the conversation is past saving.",
    author: "helpline",
    version: "0.8.4",
    runtime: "Python 3.13",
    license: "BSL-1.1",
    tags: ["csat", "support", "retention", "escalation"],
    skills: [
      {
        name: "Detect frustration",
        description: "Scores an in-flight support conversation for churn risk.",
        tools: ["intercom.conversations.list"],
      },
      {
        name: "Draft recovery",
        description: "Writes an apology and remedy within the refund policy limits.",
        tools: ["intercom.reply"],
      },
    ],
    stats: {
      author: "helpline",
      installs: 3106,
      rating: 4.1,
      daysSincePublish: 61,
    },
  },
  {
    name: "SQL Analyst",
    tagline: "Answers business questions by writing and running the query itself.",
    description:
      "Ask a question in plain language and SQL Analyst finds the right tables, writes the query, runs it against the warehouse, and returns the answer with the query it used. It reads the dbt model documentation before writing anything, refuses to guess at a column it cannot find, and caps every query with a cost limit so an exploratory question cannot melt the warehouse bill.",
    author: "northwind-data",
    version: "4.0.0",
    runtime: "Python 3.14",
    license: "MIT",
    tags: ["sql", "warehouse", "bigquery", "dbt", "analytics"],
    skills: [
      {
        name: "Resolve schema",
        description: "Finds the tables and columns that answer the question from dbt docs.",
        tools: ["dbt.manifest", "bigquery.tables.list"],
      },
      {
        name: "Write query",
        description: "Generates a cost-bounded SQL query for the resolved schema.",
        tools: [],
      },
      {
        name: "Run and explain",
        description: "Executes the query and explains the result alongside the SQL used.",
        tools: ["bigquery.jobs.query"],
      },
    ],
    stats: {
      author: "northwind-data",
      installs: 31245,
      rating: 4.8,
      daysSincePublish: 402,
    },
  },
  {
    name: "Metric Watchdog",
    tagline: "Watches your KPI dashboard and explains anomalies before you notice them.",
    description:
      "Runs a forecast over every tracked metric and alerts when the observed value leaves the expected band. Each alert arrives with a first-pass explanation: which cohort moved, which dimension explains most of the variance, and whether a deploy or campaign lines up with the break. Tuned to stay quiet — a metric has to break its band twice before it pages anyone.",
    author: "northwind-data",
    version: "2.2.0",
    runtime: "Python 3.14",
    license: "Apache-2.0",
    tags: ["anomaly", "kpi", "forecast", "dashboard", "alerting"],
    skills: [
      {
        name: "Forecast metric",
        description: "Builds an expected band for each tracked KPI from history.",
        tools: ["warehouse.query"],
      },
      {
        name: "Explain variance",
        description: "Attributes an anomaly to the cohort or dimension that drove it.",
        tools: ["warehouse.query"],
      },
      {
        name: "Page on break",
        description: "Sends an alert once a metric leaves its band twice in a row.",
        tools: ["pagerduty.incidents.create"],
      },
    ],
    stats: {
      author: "northwind-data",
      installs: 7742,
      rating: 4.3,
      daysSincePublish: 176,
    },
  },
  {
    name: "PR Reviewer",
    tagline: "Reviews every pull request for correctness bugs before a human looks.",
    description:
      "Reads the diff of a pull request together with the surrounding code, then leaves inline review comments on the things that actually break: a null the caller does not handle, a migration that is not reversible, a test that asserts nothing. It ranks findings by confidence and stays silent rather than padding a review with style nits.",
    author: "octoloop",
    version: "5.3.0",
    runtime: "Node 24",
    license: "MIT",
    tags: ["code review", "github", "pull request", "static analysis"],
    skills: [
      {
        name: "Read diff",
        description: "Pulls the pull request diff and the files it touches.",
        tools: ["github.pulls.get", "github.contents.get"],
      },
      {
        name: "Find defects",
        description: "Looks for correctness bugs reachable from the changed lines.",
        tools: [],
      },
      {
        name: "Comment inline",
        description: "Posts ranked findings as inline review comments on the diff.",
        tools: ["github.pulls.createReviewComment"],
      },
    ],
    stats: {
      author: "octoloop",
      installs: 41903,
      rating: 4.5,
      daysSincePublish: 288,
    },
  },
  {
    name: "Flaky Test Hunter",
    tagline: "Finds the flaky test that broke your CI run and proposes the fix.",
    description:
      "When a CI run fails, Flaky Test Hunter re-runs the failing test in isolation, compares it against the last hundred runs on the branch, and decides whether the failure is real or flake. Real failures get a stack trace walkthrough pointing at the offending commit. Flakes get a proposed fix — usually a missing await, a shared fixture, or a clock the test never froze.",
    author: "octoloop",
    version: "1.4.7",
    runtime: "Node 24",
    license: "MIT",
    tags: ["ci", "unit test", "flaky", "debug"],
    skills: [
      {
        name: "Reproduce failure",
        description: "Re-runs the failing test suite in isolation to check for flake.",
        tools: ["ci.jobs.rerun"],
      },
      {
        name: "Bisect commit",
        description: "Walks recent commits to find where the test started failing.",
        tools: ["github.commits.list"],
      },
      {
        name: "Propose patch",
        description: "Opens a pull request with the suggested fix for the flake.",
        tools: ["github.pulls.create"],
      },
    ],
    stats: {
      author: "octoloop",
      installs: 12660,
      rating: 4.2,
      daysSincePublish: 95,
    },
  },
  {
    name: "Pipeline Prospector",
    tagline: "Researches accounts, scores them against your ICP, and files them in the CRM.",
    description:
      "Takes a target account list and researches each company — headcount, funding, tech stack, recent news — then scores it against your ideal customer profile and writes the reasoning into the CRM record. Accounts that clear the bar get a first-touch cold email drafted against the specific reason they scored well, not a template.",
    author: "revline",
    version: "2.0.3",
    runtime: "Node 24",
    license: "Proprietary",
    tags: ["sales", "prospect", "icp", "crm", "cold email"],
    skills: [
      {
        name: "Research account",
        description: "Gathers firmographics and recent news for a target company.",
        tools: ["web.search", "web.fetch"],
      },
      {
        name: "Score against ICP",
        description: "Rates the account against the ideal customer profile with reasoning.",
        tools: [],
      },
      {
        name: "Sync to CRM",
        description: "Writes the score and reasoning onto the Salesforce lead record.",
        tools: ["salesforce.records.update"],
      },
    ],
    stats: {
      author: "revline",
      installs: 6541,
      rating: 3.9,
      daysSincePublish: 143,
    },
  },
  {
    name: "Campaign Copy Studio",
    tagline: "Writes and A/B splits ad copy for a campaign brief.",
    description:
      "Turns a campaign brief into a full set of ad copy variants across channels, each written to a distinct angle rather than a reworded version of the same line. It pulls the last quarter of campaign performance to bias toward angles that worked, and sets up the A/B split so the test is actually powered.",
    author: "revline",
    version: "1.1.0",
    runtime: "Node 24",
    license: "Proprietary",
    tags: ["ad copy", "campaign", "marketing", "a/b test"],
    skills: [
      {
        name: "Generate variants",
        description: "Writes distinct ad copy angles for each channel in the brief.",
        tools: [],
      },
      {
        name: "Launch split test",
        description: "Configures a powered A/B split across the generated variants.",
        tools: ["ads.campaigns.create"],
      },
    ],
    stats: {
      author: "revline",
      installs: 4288,
      rating: 4.0,
      daysSincePublish: 72,
    },
  },
  {
    name: "Deep Research",
    tagline: "Answers open questions with a cited, source-checked report.",
    description:
      "Given an open research question, it plans a search strategy, browses the web across many sources, and writes a report where every claim carries a citation back to the page it came from. Conflicting sources are surfaced rather than averaged away, and the report says plainly where the evidence ran out.",
    author: "atlas-research",
    version: "3.6.1",
    runtime: "Python 3.14",
    license: "Apache-2.0",
    tags: ["research", "web search", "citation", "report"],
    skills: [
      {
        name: "Plan search",
        description: "Breaks the research question into a set of source queries.",
        tools: [],
      },
      {
        name: "Browse and extract",
        description: "Fetches candidate pages and pulls the passages that bear on the question.",
        tools: ["web.search", "browser.navigate", "browser.extract"],
      },
      {
        name: "Write cited report",
        description: "Drafts the report with a citation on every factual claim.",
        tools: [],
      },
    ],
    stats: {
      author: "atlas-research",
      installs: 52810,
      rating: 4.7,
      daysSincePublish: 365,
    },
  },
  {
    name: "Competitor Radar",
    tagline: "Tracks competitor pricing and product pages, and tells you what changed.",
    description:
      "Crawls a watchlist of competitor pricing, changelog and careers pages on a schedule, diffs each crawl against the last, and reports only the changes that matter — a price move, a new tier, a feature shipped, a role that signals a new team. Noise from marketing copy rewrites is filtered out.",
    author: "atlas-research",
    version: "1.7.2",
    runtime: "Python 3.13",
    license: "MIT",
    tags: ["competitor", "market research", "crawl", "monitoring"],
    skills: [
      {
        name: "Crawl watchlist",
        description: "Fetches every page on the competitor watchlist on schedule.",
        tools: ["browser.navigate", "web.fetch"],
      },
      {
        name: "Diff and filter",
        description: "Diffs against the previous crawl and drops cosmetic changes.",
        tools: [],
      },
    ],
    stats: {
      author: "atlas-research",
      installs: 8974,
      rating: 4.2,
      daysSincePublish: 198,
    },
  },
  {
    name: "Invoice Reconciler",
    tagline: "Matches every incoming invoice to a purchase order and flags the gaps.",
    description:
      "Reads incoming supplier invoices, extracts line items, and reconciles them against the matching purchase order and goods receipt. Three-way matches are posted to the ledger automatically; anything with a price, quantity or vendor mismatch is held with a note naming the exact discrepancy so accounts payable does not have to re-read the PDF.",
    author: "ledgerworks",
    version: "2.5.0",
    runtime: "Python 3.14",
    license: "Proprietary",
    tags: ["invoice", "purchase order", "reconciliation", "accounting"],
    skills: [
      {
        name: "Extract line items",
        description: "Parses an invoice PDF into structured line items.",
        tools: ["ocr.extract"],
      },
      {
        name: "Three-way match",
        description: "Reconciles the invoice against its purchase order and receipt.",
        tools: ["erp.purchaseOrders.get"],
      },
      {
        name: "Post to ledger",
        description: "Posts a clean match to the ledger, or holds it with a discrepancy note.",
        tools: ["erp.ledger.post"],
      },
    ],
    stats: {
      author: "ledgerworks",
      installs: 11207,
      rating: 4.4,
      daysSincePublish: 251,
    },
  },
  {
    name: "Spend Guard",
    tagline: "Reviews expense claims against policy and approves the clean ones.",
    description:
      "Reads each submitted expense claim and its receipt, checks it against the written travel and expense policy, and approves anything that clearly complies. Claims that miss a receipt, exceed a per-diem cap or fall in a grey area are routed to a manager with the specific policy clause quoted, so the approver decides rather than re-investigates.",
    author: "ledgerworks",
    version: "1.3.1",
    runtime: "Node 24",
    license: "Proprietary",
    tags: ["expense", "policy", "approval", "receipt"],
    skills: [
      {
        name: "Read receipt",
        description: "Extracts merchant, amount and date from an uploaded receipt.",
        tools: ["ocr.extract"],
      },
      {
        name: "Check policy",
        description: "Tests the claim against the expense policy and per-diem caps.",
        tools: ["policy.lookup"],
      },
    ],
    stats: {
      author: "ledgerworks",
      installs: 5390,
      rating: 4.1,
      daysSincePublish: 110,
    },
  },
  {
    name: "CVE Triage",
    tagline: "Decides whether a new CVE actually reaches your code.",
    description:
      "When a vulnerability lands in a dependency, CVE Triage checks whether the vulnerable function is reachable from your application at all, rates the real exposure, and drafts the upgrade pull request when one exists. Advisories that cannot reach your code are closed with the reachability trace attached, which is what stops a security backlog from becoming noise.",
    author: "bastion",
    version: "3.0.4",
    runtime: "Python 3.14",
    license: "Apache-2.0",
    tags: ["cve", "vulnerability", "dependencies", "security"],
    skills: [
      {
        name: "Check reachability",
        description: "Traces whether the vulnerable function is callable from the app.",
        tools: ["sca.scan", "github.contents.get"],
      },
      {
        name: "Rate exposure",
        description: "Scores real-world exposure from reachability and deployment surface.",
        tools: [],
      },
      {
        name: "Draft upgrade",
        description: "Opens the dependency upgrade pull request when a fix exists.",
        tools: ["github.pulls.create"],
      },
    ],
    stats: {
      author: "bastion",
      installs: 16033,
      rating: 4.6,
      daysSincePublish: 305,
    },
  },
  {
    name: "Access Reviewer",
    tagline: "Runs quarterly access reviews and revokes what nobody uses.",
    description:
      "Collects every identity and role grant across your systems, cross-references them against actual usage over the last quarter, and builds the access review packet for each manager. Grants that were never exercised come pre-marked for revocation, and the whole run produces the audit evidence a SOC 2 review asks for.",
    author: "bastion",
    version: "1.2.0",
    runtime: "Python 3.13",
    license: "Proprietary",
    tags: ["access review", "iam", "soc 2", "audit", "compliance"],
    skills: [
      {
        name: "Collect grants",
        description: "Pulls identity and role grants from every connected system.",
        tools: ["iam.grants.list"],
      },
      {
        name: "Build review packet",
        description: "Assembles a per-manager access review with unused grants flagged.",
        tools: ["iam.usage.query"],
      },
    ],
    stats: {
      author: "bastion",
      installs: 4102,
      rating: 4.0,
      daysSincePublish: 88,
    },
  },
  {
    name: "Longform Writer",
    tagline: "Turns an outline into a publishable article in your brand voice.",
    description:
      "Takes an outline and a brand voice guide and writes the full article — structure held, transitions written, no filler paragraph restating the introduction. It matches tone of voice against your published back catalogue rather than a generic style prompt, and returns the draft with the sections it is least confident about marked for review.",
    author: "quillhouse",
    version: "2.1.5",
    runtime: "Node 24",
    license: "MIT",
    tags: ["writing", "blog", "brand", "tone of voice"],
    skills: [
      {
        name: "Match brand voice",
        description: "Derives a voice profile from previously published articles.",
        tools: ["cms.posts.list"],
      },
      {
        name: "Write draft",
        description: "Expands the outline into a full article with confidence markers.",
        tools: [],
      },
      {
        name: "Publish to CMS",
        description: "Files the finished draft into the content management system.",
        tools: ["cms.posts.create"],
      },
    ],
    stats: {
      author: "quillhouse",
      installs: 20114,
      rating: 4.3,
      daysSincePublish: 224,
    },
  },
  {
    name: "Subtitle Forge",
    tagline: "Transcribes, translates and burns subtitles for a video library.",
    description:
      "Processes a video library end to end: transcribes the audio, cleans up the transcript into readable caption lines, translates into the target languages, and writes the subtitle tracks back onto the video. Timing is checked against speech boundaries so captions do not split mid-sentence.",
    author: "quillhouse",
    version: "0.9.2",
    runtime: "Python 3.14",
    license: "MIT",
    tags: ["video", "caption", "translation", "transcript"],
    skills: [
      {
        name: "Transcribe audio",
        description: "Produces a timed transcript from the video audio track.",
        tools: ["speech.transcribe"],
      },
      {
        name: "Translate captions",
        description: "Translates the caption lines into each target language.",
        tools: ["translate.text"],
      },
    ],
    stats: {
      author: "quillhouse",
      installs: 3877,
      rating: 3.8,
      daysSincePublish: 54,
    },
  },
  {
    name: "Workflow Healer",
    tagline: "Detects a broken automation, finds the cause, and repairs it.",
    description:
      "Monitors your running automations for the signature of a break — a webhook that stopped firing, a step whose success rate collapsed, an integration whose schema changed underneath it. It reproduces the failure against the live integration, patches the step, and reruns the failed jobs from the last good checkpoint. Every repair is logged with a before and after so the change is reviewable.",
    author: "loopmend",
    version: "0.6.0",
    runtime: "Node 24",
    license: "Apache-2.0",
    tags: ["self-healing", "automation", "webhook", "retry", "orchestration"],
    skills: [
      {
        name: "Detect break",
        description: "Watches step success rates and webhook delivery for a collapse.",
        tools: ["workflow.runs.list"],
      },
      {
        name: "Diagnose cause",
        description: "Reproduces the failing step against the live integration schema.",
        tools: ["workflow.steps.run"],
      },
      {
        name: "Patch and replay",
        description: "Repairs the step and replays failed jobs from the last checkpoint.",
        tools: ["workflow.steps.patch", "workflow.runs.replay"],
      },
    ],
    stats: {
      author: "loopmend",
      installs: 2455,
      rating: 4.5,
      daysSincePublish: 27,
    },
  },
  {
    name: "Integration Sync",
    tagline: "Keeps records in sync across systems and resolves the conflicts.",
    description:
      "Runs a two-way sync between systems that disagree about what a record looks like. It maps fields, detects conflicting edits on both sides, and applies the resolution policy you configured rather than silently letting the last write win. Failed syncs are queued with backoff and surfaced once they stop being transient.",
    author: "loopmend",
    version: "2.8.1",
    runtime: "Node 24",
    license: "MIT",
    tags: ["sync", "integration", "webhook", "queue"],
    skills: [
      {
        name: "Map fields",
        description: "Builds and maintains the field mapping between two systems.",
        tools: ["schema.introspect"],
      },
      {
        name: "Resolve conflicts",
        description: "Applies the configured resolution policy to conflicting edits.",
        tools: [],
      },
      {
        name: "Retry with backoff",
        description: "Queues failed syncs and escalates once they stop being transient.",
        tools: ["queue.enqueue"],
      },
    ],
    stats: {
      author: "loopmend",
      installs: 13908,
      rating: 4.2,
      daysSincePublish: 189,
    },
  },
];

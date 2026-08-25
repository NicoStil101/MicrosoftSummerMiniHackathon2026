import Link from "next/link";
import { AgentGrid } from "@/components/agent-grid";
import { CATEGORIES } from "@/lib/categories";
import { getAllAgents, getCategoryCounts } from "@/lib/store";
import { popularQueries } from "@/lib/search";
import { formatInstalls } from "@/lib/format";

export default function HomePage() {
  const agents = getAllAgents();
  const counts = getCategoryCounts();
  const skillCount = agents.reduce((sum, agent) => sum + agent.skills.length, 0);
  const installTotal = agents.reduce((sum, agent) => sum + agent.installs, 0);

  const featured = [...agents]
    .sort((a, b) => b.installs - a.installs)
    .slice(0, 6)
    .map((agent) => ({ agent }));

  const newest = [...agents]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 3)
    .map((agent) => ({ agent }));

  const populated = CATEGORIES.filter((c) => (counts[c.id] ?? 0) > 0);

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Agent bazaar
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Publish an agent. It lands in the right category on its own.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Upload an agent together with the skills it ships, search the whole
            catalogue by what an agent can actually do, and watch eval scores
            tell you which ones still work in production.
          </p>

          <form action="/agents" className="mt-9 flex max-w-2xl gap-2">
            <input
              type="search"
              name="q"
              placeholder="Search agents, skills, tools or authors…"
              aria-label="Search agents"
              className="min-w-0 flex-1 rounded border border-line bg-background px-4 py-3.5 text-[15px] placeholder:text-subtle focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="rounded bg-accent px-5 py-3.5 font-medium text-white hover:bg-accent-hover transition-colors"
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-subtle">Try</span>
            {popularQueries().map((query) => (
              <Link
                key={query}
                href={`/agents?q=${encodeURIComponent(query)}`}
                className="rounded border border-line bg-background px-3 py-1 text-xs text-muted transition-colors hover:border-line-strong hover:text-foreground"
              >
                {query}
              </Link>
            ))}
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6">
            <Stat label="Agents published" value={String(agents.length)} />
            <Stat label="Skills indexed" value={String(skillCount)} />
            <Stat label="Total installs" value={formatInstalls(installTotal)} />
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          title="Browse by category"
          action={{ href: "/categories", label: "All categories" }}
        >
          Every upload is classified from its name, tagline, tags and skills.
        </SectionHeading>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {populated.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group rounded border border-line bg-surface p-5 transition-colors hover:border-line-strong hover:bg-surface-raised"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-subtle">
                  {counts[category.id]}
                </span>
              </div>
              <h3 className="mt-3 font-medium tracking-tight group-hover:text-accent">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <SectionHeading
          title="Most installed"
          action={{ href: "/agents?sort=installs", label: "See all" }}
        >
          What teams are actually running today.
        </SectionHeading>
        <div className="mt-6">
          <AgentGrid agents={featured} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <SectionHeading
          title="Just published"
          action={{ href: "/agents?sort=newest", label: "See all" }}
        >
          Fresh uploads, newest first.
        </SectionHeading>
        <div className="mt-6">
          <AgentGrid agents={newest} />
        </div>

        <div className="mt-10 rounded border border-line bg-surface p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h3 className="font-medium tracking-tight">
              Have an agent to share?
            </h3>
            <p className="mt-1 text-sm text-muted">
              Drop in a manifest or fill the form — the category is picked for
              you, and you can override it.
            </p>
          </div>
          <Link
            href="/upload"
            className="mt-4 inline-block rounded bg-accent px-5 py-2.5 font-medium text-white hover:bg-accent-hover transition-colors sm:mt-0 sm:shrink-0"
          >
            Upload an agent
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-subtle">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </dd>
    </div>
  );
}

function SectionHeading({
  title,
  children,
  action,
}: {
  title: string;
  children?: React.ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {children && <p className="mt-1 text-sm text-muted">{children}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="shrink-0 text-sm text-accent-soft hover:underline"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

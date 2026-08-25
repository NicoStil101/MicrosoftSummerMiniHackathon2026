import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentGrid } from "@/components/agent-grid";
import { CategoryBadge, HealthBadge, Tag } from "@/components/badges";
import { ExportManifest } from "@/components/export-manifest";
import { getCategory } from "@/lib/categories";
import { formatInstalls, formatRating, timeAgo } from "@/lib/format";
import { getAgentBySlug, getAgentsByCategory } from "@/lib/store";

export async function generateMetadata({
  params,
}: PageProps<"/agents/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAgentBySlug(slug);
  if (!agent) return { title: "Agent not found" };
  return { title: agent.name, description: agent.tagline };
}

export default async function AgentPage({
  params,
  searchParams,
}: PageProps<"/agents/[slug]">) {
  const { slug } = await params;
  const query = await searchParams;
  const agent = getAgentBySlug(slug);
  if (!agent) notFound();

  const category = getCategory(agent.category);
  const related = getAgentsByCategory(agent.category)
    .filter((other) => other.slug !== agent.slug)
    .slice(0, 3)
    .map((other) => ({ agent: other }));

  const justPublished = query.published === "1";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      {justPublished && (
        <div className="mb-8 border-l-4 border-ok bg-ok-bg px-5 py-4">
          <p className="font-semibold">
            {agent.name} is live in the marketplace.
          </p>
          <p className="mt-1 text-sm text-muted">
            {agent.categorySource === "auto"
              ? `Filed under ${category.name} by the classifier (${Math.round(agent.categoryConfidence * 100)}% confidence). Publish an update to change it.`
              : `Filed under ${category.name}, as you selected.`}
          </p>
        </div>
      )}

      <nav className="mb-6 flex items-center gap-2 text-sm text-subtle">
        <Link href="/agents" className="hover:text-foreground">
          Agents
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/categories/${category.id}`}
          className="hover:text-foreground"
        >
          {category.name}
        </Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <header>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                {agent.name}
              </h1>
              <HealthBadge health={agent.health} />
            </div>
            <p className="mt-2 font-mono text-sm text-subtle">
              {agent.author} · v{agent.version} · {agent.runtime}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {agent.tagline}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <CategoryBadge category={agent.category} />
              {agent.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          </header>

          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
              About
            </h2>
            <p className="mt-3 leading-relaxed text-muted">{agent.description}</p>
          </section>

          <section className="mt-10">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
                Skills
              </h2>
              <span className="text-xs text-subtle">
                {agent.skills.length} shipped with this agent
              </span>
            </div>
            <ol className="mt-4 space-y-3">
              {agent.skills.map((skill, index) => (
                <li
                  key={skill.id}
                  className="rounded border border-line bg-surface p-5"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-subtle">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-medium tracking-tight">{skill.name}</h3>
                  </div>
                  <p className="mt-2 pl-8 text-sm leading-relaxed text-muted">
                    {skill.description}
                  </p>
                  {skill.tools.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 pl-8">
                      <span className="text-xs text-subtle">Calls</span>
                      {skill.tools.map((tool) => (
                        <code
                          key={tool}
                          className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-xs text-accent-soft ring-1 ring-inset ring-line"
                        >
                          {tool}
                        </code>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
                Also in {category.name}
              </h2>
              <div className="mt-4">
                <AgentGrid agents={related} />
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <ExportManifest agent={agent} />

          <div className="rounded border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
              Health
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted">Eval pass rate</span>
                  <span className="font-mono text-sm tabular-nums">
                    {agent.evalScore > 0 ? `${agent.evalScore}%` : "—"}
                  </span>
                </div>
                <div
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-raised"
                  role="img"
                  aria-label={`Eval pass rate ${agent.evalScore} percent`}
                >
                  <div
                    className={`h-full rounded-full ${
                      agent.evalScore >= 90
                        ? "bg-ok"
                        : agent.evalScore >= 75
                          ? "bg-warn"
                          : "bg-bad"
                    }`}
                    style={{ width: `${agent.evalScore}%` }}
                  />
                </div>
              </div>
              <Row label="Last evaluated" value={timeAgo(agent.lastEvaluatedAt)} />
              <Row label="Published" value={timeAgo(agent.createdAt)} />
            </div>
          </div>

          <div className="rounded border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
              Details
            </h2>
            <div className="mt-4 space-y-4">
              <Row label="Installs" value={formatInstalls(agent.installs)} />
              <Row label="Rating" value={`★ ${formatRating(agent.rating)}`} />
              <Row label="Runtime" value={agent.runtime} />
              <Row label="License" value={agent.license} />
              <Row
                label="Category"
                value={
                  agent.categorySource === "auto"
                    ? `${category.name} · auto ${Math.round(agent.categoryConfidence * 100)}%`
                    : `${category.name} · set by author`
                }
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

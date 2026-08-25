import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/comment-section";
import { BenchmarkPanel } from "@/components/benchmark-panel";
import { DownloadAgent } from "@/components/download-agent";
import { getCategory } from "@/lib/categories";
import { formatInstalls, formatRating } from "@/lib/format";
import { getAgentBySlug, getComments } from "@/lib/store";

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

  const comments = getComments(agent.slug);
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
            <h1 className="text-3xl font-semibold tracking-tight">
              {agent.name}
            </h1>
            <p className="mt-2 text-lg text-muted">
              ★ {formatRating(agent.rating)}
            </p>
          </header>

          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
              About
            </h2>
            <p className="mt-3 leading-relaxed text-muted">{agent.description}</p>
          </section>

          <CommentSection agentSlug={agent.slug} comments={comments} />

        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <DownloadAgent agent={agent} />

          <BenchmarkPanel
            slug={agent.slug}
            category={agent.category}
            scores={agent.kpiScores}
          />

          <div className="rounded border border-line bg-surface p-5">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
                Skills
              </h2>
              <span className="text-xs text-subtle">{agent.skills.length}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {agent.skills.map((skill) => (
                <li key={skill.id} className="flex flex-wrap gap-1.5">
                  <code className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-xs text-accent-soft ring-1 ring-inset ring-line">
                    {skill.name}
                  </code>
                  {skill.tools.map((tool) => (
                    <code
                      key={tool}
                      className="rounded px-1.5 py-0.5 font-mono text-xs text-subtle ring-1 ring-inset ring-line"
                    >
                      {tool}
                    </code>
                  ))}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded border border-line bg-surface p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
              Details
            </h2>
            <div className="mt-4 space-y-4">
              <Row label="Author" value={agent.author} />
              <Row label="Installs" value={formatInstalls(agent.installs)} />
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

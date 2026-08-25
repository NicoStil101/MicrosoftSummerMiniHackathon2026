import Link from "next/link";
import { getCategory } from "@/lib/categories";
import { formatInstalls } from "@/lib/format";
import type { Agent } from "@/lib/types";

export function AgentCard({
  agent,
  matchedSkills = [],
}: {
  agent: Agent;
  matchedSkills?: string[];
}) {
  const category = getCategory(agent.category);

  return (
    <Link
      href={`/agents/${agent.slug}`}
      className="group flex flex-col border border-line bg-background p-5 transition-shadow hover:shadow-[0_1.6px_3.6px_rgba(0,0,0,0.13),0_0.3px_0.9px_rgba(0,0,0,0.1)]"
    >
      <h3 className="text-[15px] leading-snug group-hover:underline">
        {agent.name}
      </h3>

      <p className="mt-2 text-[13px] text-muted">{category.name}</p>

      <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-muted">
        {agent.tagline}
      </p>

      {matchedSkills.length > 0 && (
        <p className="mt-3 line-clamp-2 text-[13px] text-subtle">
          Matched: {matchedSkills.join(", ")}
        </p>
      )}

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between border-t border-line pt-3 text-[13px]">
          <span className="text-accent-soft">View details</span>
          <span className="text-subtle">
            {formatInstalls(agent.installs)} installs
          </span>
        </div>
      </div>
    </Link>
  );
}

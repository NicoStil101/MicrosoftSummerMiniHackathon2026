import { AgentCard } from "@/components/agent-card";
import type { Agent } from "@/lib/types";

export function AgentGrid({
  agents,
}: {
  agents: Array<{ agent: Agent; matchedSkills?: string[] }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {agents.map(({ agent, matchedSkills }) => (
        <AgentCard key={agent.id} agent={agent} matchedSkills={matchedSkills} />
      ))}
    </div>
  );
}

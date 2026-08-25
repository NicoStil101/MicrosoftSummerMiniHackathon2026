"use client";

import { serializeAgentMd } from "@/lib/agent-md";
import type { Agent } from "@/lib/types";

export function DownloadAgent({ agent }: { agent: Agent }) {
  function download() {
    const blob = new Blob([serializeAgentMd(agent)], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${agent.slug}.agent.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      className="w-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
    >
      Download agent.md
    </button>
  );
}

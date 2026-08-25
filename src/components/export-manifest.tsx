"use client";

import { useEffect, useState } from "react";
import type { Agent } from "@/lib/types";

/** The manifest shape the upload page accepts back — export here, import there. */
function toManifest(agent: Agent) {
  return {
    name: agent.name,
    tagline: agent.tagline,
    description: agent.description,
    author: agent.author,
    version: agent.version,
    runtime: agent.runtime,
    license: agent.license,
    category: agent.category,
    tags: agent.tags,
    skills: agent.skills.map((skill) => ({
      name: skill.name,
      description: skill.description,
      tools: skill.tools,
    })),
  };
}

export function ExportManifest({ agent }: { agent: Agent }) {
  const [copied, setCopied] = useState(false);
  const command = `npx agentx install ${agent.slug}@${agent.version}`;

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function download() {
    const blob = new Blob([JSON.stringify(toManifest(agent), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${agent.slug}.agent.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded border border-line bg-surface p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
        Install
      </h2>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-line bg-background px-3 py-2.5">
        <code className="min-w-0 flex-1 truncate font-mono text-xs text-muted">
          {command}
        </code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded px-1.5 py-0.5 text-xs text-subtle transition-colors hover:text-foreground"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <button
        type="button"
        onClick={download}
        className="mt-3 w-full rounded-lg border border-line px-4 py-2.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-foreground"
      >
        Export manifest (.json)
      </button>
      <p className="mt-2 text-xs leading-relaxed text-subtle">
        The exported file imports straight back into the upload form, skills
        included.
      </p>
    </div>
  );
}

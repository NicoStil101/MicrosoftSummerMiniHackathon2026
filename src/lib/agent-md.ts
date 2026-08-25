import type { Agent, Skill } from "./types";

/**
 * The `agent.md` interchange format. An agent page exports it and the publish
 * form parses it back, so the two halves have to agree on this shape:
 *
 *   # Name
 *   > Tagline
 *
 *   Description…
 *
 *   ## Skills
 *   ### Skill name
 *   Skill description
 *   Tools: `a.b`, `c.d`
 */

export interface ParsedAgentMd {
  name: string;
  tagline: string;
  description: string;
  skills: Array<Omit<Skill, "id">>;
  /** A "Tools:" line before any `###` heading — how a lone skill file writes it. */
  tools: string[];
}

function toolLine(tools: string[]): string {
  return tools.length > 0
    ? `\nTools: ${tools.map((tool) => `\`${tool}\``).join(", ")}\n`
    : "";
}

export function serializeAgentMd(agent: Agent): string {
  const skills = agent.skills
    .map(
      (skill) =>
        `### ${skill.name}\n\n${skill.description}\n${toolLine(skill.tools)}`,
    )
    .join("\n");

  return [
    `# ${agent.name}`,
    "",
    `> ${agent.tagline}`,
    "",
    agent.description,
    "",
    "## Skills",
    "",
    skills || "_No skills declared._",
    "",
  ].join("\n");
}

/** Pulls `a.b`, `c.d` out of a "Tools:" line. */
function parseTools(line: string): string[] {
  const body = line.replace(/^\s*tools\s*:/i, "");
  const ticked = [...body.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
  if (ticked.length > 0) return ticked;
  return body
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function parseAgentMd(source: string): ParsedAgentMd {
  const lines = source.replace(/\r\n/g, "\n").split("\n");

  let name = "";
  let tagline = "";
  const descriptionLines: string[] = [];
  const skills: Array<Omit<Skill, "id">> = [];
  let headTools: string[] = [];

  let section: "head" | "skills" = "head";
  let current: { name: string; description: string[]; tools: string[] } | null =
    null;

  function flush() {
    if (!current) return;
    skills.push({
      name: current.name,
      description: current.description.join(" ").trim(),
      tools: current.tools,
    });
    current = null;
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^#\s+/.test(trimmed)) {
      name = trimmed.replace(/^#\s+/, "").trim();
      continue;
    }
    if (/^##\s+skills\s*$/i.test(trimmed)) {
      section = "skills";
      continue;
    }
    if (/^###\s+/.test(trimmed)) {
      flush();
      section = "skills";
      current = {
        name: trimmed.replace(/^###\s+/, "").trim(),
        description: [],
        tools: [],
      };
      continue;
    }
    if (/^>\s?/.test(trimmed) && !tagline) {
      tagline = trimmed.replace(/^>\s?/, "").trim();
      continue;
    }
    if (/^\s*tools\s*:/i.test(trimmed)) {
      if (current) current.tools = parseTools(trimmed);
      else headTools = parseTools(trimmed);
      continue;
    }
    if (!trimmed) continue;

    if (section === "skills" && current) current.description.push(trimmed);
    else if (section === "head") descriptionLines.push(trimmed);
  }
  flush();

  return {
    name,
    tagline,
    description: descriptionLines.join(" ").trim(),
    skills: skills.filter((skill) => skill.name),
    tools: headTools,
  };
}

/**
 * Turns one file from an uploaded skill folder into a skill. The heading wins
 * for the name; the filename is the fallback for a file with no heading.
 */
export function parseSkillFile(
  fileName: string,
  source: string,
): Omit<Skill, "id"> {
  const parsed = parseAgentMd(source);
  const fromHeading = parsed.name || parsed.skills[0]?.name;

  const fallback = fileName
    .replace(/\.(md|markdown|txt)$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();

  return {
    name: fromHeading || fallback || "Untitled skill",
    description: parsed.description || parsed.skills[0]?.description || "",
    tools: parsed.tools.length > 0 ? parsed.tools : (parsed.skills[0]?.tools ?? []),
  };
}

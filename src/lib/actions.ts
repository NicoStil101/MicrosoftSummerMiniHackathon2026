"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addComment, getAgentBySlug, publishAgent } from "./store";
import type { AgentDraft, CategoryId } from "./types";
import { CATEGORIES } from "./categories";
import type { UploadState } from "./upload-state";
import type { CommentState } from "./comment-state";

const VALID_CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id));

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export async function uploadAgent(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const text = (key: string) => String(formData.get(key) ?? "").trim();

  const values = {
    name: text("name"),
    tagline: text("tagline"),
    description: text("description"),
    author: text("author") || "community",
    version: text("version") || "0.1.0",
    runtime: text("runtime") || "Node 24",
    license: text("license") || "MIT",
    tags: text("tags"),
    category: text("category") || "auto",
  };

  const skillNames = formData.getAll("skillName").map((v) => String(v).trim());
  const skillDescriptions = formData
    .getAll("skillDescription")
    .map((v) => String(v).trim());
  const skillTools = formData.getAll("skillTools").map((v) => String(v).trim());

  const skills = skillNames
    .map((name, i) => ({
      name,
      description: skillDescriptions[i] ?? "",
      tools: splitList(skillTools[i] ?? ""),
    }))
    .filter((skill) => skill.name.length > 0);

  const errors: Record<string, string> = {};
  if (!values.name) errors.name = "Give the agent a name.";
  if (!values.tagline) errors.tagline = "One line on what it does.";
  if (values.tagline.length > 160) errors.tagline = "Keep the tagline under 160 characters.";
  if (values.description.length < 40) {
    errors.description = "Describe the agent in at least 40 characters — the classifier reads this.";
  }
  if (values.category !== "auto" && !VALID_CATEGORY_IDS.has(values.category)) {
    errors.category = "Unknown category.";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  const draft: AgentDraft = {
    name: values.name,
    tagline: values.tagline,
    description: values.description,
    author: values.author,
    version: values.version,
    runtime: values.runtime,
    license: values.license,
    tags: splitList(values.tags),
    skills,
    category: values.category === "auto" ? "auto" : (values.category as CategoryId),
  };

  const agent = publishAgent(draft);

  // Every listing — home, categories index and the prerendered category
  // pages — reflects the catalogue, so purge the whole tree.
  revalidatePath("/", "layout");

  redirect(`/agents/${agent.slug}?published=1`);
}

export async function postComment(
  _prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const agentSlug = String(formData.get("agentSlug") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  const errors: Record<string, string> = {};
  if (!getAgentBySlug(agentSlug)) errors.body = "That agent no longer exists.";
  if (!author) errors.author = "Add a name to post under.";
  if (author.length > 40) errors.author = "Keep the name under 40 characters.";
  if (!body) errors.body = "Write something first.";
  if (body.length > 1000) errors.body = "Keep the comment under 1000 characters.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }

  addComment({ agentSlug, author, body });
  revalidatePath(`/agents/${agentSlug}`);

  return { status: "posted", errors: {} };
}

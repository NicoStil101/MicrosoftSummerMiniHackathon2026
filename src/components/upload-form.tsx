"use client";

import { Fragment, useActionState, useState } from "react";
import { uploadAgent } from "@/lib/actions";
import { EMPTY_UPLOAD_STATE } from "@/lib/upload-state";
import { parseAgentMd, parseSkillFile } from "@/lib/agent-md";
import type { Skill } from "@/lib/types";

type DraftSkill = Omit<Skill, "id">;

interface Draft {
  name: string;
  tagline: string;
  description: string;
  skills: DraftSkill[];
}

const EMPTY: Draft = { name: "", tagline: "", description: "", skills: [] };

const SKILL_FILE = /\.(md|markdown|txt)$/i;

export function UploadForm() {
  const [state, formAction, isPending] = useActionState(
    uploadAgent,
    EMPTY_UPLOAD_STATE,
  );
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [agentFile, setAgentFile] = useState<string | null>(null);
  const [skillNote, setSkillNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadAgentMd(file: File) {
    const parsed = parseAgentMd(await file.text());
    if (!parsed.name) {
      setError(
        `${file.name} has no "# Agent name" heading, so there is nothing to publish.`,
      );
      return;
    }
    setError(null);
    setAgentFile(file.name);
    setDraft((prev) => ({
      name: parsed.name,
      tagline: parsed.tagline,
      description: parsed.description,
      // Skills from a folder upload win; the file's own skills are the default.
      skills: prev.skills.length > 0 ? prev.skills : parsed.skills,
    }));
  }

  async function loadSkillFolder(files: FileList) {
    const markdown = [...files].filter((file) => SKILL_FILE.test(file.name));
    if (markdown.length === 0) {
      setSkillNote(null);
      setError("That folder has no .md files, so no skills were read.");
      return;
    }
    const skills = await Promise.all(
      markdown.map(async (file) => parseSkillFile(file.name, await file.text())),
    );
    setError(null);
    setSkillNote(
      `${skills.length} skill${skills.length === 1 ? "" : "s"} read from ${markdown.length} file${markdown.length === 1 ? "" : "s"}.`,
    );
    setDraft((prev) => ({ ...prev, skills }));
  }

  const ready = draft.name.length > 0;

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <UploadRow
        label="Agent file"
        hint="A single agent.md — its heading, quoted tagline and body become the listing."
        buttonLabel={agentFile ? "Replace agent.md" : "Upload agent.md"}
        accept=".md,.markdown,text/markdown"
        onFiles={(files) => {
          const file = files[0];
          if (file) void loadAgentMd(file);
        }}
        status={agentFile}
      />

      <UploadRow
        label="Skills"
        hint="A folder of skill files. Every .md inside becomes one skill."
        buttonLabel={draft.skills.length > 0 ? "Replace skill folder" : "Upload skill folder"}
        directory
        onFiles={(files) => void loadSkillFolder(files)}
        status={skillNote}
      />

      {error && (
        <p className="text-[13px] text-bad" role="alert">
          {error}
        </p>
      )}

      {ready && (
        <div className="border border-line bg-surface p-4">
          <p className="text-[13px] font-semibold">{draft.name}</p>
          {draft.tagline && (
            <p className="mt-1 text-[13px] text-muted">{draft.tagline}</p>
          )}
          <p className="mt-2 text-xs text-subtle">
            {draft.skills.length} skill{draft.skills.length === 1 ? "" : "s"} ·{" "}
            {draft.description.length} characters of description
          </p>
        </div>
      )}

      {/* The parsed file is what gets published; there are no typed fields. */}
      <input type="hidden" name="name" value={draft.name} />
      <input type="hidden" name="tagline" value={draft.tagline} />
      <input type="hidden" name="description" value={draft.description} />
      {draft.skills.map((skill, index) => (
        <Fragment key={index}>
          <input type="hidden" name="skillName" value={skill.name} />
          <input type="hidden" name="skillDescription" value={skill.description} />
          <input type="hidden" name="skillTools" value={skill.tools.join(", ")} />
        </Fragment>
      ))}

      <div>
        <button
          type="submit"
          disabled={isPending || !ready}
          className="bg-accent px-5 py-3 font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
        >
          {isPending ? "Publishing…" : "Publish to marketplace"}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-subtle">
          The category is picked automatically from what the file says.
        </p>
        {Object.values(state.errors).map((message) => (
          <p key={message} className="mt-1.5 text-xs text-bad">
            {message}
          </p>
        ))}
      </div>
    </form>
  );
}

function UploadRow({
  label,
  hint,
  buttonLabel,
  accept,
  directory,
  onFiles,
  status,
}: {
  label: string;
  hint: string;
  buttonLabel: string;
  accept?: string;
  directory?: boolean;
  onFiles: (files: FileList) => void;
  status: string | null;
}) {
  return (
    <div className="border border-line bg-surface p-5">
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-subtle">{hint}</p>
      <label className="mt-3 inline-block cursor-pointer border border-line-strong bg-background px-4 py-2 text-[13px] transition-colors hover:border-accent hover:text-accent-soft">
        {buttonLabel}
        <input
          type="file"
          className="sr-only"
          accept={accept}
          multiple={directory}
          // Folder picking is a non-standard attribute React passes straight through.
          {...(directory ? { webkitdirectory: "", directory: "" } : {})}
          onChange={(event) => {
            const files = event.target.files;
            if (files && files.length > 0) onFiles(files);
          }}
        />
      </label>
      {status && (
        <p className="mt-2 text-xs text-accent-soft" role="status">
          {status}
        </p>
      )}
    </div>
  );
}

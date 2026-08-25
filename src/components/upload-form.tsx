"use client";

import { Fragment, useActionState, useState } from "react";
import { uploadAgent } from "@/lib/actions";
import { EMPTY_UPLOAD_STATE } from "@/lib/upload-state";

interface SkillField {
  name: string;
  description: string;
  tools: string;
}

interface FormState {
  name: string;
  tagline: string;
  description: string;
  /** Carried through from an imported manifest — no longer hand-entered. */
  author: string;
  version: string;
  runtime: string;
  license: string;
  tags: string;
  skills: SkillField[];
}

const INITIAL: FormState = {
  name: "",
  tagline: "",
  description: "",
  author: "",
  version: "",
  runtime: "",
  license: "",
  tags: "",
  skills: [],
};

export function UploadForm() {
  const [state, formAction, isPending] = useActionState(
    uploadAgent,
    EMPTY_UPLOAD_STATE,
  );
  const [form, setForm] = useState<FormState>(INITIAL);
  const [importNote, setImportNote] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function importManifest(file: File) {
    try {
      const parsed = JSON.parse(await file.text()) as Record<string, unknown>;
      const skills = Array.isArray(parsed.skills)
        ? (parsed.skills as Array<Record<string, unknown>>).map((skill) => ({
            name: String(skill.name ?? ""),
            description: String(skill.description ?? ""),
            tools: Array.isArray(skill.tools) ? skill.tools.join(", ") : "",
          }))
        : [];

      setForm((prev) => ({
        ...prev,
        name: String(parsed.name ?? prev.name),
        tagline: String(parsed.tagline ?? prev.tagline),
        description: String(parsed.description ?? prev.description),
        author: String(parsed.author ?? prev.author),
        version: String(parsed.version ?? prev.version),
        runtime: String(parsed.runtime ?? prev.runtime),
        license: String(parsed.license ?? prev.license),
        tags: Array.isArray(parsed.tags) ? parsed.tags.join(", ") : prev.tags,
        skills: skills.length > 0 ? skills : prev.skills,
      }));
      setImportNote(
        `Imported ${file.name}${skills.length > 0 ? ` with ${skills.length} skill${skills.length === 1 ? "" : "s"}` : ""}. Review it, then publish.`,
      );
    } catch {
      setImportNote(`${file.name} isn't valid JSON — fill the form in by hand.`);
    }
  }

  return (
    <form action={formAction} className="max-w-3xl space-y-10">
      <section
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) void importManifest(file);
        }}
        className={`rounded border border-dashed p-8 text-center transition-colors ${
          dragging ? "border-accent bg-accent/10" : "border-line-strong bg-surface"
        }`}
      >
        <p className="text-sm font-medium">Drop an agent manifest to start</p>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-subtle">
          A <code className="font-mono">.json</code> file exported from any agent
          page. Everything below gets filled in, skills included.
        </p>
        <label className="mt-4 inline-block cursor-pointer rounded border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-line-strong hover:text-foreground">
          Choose file
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importManifest(file);
            }}
          />
        </label>
        {importNote && (
          <p className="mt-3 text-xs text-accent-soft" role="status">
            {importNote}
          </p>
        )}
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
            The agent
          </h2>
          <p className="mt-1 text-sm text-muted">
            These fields are what the classifier reads to pick a category.
          </p>
        </div>

        <Field label="Name" error={state.errors.name}>
          <input
            name="name"
            value={form.name}
            onChange={(event) => set("name", event.target.value)}
            placeholder="PR Reviewer"
            className={inputClass}
          />
        </Field>

        <Field
          label="Tagline"
          hint={`${form.tagline.length}/160`}
          error={state.errors.tagline}
        >
          <input
            name="tagline"
            value={form.tagline}
            maxLength={160}
            onChange={(event) => set("tagline", event.target.value)}
            placeholder="Reviews every pull request for correctness bugs."
            className={inputClass}
          />
        </Field>

        <Field
          label="Description"
          hint="What it does, where it hands off to a human."
          error={state.errors.description}
        >
          <textarea
            name="description"
            value={form.description}
            rows={6}
            onChange={(event) => set("description", event.target.value)}
            placeholder="Describe the agent's job, the systems it touches and what it refuses to do…"
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </Field>
      </section>

      {/* Everything an imported manifest carried that the form no longer asks
          for, forwarded so a round-tripped agent keeps its metadata. */}
      <input type="hidden" name="author" value={form.author} />
      <input type="hidden" name="version" value={form.version} />
      <input type="hidden" name="runtime" value={form.runtime} />
      <input type="hidden" name="license" value={form.license} />
      <input type="hidden" name="tags" value={form.tags} />
      {form.skills.map((skill, index) => (
        <Fragment key={index}>
          <input type="hidden" name="skillName" value={skill.name} />
          <input type="hidden" name="skillDescription" value={skill.description} />
          <input type="hidden" name="skillTools" value={skill.tools} />
        </Fragment>
      ))}

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-accent px-5 py-3 font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {isPending ? "Publishing…" : "Publish to marketplace"}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-subtle">
          The category is picked automatically from the name, tagline and
          description. Published agents start unevaluated.
        </p>
        {state.status === "error" && (
          <ErrorText>Fix the highlighted fields and try again.</ErrorText>
        )}
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded border border-line bg-background px-3.5 py-2.5 text-[15px] placeholder:text-subtle focus:border-accent focus:outline-none";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted">{label}</span>
        {hint && <span className="text-xs text-subtle">{hint}</span>}
      </div>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </label>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-bad">{children}</p>;
}

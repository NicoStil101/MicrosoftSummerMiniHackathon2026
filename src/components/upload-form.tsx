"use client";

import { useActionState, useMemo, useState } from "react";
import { uploadAgent } from "@/lib/actions";
import { EMPTY_UPLOAD_STATE } from "@/lib/upload-state";
import { classify } from "@/lib/categorize";
import { SELECTABLE_CATEGORIES, getCategory } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";

interface SkillField {
  name: string;
  description: string;
  tools: string;
}

interface FormState {
  name: string;
  tagline: string;
  description: string;
  author: string;
  version: string;
  runtime: string;
  license: string;
  tags: string;
  category: CategoryId | "auto";
  skills: SkillField[];
}

const EMPTY_SKILL: SkillField = { name: "", description: "", tools: "" };

const INITIAL: FormState = {
  name: "",
  tagline: "",
  description: "",
  author: "",
  version: "0.1.0",
  runtime: "Node 24",
  license: "MIT",
  tags: "",
  category: "auto",
  skills: [{ ...EMPTY_SKILL }],
};

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

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

  function setSkill(index: number, patch: Partial<SkillField>) {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) =>
        i === index ? { ...skill, ...patch } : skill,
      ),
    }));
  }

  // The same classifier the server runs, so the preview and the result agree.
  const prediction = useMemo(
    () =>
      classify({
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        author: form.author,
        version: form.version,
        runtime: form.runtime,
        license: form.license,
        tags: splitList(form.tags),
        skills: form.skills
          .filter((skill) => skill.name.trim())
          .map((skill) => ({
            name: skill.name,
            description: skill.description,
            tools: splitList(skill.tools),
          })),
      }),
    [form],
  );

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

  const predicted = getCategory(prediction.category);
  const topMatches = prediction.ranked[0]?.matched.slice(0, 6) ?? [];

  return (
    <form action={formAction} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0 space-y-10">
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
            dragging
              ? "border-accent bg-accent/10"
              : "border-line-strong bg-surface"
          }`}
        >
          <p className="text-sm font-medium">Drop an agent manifest to start</p>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-subtle">
            A <code className="font-mono">.json</code> file exported from any
            agent page. Everything below gets filled in, skills included.
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
          <SectionTitle
            title="The agent"
            hint="These fields are what the classifier reads."
          />

          <Field label="Name" error={state.errors.name}>
            <input
              name="name"
              value={form.name}
              onChange={(event) => set("name", event.target.value)}
              placeholder="Inbox Responder"
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
              placeholder="Drafts and sends replies to routine email."
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

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Author" error={state.errors.author}>
              <input
                name="author"
                value={form.author}
                onChange={(event) => set("author", event.target.value)}
                placeholder="your-team"
                className={inputClass}
              />
            </Field>
            <Field label="Version">
              <input
                name="version"
                value={form.version}
                onChange={(event) => set("version", event.target.value)}
                className={`${inputClass} font-mono`}
              />
            </Field>
            <Field label="Runtime">
              <input
                name="runtime"
                value={form.runtime}
                onChange={(event) => set("runtime", event.target.value)}
                placeholder="Node 24"
                className={inputClass}
              />
            </Field>
            <Field label="License">
              <input
                name="license"
                value={form.license}
                onChange={(event) => set("license", event.target.value)}
                placeholder="MIT"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Tags" hint="Comma separated. These weigh heavily.">
            <input
              name="tags"
              value={form.tags}
              onChange={(event) => set("tags", event.target.value)}
              placeholder="email, inbox zero, drafting"
              className={inputClass}
            />
          </Field>
        </section>

        <section className="space-y-4">
          <SectionTitle
            title="Skills"
            hint="One entry per capability the agent ships with."
          />

          {state.errors.skills && <ErrorText>{state.errors.skills}</ErrorText>}

          <ol className="space-y-4">
            {form.skills.map((skill, index) => (
              <li
                key={index}
                className="space-y-4 rounded border border-line bg-surface p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-subtle">
                    Skill {String(index + 1).padStart(2, "0")}
                  </span>
                  {form.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          skills: prev.skills.filter((_, i) => i !== index),
                        }))
                      }
                      className="text-xs text-subtle transition-colors hover:text-bad"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <Field label="Skill name">
                  <input
                    name="skillName"
                    value={skill.name}
                    onChange={(event) =>
                      setSkill(index, { name: event.target.value })
                    }
                    placeholder="Draft reply"
                    className={inputClass}
                  />
                </Field>

                <Field label="What it does">
                  <textarea
                    name="skillDescription"
                    value={skill.description}
                    rows={2}
                    onChange={(event) =>
                      setSkill(index, { description: event.target.value })
                    }
                    placeholder="Writes a reply in the user's tone using the thread history."
                    className={`${inputClass} resize-y`}
                  />
                </Field>

                <Field label="Tools it calls" hint="Comma separated, optional.">
                  <input
                    name="skillTools"
                    value={skill.tools}
                    onChange={(event) =>
                      setSkill(index, { tools: event.target.value })
                    }
                    placeholder="gmail.drafts.create, calendar.events.insert"
                    className={`${inputClass} font-mono text-sm`}
                  />
                </Field>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                skills: [...prev.skills, { ...EMPTY_SKILL }],
              }))
            }
            className="w-full rounded border border-dashed border-line-strong py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            + Add another skill
          </button>
        </section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
            Category
          </h2>

          <div className="mt-4 rounded border border-line bg-background p-4">
            <p className="text-xs text-subtle">Classifier says</p>
            <p className="mt-1.5 font-medium tracking-tight">
              {predicted.name}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-raised">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-300"
                style={{ width: `${Math.round(prediction.confidence * 100)}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-subtle">
              {prediction.confidence > 0
                ? `${Math.round(prediction.confidence * 100)}% confidence`
                : "Not enough signal yet — keep typing."}
            </p>
            {topMatches.length > 0 && (
              <p className="mt-3 text-xs leading-relaxed text-subtle">
                <span className="text-muted">Matched:</span>{" "}
                {topMatches.join(", ")}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="category" className="text-sm text-muted">
              Override
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={(event) =>
                set("category", event.target.value as FormState["category"])
              }
              className={`${inputClass} mt-1.5`}
            >
              <option value="auto">Auto-detect (recommended)</option>
              {SELECTABLE_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {state.errors.category && (
              <ErrorText>{state.errors.category}</ErrorText>
            )}
          </div>
        </div>

        <div className="rounded border border-line bg-surface p-5">
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded bg-accent px-5 py-3 font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {isPending ? "Publishing…" : "Publish to marketplace"}
          </button>
          <p className="mt-3 text-xs leading-relaxed text-subtle">
            Published agents start unevaluated. The first eval run sets the
            health badge.
          </p>
          {state.status === "error" && (
            <ErrorText>Fix the highlighted fields and try again.</ErrorText>
          )}
        </div>
      </aside>
    </form>
  );
}

const inputClass =
  "w-full rounded border border-line bg-background px-3.5 py-2.5 text-[15px] placeholder:text-subtle focus:border-accent focus:outline-none";

function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
        {title}
      </h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}

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

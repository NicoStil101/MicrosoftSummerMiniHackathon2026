"use client";

import { useEffect, useRef, useState } from "react";
import { LAYER_NAMES, type KpiLayer } from "@/lib/kpis";

export interface WorkflowStep {
  id: string;
  label: string;
  /** How long this step pretends to take, in ms. */
  duration: number;
}

type StepState = "queued" | "running" | "done";

/** Every run lasts this long, however many KPI layers it covers. */
const RUN_DURATION_MS = 11_000;

export function buildSteps(layers: KpiLayer[], skillCount: number): WorkflowStep[] {
  // Weights, not milliseconds: the suite steps carry the most time, and the
  // budget above is shared out between them so the total always lands on 11s.
  const weighted: Array<Omit<WorkflowStep, "duration"> & { weight: number }> = [
    { id: "setup", label: "Set up job", weight: 1 },
    { id: "checkout", label: "Check out agent.md", weight: 1 },
    {
      id: "skills",
      label: `Load ${skillCount} skill${skillCount === 1 ? "" : "s"}`,
      weight: 1.1,
    },
    ...layers.map((layer) => ({
      id: layer,
      label: `Run ${layer} — ${LAYER_NAMES[layer]} suite`,
      weight: 2.6,
    })),
    { id: "score", label: "Collect reviewer scores", weight: 1.6 },
    { id: "complete", label: "Complete job", weight: 0.8 },
  ];

  const total = weighted.reduce((sum, step) => sum + step.weight, 0);
  return weighted.map(({ weight, ...step }) => ({
    ...step,
    duration: Math.round((RUN_DURATION_MS * weight) / total),
  }));
}

export function WorkflowRun({
  steps,
  onFinished,
}: {
  steps: WorkflowStep[];
  onFinished: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const finished = useRef(false);

  // Honour reduced motion by collapsing the whole run to a beat.
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (index >= steps.length) {
      if (!finished.current) {
        finished.current = true;
        onFinished();
      }
      return;
    }
    const wait = reduced ? 60 : steps[index].duration;
    const timer = setTimeout(() => setIndex((i) => i + 1), wait);
    return () => clearTimeout(timer);
  }, [index, steps, onFinished, reduced]);

  useEffect(() => {
    if (index >= steps.length) return;
    const tick = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(tick);
  }, [index, steps.length]);

  const running = index < steps.length;

  return (
    <div className="overflow-hidden rounded border border-line">
      <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3">
        {running ? <Spinner /> : <Tick />}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            benchmark / evaluate-agent
          </p>
          <p className="text-xs text-subtle">
            {running
              ? `Running KPI suite — step ${index + 1} of ${steps.length}`
              : "All checks have passed"}
          </p>
        </div>
        <span className="ml-auto font-mono text-xs tabular-nums text-subtle">
          {Math.floor(elapsed / 60)}m {String(elapsed % 60).padStart(2, "0")}s
        </span>
      </div>

      <ol className="divide-y divide-line bg-background">
        {steps.map((step, i) => {
          const stepState: StepState =
            i < index ? "done" : i === index ? "running" : "queued";
          return (
            <li
              key={step.id}
              className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-opacity ${
                stepState === "queued" ? "opacity-40" : "opacity-100"
              }`}
            >
              {stepState === "done" && <Tick />}
              {stepState === "running" && <Spinner />}
              {stepState === "queued" && <Dot />}
              <span
                className={
                  stepState === "queued" ? "text-subtle" : "text-foreground"
                }
              >
                {step.label}
              </span>
              {stepState === "done" && (
                <span className="ml-auto font-mono text-xs tabular-nums text-subtle">
                  {(step.duration / 1000).toFixed(1)}s
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden
      className="size-4 shrink-0 animate-spin text-warn"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Tick() {
  return (
    <svg aria-hidden className="size-4 shrink-0 text-ok" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm3.7 5.3a1 1 0 0 0-1.4 0L7 8.6 5.7 7.3a1 1 0 1 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4a1 1 0 0 0 0-1.4Z" />
    </svg>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="size-4 shrink-0 rounded-full border border-line-strong"
    />
  );
}

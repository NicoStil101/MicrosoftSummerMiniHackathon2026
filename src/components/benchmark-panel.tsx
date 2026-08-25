import { benchmarkFor } from "@/lib/kpis";
import type { CategoryId } from "@/lib/types";

export function BenchmarkPanel({
  slug,
  category,
  scores,
  footnote = "Scored 1-5 by an independent reviewer at session end. L0 applies to every agent; deeper layers are scored only where they apply.",
}: {
  slug: string;
  category: CategoryId;
  scores?: Record<string, number>;
  footnote?: string;
}) {
  const layers = benchmarkFor(slug, category, scores);
  const all = layers.flatMap((layer) => layer.kpis);
  const overall =
    Math.round((all.reduce((sum, k) => sum + k.score, 0) / all.length) * 10) /
    10;

  return (
    <div className="rounded border border-line bg-surface p-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-subtle">
          Benchmark
        </h2>
        <span className="font-mono text-sm tabular-nums">
          {overall.toFixed(1)}
          <span className="text-subtle"> / 5</span>
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {layers.map((layer) => (
          <div key={layer.layer}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-xs font-semibold">
                <span className="font-mono text-subtle">{layer.layer}</span>{" "}
                {layer.name}
              </h3>
              <span className="font-mono text-xs tabular-nums text-subtle">
                {layer.average.toFixed(1)}
              </span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {layer.kpis.map(({ kpi, score }) => (
                <li
                  key={kpi.id}
                  className="flex items-center justify-between gap-3"
                  title={kpi.definition}
                >
                  <span className="min-w-0 truncate text-[13px] text-muted">
                    {kpi.name}
                  </span>
                  <Pips score={score} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-subtle">
        {footnote}
      </p>
    </div>
  );
}

function Pips({ score }: { score: number }) {
  return (
    <span
      className="flex shrink-0 items-center gap-0.5"
      role="img"
      aria-label={`${score} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((step) => (
        <span
          key={step}
          className={`h-1.5 w-3 rounded-[1px] ${
            step <= score ? "bg-accent" : "bg-line-strong"
          }`}
        />
      ))}
    </span>
  );
}

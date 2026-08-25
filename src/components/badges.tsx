import Link from "next/link";
import { getCategory } from "@/lib/categories";
import type { CategoryId, HealthStatus } from "@/lib/types";

export function CategoryBadge({
  category,
  href = true,
}: {
  category: CategoryId;
  href?: boolean;
}) {
  const meta = getCategory(category);
  const className =
    "inline-flex items-center gap-1.5 border border-line bg-surface px-2.5 py-1 text-xs";
  const content = meta.name;

  if (!href) return <span className={className}>{content}</span>;
  return (
    <Link
      href={`/categories/${meta.id}`}
      className={`${className} transition-colors hover:border-line-strong hover:bg-surface-raised`}
    >
      {content}
    </Link>
  );
}

const HEALTH_META: Record<
  HealthStatus,
  { label: string; dot: string; text: string }
> = {
  healthy: { label: "Healthy", dot: "bg-ok", text: "text-ok" },
  degraded: { label: "Degraded", dot: "bg-warn", text: "text-warn" },
  failing: { label: "Failing", dot: "bg-bad", text: "text-bad" },
  unevaluated: { label: "Not evaluated", dot: "bg-subtle", text: "text-subtle" },
};

export function HealthBadge({ health }: { health: HealthStatus }) {
  const meta = HEALTH_META[health];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${meta.text}`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

export function Tag({ label }: { label: string }) {
  return (
    <span className="border border-line bg-surface px-2 py-0.5 text-xs text-muted">
      {label}
    </span>
  );
}

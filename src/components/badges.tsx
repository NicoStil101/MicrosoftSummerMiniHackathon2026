import Link from "next/link";
import { getCategory } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";

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

export function Tag({ label }: { label: string }) {
  return (
    <span className="border border-line bg-surface px-2 py-0.5 text-xs text-muted">
      {label}
    </span>
  );
}

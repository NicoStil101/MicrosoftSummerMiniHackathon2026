import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-5 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        Nothing here
      </h1>
      <p className="mt-3 max-w-md text-muted">
        That agent or category isn&apos;t in the bazaar. It may have been
        unpublished, or the link is wrong.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/agents"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Browse agents
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-line-strong hover:text-foreground"
        >
          Home
        </Link>
      </div>
    </div>
  );
}

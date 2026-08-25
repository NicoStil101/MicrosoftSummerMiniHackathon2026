import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          Agent Exchange — a marketplace prototype for the Microsoft Summer Mini
          Hackathon 2026.
        </p>
        <div className="flex gap-4">
          <Link href="/agents" className="hover:text-foreground">
            Browse
          </Link>
          <Link href="/categories" className="hover:text-foreground">
            Categories
          </Link>
          <Link href="/upload" className="hover:text-foreground">
            Publish
          </Link>
        </div>
      </div>
    </footer>
  );
}

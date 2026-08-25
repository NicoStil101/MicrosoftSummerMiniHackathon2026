"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/agents", label: "Browse" },
  { href: "/categories", label: "Categories" },
  { href: "/upload", label: "Publish" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background">
      <div className="mx-auto flex h-12 max-w-[1600px] items-center gap-6 px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span
            aria-hidden
            className="grid size-6 place-items-center bg-accent text-[11px] font-semibold text-white"
          >
            AX
          </span>
          <span className="text-sm font-semibold">Agent Exchange</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 text-[13px] sm:flex">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-1.5 transition-colors ${
                  active
                    ? "font-semibold text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/upload"
            className="bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Upload agent
          </Link>
        </div>
      </div>
    </header>
  );
}

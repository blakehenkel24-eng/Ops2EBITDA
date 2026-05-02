"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems: { href: Route; label: string }[] = [
  { href: "/", label: "Knowledge Base" },
  { href: "/fundamentals", label: "PE Fundamentals" },
  { href: "/playbooks", label: "Your Needs" },
  { href: "/industries", label: "Your Industries" },
  { href: "/kpis", label: "KPI Library" },
  { href: "/study", label: "Phase 2" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen text-[var(--ink)] bg-[var(--paper)] flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-[var(--line)] bg-[var(--paper)]/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link
            href="/"
            className="group shrink-0 block"
          >
            <span className="block text-xl font-bold font-serif text-brand-gradient">PE Ops Knowledge Base</span>
            <span className="mt-1 block text-sm text-[var(--muted)]">
              Value creation, industries, KPIs
            </span>
          </Link>
          <nav
            aria-label="Primary"
            className="flex gap-2 overflow-x-auto pb-2 md:pb-0"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isActivePath(pathname, item.href)}
              />
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 min-w-0 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl bg-[var(--panel)] min-h-[calc(100vh-10rem)] rounded-[32px] border border-[var(--line)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] px-6 py-10 lg:px-16 lg:py-16">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: Route;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "shrink-0 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out flex items-center cursor-pointer border border-transparent",
        active
          ? "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]"
          : "text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-[var(--ink)] hover:border-[var(--line)]",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function isActivePath(pathname: string, href: Route) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

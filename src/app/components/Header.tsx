"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { AccountActions } from "./AccountActions";

const navItems = [
  { label: "ホーム", href: "/" },
  { label: "カテゴリー", href: "/categories" },
  { label: "タグ", href: "/tags" },
];

const circleButtonBase =
  "btn-shimmer theme-btn-ghost inline-flex items-center justify-center rounded-full border theme-border-soft text-[10px] font-semibold uppercase tracking-[0.2em] transition duration-300";

export function Header() {
  const pathname = usePathname();

  const current = useMemo(() => pathname ?? "/", [pathname]);

  return (
    <header className="sticky top-0 z-40 mb-10 flex items-center justify-between rounded-full border theme-border-soft theme-bg-glass px-6 py-4 backdrop-blur-xl transition-colors duration-500">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-white/40 text-sm font-semibold text-black shadow-[0_4px_25px_rgba(255,255,255,0.35)]">
          MA
        </div>
        <div className="flex flex-col text-xs uppercase tracking-[0.35em] text-secondary">
          <span>Memo Atelier</span>
          <span className="text-[11px] tracking-[0.4em] text-muted">crafted notes</span>
        </div>
      </div>
      <nav className="hidden items-center gap-2 text-sm text-secondary md:flex">
        {navItems.map((item) => {
          const isActive = current === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative rounded-full px-4 py-2 transition ${
                isActive
                  ? "text-primary"
                  : "text-secondary hover:text-primary"
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 -z-10 rounded-full theme-bg-chip" />
              )}
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-3">
        <button className={`${circleButtonBase} h-10 w-10`}>
          ⌘K
        </button>
        <ThemeToggle />
        <AccountActions />
      </div>
    </header>
  );
}

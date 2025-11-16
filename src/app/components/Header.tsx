"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { AccountActions } from "./AccountActions";
import { LanguageSelector } from "./LanguageSelector";
import type { CommonCopy, Locale } from "@/lib/i18n";

const navItems = (t: CommonCopy["nav"]) => [
  { label: t.home, href: "/" },
  { label: t.categories, href: "/categories" },
];

export function Header({ locale, dictionary }: { locale: Locale; dictionary: CommonCopy }) {
  const pathname = usePathname();

  const current = useMemo(() => pathname ?? "/", [pathname]);

  return (
    <header className="sticky top-0 z-40 mb-10 flex items-center justify-between rounded-full border theme-border-soft theme-bg-glass px-6 py-4 backdrop-blur-xl transition-colors duration-500">
      <div />
      <nav className="hidden items-center gap-3 text-sm text-secondary md:flex">
        {navItems(dictionary.nav).map((item) => {
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
        <LanguageSelector initialLocale={locale} labels={dictionary.language} />
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href="/memo"
          className="btn-shimmer theme-btn-primary hidden rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm transition hover:translate-y-0.5 md:inline-flex"
          aria-label={dictionary.nav.memoList}
        >
          {dictionary.nav.memoList}
        </Link>
        <ThemeToggle />
        <AccountActions dict={dictionary.auth} />
      </div>
    </header>
  );
}

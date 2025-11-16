"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const portalRef = useRef<HTMLElement | null>(null);

  const current = useMemo(() => pathname ?? "/", [pathname]);

  useEffect(() => {
    // 背景はスクロール可能のままにするため、特別な処理は不要
  }, [menuOpen]);

  useEffect(() => {
    if (portalRef.current) return;
    const el = document.createElement("div");
    portalRef.current = el;
    document.body.appendChild(el);
    return () => {
      if (portalRef.current) {
        document.body.removeChild(portalRef.current);
        portalRef.current = null;
      }
    };
  }, []);

  // eslint-disable-next-line react-hooks/refs
  const portalTarget = portalRef.current;

  return (
    <header className="sticky top-0 z-40 mb-10 flex items-center justify-between rounded-full border theme-border-soft theme-bg-glass px-6 py-4 backdrop-blur-xl transition-colors duration-500">
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          type="button"
          className="md:hidden rounded-full border theme-border-soft px-3 py-2 text-xs font-semibold text-secondary transition hover:text-primary"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      <nav className="hidden items-center gap-3 text-sm text-secondary md:flex">
        {navItems(dictionary.nav).map((item) => {
          const isActive = current === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative rounded-full px-4 py-2 transition ${isActive ? "text-primary" : "text-secondary hover:text-primary"
                }`}
            >
              {isActive && <span className="absolute inset-0 -z-10 rounded-full theme-bg-chip" />}
              {item.label}
            </Link>
          );
        })}
        <LanguageSelector initialLocale={locale} labels={dictionary.language} />
      </nav>

      <div className="hidden items-center gap-3 md:flex">
        <Link
          href="/memo"
          className="btn-shimmer theme-btn-primary rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm transition hover:translate-y-0.5"
          aria-label={dictionary.nav.memoList}
        >
          {dictionary.nav.memoList}
        </Link>
        <AccountActions dict={dictionary.auth} />
      </div>

      {portalTarget
        ? createPortal(
          <div
            className={`fixed inset-0 z-50 flex md:hidden transition ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
            aria-modal="true"
            role="dialog"
            onClick={() => setMenuOpen(false)}
          >
            <div
              className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-0"
                }`}
              aria-hidden="true"
            />
            <div
              className={`ml-auto flex h-full w-[78%] max-w-xs flex-col border-l theme-border-soft p-6 shadow-[0_12px_60px_rgba(0,0,0,0.28)] transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"
                }`}
              style={{
                minHeight: "100vh",
                position: "fixed",
                right: 0,
                top: 0,
                backgroundColor: "var(--page-bg)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-primary">Menu</span>
                <button
                  type="button"
                  className="rounded-full border theme-border-soft px-3 py-1 text-xs font-semibold text-secondary"
                  onClick={() => setMenuOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto">
                <div className="flex flex-col gap-2 text-sm text-secondary">
                  {navItems(dictionary.nav).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-2xl border theme-border-soft px-4 py-3 text-left font-semibold text-primary transition hover:border-white/60"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/memo"
                    className="rounded-2xl border theme-border-soft px-4 py-3 text-left font-semibold text-primary transition hover:border-white/60"
                    onClick={() => setMenuOpen(false)}
                  >
                    {dictionary.nav.memoList}
                  </Link>
                </div>
                <LanguageSelector initialLocale={locale} labels={dictionary.language} />
                <div className="border-t theme-border-soft pt-4">
                  <AccountActions dict={dictionary.auth} />
                </div>
              </div>
            </div>
          </div>,
          portalTarget,
        )
        : null}
    </header>
  );
}

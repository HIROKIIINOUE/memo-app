"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

type LanguageSelectorProps = {
  initialLocale: Locale;
  labels: {
    label: string;
    helperJa: string;
    helperEn: string;
    helperFr: string;
  };
};

const STORAGE_KEY = "memo-app-language";

const LOCALE_OPTIONS: Array<{ code: Locale; label: string; short: string; helperKey: keyof LanguageSelectorProps["labels"] }> = [
  { code: "ja", label: "日本語", short: "JP", helperKey: "helperJa" },
  { code: "en", label: "English", short: "EN", helperKey: "helperEn" },
  { code: "fr", label: "Français", short: "FR", helperKey: "helperFr" },
];

export function LanguageSelector({ initialLocale, labels }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // SSR と一致させるためサーバー決定の言語を初期値にする
    setLocale(initialLocale);
  }, [initialLocale]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const currentOption = useMemo(
    () => LOCALE_OPTIONS.find((item) => item.code === locale) ?? LOCALE_OPTIONS[0],
    [locale],
  );

  const handleSelect = (code: Locale) => {
    setLocale(code);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, code);
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = `locale=${code}; path=/; max-age=31536000`;
      window.location.reload();
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border theme-border-soft px-3 py-2 text-xs font-semibold text-secondary transition hover:text-primary"
      >
        <span className="hidden lg:inline text-muted">{labels.label}</span>
        <span className="text-primary">{currentOption.short}</span>
        <span aria-hidden="true" className="text-[10px] text-muted">
          ▾
        </span>
      </button>
      {open ? (
        <div
          className="language-dropdown absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border theme-border-soft bg-white dark:bg-[#0c0d14] shadow-[0_18px_55px_rgba(0,0,0,0.16)]"
        >
          <ul role="listbox">
            {LOCALE_OPTIONS.map((item) => {
              const isActive = item.code === locale;
              return (
                <li key={item.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(item.code)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                      isActive
                        ? "text-primary ring-2 ring-black/10 dark:ring-white/20 bg-transparent"
                        : "text-secondary hover:bg-gray-100 hover:dark:bg-white/10"
                    }`}
                  >
                    <span className="mt-[2px] h-2.5 w-2.5 rounded-full border theme-border-soft" />
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-primary">{item.label}</span>
                      <span className="text-[11px] text-muted">{labels[item.helperKey]}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

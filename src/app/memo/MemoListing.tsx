"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { MockCategory } from "@/lib/mockCategories";
import { loadStoredCategories, subscribeCategoryStorage } from "@/lib/categoryStorage";
import { loadAllMemoCategories, subscribeMemoCategories } from "@/lib/memoCategoryStorage";

type SerializableMemo = {
  id: string;
  title: string;
  content: string | null;
  updatedAt: string;
  createdAt: string;
};

type MemoListingProps = {
  memos: SerializableMemo[];
  isSearchFiltered: boolean;
};

const formatter = new Intl.RelativeTimeFormat("ja-JP", { numeric: "auto" });

const PREVIEW_CHAR_LIMIT = 220;

function formatRelativeTime(date: Date) {
  const now = Date.now();
  const diff = date.getTime() - now;
  const minutes = Math.round(diff / (1000 * 60));
  if (Math.abs(minutes) < 60) {
    return formatter.format(minutes, "minute");
  }
  const hours = Math.round(diff / (1000 * 60 * 60));
  if (Math.abs(hours) < 24) {
    return formatter.format(hours, "hour");
  }
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  if (Math.abs(days) < 30) {
    return formatter.format(days, "day");
  }
  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) {
    return formatter.format(months, "month");
  }
  const years = Math.round(months / 12);
  return formatter.format(years, "year");
}

function sanitizePreview(content?: string | null) {
  if (!content) return "";
  const stripped = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_`~-]+/g, " ")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (stripped.length > PREVIEW_CHAR_LIMIT) {
    return `${stripped.slice(0, PREVIEW_CHAR_LIMIT)}…`;
  }
  return stripped;
}

export function MemoListing({ memos, isSearchFiltered }: MemoListingProps) {
  const [categories, setCategories] = useState<MockCategory[]>(() => loadStoredCategories());
  const [memoCategoryMap, setMemoCategoryMap] = useState<Record<string, string[]>>(() => loadAllMemoCategories());
  const searchParams = useSearchParams();
  const selectedCategoryId = searchParams?.get("category") ?? undefined;
  const sortParam = searchParams?.get("sort");
  const sortMode = sortParam === "category" ? "category" : "recent";

  useEffect(() => {
    const unsubscribe = subscribeCategoryStorage(() => {
      setCategories(loadStoredCategories());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeMemoCategories(() => {
      setMemoCategoryMap(loadAllMemoCategories());
    });
    return unsubscribe;
  }, []);

  const decoratedMemos = useMemo(() => {
    return memos.map((memo) => {
      const assignedIds = memoCategoryMap[memo.id] ?? [];
      const resolvedCategories = assignedIds
        .map((categoryId) => categories.find((category) => category.id === categoryId))
        .filter((category): category is MockCategory => Boolean(category));
      return {
        ...memo,
        updatedAtDate: new Date(memo.updatedAt),
        categories: resolvedCategories,
      };
    });
  }, [memos, memoCategoryMap, categories]);

  const filteredMemos = useMemo(() => {
    if (!selectedCategoryId) return decoratedMemos;
    return decoratedMemos.filter((memo) =>
      memo.categories.some((category) => category.id === selectedCategoryId),
    );
  }, [decoratedMemos, selectedCategoryId]);

  const sortedMemos = useMemo(() => {
    const next = [...filteredMemos];
    if (sortMode === "category") {
      next.sort((a, b) => {
        const nameA = a.categories[0]?.name ?? "ZZZ";
        const nameB = b.categories[0]?.name ?? "ZZZ";
        if (nameA === nameB) {
          return b.updatedAtDate.getTime() - a.updatedAtDate.getTime();
        }
        return nameA.localeCompare(nameB, "ja");
      });
      return next;
    }
    return next.sort((a, b) => b.updatedAtDate.getTime() - a.updatedAtDate.getTime());
  }, [filteredMemos, sortMode]);

  if (memos.length === 0) {
    return (
      <div className="rounded-[32px] border border-dashed border-white/15 p-12 text-center text-secondary">
        {isSearchFiltered ? (
          <>
            <p className="text-lg font-medium">該当するメモが見つかりませんでした</p>
            <p className="mt-2 text-sm text-muted">別のキーワードを試すか検索条件をリセットしてください。</p>
          </>
        ) : (
          <>
            <p className="text-lg font-medium">まだメモがありません</p>
            <p className="mt-2 text-sm text-muted">「新しいメモを作成」から最初のノートを追加しましょう。</p>
          </>
        )}
      </div>
    );
  }

  if (sortedMemos.length === 0) {
    return (
      <div className="rounded-[32px] border border-dashed border-white/15 p-12 text-center text-secondary">
        <p className="text-lg font-medium">カテゴリに一致するメモはありません</p>
        <p className="mt-2 text-sm text-muted">別のカテゴリを選ぶか、フィルタを解除してください。</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {sortedMemos.map((memo) => (
        <Link
          key={memo.id}
          href={`/memo/${memo.id}`}
          className="group block h-[340px] rounded-[28px] border theme-border-soft theme-bg-card/90 p-5 shadow-[0_25px_60px_rgba(255,255,255,0.12)] transition hover:-translate-y-1 hover:border-white/60"
        >
          <article className="flex h-full flex-col gap-4">
            <header className="space-y-2">
              <h2 className="text-lg font-semibold text-primary transition group-hover:text-white">
                {memo.title}
              </h2>
              <time className="text-[11px] uppercase tracking-[0.35em] text-muted">
                {formatRelativeTime(memo.updatedAtDate)}
              </time>
              <div className="flex flex-wrap gap-2">
                {memo.categories.map((category) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: category.color }}
                      aria-hidden="true"
                    />
                    {category.name}
                  </span>
                ))}
              </div>
            </header>
            <div className="flex-1 overflow-hidden rounded-2xl border border-white/5 bg-black/5 p-4">
              <p className="text-sm leading-relaxed text-secondary line-clamp-4">
                {sanitizePreview(memo.content) || "本文はまだ追加されていません。"}
              </p>
            </div>
            <footer className="text-[12px] font-semibold text-secondary">
              <span className="inline-flex items-center gap-1">
                詳細を開く <span aria-hidden="true">↗</span>
              </span>
            </footer>
          </article>
        </Link>
      ))}
    </div>
  );
}

export default MemoListing;

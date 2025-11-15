"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useEffect } from "react";
import { CATEGORY_LIMIT, type MockCategory } from "@/lib/mockCategories";
import { loadStoredCategories, subscribeCategoryStorage } from "@/lib/categoryStorage";

type SortMode = "recent" | "category";

export function MemoCategoryControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = useMemo(() => searchParams?.toString() ?? "", [searchParams]);
  const selectedCategoryId = searchParams?.get("category") ?? undefined;
  const sortParam = searchParams?.get("sort");
  const sortMode: SortMode = sortParam === "category" ? "category" : "recent";
  const [categories, setCategories] = useState<MockCategory[]>(() => loadStoredCategories());

  useEffect(() => {
    const unsubscribe = subscribeCategoryStorage(() => {
      setCategories(loadStoredCategories());
    });
    return unsubscribe;
  }, []);

  const updateParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParamsString);
      updater(params);
      const queryString = params.toString();
      const href = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(href, { scroll: false });
    },
    [pathname, router, searchParamsString],
  );

  const toggleCategory = useCallback(
    (categoryId?: string) => {
      updateParams((params) => {
        if (!categoryId || params.get("category") === categoryId) {
          params.delete("category");
        } else {
          params.set("category", categoryId);
        }
      });
    },
    [updateParams],
  );

  const changeSortMode = useCallback(
    (nextMode: SortMode) => {
      updateParams((params) => {
        if (nextMode === "recent") {
          params.delete("sort");
        } else {
          params.set("sort", nextMode);
        }
      });
    },
    [updateParams],
  );

  return (
    <div className="rounded-[28px] border theme-border-soft bg-white/5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Categories</p>
          <p className="text-sm text-secondary">{categories.length} / {CATEGORY_LIMIT} 使用中</p>
        </div>
        <Link
          href="/categories"
          className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-secondary transition hover:border-white hover:text-white"
        >
          カテゴリーを編集
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 p-1 text-xs font-semibold text-secondary">
          <button
            type="button"
            className={`rounded-full px-4 py-1 transition ${sortMode === "recent" ? "bg-white/90 text-black" : "text-secondary"}`}
            aria-pressed={sortMode === "recent"}
            onClick={() => changeSortMode("recent")}
          >
            新着順
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-1 transition ${sortMode === "category" ? "bg-white/90 text-black" : "text-secondary"}`}
            aria-pressed={sortMode === "category"}
            onClick={() => changeSortMode("category")}
          >
            カテゴリ順
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          className={`rounded-full border px-4 py-2 text-sm transition ${selectedCategoryId ? "border-white/10 text-muted" : "border-white text-white"}`}
          onClick={() => toggleCategory(undefined)}
          aria-pressed={!selectedCategoryId}
        >
          すべて
        </button>
        {categories.map((category) => {
          const isActive = category.id === selectedCategoryId;
          return (
            <button
              key={category.id}
              type="button"
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive ? "border-white bg-white text-black" : "border-white/10 text-secondary hover:border-white/40"
              }`}
              style={isActive ? { boxShadow: `0 10px 30px ${category.color}55` } : undefined}
              onClick={() => toggleCategory(category.id)}
              aria-pressed={isActive}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} aria-hidden="true" />
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MemoCategoryControls;

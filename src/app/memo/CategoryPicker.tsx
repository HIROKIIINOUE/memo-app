"use client";

import { useEffect, useState } from "react";
import { CATEGORY_LIMIT, CATEGORIES_PER_MEMO_LIMIT, type MockCategory } from "@/lib/mockCategories";
import {
  loadStoredCategories,
  subscribeCategoryStorage,
} from "@/lib/categoryStorage";

type CategoryPickerProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  helperText?: string;
};

export function CategoryPicker({ selectedIds, onChange, helperText }: CategoryPickerProps) {
  const [categories, setCategories] = useState<MockCategory[]>(() => loadStoredCategories());

  useEffect(() => {
    const unsubscribe = subscribeCategoryStorage(() => {
      setCategories(loadStoredCategories());
    });
    return unsubscribe;
  }, []);

  const toggleCategory = (categoryId: string) => {
    if (selectedIds.includes(categoryId)) {
      onChange(selectedIds.filter((id) => id !== categoryId));
      return;
    }

    if (selectedIds.length >= CATEGORIES_PER_MEMO_LIMIT) {
      return;
    }

    onChange([...selectedIds, categoryId]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-secondary">
        <div>
          <p className="font-medium">カテゴリー</p>
          <p className="text-xs text-muted">
            メモごとに最大 {CATEGORIES_PER_MEMO_LIMIT} 件まで選択可能（全体 {categories.length} / {CATEGORY_LIMIT}）
          </p>
          {helperText && <p className="mt-1 text-xs text-muted">{helperText}</p>}
        </div>
        <div className="text-xs text-muted">{selectedIds.length} / {CATEGORIES_PER_MEMO_LIMIT}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedIds.includes(category.id);
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                isSelected
                  ? "border-white bg-white text-black"
                  : "border-white/15 text-secondary hover:border-white/40"
              }`}
              style={isSelected ? { boxShadow: `0 15px 30px ${category.color}40` } : undefined}
              aria-pressed={isSelected}
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

export default CategoryPicker;

"use client";

import { useEffect, useRef, useState } from "react";
import type { MockCategory } from "@/lib/mockCategories";
import { CATEGORY_LIMIT } from "@/lib/mockCategories";
import {
  loadStoredCategories,
  saveStoredCategories,
  subscribeCategoryStorage,
} from "@/lib/categoryStorage";

type CategoryManagerProps = {
  initialCategories: MockCategory[];
};

type DraftCategory = Omit<MockCategory, "id">;

const COLOR_PRESETS = ["#5B6DFF", "#FF8F6B", "#41C9A6", "#F2C94C", "#C084FC"];

export default function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<MockCategory[]>(() => {
    const stored = loadStoredCategories();
    if (stored.length > 0) {
      return stored;
    }
    return initialCategories.map((category) => ({ ...category }));
  });
  const hasSavedRef = useRef(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DraftCategory | null>(null);
  const [createDraft, setCreateDraft] = useState<DraftCategory>({
    name: "",
    description: "",
    color: COLOR_PRESETS[0],
  });

  const remainingSlots = CATEGORY_LIMIT - categories.length;
  const isLimitReached = remainingSlots <= 0;

  const startEdit = (category: MockCategory) => {
    setEditingId(category.id);
    setEditDraft({ name: category.name, description: category.description, color: category.color });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(null);
  };

  const saveEdit = () => {
    if (!editingId || !editDraft?.name.trim()) return;
    setCategories((prev) =>
      prev.map((category) =>
        category.id === editingId ? { ...category, ...editDraft, name: editDraft.name.trim() } : category,
      ),
    );
    cancelEdit();
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
    if (editingId === id) {
      cancelEdit();
    }
  };

  const handleCreate = () => {
    if (!createDraft.name.trim() || isLimitReached) return;
    const newCategory: MockCategory = {
      id: `cat-${Math.random().toString(36).slice(2, 8)}`,
      name: createDraft.name.trim(),
      description: createDraft.description.trim() || "説明未設定",
      color: createDraft.color,
    };
    setCategories((prev) => [...prev, newCategory]);
    setCreateDraft({ name: "", description: "", color: COLOR_PRESETS[0] });
  };

  useEffect(() => {
    if (!hasSavedRef.current) {
      hasSavedRef.current = true;
      return;
    }
    saveStoredCategories(categories.slice(0, CATEGORY_LIMIT));
  }, [categories]);

  useEffect(() => {
    const unsubscribe = subscribeCategoryStorage(() => {
      setCategories(loadStoredCategories());
    });
    return unsubscribe;
  }, []);

  const emptyState = categories.length === 0;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border theme-border-soft theme-bg-card p-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted">Current Categories</p>
            <h2 className="mt-2 text-2xl font-semibold text-primary">
              {emptyState ? "カテゴリが未作成です" : `登録済み ${categories.length} 件`}
            </h2>
          </div>
          <div className="rounded-full border theme-border-soft px-4 py-2 text-sm text-secondary">
            残り {Math.max(0, remainingSlots)} / {CATEGORY_LIMIT}
          </div>
        </header>

        {emptyState ? (
          <div className="mt-6 rounded-[24px] border border-dashed theme-border-soft p-8 text-center text-secondary">
            <p>「カテゴリを追加」から最初のカテゴリーを作成できます。</p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {categories.map((category) => {
              const isEditing = editingId === category.id;
              const draft = isEditing && editDraft ? editDraft : category;
              return (
                <li
                  key={category.id}
                  className="rounded-[28px] border theme-border-soft theme-bg-card p-6 shadow-[0_14px_45px_rgba(12,13,20,0.05)]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-10 w-10 rounded-2xl"
                      style={{ backgroundColor: category.color }}
                      aria-hidden="true"
                    />
                    {isEditing ? (
                      <input
                        className="flex-1 rounded-xl border theme-border-soft theme-bg-card px-3 py-2 text-base text-primary shadow-sm outline-none transition focus:border-current"
                        value={draft.name}
                        onChange={(event) =>
                          setEditDraft((prev) =>
                            prev ? { ...prev, name: event.target.value } : { ...draft, name: event.target.value },
                          )
                        }
                      />
                    ) : (
                      <h3 className="text-xl font-semibold text-primary">{category.name}</h3>
                    )}
                  </div>
                  <p className="mt-4 text-sm text-secondary">
                    {isEditing ? (
                      <textarea
                        className="w-full rounded-2xl border theme-border-soft theme-bg-card px-3 py-2 text-sm text-primary shadow-sm outline-none transition focus:border-current"
                        rows={3}
                        value={draft.description}
                        onChange={(event) =>
                          setEditDraft((prev) =>
                            prev
                              ? { ...prev, description: event.target.value }
                              : { ...draft, description: event.target.value },
                          )
                        }
                      />
                    ) : (
                      category.description
                    )}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
                    <span className="rounded-full border theme-border-soft px-3 py-1 uppercase tracking-[0.35em]">
                      {category.id}
                    </span>
                    <span
                      className="rounded-full border px-3 py-1 text-primary"
                      style={{ borderColor: `${category.color}55` }}
                    >
                      {category.color}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className="btn-shimmer theme-btn-primary rounded-full px-4 py-2 text-sm font-semibold shadow-sm"
                          onClick={saveEdit}
                        >
                          保存
                        </button>
                        <button
                          type="button"
                          className="rounded-full border theme-border-soft px-4 py-2 text-sm text-secondary"
                          onClick={cancelEdit}
                        >
                          キャンセル
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="rounded-full border theme-border-soft px-4 py-2 text-sm text-primary shadow-sm"
                        onClick={() => startEdit(category)}
                      >
                        編集
                      </button>
                    )}
                    <button
                      type="button"
                      className="rounded-full border border-red-400/70 px-4 py-2 text-sm font-semibold text-red-600"
                      onClick={() => handleDelete(category.id)}
                    >
                      削除
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-[32px] border border-dashed theme-border-soft p-8">
        <h2 className="text-2xl font-semibold text-primary">カテゴリを追加</h2>
        <p className="mt-2 text-sm text-secondary">
          プレースホルダー実装のため、入力内容はこのページ内でのみ保持されます。
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-secondary">
            名称
            <input
              value={createDraft.name}
              onChange={(event) => setCreateDraft((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-2xl border theme-border-soft theme-bg-card px-4 py-3 text-primary shadow-sm outline-none transition focus:border-current"
              placeholder="例: プロジェクト"
            />
          </label>
          <label className="space-y-2 text-sm text-secondary">
            カラー
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((color) => {
                const isActive = createDraft.color === color;
                const outline = isActive ? "0 0 0 3px var(--border-soft)" : "0 0 0 1px var(--border-soft)";
                return (
                  <button
                    key={color}
                    type="button"
                    aria-label={`色 ${color}`}
                    className="h-10 w-10 rounded-2xl transition"
                    style={{ backgroundColor: color, boxShadow: outline }}
                    onClick={() => setCreateDraft((prev) => ({ ...prev, color }))}
                  />
                );
              })}
            </div>
          </label>
          <label className="md:col-span-2 space-y-2 text-sm text-secondary">
            説明
            <textarea
              value={createDraft.description}
              onChange={(event) => setCreateDraft((prev) => ({ ...prev, description: event.target.value }))}
              rows={3}
              className="w-full rounded-2xl border theme-border-soft theme-bg-card px-4 py-3 text-primary shadow-sm outline-none transition focus:border-current"
              placeholder="カテゴリの用途や対象をメモ"
            />
          </label>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCreate}
            disabled={isLimitReached || !createDraft.name.trim()}
            className="btn-shimmer theme-btn-primary rounded-full px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            カテゴリを追加
          </button>
          {isLimitReached && <p className="text-sm font-medium text-red-600">これ以上追加できません。</p>}
        </div>
      </section>
    </div>
  );
}

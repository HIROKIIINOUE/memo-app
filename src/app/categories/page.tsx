import CategoryManager from "@/app/categories/CategoryManager";
import { CATEGORY_LIMIT, mockCategories } from "@/lib/mockCategories";

export default function CategoriesSettingsPage() {
  return (
    <section className="space-y-10">
      <header className="rounded-[32px] border theme-border-soft theme-bg-card p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">Settings</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-primary">カテゴリ管理</h1>
            <p className="mt-3 text-base text-secondary">
              最大 {CATEGORY_LIMIT} 件のカテゴリを作成・編集・削除し、メモの分類ルールをデザイン段階で検証できます。
            </p>
          </div>
        </div>
      </header>

      <CategoryManager initialCategories={mockCategories} />
    </section>
  );
}

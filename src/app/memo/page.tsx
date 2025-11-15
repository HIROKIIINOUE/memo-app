import Link from "next/link";
import MemoCategoryControls from "@/app/memo/MemoCategoryControls";
import MemoListing from "@/app/memo/MemoListing";
import MemoSearchForm from "@/app/memo/MemoSearchForm";
import { getMemos } from "@/lib/memos";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string | string[];
};

type MemoIndexPageProps = {
  searchParams?: SearchParams | Promise<SearchParams | undefined>;
};

export default async function MemoIndexPage({ searchParams }: MemoIndexPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawQuery = resolvedSearchParams?.q;
  const searchQuery = Array.isArray(rawQuery) ? rawQuery[0] ?? "" : rawQuery ?? "";
  const memos = await getMemos({ searchQuery });
  const serializedMemos = memos.map((memo) => ({
    id: memo.id,
    title: memo.title,
    content: memo.content,
    createdAt: memo.createdAt.toISOString(),
    updatedAt: memo.updatedAt.toISOString(),
  }));
  const isSearchFiltered = Boolean(searchQuery.trim());

  return (
    <section className="space-y-10">
      <header className="rounded-[32px] border theme-border-soft theme-bg-card p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">Memo Library</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-primary">あなたのメモ</h1>
            <p className="mt-3 text-base text-secondary">
              Supabase に保存されたメモを Markdown 形式でブラウズできます。
            </p>
          </div>
          <Link
            href="/memo/new"
            className="btn-shimmer theme-btn-primary rounded-full px-6 py-3 text-sm font-semibold"
          >
            新しいメモを作成
          </Link>
        </div>
        <div className="mt-6 space-y-4">
          <MemoSearchForm initialQuery={searchQuery} />
          <MemoCategoryControls />
        </div>
      </header>

      <MemoListing memos={serializedMemos} isSearchFiltered={isSearchFiltered} />
    </section>
  );
}

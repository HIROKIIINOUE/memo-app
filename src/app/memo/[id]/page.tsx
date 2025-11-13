import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/app/components/MarkdownRenderer";
import { getMemoById } from "@/lib/memos";

type MemoDetailPageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const dynamic = "force-dynamic";

export default async function MemoDetailPage({ params }: MemoDetailPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const memoId = resolvedParams.id;

  if (!memoId) {
    notFound();
  }

  const memo = await getMemoById(memoId);

  if (!memo) {
    notFound();
  }

  return (
    <article className="space-y-8 rounded-[32px] border theme-border-soft theme-bg-card p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/memo"
          className="text-sm font-medium text-secondary underline-offset-4 hover:underline"
        >
          ← メモ一覧に戻る
        </Link>
        <Link
          href="/memo/new"
          className="btn-shimmer theme-btn-primary rounded-full px-5 py-2 text-sm font-semibold"
        >
          新しいメモを作成
        </Link>
      </div>

      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">Memo Detail</p>
        <h1 className="text-4xl font-semibold text-primary">{memo.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-secondary">
          <time>作成: {dateFormatter.format(memo.createdAt)}</time>
          <span className="text-muted">/</span>
          <time>更新: {dateFormatter.format(memo.updatedAt)}</time>
        </div>
      </header>

      <MarkdownRenderer
        content={memo.content}
        emptyFallback={
          <p className="rounded-2xl border border-dashed border-white/20 p-6 text-center text-sm text-muted">
            このメモにはまだ本文がありません。
          </p>
        }
      />
    </article>
  );
}

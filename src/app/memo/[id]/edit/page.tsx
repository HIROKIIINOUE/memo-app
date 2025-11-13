import Link from "next/link";
import { notFound } from "next/navigation";
import { EditMemoForm } from "../EditMemoForm";
import { updateMemoAction } from "../actions";
import { getMemoById } from "@/lib/memos";

type MemoEditPageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function MemoEditPage({ params }: MemoEditPageProps) {
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
    <section className="space-y-8 rounded-[32px] border theme-border-soft theme-bg-card p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/memo/${memo.id}`}
          className="text-sm font-medium text-secondary underline-offset-4 hover:underline"
        >
          ← 詳細ページに戻る
        </Link>
        <Link
          href="/memo"
          className="btn-shimmer theme-btn-secondary rounded-full border px-5 py-2 text-sm font-semibold"
        >
          メモ一覧
        </Link>
      </div>

      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">Edit Memo</p>
        <h1 className="text-4xl font-semibold text-primary">メモ内容を更新</h1>
        <p className="text-sm text-secondary">
          変更を保存すると詳細ページと一覧が即座に更新されます。
        </p>
      </header>

      <EditMemoForm memo={memo} action={updateMemoAction} />
    </section>
  );
}

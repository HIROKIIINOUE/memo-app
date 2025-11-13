import Link from "next/link";

export default function MemoNotFound() {
  return (
    <section className="rounded-[32px] border border-dashed border-white/20 p-12 text-center text-secondary">
      <p className="text-lg font-semibold text-primary">メモが見つかりませんでした。</p>
      <p className="mt-2 text-sm text-muted">
        URL を確認するか、新しいメモを作成してください。
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-semibold">
        <Link href="/memo" className="underline-offset-4 hover:underline">
          メモ一覧へ戻る
        </Link>
        <Link href="/memo/new" className="btn-shimmer theme-btn-primary rounded-full px-5 py-2">
          新しいメモを作成
        </Link>
      </div>
    </section>
  );
}

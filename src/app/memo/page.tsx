import Link from "next/link";
import { getMemos } from "@/lib/memos";

const formatter = new Intl.RelativeTimeFormat("ja-JP", { numeric: "auto" });

const formatRelativeTime = (date: Date) => {
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
};

const PREVIEW_CHAR_LIMIT = 220;

const sanitizePreview = (content?: string | null) => {
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
};

export const dynamic = "force-dynamic";

export default async function MemoIndexPage() {
  const memos = await getMemos();

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
      </header>

      {memos.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-white/15 p-12 text-center text-secondary">
          <p className="text-lg font-medium">まだメモがありません</p>
          <p className="mt-2 text-sm text-muted">「新しいメモを作成」から最初のノートを追加しましょう。</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {memos.map((memo) => (
            <Link
              key={memo.id}
              href={`/memo/${memo.id}`}
              className="group block h-[320px] rounded-[28px] border theme-border-soft theme-bg-card/90 p-5 shadow-[0_25px_60px_rgba(255,255,255,0.12)] transition hover:-translate-y-1 hover:border-white/60"
            >
              <article className="flex h-full flex-col gap-4">
                <header className="space-y-2">
                  <h2 className="text-lg font-semibold text-primary transition group-hover:text-white">
                    {memo.title}
                  </h2>
                  <time className="text-[11px] uppercase tracking-[0.35em] text-muted">
                    {formatRelativeTime(memo.updatedAt)}
                  </time>
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
      )}
    </section>
  );
}

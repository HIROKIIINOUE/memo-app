import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MarkdownRenderer } from "@/app/components/MarkdownRenderer";
import { deleteMemoAction } from "./actions";
import { getMemoById } from "@/lib/memos";
import { getDictionary, getLocaleFromRequest, type Locale } from "@/lib/i18n";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type MemoDetailPageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

const dateTimeFormats: Record<Locale, Intl.DateTimeFormat> = {
  ja: new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }),
  en: new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }),
  fr: new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }),
};

export const dynamic = "force-dynamic";

export default async function MemoDetailPage({ params }: MemoDetailPageProps) {
  const locale = await getLocaleFromRequest();
  const dict = getDictionary(locale).common.memo;
  const dateFormatter = dateTimeFormats[locale] ?? dateTimeFormats.ja;
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const resolvedParams = await Promise.resolve(params);
  const memoId = resolvedParams.id;

  if (!memoId) {
    notFound();
  }

  const memo = await getMemoById(memoId);

  if (!memo) {
    notFound();
  }

  if (!session) {
    redirect(`/signin?redirect=/memo/${memo.id}`);
  }

  return (
    <article className="space-y-8 rounded-[32px] border theme-border-soft theme-bg-card p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/memo"
          className="text-sm font-medium text-secondary underline-offset-4 hover:underline"
        >
          {dict.detailBack}
        </Link>
        <div className="flex w-full max-w-xs flex-col gap-3 sm:w-auto">
          <Link
            href={`/memo/${memo.id}/edit`}
            className="btn-shimmer theme-btn-primary rounded-full px-5 py-2 text-sm font-semibold text-center"
          >
            {dict.detailEdit}
          </Link>
          <form action={deleteMemoAction}>
            <input type="hidden" name="memoId" value={memo.id} />
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(225,29,72,0.35)] transition hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200"
            >
              {dict.detailDelete}
            </button>
          </form>
        </div>
      </div>

      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">Memo Detail</p>
        <h1 className="text-4xl font-semibold text-primary">{memo.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-secondary">
          <time>{dict.createdAt}: {dateFormatter.format(memo.createdAt)}</time>
          <span className="text-muted">/</span>
          <time>{dict.updatedAt}: {dateFormatter.format(memo.updatedAt)}</time>
        </div>
      </header>

      <MarkdownRenderer
        content={memo.content}
        emptyFallback={
          <p className="rounded-2xl border border-dashed border-white/20 p-6 text-center text-sm text-muted">
            {dict.detailEmpty}
          </p>
        }
      />
    </article>
  );
}

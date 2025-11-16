import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EditMemoForm } from "../EditMemoForm";
import { updateMemoAction } from "../actions";
import { getMemoById } from "@/lib/memos";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getDictionary, getLocaleFromRequest } from "@/lib/i18n";

type MemoEditPageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function MemoEditPage({ params }: MemoEditPageProps) {
  const locale = await getLocaleFromRequest();
  const dict = getDictionary(locale).common.memo;
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
    redirect(`/signin?redirect=/memo/${memo.id}/edit`);
  }

  return (
    <section className="space-y-8 rounded-[32px] border theme-border-soft theme-bg-card p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/memo/${memo.id}`}
          className="text-sm font-medium text-secondary underline-offset-4 hover:underline"
        >
          {dict.editBack}
        </Link>
        <Link
          href="/memo"
          className="btn-shimmer theme-btn-secondary rounded-full border px-5 py-2 text-sm font-semibold"
        >
          {dict.memoList}
        </Link>
      </div>

      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">Edit Memo</p>
        <h1 className="text-3xl font-semibold text-primary sm:text-4xl break-words">{dict.editTitle}</h1>
        <p className="text-sm text-secondary leading-relaxed break-words">{dict.editLead}</p>
      </header>

      <EditMemoForm memo={memo} action={updateMemoAction} dict={dict} />
    </section>
  );
}

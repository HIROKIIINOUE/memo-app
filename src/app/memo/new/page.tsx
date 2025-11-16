import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreateMemoForm } from "./CreateMemoForm";
import { createMemoAction } from "./actions";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getDictionary, getLocaleFromRequest } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "新規メモ | Memo Atelier",
  description:
    "Supabase に同期されるメモをMarkdownで作成します。入力中からライブプレビューで書式を確認できます。",
};

export default async function NewMemoPage() {
  const locale = await getLocaleFromRequest();
  const dict = getDictionary(locale).common.memo;

  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/signin?redirect=/memo/new");
  }

  return (
    <div className="pb-16 pt-10 text-primary">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-[32px] border theme-border-soft theme-bg-card p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">Create</p>
          <h1 className="mt-3 text-4xl font-semibold">{dict.newTitle}</h1>
          <p className="mt-3 max-w-3xl text-secondary">
            {dict.newLead}
          </p>
        </header>

        <CreateMemoForm action={createMemoAction} dict={dict} />
      </div>
    </div>
  );
}

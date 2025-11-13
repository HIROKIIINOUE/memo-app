import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreateMemoForm } from "./CreateMemoForm";
import { createMemoAction } from "./actions";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "新規メモ | Memo Atelier",
  description:
    "Supabase に同期されるメモをMarkdownで作成します。入力中からライブプレビューで書式を確認できます。",
};

export default async function NewMemoPage() {
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
          <h1 className="mt-3 text-4xl font-semibold">新しいメモを描き始める</h1>
          <p className="mt-3 max-w-3xl text-secondary">
            Supabase 上の Memo テーブルに即時保存され、後続の検索・分類機能にそのまま活用できます。
            Markdown を使ってリッチな文章を構築しながら、同時に右側のプレビューで結果を確認してください。
          </p>
        </header>

        <CreateMemoForm action={createMemoAction} />
      </div>
    </div>
  );
}

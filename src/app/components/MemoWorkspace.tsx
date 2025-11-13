"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";

type DemoMemo = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
};

const seedMemos: DemoMemo[] = [
  {
    id: "1",
    title: "Apple Pencil リサーチ",
    content: "新しい iPad Pro での描画遅延 7ms -> 4ms。メモ UX への反映を検討。",
    tags: ["research", "hardware"],
    updatedAt: "08:45",
  },
  {
    id: "2",
    title: "Memo Atelier Roadmap",
    content: "- Supabase Realtime\n- PDF Export\n- Collaborative cursors",
    tags: ["product"],
    updatedAt: "昨日",
  },
];

export function MemoWorkspace({
  canUseWorkspace,
}: {
  canUseWorkspace: boolean;
}) {
  const [memos, setMemos] = useState<DemoMemo[]>(seedMemos);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return memos;
    }
    const q = query.toLowerCase();
    return memos.filter(
      (memo) =>
        memo.title.toLowerCase().includes(q) ||
        memo.content.toLowerCase().includes(q) ||
        memo.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [memos, query]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canUseWorkspace) {
      toast.info("ログインが必要です", {
        description: "メモ作成はログイン後にご利用いただけます。",
      });
      return;
    }
    if (!title.trim()) {
      toast.error("タイトルを入力してください");
      return;
    }
    const now = new Date();
    const newMemo: DemoMemo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim() || "(本文なし)",
      tags: ["draft"],
      updatedAt: now.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
    };
    setMemos((prev) => [newMemo, ...prev]);
    setTitle("");
    setContent("");
    toast.success("メモを追加しました", { description: newMemo.title });
  };

  return (
    <div className="rounded-[32px] border theme-border-soft theme-bg-card p-8 backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted">Workspace</p>
          <h2 className="mt-2 text-3xl font-semibold">ライブメモボード</h2>
        </div>
        <div className="text-sm text-muted">
          {canUseWorkspace ? "あなたのメモだけがここに表示されます" : "ログインすると編集が有効になります"}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="text-sm font-medium text-secondary" htmlFor="memo-title">
              タイトル
            </label>
            <input
              id="memo-title"
              type="text"
              className="mt-1 w-full rounded-2xl border bg-transparent px-4 py-3 text-base text-primary outline-none transition focus:border-white/60 focus:bg-white/5"
              placeholder="例: WWDC 2025 メモ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!canUseWorkspace}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-secondary" htmlFor="memo-content">
              内容
            </label>
            <textarea
              id="memo-content"
              className="mt-1 h-32 w-full rounded-2xl border bg-transparent px-4 py-3 text-base text-primary outline-none transition focus:border-white/60 focus:bg-white/5"
              placeholder="Markdown でメモを書き始めましょう"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!canUseWorkspace}
            />
          </div>
          <button
            type="submit"
            className="btn-shimmer theme-btn-primary w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-50"
            disabled={!canUseWorkspace}
          >
            メモを保存
          </button>
          {!canUseWorkspace && (
            <div className="rounded-2xl border border-dashed border-white/20 bg-black/30 p-4 text-sm text-inverse">
              <p className="font-semibold">メモ作成はログイン後にご利用いただけます。</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link href="/signin" className="underline-offset-4 hover:underline">
                  ログイン
                </Link>
                <span className="text-white/50">/</span>
                <Link href="/signup" className="underline-offset-4 hover:underline">
                  アカウント作成
                </Link>
              </div>
            </div>
          )}
        </form>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-secondary" htmlFor="memo-search">
              メモ検索
            </label>
            <input
              id="memo-search"
              type="search"
              placeholder="タイトルやタグで検索"
              className="mt-1 w-full rounded-2xl border bg-transparent px-4 py-3 text-base text-primary outline-none transition focus:border-white/60 focus:bg-white/5"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!canUseWorkspace}
            />
          </div>
          <div className="space-y-3">
            {filtered.map((memo) => (
              <div
                key={memo.id}
                className="rounded-3xl border theme-border-soft theme-bg-glass p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-semibold">{memo.title}</h3>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted">{memo.updatedAt}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-secondary">{memo.content}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                  {memo.tags.map((tag) => (
                    <span key={tag} className="rounded-full border px-3 py-1">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-muted">
                {canUseWorkspace ? "条件に一致するメモがありません" : "ログインするとメモ一覧が表示されます"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

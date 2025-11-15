"use client";

import {
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFormStatus } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { memoMarkdownComponents } from "@/app/components/markdown";
import { TITLE_MAX_LENGTH } from "@/lib/memoRules";
import { CategoryPicker } from "@/app/memo/CategoryPicker";
import { CATEGORIES_PER_MEMO_LIMIT } from "@/lib/mockCategories";
import { loadMemoCategories, saveMemoCategories } from "@/lib/memoCategoryStorage";
import {
  editMemoInitialState,
  type EditMemoAction,
  type EditMemoFormState,
} from "./types";

type EditMemoFormProps = {
  memo: {
    id: string;
    title: string;
    content: string | null;
  };
  action: EditMemoAction;
};

export function EditMemoForm({ memo, action }: EditMemoFormProps) {
  const [title, setTitle] = useState(memo.title);
  const [content, setContent] = useState(memo.content ?? "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    loadMemoCategories(memo.id),
  );
  const [state, formAction] = useActionState(action, editMemoInitialState);

  const titleCount = useMemo(() => title.length, [title]);
  const remaining = TITLE_MAX_LENGTH - titleCount;

  useEffect(() => {
    if (state.status === "success") {
      saveMemoCategories(memo.id, selectedCategories.slice(0, CATEGORIES_PER_MEMO_LIMIT));
    }
  }, [state.status, memo.id, selectedCategories]);

  return (
    <form
      action={formAction}
      className="grid gap-8 lg:grid-cols-2"
      noValidate
    >
      <input type="hidden" name="memoId" value={memo.id} />

      <div className="space-y-6">
        <div className="rounded-[32px] border theme-border-soft theme-bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted">Edit memo</p>
              <h2 className="mt-2 text-2xl font-semibold text-primary">メモを編集</h2>
            </div>
            <span className="rounded-full border px-3 py-1 text-xs text-secondary">
              Markdown + プレビュー
            </span>
          </div>
          <p className="mt-4 text-sm text-secondary">
            タイトルと本文を更新すると、一覧と詳細プレビューが即座に刷新されます。
          </p>
        </div>

        <div className="space-y-5 rounded-[32px] border theme-border-soft theme-bg-card p-6">
          <label className="block space-y-2" htmlFor="edit-memo-title">
            <div className="flex items-center justify-between text-sm font-medium text-secondary">
              <span>タイトル</span>
              <span className={remaining < 0 ? "text-rose-400" : "text-muted"}>
                {titleCount}/{TITLE_MAX_LENGTH}
              </span>
            </div>
            <input
              id="edit-memo-title"
              name="title"
              required
              maxLength={TITLE_MAX_LENGTH}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border bg-transparent px-4 py-3 text-base text-primary outline-none transition focus:border-white/60 focus:bg-white/5"
            />
          </label>

          <label className="block space-y-2" htmlFor="edit-memo-content">
            <span className="text-sm font-medium text-secondary">本文（Markdown対応）</span>
            <textarea
              id="edit-memo-content"
              name="content"
              rows={12}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="w-full rounded-2xl border bg-transparent px-4 py-3 text-base text-primary outline-none transition focus:border-white/60 focus:bg-white/5"
            />
          </label>

          <div>
            <CategoryPicker
              selectedIds={selectedCategories}
              onChange={setSelectedCategories}
              helperText="現在はローカルに保存される暫定仕様です。まもなく Supabase へ同期されます。"
            />
          </div>

          <StatusMessage state={state} />

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-[32px] border theme-border-soft theme-bg-card/60 p-6 backdrop-blur">
        <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-muted">
          <span>Preview</span>
          <span>Live Markdown</span>
        </div>
        <div className="rounded-3xl border theme-border-soft bg-black/20 p-5 text-primary">
          <p className="text-xl font-semibold text-primary">
            {title.trim() || "タイトルのプレビュー"}
          </p>
          <div className="markdown-preview mt-4 rounded-2xl border border-white/5 bg-black/10 p-4 text-sm leading-relaxed text-secondary">
            {content.trim() ? (
              <ReactMarkdown
                components={memoMarkdownComponents}
                remarkPlugins={[remarkGfm]}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-muted">Markdown を入力するとここにプレビューが表示されます。</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

function StatusMessage({ state }: { state: EditMemoFormState }) {
  let message = "変更内容は Supabase に保存されます。";
  let tone = "text-muted";

  if (state.status === "success") {
    message = "保存しました。すべてのビューを更新済みです。";
    tone = "text-emerald-300";
  } else if (state.status === "error") {
    message = state.message;
    tone = "text-rose-300";
  }

  return (
    <p className={`text-sm ${tone}`} aria-live="polite">
      {message}
    </p>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn-shimmer theme-btn-primary rounded-full px-8 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "保存中..." : "変更を保存"}
    </button>
  );
}

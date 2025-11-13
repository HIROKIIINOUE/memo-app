"use client";

import {
  useActionState,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentPropsWithoutRef } from "react";
import { useFormStatus } from "react-dom";
import ReactMarkdown from "react-markdown";
import type { Components, ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import { TITLE_MAX_LENGTH } from "@/lib/memoRules";
import {
  createMemoInitialState,
  type CreateMemoAction,
  type CreateMemoFormState,
} from "./types";

type CreateMemoFormProps = {
  action: CreateMemoAction;
};

export function CreateMemoForm({ action }: CreateMemoFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [state, formAction] = useActionState(action, createMemoInitialState);
  const formRef = useRef<HTMLFormElement>(null);

  const resetDraft = useEffectEvent(() => {
    formRef.current?.reset();
    setTitle("");
    setContent("");
  });

  useEffect(() => {
    if (state.status === "success") {
      resetDraft();
    }
  }, [state.status]);

  const titleCount = useMemo(() => title.length, [title]);
  const remaining = TITLE_MAX_LENGTH - titleCount;

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-8 lg:grid-cols-2"
    >
      <div className="space-y-6">
        <div className="rounded-[32px] border theme-border-soft theme-bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted">New memo</p>
              <h2 className="mt-2 text-2xl font-semibold text-primary">メモを作成</h2>
            </div>
            <span className="rounded-full border px-3 py-1 text-xs text-secondary">
              Markdown + プレビュー
            </span>
          </div>
          <p className="mt-4 text-sm text-secondary">
            タイトルを 1 行でまとめ、本文には Markdown を使用できます。
            入力中の内容は右側でライブレンダリングされます。
          </p>
        </div>

        <div className="space-y-5 rounded-[32px] border theme-border-soft theme-bg-card p-6">
          <label className="block space-y-2" htmlFor="memo-title">
            <div className="flex items-center justify-between text-sm font-medium text-secondary">
              <span>タイトル</span>
              <span className={remaining < 0 ? "text-rose-400" : "text-muted"}>
                {titleCount}/{TITLE_MAX_LENGTH}
              </span>
            </div>
            <input
              id="memo-title"
              name="title"
              required
              maxLength={TITLE_MAX_LENGTH}
              className="w-full rounded-2xl border bg-transparent px-4 py-3 text-base text-primary outline-none transition focus:border-white/60 focus:bg-white/5"
              placeholder="今日の気づきを 1 行で要約..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="block space-y-2" htmlFor="memo-content">
            <span className="text-sm font-medium text-secondary">本文（Markdown対応）</span>
            <textarea
              id="memo-content"
              name="content"
              rows={12}
              className="w-full rounded-2xl border bg-transparent px-4 py-3 text-base text-primary outline-none transition focus:border-white/60 focus:bg-white/5"
              placeholder="# 見出し\n- 箇条書き\n**強調** も自由自在"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </label>

          <StatusMessage state={state} />

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </div>
      </div>

      <PreviewPanel content={content} title={title} />
    </form>
  );
}

function StatusMessage({ state }: { state: CreateMemoFormState }) {
  let message = "保存すると Supabase に同期されます。";
  let tone = "text-muted";

  if (state.status === "success") {
    message = "保存しました。続けて追記できます。";
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
      {pending ? "保存中..." : "メモを保存"}
    </button>
  );
}

function PreviewPanel({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-[32px] border theme-border-soft theme-bg-card/60 p-6 backdrop-blur">
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-muted">
        <span>Preview</span>
        <span>Markdown</span>
      </div>
      <div className="space-y-4 rounded-3xl border theme-border-soft bg-black/20 p-5 text-primary">
        <p className="text-xl font-semibold text-primary">
          {title.trim() || "タイトルのプレビュー"}
        </p>
        <div className="markdown-preview rounded-2xl border border-white/5 bg-black/10 p-4 text-base leading-relaxed text-secondary">
          {content.trim() ? (
            <ReactMarkdown
              components={markdownComponents}
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
  );
}

type MarkdownCodeProps = ComponentPropsWithoutRef<"code"> &
  ExtraProps & {
    inline?: boolean;
  };

const markdownComponents: Components = {
  h1: ({ className, ...props }) => (
    <h1
      {...props}
      className={mergeClassName(
        "mt-6 text-2xl font-semibold text-primary first:mt-0",
        className,
      )}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      {...props}
      className={mergeClassName(
        "mt-5 text-xl font-semibold text-primary first:mt-0",
        className,
      )}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      {...props}
      className={mergeClassName(
        "mt-4 text-lg font-semibold text-primary first:mt-0",
        className,
      )}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      {...props}
      className={mergeClassName(
        "mt-4 text-base font-semibold text-primary first:mt-0",
        className,
      )}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5
      {...props}
      className={mergeClassName(
        "mt-4 text-base font-semibold text-primary uppercase tracking-wide first:mt-0",
        className,
      )}
    />
  ),
  h6: ({ className, ...props }) => (
    <h6
      {...props}
      className={mergeClassName(
        "mt-4 text-sm font-semibold text-primary uppercase tracking-[0.3em] first:mt-0",
        className,
      )}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      {...props}
      className={mergeClassName("my-4 text-secondary", className)}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      {...props}
      className={mergeClassName(
        "my-4 list-disc space-y-2 pl-6 text-secondary",
        className,
      )}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      {...props}
      className={mergeClassName(
        "my-4 list-decimal space-y-2 pl-6 text-secondary",
        className,
      )}
    />
  ),
  li: ({ className, ...props }) => (
    <li {...props} className={mergeClassName("leading-relaxed", className)} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      {...props}
      className={mergeClassName(
        "my-4 border-l-4 border-white/20 pl-4 italic text-secondary",
        className,
      )}
    />
  ),
  code: ({ inline, className, children, ...props }: MarkdownCodeProps) => {
    if (inline) {
      return (
        <code
          {...props}
          className={mergeClassName(
            "rounded-xl border border-white/10 bg-white/10 px-2 py-0.5 font-mono text-xs text-primary",
            className,
          )}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        {...props}
        className={mergeClassName(
          "block font-mono text-sm text-primary",
          className,
        )}
      >
        {children}
      </code>
    );
  },
  pre: ({ className, ...props }) => (
    <pre
      {...props}
      className={mergeClassName(
        "my-4 overflow-x-auto rounded-2xl border border-white/5 bg-black/60 p-4 text-sm text-secondary",
        className,
      )}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      {...props}
      className={mergeClassName(
        "font-medium text-sky-300 underline-offset-4 hover:underline",
        className,
      )}
    />
  ),
  strong: ({ className, ...props }) => (
    <strong
      {...props}
      className={mergeClassName("font-semibold text-primary", className)}
    />
  ),
  em: ({ className, ...props }) => (
    <em
      {...props}
      className={mergeClassName("text-secondary italic", className)}
    />
  ),
};

function mergeClassName(base: string, additional?: string) {
  return [base, additional].filter(Boolean).join(" ");
}

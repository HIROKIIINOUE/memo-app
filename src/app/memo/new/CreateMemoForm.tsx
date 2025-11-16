"use client";

import {
  useActionState,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFormStatus } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TITLE_MAX_LENGTH } from "@/lib/memoRules";
import { CategoryPicker } from "@/app/memo/CategoryPicker";
import { CATEGORIES_PER_MEMO_LIMIT } from "@/lib/mockCategories";
import { saveMemoCategories } from "@/lib/memoCategoryStorage";
import { memoMarkdownComponents } from "@/app/components/markdown";
import type { CommonCopy } from "@/lib/i18n";
import {
  createMemoInitialState,
  type CreateMemoAction,
  type CreateMemoFormState,
} from "./types";

type CreateMemoFormProps = {
  action: CreateMemoAction;
  dict: CommonCopy["memo"];
};

export function CreateMemoForm({ action, dict }: CreateMemoFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [state, formAction] = useActionState(action, createMemoInitialState);
  const formRef = useRef<HTMLFormElement>(null);
  const lastSubmittedCategories = useRef<string[]>([]);

  const resetDraft = useEffectEvent(() => {
    formRef.current?.reset();
    setTitle("");
    setContent("");
    setSelectedCategories([]);
  });

  useEffect(() => {
    if (state.status === "success") {
      resetDraft();
    }
  }, [state.status]);

  useEffect(() => {
    lastSubmittedCategories.current = selectedCategories;
  }, [selectedCategories]);

  useEffect(() => {
    if (state.status === "success") {
      saveMemoCategories(
        state.memoId,
        lastSubmittedCategories.current.slice(0, CATEGORIES_PER_MEMO_LIMIT),
      );
    }
  }, [state]);

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
              <h2 className="mt-2 text-2xl font-semibold text-primary">{dict.form.sectionTitle}</h2>
            </div>
            <span className="rounded-full border px-3 py-1 text-xs text-secondary">
              {dict.form.markdown}
            </span>
          </div>
          <p className="mt-4 text-sm text-secondary">
            {dict.form.tip}
          </p>
        </div>

        <div className="space-y-5 rounded-[32px] border theme-border-soft theme-bg-card p-6">
          <label className="block space-y-2" htmlFor="memo-title">
            <div className="flex items-center justify-between text-sm font-medium text-secondary">
              <span>{dict.form.title}</span>
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
              placeholder={dict.form.title}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="block space-y-2" htmlFor="memo-content">
            <span className="text-sm font-medium text-secondary">{dict.form.content}</span>
            <textarea
              id="memo-content"
              name="content"
              rows={12}
              className="w-full rounded-2xl border bg-transparent px-4 py-3 text-base text-primary outline-none transition focus:border-white/60 focus:bg-white/5"
              placeholder={dict.form.content}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </label>

          <div>
            <input type="hidden" name="categoryIds" value={selectedCategories.join(",")} />
            <CategoryPicker
              selectedIds={selectedCategories}
              onChange={setSelectedCategories}
              helperText={dict.form.categoryHelper}
              dict={dict.form.categoryPicker}
            />
          </div>

          <StatusMessage state={state} dict={dict} />

          <div className="flex justify-end">
            <SubmitButton dict={dict} />
          </div>
        </div>
      </div>

      <PreviewPanel content={content} title={title} dict={dict} />
    </form>
  );
}

function StatusMessage({ state, dict }: { state: CreateMemoFormState; dict: CommonCopy["memo"] }) {
  let message = dict.form.statusDefault;
  let tone = "text-muted";

  if (state.status === "success") {
    message = dict.form.statusSuccess;
    tone = "text-emerald-300";
  } else if (state.status === "error") {
    message = state.message || dict.form.statusError;
    tone = "text-rose-300";
  }

  return (
    <p className={`text-sm ${tone}`} aria-live="polite">
      {message}
    </p>
  );
}

function SubmitButton({ dict }: { dict: CommonCopy["memo"] }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn-shimmer theme-btn-primary rounded-full px-8 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? dict.form.statusSaving : dict.form.statusSave}
    </button>
  );
}

function PreviewPanel({ title, content, dict }: { title: string; content: string; dict: CommonCopy["memo"] }) {
  return (
    <div className="rounded-[32px] border theme-border-soft theme-bg-card/60 p-6 backdrop-blur">
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-muted">
        <span>Preview</span>
        <span>Markdown</span>
      </div>
      <div className="space-y-4 rounded-3xl border theme-border-soft bg-black/20 p-5 text-primary">
        <p className="text-xl font-semibold text-primary">
          {title.trim() || dict.form.previewTitle}
        </p>
        <div className="markdown-preview rounded-2xl border border-white/5 bg-black/10 p-4 text-base leading-relaxed text-secondary">
          {content.trim() ? (
            <ReactMarkdown
              components={memoMarkdownComponents}
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-muted">{dict.form.previewEmpty}</p>
          )}
        </div>
      </div>
    </div>
  );
}

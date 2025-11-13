import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { memoMarkdownComponents } from "@/app/components/markdown";

type MarkdownRendererProps = {
  content: string | null | undefined;
  className?: string;
  emptyFallback?: ReactNode;
};

const joinClassName = (...classes: Array<string | undefined>) =>
  classes.filter(Boolean).join(" ");

export function MarkdownRenderer({
  content,
  className,
  emptyFallback,
}: MarkdownRendererProps) {
  const value = content?.trim();

  if (!value) {
    if (emptyFallback) {
      return <>{emptyFallback}</>;
    }
    return null;
  }

  return (
    <div className={joinClassName("markdown-preview space-y-4 text-secondary", className)}>
      <ReactMarkdown
        components={memoMarkdownComponents}
        remarkPlugins={[remarkGfm]}
      >
        {value}
      </ReactMarkdown>
    </div>
  );
}

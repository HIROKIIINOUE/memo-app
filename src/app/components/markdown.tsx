import type { ComponentPropsWithoutRef } from "react";
import type { Components, ExtraProps } from "react-markdown";

type MarkdownCodeProps = ComponentPropsWithoutRef<"code"> &
  ExtraProps & {
    inline?: boolean;
  };

const mergeClassName = (base: string, additional?: string) =>
  [base, additional].filter(Boolean).join(" ");

export const memoMarkdownComponents: Components = {
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

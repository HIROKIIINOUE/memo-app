"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CommonCopy } from "@/lib/i18n";

type MemoSearchFormProps = {
  initialQuery?: string;
  dict: CommonCopy["memo"];
};

const DEBOUNCE_DELAY = 300;

export function MemoSearchForm({ initialQuery = "", dict }: MemoSearchFormProps) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = useMemo(() => searchParams?.toString() ?? "", [searchParams]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  const updateQuery = useCallback(
    (nextValue: string) => {
      const params = new URLSearchParams(searchParamsString);
      const trimmed = nextValue.trim();

      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      const queryString = params.toString();
      const href = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(href, { scroll: false });
    },
    [pathname, router, searchParamsString],
  );

  const debouncedUpdate = useCallback(
    (nextValue: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        updateQuery(nextValue);
      }, DEBOUNCE_DELAY);
    },
    [updateQuery],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    debouncedUpdate(nextValue);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQuery(value);
  };

  const handleClear = () => {
    setValue("");
    updateQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <label htmlFor="memo-search" className="sr-only">
        {dict.searchLabel}
      </label>
      <div className="flex items-center overflow-hidden rounded-full border theme-border-soft bg-white/5 px-5 py-3 shadow-inner shadow-white/5">
        <input
          id="memo-search"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={dict.searchPlaceholder}
          className="ml-4 flex-1 bg-transparent text-sm text-secondary placeholder:text-muted focus:outline-none"
          style={{ minWidth: 0 }}
          aria-label={dict.searchLabel}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full px-3 py-1 text-xs font-medium text-muted transition hover:text-white"
          >
            {dict.searchClear}
          </button>
        )}
      </div>
    </form>
  );
}

export default MemoSearchForm;

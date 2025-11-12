"use client";

import { useMemo } from "react";
import { useTheme } from "./ThemeProvider";

const iconClass =
  "h-4 w-4 stroke-[1.6px] text-secondary transition-colors duration-300";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const icon = useMemo(() => {
    if (isLight) {
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 17.5A5.5 5.5 0 1 0 12 6.5a5.5 5.5 0 0 0 0 11ZM12 1v2M12 21v2M4.22 4.22 5.64 5.64M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78 5.64 18.36M18.36 5.64l1.42-1.42"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return (
      <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M21 15.5a9 9 0 1 1-12.5-12.5 7 7 0 0 0 12.5 12.5Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }, [isLight]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "ダークモードに切り替え" : "ライトモードに切り替え"}
      className="btn-shimmer theme-btn-ghost inline-flex h-10 w-10 items-center justify-center rounded-full border transition duration-300"
    >
      {icon}
    </button>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { CommonCopy } from "@/lib/i18n";

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

export function SigninForm({ dict }: { dict: CommonCopy["auth"]["signin"] }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setStatus({ state: "error", message: dict.error });
      return;
    }

    setStatus({ state: "loading" });

    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        const message = error.message || "メール送信に失敗しました";
        setStatus({ state: "error", message });
        toast.error(message);
        return;
      }

      const successMessage = dict.success;
      setStatus({
        state: "success",
        message: successMessage,
      });
      toast.success(dict.toastTitle, {
        description: dict.toastDesc,
      });
      setEmail("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "通信中にエラーが発生しました";
      setStatus({
        state: "error",
        message,
      });
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <label className="block space-y-2" htmlFor="signin-email">
        <span className="text-sm font-medium text-secondary">{dict.field}</span>
        <input
          id="signin-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          className="w-full rounded-2xl border bg-transparent px-4 py-3 text-base text-primary outline-none transition focus:border-white/60 focus:bg-white/5 focus:shadow-[0_20px_45px_rgba(15,15,35,0.45)]"
          placeholder={dict.placeholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status.state === "loading"}
        />
      </label>
      <button
        type="submit"
        className="btn-shimmer theme-btn-primary flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
        disabled={status.state === "loading"}
      >
        {status.state === "loading" ? dict.loading : dict.ctaSignin}
      </button>
      <p
        className={`text-sm ${
          status.state === "success"
            ? "text-green-400"
            : status.state === "error"
              ? "text-rose-300"
              : "text-muted"
        }`}
        aria-live="polite"
      >
        {status.state === "idle" && dict.idleHint}
        {status.state === "success" && status.message}
        {status.state === "error" && status.message}
      </p>
    </form>
  );
}

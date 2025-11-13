"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type CallbackStatus =
  | { type: "loading"; message: string }
  | { type: "error"; message: string };

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>({
    type: "loading",
    message: "サインアップを確定しています...",
  });

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const finishWithTokens = async () => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          window.history.replaceState(null, "", window.location.pathname);
          toast.success("サインインしました", {
            description: "メモボードに移動します。",
          });
          router.replace("/");
          return true;
        }
      }
      return false;
    };

    const finishWithCode = async () => {
      const code = searchParams.get("code");
      if (!code) {
        return false;
      }
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setStatus({ type: "error", message: error.message });
        toast.error(error.message || "サインインに失敗しました");
        return true;
      }
      toast.success("サインインしました", {
        description: "メモボードに移動します。",
      });
      router.replace("/");
      return true;
    };

    const finalize = async () => {
      try {
        const handledByHash = await finishWithTokens();
        if (handledByHash) {
          return;
        }
        const handledByCode = await finishWithCode();
        if (handledByCode) {
          return;
        }
        const message =
          "サインアップ情報を確認できませんでした。メールのリンクを再度お試しください。";
        setStatus({
          type: "error",
          message,
        });
        toast.error(message);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "処理中に問題が発生しました。";
        setStatus({
          type: "error",
          message,
        });
        toast.error(message);
      }
    };

    void finalize();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center text-primary">
      {status.type === "loading" ? (
        <>
          <div className="h-16 w-16 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          <p className="text-secondary">{status.message}</p>
          <p className="text-sm text-muted">この処理には数秒かかることがあります。</p>
        </>
      ) : (
        <>
          <p className="text-lg font-semibold text-rose-200">サインアップエラー</p>
          <p className="text-secondary">{status.message}</p>
          <button
            type="button"
            className="btn-shimmer theme-btn-primary rounded-full px-6 py-2 text-sm font-semibold"
            onClick={() => router.replace("/signup")}
          >
            サインアップ画面に戻る
          </button>
        </>
      )}
    </div>
  );
}

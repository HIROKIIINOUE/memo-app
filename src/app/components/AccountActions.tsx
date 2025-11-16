"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { CommonCopy } from "@/lib/i18n";

type AccountActionsProps = {
  dict: CommonCopy["auth"];
};

export function AccountActions({ dict }: AccountActionsProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setError(error.message);
      }
      setSession(data.session ?? null);
      setLoading(false);
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        toast.error(error.message || dict.callback.signinError);
      } else {
        toast.success(dict.action?.signoutSuccess ?? "Signed out");
        router.refresh();
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : (dict.callback.signinError ?? "Failed to sign out");
      setError(message);
      toast.error(message);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="h-10 w-32 animate-pulse rounded-full bg-white/10" aria-hidden="true" />
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/signin"
          className="btn-shimmer theme-btn-secondary hidden rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 md:inline-flex"
        >
          {dict.action?.signin ?? "Sign in"}
        </Link>
        <Link
          href="/signup"
          className="btn-shimmer theme-btn-primary rounded-full px-5 py-2 text-sm font-semibold transition duration-300"
        >
          {dict.action?.startFree ?? "Start free"}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden flex-col text-right text-xs text-muted md:flex">
        <span className="text-secondary">{dict.action?.signedIn ?? "Signed in"}</span>
        <span className="text-[11px] text-primary">{session.user.email}</span>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="btn-shimmer theme-btn-secondary rounded-full border px-4 py-2 text-sm font-semibold transition duration-300"
        disabled={isSigningOut}
      >
        {isSigningOut ? (dict.action?.signingOut ?? "Signing out...") : (dict.action?.signout ?? "Sign out")}
      </button>
      {error && <span className="text-xs text-rose-300">{error}</span>}
    </div>
  );
}

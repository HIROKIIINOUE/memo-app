"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      theme="system"
      position="top-center"
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-white/10 bg-black/70 text-white shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl",
          success: "bg-emerald-500/20",
          error: "bg-rose-500/20",
        },
      }}
      richColors
      closeButton
    />
  );
}

import type { Metadata } from "next";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = {
  title: "メールサインアップ | Memo Atelier",
  description:
    "メールアドレスだけで Memo Atelier に参加できます。Apple ライクなモダン体験を堪能するための招待リンクを受け取りましょう。",
};

export default function SignupPage() {
  return (
    <div className="pb-24 pt-16">
      <div className="mx-auto max-w-3xl rounded-[40px] border theme-border-soft theme-bg-card p-10 text-primary backdrop-blur-2xl">
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">Sign Up</p>
          <h1 className="text-4xl font-semibold">メールで招待リンクを受け取る</h1>
          <p className="text-secondary">
            メールアドレスを送信すると、確認リンクをお送りします。クリックするだけでサインアップが完了し、メモ体験をすぐに始められます。
          </p>
        </div>
        <div className="mt-10">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

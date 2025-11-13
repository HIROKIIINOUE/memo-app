import type { Metadata } from "next";
import Link from "next/link";
import { SigninForm } from "./SigninForm";

export const metadata: Metadata = {
  title: "メールサインイン | Memo Atelier",
  description:
    "メールアドレスのみで Memo Atelier にサインインできます。Magic Link を受信して、数秒でノートを再開しましょう。",
};

export default function SigninPage() {
  return (
    <div className="pb-24 pt-16">
      <div className="mx-auto max-w-3xl rounded-[40px] border theme-border-soft theme-bg-card p-10 text-primary backdrop-blur-2xl">
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">Sign In</p>
          <h1 className="text-4xl font-semibold">メールリンクで素早くサインイン</h1>
          <p className="text-secondary">
            登録済みのメールアドレスを入力すると、Magic Link を送信します。リンクを開くだけでサインインが完了し、ホームにリダイレクトされます。
          </p>
          <p className="text-sm text-muted">
            アカウントをまだお持ちでない場合は、
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              こちらからサインアップ
            </Link>
            してください。
          </p>
        </div>
        <div className="mt-10">
          <SigninForm />
        </div>
      </div>
    </div>
  );
}

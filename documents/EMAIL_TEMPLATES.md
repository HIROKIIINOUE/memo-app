# Supabase Auth メールテンプレート (Memo Atelier)

Supabase Auth の「Confirm signup」「Magic Link」などのメールは Supabase ダッシュボードから編集します。このファイルは日本語テンプレートの雛形です。カスタマイズ後は Dashboard → **Auth** → **Templates** で各テンプレートに貼り付けてください。

## 共通セットアップ
1. Supabase ダッシュボードで対象プロジェクトを開く。
2. 左メニュー **Auth** → **Templates** を開き、カスタマイズしたいテンプレート（`Confirm signup`, `Magic Link`, `Reset password` など）を選択。
3. 本ドキュメントの件名・HTML をコピーして保存。テキスト版も必要であれば HTML を簡略化して貼り付ける。
4. プレースホルダー（例: `{{ .Email }}`, `{{ .ConfirmationURL }}`）は Supabase が実行時に置換するため削除しないこと。

> 参考: [Supabase Auth Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

---

## Confirm signup (Sign up)
- **Subject**: `[Memo Atelier] Confirm your sign up`
- **HTML Body**:

```html
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#0d0f17;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;color:#f4f6fb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;padding:32px;">
      <tr>
        <td style="text-align:center;padding-bottom:24px;">
          <p style="margin:0;font-size:12px;letter-spacing:0.4em;text-transform:uppercase;color:#a9b4d0;">Memo Atelier</p>
          <h1 style="margin-top:12px;font-size:24px;font-weight:600;color:#ffffff;">Finish signing up</h1>
        </td>
      </tr>
      <tr>
        <td style="background:rgba(255,255,255,0.05);border-radius:24px;padding:28px;border:1px solid rgba(255,255,255,0.12);">
          <p style="margin-top:0;line-height:1.7;color:#c7d2f0;">
            We received a request to create your Memo Atelier account for {{ .Email }}.<br />
            Tap the button within 10 minutes to confirm.
          </p>
          <p style="text-align:center;margin:32px 0;">
            <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 36px;background:#ffffff;color:#050505;border-radius:999px;font-weight:600;text-decoration:none;">
              Confirm sign up
            </a>
          </p>
          <p style="margin:0;line-height:1.6;color:#98a2c7;font-size:13px;">
            If the button doesn’t work, paste this URL into your browser:<br />
            <span style="word-break:break-all;color:#d4daff;">{{ .ConfirmationURL }}</span>
          </p>
        </td>
      </tr>
      <tr>
        <td style="text-align:center;padding-top:24px;color:#7f89a8;font-size:12px;line-height:1.5;">
          If you didn’t request this, feel free to ignore this email.<br />
          © {{ .CurrentYear }} Memo Atelier
        </td>
      </tr>
    </table>
  </body>
</html>
```

## Magic Link / Sign in with OTP
- **Subject**: `[Memo Atelier] Sign-in link`
- **HTML Body**:

```html
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#0d0f17;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;color:#f4f6fb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;padding:32px;">
      <tr>
        <td style="text-align:center;padding-bottom:24px;">
          <p style="margin:0;font-size:12px;letter-spacing:0.4em;text-transform:uppercase;color:#a9b4d0;">Memo Atelier</p>
          <h1 style="margin-top:12px;font-size:24px;font-weight:600;color:#ffffff;">Sign in with one tap</h1>
        </td>
      </tr>
      <tr>
        <td style="background:rgba(255,255,255,0.05);border-radius:24px;padding:28px;border:1px solid rgba(255,255,255,0.12);">
          <p style="margin-top:0;line-height:1.7;color:#c7d2f0;">
            Open the Magic Link below to get back to your notes.<br />
            The link expires in 10 minutes.
          </p>
          <p style="text-align:center;margin:32px 0;">
            <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 36px;background:#ffffff;color:#050505;border-radius:999px;font-weight:600;text-decoration:none;">
              Sign in
            </a>
          </p>
          <p style="margin:0;line-height:1.6;color:#98a2c7;font-size:13px;">
            If the button doesn’t work, paste this URL into your browser:<br />
            <span style="word-break:break-all;color:#d4daff;">{{ .ConfirmationURL }}</span>
          </p>
        </td>
      </tr>
      <tr>
        <td style="text-align:center;padding-top:24px;color:#7f89a8;font-size:12px;line-height:1.5;">
          This link is unique to you. If you didn’t request it, you can ignore this email.<br />
          © {{ .CurrentYear }} Memo Atelier
        </td>
      </tr>
    </table>
  </body>
</html>
```

## メンテナンスメモ
- Memo Atelier のブランドカラーや文言を変更したら本ファイルも更新し、Supabase ダッシュボードに再適用する。
- 追加で「パスワードリセット」「招待メール」などが必要な場合は同スタイルで追記する。
- HTML のテキスト版が必要な場合は、段落テキストをそのまま貼り付けるか、自動生成ツールを活用してプレーンテキスト化する。
- 英語ベースで構成しつつ、ボタンテキストは簡潔にし、誰でも直感的にクリックできるよう余白とコントラストを十分確保している。

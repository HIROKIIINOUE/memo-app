# Supabase Auth メールテンプレート (Memo Atelier)

Supabase Auth の「Confirm signup」「Magic Link」などのメールは Supabase ダッシュボードから編集します。このファイルは日本語テンプレートの雛形です。カスタマイズ後は Dashboard → **Auth** → **Templates** で各テンプレートに貼り付けてください。

## 共通セットアップ
1. Supabase ダッシュボードで対象プロジェクトを開く。
2. 左メニュー **Auth** → **Templates** を開き、カスタマイズしたいテンプレート（`Confirm signup`, `Magic Link`, `Reset password` など）を選択。
3. 本ドキュメントの件名・HTML をコピーして保存。テキスト版も必要であれば HTML を簡略化して貼り付ける。
4. プレースホルダー（例: `{{ .Email }}`, `{{ .ConfirmationURL }}`）は Supabase が実行時に置換するため削除しないこと。

> 参考: [Supabase Auth Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

---

## サインアップ確認 (Confirm signup)
- **Subject**: `[Memo Atelier] サインアップのご案内`
- **HTML Body**:

```html
<!DOCTYPE html>
<html lang="ja">
  <body style="margin:0;padding:0;background-color:#0d0f17;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;color:#f4f6fb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;padding:32px;">
      <tr>
        <td style="text-align:center;padding-bottom:24px;">
          <p style="margin:0;font-size:12px;letter-spacing:0.4em;text-transform:uppercase;color:#a9b4d0;">Memo Atelier</p>
          <h1 style="margin-top:12px;font-size:24px;font-weight:600;color:#ffffff;">サインアップを完了してください</h1>
        </td>
      </tr>
      <tr>
        <td style="background:rgba(255,255,255,0.05);border-radius:24px;padding:28px;border:1px solid rgba(255,255,255,0.12);">
          <p style="margin-top:0;line-height:1.7;color:#c7d2f0;">
            {{ .Email }} 宛に Memo Atelier への参加リクエストを受け付けました。
            下のボタンをクリックして 10 分以内にサインアップを完了してください。
          </p>
          <p style="text-align:center;margin:32px 0;">
            <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 36px;background:#ffffff;color:#050505;border-radius:999px;font-weight:600;text-decoration:none;">
              サインアップを確定する
            </a>
          </p>
          <p style="margin:0;line-height:1.6;color:#98a2c7;font-size:13px;">
            ボタンが機能しない場合は、以下の URL をブラウザに貼り付けてください:<br />
            <span style="word-break:break-all;color:#d4daff;">{{ .ConfirmationURL }}</span>
          </p>
        </td>
      </tr>
      <tr>
        <td style="text-align:center;padding-top:24px;color:#7f89a8;font-size:12px;line-height:1.5;">
          このメールに心当たりがない場合は破棄してください。<br />
          © {{ .CurrentYear }} Memo Atelier
        </td>
      </tr>
    </table>
  </body>
</html>
```

## サインイン (Magic Link / Sign in with OTP)
- **Subject**: `[Memo Atelier] サインインリンク`
- **HTML Body**:

```html
<!DOCTYPE html>
<html lang="ja">
  <body style="margin:0;padding:0;background-color:#0d0f17;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;color:#f4f6fb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;padding:32px;">
      <tr>
        <td style="text-align:center;padding-bottom:24px;">
          <p style="margin:0;font-size:12px;letter-spacing:0.4em;text-transform:uppercase;color:#a9b4d0;">Memo Atelier</p>
          <h1 style="margin-top:12px;font-size:24px;font-weight:600;color:#ffffff;">ワンクリックでサインイン</h1>
        </td>
      </tr>
      <tr>
        <td style="background:rgba(255,255,255,0.05);border-radius:24px;padding:28px;border:1px solid rgba(255,255,255,0.12);">
          <p style="margin-top:0;line-height:1.7;color:#c7d2f0;">
            Memo Atelier へのアクセスを再開するには、以下の Magic Link を開いてください。
            リンクの有効期限は 10 分です。
          </p>
          <p style="text-align:center;margin:32px 0;">
            <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 36px;background:#ffffff;color:#050505;border-radius:999px;font-weight:600;text-decoration:none;">
              サインインする
            </a>
          </p>
          <p style="margin:0;line-height:1.6;color:#98a2c7;font-size:13px;">
            ボタンが機能しない場合は、以下の URL をブラウザに貼り付けてください:<br />
            <span style="word-break:break-all;color:#d4daff;">{{ .ConfirmationURL }}</span>
          </p>
        </td>
      </tr>
      <tr>
        <td style="text-align:center;padding-top:24px;color:#7f89a8;font-size:12px;line-height:1.5;">
          セキュリティのため、このリンクは本人のみに届いています。<br />
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

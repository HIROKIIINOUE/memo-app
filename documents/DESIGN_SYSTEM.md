# Memo Atelier デザインシステム

Apple のヒューマンインターフェイスガイドライン(HIG)に着想を得た、モダンかつ高級感のある UI/UX を再現するための共通ルールです。新機能やページを追加する際は必ず本ドキュメントを参照し、レイアウト・カラー・トーン&マナーを揃えてください。

## 1. デザイン原則
- **静かな自信**: 余白とタイポグラフィで情報を整理し、主張しすぎない。色は必要最低限に抑え、アクセントは光沢やグラデーションで表現する。
- **層と奥行き**: ガラス質感、ぼかし、柔らかい影を組み合わせて、Apple らしい物理的な奥行きを演出する。
- **意図的なモーション**: 過剰なアニメーションを避け、`transition` は 300–600ms 程度で穏やかに。ステータス変化やコンテキスト切り替えにのみ使用する。
- **アクセシビリティ優先**: ダークモード時でも 4.5:1 以上のコントラストを確保。インタラクティブ要素にはフォーカスリングか明示的な hover/focus state を設ける。

## 2. カラートークン
カラーは `src/app/globals.css` の CSS カスタムプロパティを唯一のソースとし、Tailwind と組み合わせて使用します。新色を追加する場合は必ず light/dark 両方に対応させてください。

| Token | Light | Dark | 用途 |
| --- | --- | --- | --- |
| `--page-bg` | `#f6f6f8` | `#030305` | ページ背景。濁りのないニュートラルカラーを維持。 |
| `--text-primary` | `#0c0d14` | `#f5f7ff` | 本文や主要見出し。 |
| `--text-secondary` | `rgba(12,13,20,0.78)` | `rgba(245,247,255,0.78)` | サブテキスト。|
| `--text-muted` | `rgba(12,13,20,0.56)` | `rgba(245,247,255,0.5)` | キャプション・メタ情報。|
| `--text-inverse` | `#fdfdff` | `#fdfdff` | ダークカード上でのテキスト。常に高コントラストを確保。|
| `--glass-surface` / `--card-surface` | 透過白 | 透過黒/白 | ガラス調パネル。半透明×`backdrop-blur`で層を演出。|
| `--chip-surface` | `rgba(12,13,20,0.08)` | `rgba(255,255,255,0.07)` | ピル/トークン背景。|
| `--border-soft` | `rgba(12,13,20,0.16)` | `rgba(255,255,255,0.15)` | 透明感を保つためのボーダー。|
| `--btn-*` シリーズ | 変数参照 | 変数参照 | プライマリ/セカンダリ/ゴーストボタンの背景・テキスト・影。|

### 運用ルール
1. 生の hex 値ではなく、必ずカスタムプロパティ経由で `var(--token)` を参照する。
2. 透過レイヤーと背景の組み合わせでコントラストが不足しないか [Accessible Brand Colors](https://accessiblepalette.com/) などで確認する。
3. 新規アクセントカラーは `--glow-*` のようにトークン化し、光源(blur)用と面塗り用を分ける。

## 3. タイポグラフィ
- ベースフォント: `Geist` (`--font-geist-sans`)、コード/モノスペースには `Geist Mono`。
- 階層: `h1` 〜 `h3` は 1.2–1.4 の行間、本文は 1.6 の行間が基準。
- 文言は Apple らしい簡潔な文節を意識し、英数字の追従は半角。全角記号は必要最低限。

| レベル | サイズ例 | 用途 |
| --- | --- | --- |
| Heading XL | `text-6xl` (lg) | ヒーローのリードコピー |
| Heading L | `text-4xl` | セクションタイトル |
| Heading M | `text-2xl` | カード見出し |
| Body L | `text-lg leading-relaxed` | リード文 |
| Body M | `text-sm/6` | カード本文、注釈 |
| Micro | `text-xs uppercase tracking-[0.3-0.4em]` | メタ情報、タグ |

## 4. スペーシング & レイアウト
- 基本グリッド: `24px` ライン (Tailwind の `space-y-6`, `gap-6`, `px-6` など) を最小単位とし、24 の倍数で増減する。
- コンテナ最大幅は `max-w-6xl` を基準、ドキュメント/キャンバス系は `max-w-4xl` に制限して読みやすさを優先。
- 角丸: 大きなコンテナ `rounded-[32px~40px]`、カード `rounded-3xl`、ボタン `rounded-full` を統一。新規スタイルは既存スケール内で選ぶ。

## 5. コンポーネントパターン
### 5.1 ボタン
- `theme-btn-primary`: メイン行動。背景は `--btn-primary-bg`、`btn-shimmer` を併用して光沢を付与。
- `theme-btn-secondary`: 枠線ベースで控えめに。hover 時は `--btn-secondary-hover-*` を使用。
- `theme-btn-ghost`: 透明背景。アイコンボタンは `h-10 w-10` を基準に統一。
- すべて `transition duration-300` と `rounded-full` を基本とし、ラベルは `text-sm font-semibold`。

### 5.2 チップ/バッジ
- `.theme-bg-chip` + `tracking-[0.3-0.4em]` の組み合わせで、Apple のラベル感を再現。
- アイコンやステータス点灯が必要な場合は `before` 疑似要素や `bg-gradient-to-br` を使い、色はトークンから選ぶ。

### 5.3 カード/ガラスパネル
- `theme-bg-card` or `theme-bg-accent` + `backdrop-blur-2xl` で層を形成し、`theme-border-soft` で囲う。
- 内側余白は `p-6` 以上を目安にし、`space-y-4` で段落間隔を保つ。
- 影は `shadow-[0_40px_120px_rgba(0,0,0,0.25)]` のように柔らかな値で統一。安易に濃い影を増やさない。

### 5.4 ステータス/統計カード
- 円形/角丸のグラデーションブロック (`bg-gradient-to-br`) を上部に置いて視線を誘導し、値は `text-4xl font-semibold` を採用。
- ラベルは Micro スタイルで統一し、`text-muted` を使用。

### 5.5 ヘッダー & ナビ
- Sticky Header を保ち、左右の余白を `px-6` で合わせる。
- ナビ項目は `text-sm text-secondary` をデフォルトにし、アクティブ状態のみ `text-primary`。タップ領域は 44px 以上。

## 6. 交互作用 & 状態
- **ホバー/フォーカス**: `hover:` と `focus-visible:` 双方で色・影・ボーダー変化を実装。アクセシビリティのため、フォーカス時に `outline` か `ring` を与える。
- **テーマ切替**: `ThemeToggle` は `aria-label` をローカライズ済み。新規トグルやスイッチでも同等のアクセシビリティ属性を付与する。
- **モーション**: `transition` は `duration-300`〜`600`、`ease-out` を基本。`hover` に短いイージング、`enter/leave` には `duration-500` を採用。

## 7. アクセシビリティ・テスト
- 主要テキスト/背景のコントラスト比を 4.5:1 以上に保つ。ダークテーマで `text-inverse` を使用する際は必ず `--text-inverse` を参照する。
- `prefers-reduced-motion` を尊重し、今後アニメーションを追加する場合は `@media (prefers-reduced-motion: reduce)` 内でアニメーションを無効化。
- コンポーネントごとに `aria-label`, `aria-live`, `role` などを検討し、意味を補強する。
- 各開発タスクでは最低限 `npm run lint` と `npm run typecheck` に加え、デザイン面の差分レビューで本ガイドラインへの準拠を確認すること。

---
この文書はリビジョンごとにアップデートしてください。変更時は PR でハイライトし、`AGENTS.md` に記載された運用フローを通じて全員に共有します。

# メモ機能拡張計画

## 1. 目的と背景
- メモアプリの回遊性と情報検索性を高め、保存したメモを素早く再発見できるようにする。
- 既存機能では `/memo` 一覧で全文表示される内容を視覚的に確認するしかなく、件数が増えると目的のメモに到達しづらい。
- 今後の拡張として「本文キーワード検索」「カテゴリ分類」「タグフィルタ」を追加し、業務利用にも耐える情報整理体験を実現する。

## 2. 要件定義
### 2.1 メモ本文キーワード検索
- ユーザーは `/memo` 画面上部の検索バーにキーワードを入力し、本文・タイトルを横断検索できる。
- 検索は部分一致かつ複数語（スペース区切り）に対応し、全語を含むメモだけがヒットする。
- 入力と同時にデバウンス（300ms）付きで結果を更新し、空欄時は最新順の全メモを表示する。
- 0 件時は UI 上で空状態メッセージを表示する。

### 2.2 メモのカテゴリ分類
- 1 メモにつき 0〜1 個のカテゴリを紐づける。
- カテゴリは事前に定義・管理できる（最低限：仕事／個人／アイデア）。長期的には `/settings/categories` などで CRUD を提供する設計とする。
- `/memo/new` および `/memo/[id]/edit` でカテゴリを選択でき、一覧や詳細でカテゴリラベルを表示する。
- `/memo` 一覧ではカテゴリで絞り込める。（ドロップダウン or ピル）

### 2.3 メモのタグ付けとフィルタ
- メモへ 0〜5 個のタグ（自由入力）を付与できる。重複タグは統合管理し、候補サジェストを表示する。
- `/memo` 一覧でタグピルをクリックする、もしくはマルチセレクト UI で複数タグによる AND フィルタができる。
- `/memo/[id]` 詳細ではタグを Notion 風にピル表示し、クリックでタグフィルタ状態の `/memo` へ遷移する。

### 2.4 共通・非機能要件
- 既存の Supabase/Postgres/Prisma を継続利用。DB アクセスは `src/lib/prisma.ts` シングルトン経由に限定。
- 新データ構造は `prisma/schema.prisma` に定義し、マイグレーションは `npm run db:migrate` で適用する。
- UI 変更は `documents/DESIGN_SYSTEM.md` を踏まえ Apple ライクな質感を維持する。
- TDD 方針：新機能ごとに Jest (Testing Library) のテストを追加し、検索クエリやフィルタ条件のロジックをユニットテストで担保する。

## 3. 設計方針
### 3.1 データモデル（Prisma）
```prisma
model Memo {
  id          String      @id @default(cuid())
  title       String      @db.VarChar(160)
  content     String?     @db.Text
  categoryId  String?     @db.Uuid
  category    Category?   @relation(fields: [categoryId], references: [id])
  tags        MemoTag[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Category {
  id      String  @id @default(uuid())
  name    String  @unique @db.VarChar(64)
  color   String  @db.VarChar(16) // DESIGN_SYSTEM のカラートークン参照
  memos   Memo[]
}

model Tag {
  id      String   @id @default(uuid())
  name    String   @unique @db.VarChar(64)
  memos   MemoTag[]
}

model MemoTag {
  memoId String
  tagId  String
  memo   Memo   @relation(fields: [memoId], references: [id], onDelete: Cascade)
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)
  @@id([memoId, tagId])
}
```
- `Category.color` はデザインシステムの既存トークンに合わせた 6〜8 色想定。
- 将来的な検索高速化のため、`content` に対し `GIN` インデックス（`to_tsvector('simple', coalesce(content,''))`）を追加予定。初期実装は `ILIKE` + `AND` 条件で実装し、必要に応じてマイグレーションで拡張する。

### 3.2 サーバー／データアクセス層
- 既存の `getMemos`, `getMemoById` を拡張し、以下パラメーターを受け取る：`searchQuery?: string`, `categoryId?: string`, `tagIds?: string[]`。
- Prisma クエリでは
  - `searchQuery` をスペースで分割し、`where: { AND: keywords.map(k => ({ OR: [{ title: { contains: k, mode: 'insensitive' } }, { content: { contains: k, mode: 'insensitive' } }] })) }` を組み立てる。
  - `categoryId` 指定時は `categoryId: categoryId`。
  - `tagIds` 指定時は `tags: { some: { AND: tagIds.map(...) } }` を利用。
- カテゴリ／タグ候補を取得する新しいリポジトリ関数（例：`getCategories`, `getTags`, `upsertTags(names: string[])`）を `src/lib/memoRepository.ts` として切り出し、Server Actions から再利用する。
- 新規 API/Server Action
  - `createMemo`/`updateMemo` にカテゴリIDとタグ配列を受け渡し。
  - `searchMemos` server action で検索パラメータを受け取り、結果をストリーミング（React Server Component）する。

### 3.3 UI / ルーティング
- `/memo`
  - ヒーロー部に検索バー + カテゴリドロップダウン + タグマルチセレクトを配置。Tailwind でレイアウトを整え、Selection 状態は URL クエリ（`?q=xxx&category=...&tags=a,b`）に同期して共有可能にする。
  - メモカードにカテゴリバッジ・タグピルを追加。フィルタ状態に応じてフェードインアニメーションを適用（DESIGN_SYSTEM のモーション規則参照）。
- `/memo/new`
  - `CreateMemoForm` にカテゴリセレクト（`<select>` or カスタムセグメント）とタグ入力（トークン化した入力 + サジェスト）フィールドを追加。タグ候補は Server Action から取得。
- `/memo/[id]`
  - タイトル下にカテゴリバッジを表示し、右側にタグピルを並べる。クリックで `/memo?tags=...` に遷移しフィルタ状態を共有。
- アクセシビリティ
  - 検索バー: `aria-label` 付与、タグ入力はロービジョンでも判別できる色彩コントラストを DESIGN_SYSTEM のトークンで確認。

### 3.4 状態管理とパフォーマンス
- 検索バー・フィルタはクライアントコンポーネント化し、URLSearchParams を介して RSC にパラメータを渡す。
- キーワード入力は 300ms デバウンス、タグ選択は即時 URL 反映。
- Prisma クエリ結果にはカテゴリ・タグを `include` し、N+1 を回避。

### 3.5 テスト戦略
- Repository レイヤーの検索条件組み立てをユニットテスト化（Mock Prisma）。
- `CreateMemoForm` の統合テストでカテゴリ・タグ入力のバリデーションとサーバーアクション呼び出しを検証。
- `/memo` ページの検索/フィルタ動作は React Testing Library + `next/navigation` Mock で E2E 風テスト。
- 主要フローについて Playwright の追加も検討（検索→詳細遷移）。

## 4. 実装計画（フェーズ別）
| フェーズ | タスク | 成果物 |
| --- | --- | --- |
| 1. データレイヤー | Prisma スキーマ更新、マイグレーション作成、シードデータ更新、`Memo` 既存データのカテゴリ/タグ初期化スクリプト | `prisma/schema.prisma`, `prisma/migrations/*`, `scripts/seed.ts` |
| 2. リポジトリ/サーバー | `src/lib/memoRepository.ts` 作成、`getMemos` 拡張、カテゴリ/タグ取得 API、Server Actions 更新、ユニットテスト | `src/lib/*.ts`, `src/__tests__/*.test.ts` |
| 3. UI 実装 | `/memo`, `/memo/new`, `/memo/[id]` のコンポーネント更新、検索/フィルタ UI、Tailwind スタイル、アクセシビリティ確認 | `src/app/memo/*` |
| 4. テスト & バリデーション | Jest 追加・更新テスト実行、`npm run typecheck`, `npm run lint`, 必要に応じ `npm run test` & 手動確認、ドキュメント（DESIGN_SYSTEM 変更時は同時更新） | テストスナップショット、検証ログ |

### マイルストーン/優先度
1. **検索基盤**（キーワード検索のみ先行）→ ユーザー価値が高いため優先実装。
2. **カテゴリ分類** → UI が単純なドロップダウンで提供でき、検索体験を補完。
3. **タグ機能** → 多対多・サジェストなど実装コストが高いため最後に着手。

### リスクと対策
- **検索パフォーマンス**：メモ件数が多い場合に `ILIKE` 条件が遅くなる可能性 → 件数増加が見込まれたら `GIN` インデックス＋`tsvector` に移行。初回リリース時からマイグレーションテンプレートを準備。
- **タグのデータ整合性**：ユーザー入力のバラつき → 正規化のため入力時にトリム/小文字化し、`Tag.name` は一意（case-insensitive）制約を追加。
- **UI 複雑化**：検索 UI が過密になる → Apple ライクな余白/モーションを DESIGN_SYSTEM に追記し、モバイルではアコーディオン式フィルタに切り替える。

## 5. 今後のアクション
1. ドキュメント承認後、フェーズ1のスキーマ変更ブランチを作成し TDD 方針で実装開始。
2. 変更に応じて `documents/DESIGN_SYSTEM.md` のカラートークンとモーション指針をアップデート。
3. Supabase 環境で `npm run db:migrate` を実行し、`npm run typecheck` / `npm run lint` / `npm run test` の結果を PR に添付する。

# Repository Guidelines

私の指示に従って手順を表示する際、できる限り日本語で表示して欲しい。
チャットの返事もできる限り日本語でお願い。

## コミュニケーション方針
チャットでの返答および手順説明は必ず日本語で行うこと（ログやコードは原文のままで可）。英語を引用する必要がある場合も、補足説明は日本語で記載する。

## Project Structure & Module Organization
Source lives in `src/app`, where `layout.tsx` defines shared shells and `page.tsx` holds the default route. Global styles and Tailwind layers stay in `src/app/globals.css`, while static assets (favicons, logos, placeholder data) belong in `public/`. Configuration sits at the repo root: `next.config.ts` for runtime tweaks, `tsconfig.json` (with the `@/*` path alias) for TypeScript, and `eslint.config.mjs` plus the Tailwind/PostCSS configs for linting and styling. Backend helpers sit in `src/lib/` (`prisma.ts`, `supabase.ts`), and Prisma schemas/migrations reside under `prisma/`.

## Build, Test, and Development Commands
- `npm run dev`: Launches the Next.js dev server on port 3000 with hot reload—use while iterating on memo features.
- `npm run build`: Produces the optimized `.next` directory; run before releasing or changing build-time config.
- `npm run start`: Serves the production build locally to verify deployment artifacts.
- `npm run test`: Runs Jest (configured with `next/jest` + Testing Library) across `__tests__` and `*.test.ts(x)` files.
- `npm run db:generate`: Regenerates the Prisma client after schema edits.
- `npm run db:migrate`: Applies a local development migration (requires `DATABASE_URL` pointing at Supabase).
- `npm run db:studio`: Opens Prisma Studio for inspecting Supabase tables (development only).
- `npm run typecheck`: Runs `tsc --noEmit` to verify every file compiles under the strict TypeScript config.
- `npm run lint`: Executes ESLint with `eslint-config-next`; resolve warnings before committing.

## Coding Style & Naming Conventions
Use TypeScript with the strict settings already enabled; prefer functional React components and stay in the Server Components model unless `"use client"` is required. Indent with two spaces, keep component files in PascalCase, hooks/utilities in camelCase, and colocate feature-specific files under `src/app/<route>/`. Compose UI with Tailwind CSS v4 utilities, grouping related classes (layout, spacing, color) for readability, and extract repeated blocks into shared components under `src/app/components`.

## Design System
- 画面やコンポーネントを追加/変更する際は、Apple ライクな質感を保つため必ず `documents/DESIGN_SYSTEM.md` を参照すること。
- カラートークン・タイポグラフィ・モーションルールを更新した場合は `documents/DESIGN_SYSTEM.md` を同時に改訂し、PR で周知する。

## Auth Email Templates
- Supabase Auth の確認メール/Magic Link は `documents/EMAIL_TEMPLATES.md` の内容を最新とし、必要に応じてダッシュボードのテンプレートに反映する。
- 文言・ブランドカラーを変更した際はテンプレートも合わせて更新し、エージェント同士で共有する。

## Database & Supabase Setup
Provision a Supabase project, then copy the connection string from Dashboard → Settings → Database (`postgresql://postgres:<PASSWORD>@db.<project-ref>.supabase.co:5432/postgres?schema=public`). Store it as `DATABASE_URL` inside a local `.env`, alongside `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` (see `.env.example`). Run `npm run db:migrate` to create/align the `Memo` table defined in `prisma/schema.prisma`; use `npm run db:generate` whenever the schema changes. Server-side data access should use the shared `prisma` singleton (`src/lib/prisma.ts`) or `createSupabaseAdminClient()` (`src/lib/supabase.ts`)—never instantiate new clients per request. Use `GET /api/health` to verify the API can reach the database (it executes a lightweight `SELECT 1` via Prisma).

## Testing Guidelines
Unit and component tests run through Jest with Testing Library (`@testing-library/react`, `@testing-library/jest-dom`). Place specs under `src/**/__tests__` or next to the implementation using the `.test.tsx` suffix, and import helpers from `@testing-library/react` for rendering client components. Mock data-fetching and routing via Next.js utilities as needed, and add Playwright end-to-end coverage only when the UX flow crosses multiple pages. Every bug fix or feature needs at least one failing test before implementation and all suites must pass via `npm run test` prior to merging; document any temporary skips in the PR.

## Test-Driven Development
Follow TDD by writing the minimal failing Jest test that captures the desired user behavior before touching production code. Iterate in red/green/refactor loops: (1) add/adjust a test under `__tests__`, (2) implement the memo feature until `npm run test` turns green, (3) clean up code and tests, ensuring accessibility and performance considerations remain covered. When a regression is reported, first codify it with a failing test, then fix it—no fixes land without reproducible automated coverage.

## Validation Workflow
After every code change, run `npm run typecheck` and `npm run lint` locally before pushing. This guards against type regressions (strict TS config) and style or accessibility issues caught by ESLint. CI will assume both commands pass, so fix all reported items or document intentional suppressions in the PR. When Codex agents contribute, they must run both commands before handing work back to the team and report the results in the final response.

## Commit & Pull Request Guidelines
Write commits in imperative mood with focused scope (`Add memo editor`, `Fix theme toggle`), referencing related issues in the body when applicable. Pull requests should include: a concise summary, testing evidence (`npm run build`, screenshots or GIFs for UI), linked tasks, and rollout notes for any config or data changes. Request review once lint/build/test steps pass and call out follow-up work or known limitations in the PR description.

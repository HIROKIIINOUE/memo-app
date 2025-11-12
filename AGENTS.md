# Repository Guidelines

私の指示に従って手順を表示する際、できる限り日本語で表示して欲しい。
チャットの返事もできる限り日本語でお願い。

## Project Structure & Module Organization
Source lives in `src/app`, where `layout.tsx` defines shared shells and `page.tsx` holds the default route. Global styles and Tailwind layers stay in `src/app/globals.css`, while static assets (favicons, logos, placeholder data) belong in `public/`. Configuration sits at the repo root: `next.config.ts` for runtime tweaks, `tsconfig.json` (with the `@/*` path alias) for TypeScript, and `eslint.config.mjs` plus the Tailwind/PostCSS configs for linting and styling.

## Build, Test, and Development Commands
- `npm run dev`: Launches the Next.js dev server on port 3000 with hot reload—use while iterating on memo features.
- `npm run build`: Produces the optimized `.next` directory; run before releasing or changing build-time config.
- `npm run start`: Serves the production build locally to verify deployment artifacts.
- `npm run lint`: Executes ESLint with `eslint-config-next`; resolve warnings before committing.

## Coding Style & Naming Conventions
Use TypeScript with the strict settings already enabled; prefer functional React components and stay in the Server Components model unless `"use client"` is required. Indent with two spaces, keep component files in PascalCase, hooks/utilities in camelCase, and colocate feature-specific files under `src/app/<route>/`. Compose UI with Tailwind CSS v4 utilities, grouping related classes (layout, spacing, color) for readability, and extract repeated blocks into shared components under `src/app/components`.

## Testing Guidelines
Automated tests are not wired up yet; plan to add React Testing Library + Vitest for units and Playwright for user flows. Place specs in `__tests__/component-name.test.tsx` or beside the component using the `.test.tsx` suffix, and describe expected behavior in the test title (`renders memo list`, `persists drafts`). Cover every new interactive behavior with at least one unit test and add a Playwright smoke path whenever routing or persistence changes. Run the future `npm test` script locally (and document temporary gaps) before opening a PR.

## Commit & Pull Request Guidelines
Write commits in imperative mood with focused scope (`Add memo editor`, `Fix theme toggle`), referencing related issues in the body when applicable. Pull requests should include: a concise summary, testing evidence (`npm run build`, screenshots or GIFs for UI), linked tasks, and rollout notes for any config or data changes. Request review once lint/build/test steps pass and call out follow-up work or known limitations in the PR description.

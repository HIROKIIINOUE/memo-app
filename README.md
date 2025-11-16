# Memo Atelier

## Overview | 概要 | Aperçu
- **EN:** A minimalist, Apple-inspired Markdown memo app with live preview, categories, and full-text search. Built alongside Codex as a pairing exercise.
- **JA:** Apple ライクな雰囲気の Markdown メモアプリ。ライブプレビュー、カテゴリー整理、全文検索に対応。Codex と並走しながら作り上げたプロジェクトです。
- **FR:** Application de mémo Markdown inspirée d’Apple : aperçu en direct, catégories, recherche plein texte. Réalisée en binôme avec Codex.

## Features | 機能 | Fonctionnalités
- **EN:** Live Markdown preview, create/edit/delete memos, list/detail views, category filtering, responsive UI (from 320px), language switcher (JA/EN/FR).
- **JA:** ライブ Markdown プレビュー／メモの作成・編集・削除／一覧・詳細表示／カテゴリー絞り込み／320px からのレスポンシブ／日英仏の言語切替。
- **FR:** Aperçu Markdown en direct, création/édition/suppression de mémos, vues liste/détail, filtre par catégorie, UI responsive (dès 320px), changement de langue (JP/EN/FR).

## Tech Stack | 技術スタック | Stack technique
- **Framework:** Next.js (App Router, Server/Client Components)
- **Styling:** Tailwind CSS v4 + custom design tokens (light/dark)
- **Data:** Supabase Auth, Prisma (memo model), Jest for testing
- **Other:** Remark/ReactMarkdown for Markdown, responsive design tuned for mobile-first

## How We Built It with Codex | Codex と並走した開発 | Réalisé avec Codex
- **EN:** This repo was built pairing with Codex (LLM assistant). We iterated via prompts to design, internationalize (JA/EN/FR), and harden responsive behavior while keeping UI simple.
- **JA:** このリポジトリは Codex（LLM アシスタント）とペアで開発しました。プロンプトを重ねて設計・多言語化（日本語/英語/フランス語）・レスポンシブ最適化を行い、シンプルな UI を保っています。
- **FR:** Développé en binôme avec Codex (assistant LLM) : itérations de conception, internationalisation (JP/EN/FR) et optimisation responsive, tout en gardant une interface épurée.

## Getting Started | 使い方 | Démarrage
- **Install / インストール / Installation**
  ```bash
  npm install
  ```
- **Dev server / 開発サーバー / Serveur de dev**
  ```bash
  npm run dev
  ```
  Open `http://localhost:3000`.
- **Tests / テスト / Tests**
  ```bash
  npm run typecheck
  npm run lint
  npm run test   # if tests are added
  ```

## Notes | 補足 | Notes
- **EN:** Configure Supabase keys in `.env` as per `documents/AGENTS.md` and run Prisma migrations before production use.
- **JA:** `.env` に Supabase キーを設定し、`documents/AGENTS.md` に沿って Prisma マイグレーションを実行してから利用してください。
- **FR:** Configurez les clés Supabase dans `.env` (voir `documents/AGENTS.md`) et exécutez les migrations Prisma avant la mise en production.

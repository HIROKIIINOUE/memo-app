const highlights = [
  {
    label: "Markdown",
    title: "ライブプレビュー",
    body: "入力と同時にレンダリングされるプレイグラウンドで、構造と装飾を安心して確認できます。",
  },
  {
    label: "カテゴリー",
    title: "知識の棚を整頓",
    body: "階層化されたカテゴリーとタグの組み合わせで、大量のメモも高速検索。",
  },
  {
    label: "同期",
    title: "Supabaseと即時連携",
    body: "Prisma経由で暗号化しながら同期し、チームでも安全に共有。",
  },
];

const quickStats = [
  { label: "下書き", value: "12", accent: "from-[#ffffff] to-[#dfe8ff]" },
  { label: "カテゴリー", value: "6", accent: "from-[#fdf2ff] to-[#fbe4ff]" },
  { label: "タグ", value: "28", accent: "from-[#e1fff4] to-[#f2fffb]" },
];

export default function Home() {
  return (
    <div className="space-y-16 pb-8 text-primary">
      <section className="grid items-center gap-12 pt-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-2 rounded-full border theme-border-soft theme-bg-chip px-4 py-1 text-xs uppercase tracking-[0.4em] text-secondary transition-colors duration-500">
            <span>Memo Atelier</span>
            <span className="text-muted">for makers</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Appleの佇まいで、<span className="text-secondary">記憶</span>をデザインする
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-secondary">
              Markdownで綴ったアイデアにカテゴリーとタグを付与し、
              どんな瞬間も美しく整理するメモアプリ。モダンな Supabase
              スタックで、認証から共同編集までシームレスに拡張できます。
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="btn-shimmer theme-btn-primary rounded-full px-8 py-3 text-sm font-semibold transition duration-300">
              無料でセットアップ
            </button>
            <button className="btn-shimmer theme-btn-secondary rounded-full border px-8 py-3 text-sm font-semibold transition duration-300">
              デモを見る
            </button>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-secondary">
            <span>✔ Markdownプレビュー</span>
            <span>✔ Supabase 認証</span>
            <span>✔ iCloud風ナビゲーション</span>
          </div>
        </div>
        <div className="relative lg:flex lg:items-start lg:gap-10">
          <div className="hidden lg:block">
            <div className="rounded-[34px] border theme-border-soft theme-bg-accent p-6 text-inverse backdrop-blur-2xl">
              <p className="text-inverse text-xs uppercase tracking-[0.3em] opacity-70">Today</p>
              <p className="mt-4 text-2xl font-semibold">あなたの記憶をホテルライクに整理</p>
              <div className="mt-6 space-y-3 text-sm text-inverse opacity-80">
                <div className="flex items-center justify-between">
                  <span>タグ</span>
                  <span className="font-semibold">28</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>共有メモ</span>
                  <span className="font-semibold">4</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mt-8 w-full rounded-[40px] border theme-border-soft theme-bg-card p-8 backdrop-blur-3xl lg:mt-0">
            <div className="rounded-3xl border theme-border-soft theme-bg-accent p-6 shadow-[0_40px_120px_rgba(0,0,0,0.25)]">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-inverse">
                <div>
                  <p className="text-inverse text-xs uppercase tracking-[0.3em] opacity-70">Draft · Markdown</p>
                  <p className="text-2xl font-semibold">Vision OS リサーチ</p>
                </div>
                <span className="rounded-full border border-white/30 px-4 py-1 text-xs">
                  #design
                </span>
              </div>
              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-inverse opacity-80">
                <p className="text-inverse font-mono text-xs uppercase tracking-[0.4em] opacity-60">
                  PREVIEW
                </p>
                <div className="space-y-2 rounded-2xl bg-black/30 p-4 text-left">
                  <p className="text-lg font-semibold">## Spatial メモ</p>
                  <p className="text-inverse opacity-80">
                    - Apple Pencil でタグをドラッグ
                    <br />- Markdown と手書きの共存
                    <br />- メモの区切りはモーフィングで表示
                  </p>
                </div>
                <p className="text-inverse text-xs opacity-60">⌘ + Shift + K でタグ付け</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-[32px] border theme-border-soft theme-bg-card p-8 backdrop-blur-2xl lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">Structure</p>
          <h2 className="text-2xl font-semibold">カテゴリーとタグが織りなす柔らかい階層</h2>
          <p className="text-sm leading-relaxed text-secondary">
            メモの粒度に合わせてカテゴリーとタグを柔軟に組み合わせられるよう、
            ボードビューとリストビューをワンタップで切り替えられるコンポーネントを提供します。
          </p>
        </div>
        <div className="grid gap-4 lg:col-span-3 lg:grid-cols-3">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border theme-border-soft theme-bg-card p-4 text-center"
            >
              <div
                className={`mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br ${stat.accent}`}
              />
              <p className="text-4xl font-semibold">{stat.value}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="rounded-[28px] border theme-border-soft theme-bg-card p-6 backdrop-blur-2xl"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-muted">{item.label}</p>
            <h3 className="mt-4 text-2xl font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-secondary">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

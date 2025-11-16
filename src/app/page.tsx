import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getDictionary, getLocaleFromRequest } from "@/lib/i18n";

export default async function Home() {
  const locale = await getLocaleFromRequest();
  const dictionary = getDictionary(locale);

  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAuthenticated = Boolean(session);

  if (!isAuthenticated) {
    return <MarketingExperience dict={dictionary.home} />;
  }

  return <AuthenticatedExperience email={session?.user.email ?? ""} dict={dictionary.home} />;
}

type HomeDict = ReturnType<typeof getDictionary>["home"];

function MarketingExperience({ dict }: { dict: HomeDict }) {
  return (
    <div className="space-y-16 pb-6 text-primary">
      <section className="grid items-center justify-center gap-12 pt-14 text-center">
        <div className="space-y-10">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border theme-border-soft theme-bg-chip px-4 py-1 text-xs uppercase tracking-[0.4em] text-secondary transition-colors duration-500">
            <span>Memo Atelier</span>
            <span className="text-muted">{dict.hero.pill}</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {dict.hero.headline}
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-secondary">
              {dict.hero.subhead}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link className="btn-shimmer theme-btn-primary rounded-full px-8 py-3 text-sm font-semibold" href="/signup">
              {dict.hero.primaryCta}
            </Link>
            <Link className="btn-shimmer theme-btn-secondary rounded-full border px-8 py-3 text-sm font-semibold" href="/signin">
              {dict.hero.secondaryCta}
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-secondary">
            {dict.hero.benefits.map((item) => (
              <span key={item}>✔ {item}</span>
            ))}
          </div>
          <div className="rounded-3xl border theme-border-soft theme-bg-card/80 p-6 text-sm text-secondary backdrop-blur">
            <p className="font-semibold text-primary">{dict.hero.unlocked}</p>
            <ul className="mt-3 space-y-2 text-muted">
              {dict.hero.unlockedItems.map((item) => (
                <li key={item}>・{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative lg:flex lg:items-start lg:gap-10" />
      </section>
    </div>
  );
}

function AuthenticatedExperience({ email, dict }: { email: string; dict: HomeDict }) {
  const [headlinePrefix, headlineSuffix] = dict.auth.headline.split("{{email}}");

  return (
    <div className="space-y-10 pb-6 text-primary">
      <section className="rounded-[32px] border theme-border-soft theme-bg-card p-8 backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">{dict.auth.welcome}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold sm:text-4xl lg:text-5xl">
              <span className="break-words">{headlinePrefix}</span>
              <span className="break-all">{email}</span>
              <span className="break-words">{headlineSuffix}</span>
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-secondary sm:text-base break-words">
              {dict.auth.subhead}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/memo/new" className="btn-shimmer theme-btn-primary rounded-full px-6 py-3 text-sm font-semibold">
              {dict.auth.newMemo}
            </Link>
            <Link href="/memo" className="btn-shimmer theme-btn-secondary rounded-full border px-6 py-3 text-sm font-semibold">
              {dict.auth.list}
            </Link>
            <Link href="/memo/search" className="btn-shimmer theme-btn-ghost rounded-full border px-6 py-3 text-sm font-semibold">
              {dict.auth.search}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

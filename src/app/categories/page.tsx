import CategoryManager from "@/app/categories/CategoryManager";
import { CATEGORY_LIMIT, mockCategories } from "@/lib/mockCategories";
import { getDictionary, getLocaleFromRequest } from "@/lib/i18n";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function CategoriesSettingsPage() {
  const locale = await getLocaleFromRequest();
  const dict = getDictionary(locale).common.categories;
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/signin?redirect=/categories");
  }

  return (
    <section className="space-y-10">
      <header className="rounded-[32px] border theme-border-soft theme-bg-card p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-muted">Settings</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-primary">{dict.title}</h1>
            <p className="mt-3 text-base text-secondary">
              {dict.lead.replace("{limit}", String(CATEGORY_LIMIT))}
            </p>
          </div>
        </div>
      </header>

      <CategoryManager initialCategories={mockCategories} dict={dict} />
    </section>
  );
}

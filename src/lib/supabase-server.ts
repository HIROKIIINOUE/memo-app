import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    );
  }

  return createServerClient(url, anonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        try {
          // Server Componentsではcookieの書き換えが禁止されているため、Server Action/Route Handler以外からの呼び出しで投げられる例外を握りつぶす
          cookieStore.set({ ...options, name, value });
        } catch {
          // no-op
        }
      },
      remove(name, options) {
        try {
          cookieStore.delete({ ...options, name });
        } catch {
          // no-op
        }
      },
    },
  });
}

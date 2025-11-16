import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALE_COOKIE = "locale";
const DEFAULT_LOCALE = "en";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const localeCookie = request.cookies.get(LOCALE_COOKIE)?.value;

  // 初回訪問などで言語クッキーが無い場合のみデフォルト英語をセット
  if (!localeCookie) {
    response.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
  }

  return response;
}

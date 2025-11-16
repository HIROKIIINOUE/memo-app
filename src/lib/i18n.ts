import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import enCommon from "@/../locales/en/common.json";
import enHome from "@/../locales/en/home.json";
import frCommon from "@/../locales/fr/common.json";
import frHome from "@/../locales/fr/home.json";
import jaCommon from "@/../locales/ja/common.json";
import jaHome from "@/../locales/ja/home.json";

export type Locale = "ja" | "en" | "fr";

export const SUPPORTED_LOCALES: Locale[] = ["ja", "en", "fr"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_KEY = "locale";

export type HomeCopy = typeof jaHome;
export type CommonCopy = typeof jaCommon;

const dictionaries: Record<Locale, { common: CommonCopy; home: HomeCopy }> = {
  ja: { common: jaCommon, home: jaHome },
  en: { common: enCommon, home: enHome },
  fr: { common: frCommon, home: frHome },
};

function readCookieLocale(cookieStore: ReadonlyRequestCookies): Locale {
  const value = cookieStore.get(LOCALE_COOKIE_KEY)?.value;
  if (value === "ja" || value === "en" || value === "fr") {
    return value;
  }
  return DEFAULT_LOCALE;
}

export async function getLocaleFromRequest(): Promise<Locale> {
  const cookieStore = await cookies();
  return readCookieLocale(cookieStore);
}

export function getDictionary(locale: Locale = DEFAULT_LOCALE) {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

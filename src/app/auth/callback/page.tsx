import CallbackClient from "./CallbackClient";
import { getDictionary, getLocaleFromRequest } from "@/lib/i18n";

export default async function AuthCallbackPage() {
  const locale = await getLocaleFromRequest();
  const dict = getDictionary(locale).common.auth.callback;
  return <CallbackClient dict={dict} />;
}

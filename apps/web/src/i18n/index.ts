import i18n, { initialLocale } from "@/i18n/core";
import { preloadDeferredNamespaces } from "@/i18n/load-namespace";

void preloadDeferredNamespaces(initialLocale);
if (initialLocale === "ar") {
  void preloadDeferredNamespaces("en");
}

export default i18n;
export { ensureNamespace, loadLocaleNamespaces, preloadDeferredNamespaces } from "@/i18n/load-namespace";

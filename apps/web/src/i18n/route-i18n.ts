import { matchPath } from "react-router";
import { productRoutes } from "@/app/route-table";
import type { AppNamespace } from "@/i18n/namespaces";
import { ensureNamespace } from "@/i18n/load-namespace";

export function namespacesForPath(pathname: string): AppNamespace[] {
  const found = productRoutes.find((route) => matchPath(route.path, pathname) !== null);
  if (found === undefined) {
    return [];
  }
  return [found.ns];
}

export function preloadRouteI18n(pathname: string, locale: string): void {
  const lang = locale === "ar" ? "ar" : "en";
  for (const namespace of namespacesForPath(pathname)) {
    void ensureNamespace(lang, namespace);
  }
}

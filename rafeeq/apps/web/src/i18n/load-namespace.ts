import i18n from "./core";
import { NAMESPACES, type AppNamespace } from "@/i18n/namespaces";

export const BOOT_NAMESPACES = ["common", "landing", "public", "errors"] as const satisfies readonly AppNamespace[];

const DEFERRED_NAMESPACES = [
  "couple",
  "learn",
  "check",
  "ask",
  "privacy",
  "care",
  "result",
  "website-assistant",
] as const satisfies readonly AppNamespace[];

const ROUTE_LAZY_NAMESPACES = new Set<AppNamespace>(["clinic", "insights"]);

type AppLocale = "en" | "ar";

function collectLoaders(
  locale: AppLocale,
  modules: Record<string, () => Promise<Record<string, unknown>>>,
): Partial<Record<AppNamespace, () => Promise<Record<string, unknown>>>> {
  const loaders: Partial<Record<AppNamespace, () => Promise<Record<string, unknown>>>> = {};
  for (const [path, loader] of Object.entries(modules)) {
    const match = new RegExp(`^\\.\\/locales\\/${locale}\\/([^/]+)\\.json$`).exec(path);
    const namespace = match?.[1] as AppNamespace | undefined;
    if (namespace === undefined || ROUTE_LAZY_NAMESPACES.has(namespace)) {
      continue;
    }
    loaders[namespace] = loader;
  }
  return loaders;
}

const enModules = import.meta.glob<Record<string, unknown>>(
  [
    "./locales/en/*.json",
    "!./locales/en/clinic.json",
    "!./locales/en/insights.json",
    "!./locales/en/common.json",
    "!./locales/en/landing.json",
    "!./locales/en/public.json",
    "!./locales/en/errors.json",
  ],
  { import: "default" },
);

const arModules = import.meta.glob<Record<string, unknown>>(
  [
    "./locales/ar/*.json",
    "!./locales/ar/clinic.json",
    "!./locales/ar/insights.json",
    "!./locales/ar/common.json",
    "!./locales/ar/landing.json",
    "!./locales/ar/public.json",
    "!./locales/ar/errors.json",
  ],
  { import: "default" },
);

const namespaceLoaders: Record<AppLocale, Partial<Record<AppNamespace, () => Promise<Record<string, unknown>>>>> = {
  en: collectLoaders("en", enModules),
  ar: collectLoaders("ar", arModules),
};

const inflight = new Map<string, Promise<void>>();

export async function ensureNamespace(locale: AppLocale, namespace: AppNamespace): Promise<void> {
  if (i18n.hasResourceBundle(locale, namespace)) {
    return;
  }
  const key = `${locale}:${namespace}`;
  const pending = inflight.get(key);
  if (pending !== undefined) {
    await pending;
    return;
  }
  const load = namespaceLoaders[locale][namespace];
  if (load === undefined) {
    return;
  }
  const task = load()
    .then((catalog) => {
      i18n.addResourceBundle(locale, namespace, catalog, true, true);
    })
  .finally(() => {
    inflight.delete(key);
  });
  inflight.set(key, task);
  await task;
}

export async function loadLocaleNamespaces(locale: AppLocale): Promise<void> {
  const namespaces = NAMESPACES.filter((namespace) => !ROUTE_LAZY_NAMESPACES.has(namespace));
  await Promise.all(namespaces.map((namespace) => ensureNamespace(locale, namespace)));
}

export async function preloadDeferredNamespaces(locale: AppLocale): Promise<void> {
  await Promise.all(DEFERRED_NAMESPACES.map((namespace) => ensureNamespace(locale, namespace)));
}

import { useTranslation } from "react-i18next";
import type { AppNamespace } from "@/i18n/namespaces";

/** Reads an array from a locale file. Returns [] when the key is missing or not an array. */
export function useCopyList<T>(key: string, ns: AppNamespace): T[] {
  const { t } = useTranslation();
  const raw: unknown = t(key, { ns, returnObjects: true });
  return Array.isArray(raw) ? (raw as T[]) : [];
}

export type TitleBody = { title: string; body: string };

export type I18nViolation = {
  file: string;
  line: number;
  column: number;
  message: string;
};

export type I18nCatalogs = {
  en: Record<string, unknown>;
  ar: Record<string, unknown>;
};

export const REQUIRED_NAMESPACES: readonly string[];

export function auditWeb(webRoot: string): I18nViolation[];

export function auditSource(text: string, file: string, catalogs: I18nCatalogs): I18nViolation[];

export function diffCatalogs(catalogs: I18nCatalogs): I18nViolation[];

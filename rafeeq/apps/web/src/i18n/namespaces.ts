export const NAMESPACES = [
  "common",
  "public",
  "landing",
  "result",
  "couple",
  "learn",
  "check",
  "ask",
  "privacy",
  "care",
  "clinic",
  "insights",
  "errors",
] as const;

export type AppNamespace = (typeof NAMESPACES)[number];

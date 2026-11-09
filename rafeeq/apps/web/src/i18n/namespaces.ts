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
  "website-assistant",
] as const;

export type AppNamespace = (typeof NAMESPACES)[number];

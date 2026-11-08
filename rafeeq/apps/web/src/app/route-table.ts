import type { ReactNode } from "react";
import type { GuardRole } from "@/app/session";
import type { AppNamespace } from "@/i18n/namespaces";

export type PageModule = {
  Component: () => ReactNode;
};

export type RouteAccess = "public" | "couple" | "counsellor" | "analyst" | "admin";

export type ProductRoute = {
  path: string;
  access: RouteAccess;
  ns: AppNamespace;
  titleKey: string;
  load: () => Promise<PageModule>;
};

// OPEN_QUESTION: MASTER.md does not map roles to routes. Guest is treated as
// couple. Counsellor, analyst, and admin stay on /clinic, /insights, and /admin.
// /, /trust, /demo, and /legal are public. There is no admin, settings, trust,
// demo, or legal namespace: settings and admin titles live in common, and the
// other public titles live in landing.
export const guardRoles: Record<Exclude<RouteAccess, "public">, readonly GuardRole[]> = {
  couple: ["couple"],
  counsellor: ["counsellor"],
  analyst: ["analyst"],
  admin: ["admin"],
};

export const productRoutes: readonly ProductRoute[] = [
  {
    path: "/",
    access: "public",
    ns: "landing",
    titleKey: "hero.title",
    load: () => import("@/pages/landing-page"),
  },
  {
    path: "/trust",
    access: "public",
    ns: "landing",
    titleKey: "trust.title",
    load: () => import("@/pages/trust-page"),
  },
  {
    path: "/demo",
    access: "public",
    ns: "landing",
    titleKey: "demo.title",
    load: () => import("@/pages/demo-page"),
  },
  {
    path: "/app",
    access: "couple",
    ns: "couple",
    titleKey: "home.title",
    load: () => import("@/pages/app-home-page"),
  },
  {
    path: "/app/result",
    access: "couple",
    ns: "result",
    titleKey: "page.title",
    load: () => import("@/pages/result-page"),
  },
  {
    path: "/app/couple",
    access: "couple",
    ns: "couple",
    titleKey: "together.title",
    load: () => import("@/pages/couple-page"),
  },
  {
    path: "/app/learn",
    access: "couple",
    ns: "learn",
    titleKey: "page.title",
    load: () => import("@/pages/learn-page"),
  },
  {
    path: "/app/check",
    access: "couple",
    ns: "check",
    titleKey: "page.title",
    load: () => import("@/pages/check-page"),
  },
  {
    path: "/app/ask",
    access: "couple",
    ns: "ask",
    titleKey: "page.title",
    load: () => import("@/pages/ask-page"),
  },
  {
    path: "/app/privacy",
    access: "couple",
    ns: "privacy",
    titleKey: "page.title",
    load: () => import("@/pages/privacy-page"),
  },
  {
    path: "/app/care",
    access: "couple",
    ns: "care",
    titleKey: "page.title",
    load: () => import("@/pages/care-page"),
  },
  {
    path: "/app/settings",
    access: "couple",
    ns: "common",
    titleKey: "routes.settings",
    load: () => import("@/pages/settings-page"),
  },
  {
    path: "/clinic",
    access: "counsellor",
    ns: "clinic",
    titleKey: "page.title",
    load: () => import("@/pages/clinic-page"),
  },
  {
    path: "/clinic/queue",
    access: "counsellor",
    ns: "clinic",
    titleKey: "queue.title",
    load: () => import("@/pages/clinic-queue-page"),
  },
  {
    path: "/clinic/case/:id",
    access: "counsellor",
    ns: "clinic",
    titleKey: "case.title",
    load: () => import("@/pages/clinic-case-page"),
  },
  {
    path: "/clinic/audit",
    access: "counsellor",
    ns: "clinic",
    titleKey: "audit.title",
    load: () => import("@/pages/clinic-audit-page"),
  },
  {
    path: "/insights",
    access: "analyst",
    ns: "insights",
    titleKey: "page.title",
    load: () => import("@/pages/insights-page"),
  },
  {
    path: "/admin",
    access: "admin",
    ns: "common",
    titleKey: "routes.admin",
    load: () => import("@/pages/admin-page"),
  },
  {
    path: "/legal",
    access: "public",
    ns: "landing",
    titleKey: "legal.title",
    load: () => import("@/pages/legal-page"),
  },
];

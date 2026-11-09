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
    path: "/about",
    access: "public",
    ns: "public",
    titleKey: "about.heroTitle",
    load: () => import("@/pages/about-page"),
  },
  {
    path: "/how-it-works",
    access: "public",
    ns: "public",
    titleKey: "howItWorks.heroTitle",
    load: () => import("@/pages/how-it-works-page"),
  },
  {
    path: "/understanding-genetic-risk",
    access: "public",
    ns: "public",
    titleKey: "risk.heroTitle",
    load: () => import("@/pages/understanding-risk-page"),
  },
  {
    path: "/inherited-conditions",
    access: "public",
    ns: "public",
    titleKey: "conditions.heroTitle",
    load: () => import("@/pages/inherited-conditions-page"),
  },
  {
    path: "/genetic-counselling",
    access: "public",
    ns: "public",
    titleKey: "counsellingPage.heroTitle",
    load: () => import("@/pages/genetic-counselling-page"),
  },
  {
    path: "/contact",
    access: "public",
    ns: "public",
    titleKey: "contact.heroTitle",
    load: () => import("@/pages/contact-page"),
  },
  {
    path: "/faq",
    access: "public",
    ns: "public",
    titleKey: "faq.title",
    load: () => import("@/pages/faq-page"),
  },
  {
    path: "/privacy-policy",
    access: "public",
    ns: "public",
    titleKey: "privacyPolicy.heroTitle",
    load: () => import("@/pages/privacy-policy-page"),
  },
  {
    path: "/terms",
    access: "public",
    ns: "public",
    titleKey: "terms.title",
    load: () => import("@/pages/terms-page"),
  },
  {
    path: "/trust",
    access: "public",
    ns: "public",
    titleKey: "trustPublic.heroTitle",
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
    path: "/app/report",
    access: "couple",
    ns: "couple",
    titleKey: "report.title",
    load: () => import("@/pages/report-page"),
  },
  {
    path: "/app/partner",
    access: "couple",
    ns: "couple",
    titleKey: "partner.title",
    load: () => import("@/pages/partner-page"),
  },
  {
    path: "/app/notifications",
    access: "couple",
    ns: "couple",
    titleKey: "notifications.title",
    load: () => import("@/pages/notifications-page"),
  },
  {
    path: "/app/settings",
    access: "couple",
    ns: "couple",
    titleKey: "settingsPage.title",
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
    ns: "public",
    titleKey: "terms.title",
    load: () => import("@/pages/legal-page"),
  },
];

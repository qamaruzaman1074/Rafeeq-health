import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { preloadRouteI18n } from "@/i18n/route-i18n";
import { LiteracyModeToggle } from "@/components/literacy-mode-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { CoupleAppFrame, isCoupleAppPath } from "@/components/app/couple-app-frame";
import { PUBLIC_PATHS, PublicSiteFrame } from "@/components/public/public-site-frame";
import { SkipLink } from "@/components/skip-link";

function subscribeOnline(onChange: () => void): () => void {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

function useOnline(): boolean {
  return useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  );
}

export function ShellFrame({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const online = useOnline();
  return (
    <div className="flex min-h-screen min-w-0 flex-col bg-background text-ink-900">
      <SkipLink />
      <header className="border-b border-border-subtle bg-primary text-primary-foreground [&_button.border-transparent]:text-primary-foreground [&_button.border-transparent]:hover:bg-primary-hover/25 [&_button.border-transparent]:hover:text-primary-foreground">
        <div className="flex flex-wrap items-center gap-4 ps-4 pe-4 py-3">
          <p className="text-lg font-semibold">{t("app.documentTitle")}</p>
          <div className="ms-auto flex flex-wrap items-center gap-3">
            <LocaleSwitcher />
            <ThemeToggle />
            <LiteracyModeToggle />
          </div>
        </div>
      </header>
      {online ? null : (
        <p role="status" className="bg-secondary ps-4 pe-4 py-3 text-ink-900">
          {t("shell.offline")}
        </p>
      )}
      <main
        id="main"
        tabIndex={-1}
        className="min-w-0 flex-1 ps-4 pe-4 py-6 focus:outline focus:outline-[3px] focus:outline-offset-2 focus:outline-teal-500"
      >
        {children}
      </main>
      <footer className="border-t border-border-subtle bg-muted ps-4 pe-4 py-4 text-ink-900">
        <p>{t("shell.syntheticNotice")}</p>
      </footer>
    </div>
  );
}

export function AppShell() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  useEffect(() => {
    preloadRouteI18n(pathname, i18n.resolvedLanguage ?? i18n.language);
  }, [pathname, i18n]);
  const screen = (
    <div data-screen={pathname}>
      <ScrollRestoration />
      <Outlet />
    </div>
  );
  if (PUBLIC_PATHS.has(pathname)) {
    return <PublicSiteFrame>{screen}</PublicSiteFrame>;
  }
  if (isCoupleAppPath(pathname)) {
    return <CoupleAppFrame>{screen}</CoupleAppFrame>;
  }
  return <ShellFrame>{screen}</ShellFrame>;
}

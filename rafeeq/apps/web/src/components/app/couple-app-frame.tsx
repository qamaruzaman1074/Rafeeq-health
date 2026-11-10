import { useSyncExternalStore, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { CoupleNavIcon } from "@/components/app/nav-icons";
import { CouplePrimaryNav, CoupleSecondaryNav } from "@/components/app/couple-nav";
import { CoupleSessionCard } from "@/components/app/couple-session";
import { RafeeqLogo } from "@/components/brand/rafeeq-logo";
import { LiteracyModeToggle } from "@/components/literacy-mode-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { SkipLink } from "@/components/skip-link";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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

const wordmarkClass =
  "inline-flex w-fit rounded-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500";

function MoreMenu({ label }: { label: string }) {
  const { t } = useTranslation();
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="gap-2 ps-3 pe-3">
          <CoupleNavIcon id="more" />
          <span>{label}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle>{t("shell.nav.more")}</DrawerTitle>
        <DrawerDescription>{t("shell.nav.moreBody")}</DrawerDescription>
        <CoupleSecondaryNav />
        <div className="flex flex-col gap-3 border-t border-border-subtle pt-4">
          <LiteracyModeToggle />
        </div>
        <CoupleSessionCard />
      </DrawerContent>
    </Drawer>
  );
}

export function CoupleAppFrame({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const online = useOnline();
  const moreLabel = t("shell.nav.more");

  return (
    <div className="min-h-screen bg-background text-ink-900 lg:flex">
      <SkipLink />
      <aside className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-e lg:border-border-subtle lg:bg-card">
        <header className="flex items-center gap-2 border-b border-border-subtle ps-3 pe-3 py-3 lg:flex-col lg:items-stretch lg:gap-4 lg:ps-4 lg:pe-4 lg:pt-5 lg:pb-4">
          <Link to="/app" className={wordmarkClass} aria-label={t("app.documentTitle")}>
            <RafeeqLogo />
          </Link>
          <div className="ms-auto flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <MoreMenu label={moreLabel} />
          </div>
          <div className="hidden lg:block">
            <CoupleSessionCard />
          </div>
        </header>
        <div className="lg:flex lg:flex-col lg:gap-5 lg:ps-3 lg:pe-3 lg:py-4">
          <CouplePrimaryNav className="fixed start-0 end-0 bottom-0 z-30 border-t border-border-subtle bg-background pb-[env(safe-area-inset-bottom)] ps-1 pe-1 pt-1 shadow-surface lg:static lg:z-auto lg:border-t-0 lg:bg-transparent lg:p-0 lg:shadow-none" />
          <div className="hidden lg:block">
            <CoupleSecondaryNav />
          </div>
        </div>
        <div className="hidden lg:mt-auto lg:flex lg:flex-col lg:gap-3 lg:border-t lg:border-border-subtle lg:ps-4 lg:pe-4 lg:py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-600">
              {t("shell.nav.groups.display")}
            </p>
            <ThemeToggle />
          </div>
          <LiteracyModeToggle />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        {online ? null : (
          <p role="status" className="bg-secondary ps-4 pe-4 py-3 text-ink-900">
            {t("shell.offline")}
          </p>
        )}
        <main
          id="main"
          tabIndex={-1}
          className="flex-1 ps-4 pe-4 py-6 focus:outline focus:outline-[3px] focus:outline-offset-2 focus:outline-teal-500 lg:ps-8 lg:pe-8 lg:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export function isCoupleAppPath(pathname: string): boolean {
  return pathname === "/app" || pathname.startsWith("/app/");
}

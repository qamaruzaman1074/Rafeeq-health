import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { LiteracyModeToggle } from "@/components/literacy-mode-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NumeralToggle } from "@/components/numeral-toggle";
import { SkipLink } from "@/components/skip-link";

export function ShellFrame({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col bg-sand-50 text-ink-900">
      <SkipLink />
      <header className="border-b border-teal-100 bg-teal-900 text-sand-50">
        <div className="flex flex-wrap items-center gap-4 ps-4 pe-4 py-3">
          <p className="text-lg font-semibold">{t("app.documentTitle")}</p>
          <div className="ms-auto flex flex-wrap items-center gap-3">
            <LocaleSwitcher />
            <LiteracyModeToggle />
            <NumeralToggle />
          </div>
        </div>
      </header>
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 ps-4 pe-4 py-6 focus:outline focus:outline-[3px] focus:outline-offset-2 focus:outline-teal-500"
      >
        {children}
      </main>
      <footer className="border-t border-teal-100 bg-amber-100 ps-4 pe-4 py-4 text-ink-900">
        <p>{t("shell.syntheticNotice")}</p>
      </footer>
    </div>
  );
}

export function AppShell() {
  return (
    <ShellFrame>
      <Outlet />
    </ShellFrame>
  );
}

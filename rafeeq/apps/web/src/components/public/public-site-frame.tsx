import { useSyncExternalStore, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { SkipLink } from "@/components/skip-link";
import { publicSitePaths } from "@/config/public-nav";

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

export function PublicSiteFrame({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const online = useOnline();

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden bg-background text-ink-900">
      <SkipLink />
      <PublicHeader />
      {online ? null : (
        <p role="status" className="bg-secondary ps-4 pe-4 py-3 text-ink-900">
          {t("shell.offline")}
        </p>
      )}
      <main
        id="main"
        tabIndex={-1}
        className="min-w-0 flex-1 focus:outline focus:outline-[3px] focus:outline-offset-2 focus:outline-teal-500"
      >
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}

export const PUBLIC_PATHS = publicSitePaths;

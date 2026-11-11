import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type AssistantLauncherProps = {
  open: boolean;
  panelId: string;
  onOpen: () => void;
};

export function AssistantLauncher({ open, panelId, onOpen }: AssistantLauncherProps) {
  const { t } = useTranslation("website-assistant");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      setScrolled(window.scrollY > 180);
    };
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-end gap-3 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-6">
      <div
        className={cn(
          "pointer-events-none mb-1 hidden rounded-2xl border border-white/80 bg-white/95 px-4 py-2.5 text-start shadow-lg shadow-teal-950/10 backdrop-blur transition-[opacity,transform] duration-300 sm:block",
          "dark:border-border-subtle dark:bg-card/95",
          open ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100",
        )}
        aria-hidden="true"
      >
        <p className="text-sm font-semibold text-teal-950 dark:text-foreground">
          {t("launcherTitle")}
        </p>
        <p className="mt-0.5 text-xs text-ink-600 dark:text-muted-foreground">
          {t("launcherHint")}
        </p>
      </div>
      <button
        type="button"
        className={cn(
          "group pointer-events-auto relative flex size-14 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-teal-700 to-cyan-700 p-2 shadow-xl shadow-teal-950/25 ring-1 ring-teal-900/10 sm:size-[4.25rem]",
          "transition-[transform,opacity,background-color] duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-teal-950/30",
          "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500",
          "motion-reduce:transition-none",
          scrolled && "scale-90",
          open && "pointer-events-none scale-90 opacity-0",
        )}
        data-scrolled={scrolled ? "true" : undefined}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t("launcher")}
        aria-hidden={open}
        disabled={open}
        tabIndex={open ? -1 : undefined}
        onClick={onOpen}
      >
        <img
          src="/images/website-assistant/rafeeq-assistant-launcher.svg"
          alt=""
          width={56}
          height={56}
          decoding="async"
          className="size-full object-contain drop-shadow-sm transition-transform duration-300 motion-safe:group-hover:scale-105"
        />
        <span className="absolute end-0 top-0 size-3.5 rounded-full border-2 border-white bg-emerald-400" />
      </button>
    </div>
  );
}

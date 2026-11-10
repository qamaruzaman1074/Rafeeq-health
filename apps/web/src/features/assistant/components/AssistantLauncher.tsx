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
    <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-end p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-6">
      <button
        type="button"
        className={cn(
          "pointer-events-auto flex size-14 items-center justify-center rounded-full p-2 shadow-lg ring-2 ring-gold-500/50 sm:size-[4.25rem]",
          "bg-teal-700 hover:bg-teal-500",
          "dark:bg-teal-500 dark:ring-gold-500/60 dark:hover:bg-teal-700",
          "transition-[transform,opacity,background-color] duration-300 ease-out hover:scale-105",
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
          className="size-full object-contain drop-shadow-sm"
        />
      </button>
    </div>
  );
}

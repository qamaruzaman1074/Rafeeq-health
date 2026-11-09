import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type AssistantLauncherProps = {
  open: boolean;
  panelId: string;
  onOpen: () => void;
};

export function AssistantLauncher({ open, panelId, onOpen }: AssistantLauncherProps) {
  const { t } = useTranslation("website-assistant");

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-end p-4 sm:p-6">
      <button
        type="button"
        className={cn(
          "pointer-events-auto flex size-[4.25rem] items-center justify-center rounded-full p-2 shadow-lg ring-2 ring-gold-500/50",
          "bg-teal-700 hover:bg-teal-500",
          "dark:bg-teal-500 dark:ring-gold-500/60 dark:hover:bg-teal-700",
          "transition-[transform,background-color] duration-200 hover:scale-105",
          "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500",
          "motion-reduce:transition-none",
          open && "pointer-events-none opacity-0",
        )}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t("launcher")}
        hidden={open}
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

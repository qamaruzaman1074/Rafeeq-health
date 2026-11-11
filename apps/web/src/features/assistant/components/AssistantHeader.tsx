import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

type AssistantHeaderProps = {
  onClose: () => void;
  onClear: () => void;
  canClear: boolean;
};

export function AssistantHeader({ onClose, onClear, canClear }: AssistantHeaderProps) {
  const { t } = useTranslation("website-assistant");

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-teal-900/10 bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 px-4 py-4 text-white sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 p-1.5 shadow-inner">
          <img
            src="/images/website-assistant/rafeeq-assistant-launcher.svg"
            alt=""
            className="size-full object-contain"
            width={40}
            height={40}
          />
          <span className="absolute -end-1 -bottom-1 size-3 rounded-full border-2 border-teal-700 bg-emerald-300" />
        </div>
        <div className="min-w-0">
          <DialogPrimitive.Title className="truncate text-base font-semibold text-white sm:text-lg">
            {t("title")}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-teal-50/90 sm:text-sm">
            {t("subtitle")}
          </DialogPrimitive.Description>
          <p className="mt-1.5 flex items-center gap-1.5 text-[0.68rem] font-medium text-emerald-100">
            <span className="size-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
            {t("ready")}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          className="size-10 rounded-xl p-0 text-white hover:bg-white/15 hover:text-white"
          disabled={!canClear}
          onClick={onClear}
          aria-label={t("clear")}
          title={t("clear")}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-5"
            aria-hidden="true"
          >
            <path
              d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="size-10 rounded-xl p-0 text-white hover:bg-white/15 hover:text-white"
          onClick={onClose}
          aria-label={t("close")}
          title={t("close")}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-5"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </Button>
      </div>
    </header>
  );
}

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
    <header className="flex items-start justify-between gap-3 border-b border-border-subtle bg-card px-4 py-3">
      <div className="min-w-0">
        <DialogPrimitive.Title className="text-lg font-semibold text-teal-900">
          {t("title")}
        </DialogPrimitive.Title>
        <DialogPrimitive.Description className="mt-1 text-sm text-ink-600">
          {t("subtitle")}
        </DialogPrimitive.Description>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row">
        <Button type="button" variant="secondary" disabled={!canClear} onClick={onClear}>
          {t("clear")}
        </Button>
        <Button type="button" variant="ghost" onClick={onClose}>
          {t("close")}
        </Button>
      </div>
    </header>
  );
}

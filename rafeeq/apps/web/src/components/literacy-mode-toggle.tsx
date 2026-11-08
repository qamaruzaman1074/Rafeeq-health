import { useTranslation } from "react-i18next";
import { useLiteracy, type LiteracyMode } from "@/app/literacy";
import { Button } from "@/components/ui/button";

export function LiteracyModeToggle() {
  const { t } = useTranslation();
  const { mode, setMode } = useLiteracy();

  const choose = (next: LiteracyMode) => {
    if (next !== mode) {
      setMode(next);
    }
  };

  return (
    <div role="group" aria-label={t("shell.literacy.label")} className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        aria-pressed={mode === "standard"}
        onClick={() => {
          choose("standard");
        }}
      >
        {t("shell.literacy.standard")}
      </Button>
      <Button
        variant="secondary"
        aria-pressed={mode === "simple"}
        onClick={() => {
          choose("simple");
        }}
      >
        {t("shell.literacy.simple")}
      </Button>
      <Button
        variant="secondary"
        aria-pressed={mode === "voice"}
        onClick={() => {
          choose("voice");
        }}
      >
        {t("shell.literacy.voice")}
      </Button>
    </div>
  );
}

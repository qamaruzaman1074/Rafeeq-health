import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useNumerals } from "@/i18n/numerals";
import type { NumeralSystem } from "@/i18n/format";

export function NumeralToggle() {
  const { t } = useTranslation();
  const { system, setSystem } = useNumerals();

  const choose = (next: NumeralSystem) => {
    if (next !== system) {
      setSystem(next);
    }
  };

  return (
    <div role="group" aria-label={t("common.numerals.label")} className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        aria-pressed={system === "latn"}
        onClick={() => {
          choose("latn");
        }}
      >
        {t("common.numerals.latn")}
      </Button>
      <Button
        variant="secondary"
        aria-pressed={system === "arab"}
        onClick={() => {
          choose("arab");
        }}
      >
        {t("common.numerals.arab")}
      </Button>
    </div>
  );
}

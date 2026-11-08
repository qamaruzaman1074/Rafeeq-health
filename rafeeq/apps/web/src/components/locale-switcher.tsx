import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { changeAppLanguage } from "@/i18n/language";
import { documentLocale, type AppLocale } from "@/i18n/locale";

export function LocaleSwitcher() {
  const { t, i18n } = useTranslation();
  const active = documentLocale(i18n.resolvedLanguage ?? i18n.language).lang;

  const choose = (locale: AppLocale) => {
    void changeAppLanguage(locale);
  };

  return (
    <div role="group" aria-label={t("common.language")} className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        aria-pressed={active === "en"}
        onClick={() => {
          choose("en");
        }}
      >
        {t("common.languageName.en")}
      </Button>
      <Button
        variant="secondary"
        aria-pressed={active === "ar"}
        onClick={() => {
          choose("ar");
        }}
      >
        {t("common.languageName.ar")}
      </Button>
    </div>
  );
}

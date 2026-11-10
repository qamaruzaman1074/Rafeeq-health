import { useTranslation } from "react-i18next";
import { changeAppLanguage } from "@/i18n/language";
import type { AppLocale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

const LOCALES: AppLocale[] = ["en", "ar"];

export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const { t, i18n } = useTranslation();
  const active = i18n.resolvedLanguage === "ar" ? "ar" : "en";

  return (
    <div
      role="group"
      aria-label={t("common.language")}
      className={cn("flex flex-wrap gap-2", compact && "gap-1")}
    >
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          aria-pressed={active === locale}
          className={cn(
            "min-h-11 rounded-lg border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500",
            active === locale
              ? "border-teal-700 bg-teal-100 text-teal-900"
              : "border-border-subtle bg-card text-ink-600",
          )}
          onClick={() => {
            void changeAppLanguage(locale);
          }}
        >
          {compact ? t(`common.languageCompact.${locale}`) : t(`common.languageName.${locale}`)}
        </button>
      ))}
    </div>
  );
}

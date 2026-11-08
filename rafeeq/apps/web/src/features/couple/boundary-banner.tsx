import { useTranslation } from "react-i18next";
import type { LocalizedBlock } from "@/features/couple/fact-card-dto";
import { documentLocale } from "@/i18n/locale";

export function BoundaryBanner({ blocks }: { blocks: readonly LocalizedBlock[] }) {
  const { i18n, t } = useTranslation();
  const locale = documentLocale(i18n.resolvedLanguage ?? i18n.language).lang;
  const block = blocks.find((item) => item.locale === locale);

  return (
    <aside className="rounded-lg border border-teal-700 bg-amber-100 p-4">
      {block === undefined || block.text === null ? (
        <p>{t("content.missing", { ns: "common" })}</p>
      ) : (
        <p lang={block.locale} dir={block.locale === "ar" ? "rtl" : "ltr"}>
          {block.text}
        </p>
      )}
      {block !== undefined ? (
        <p lang="en" dir="ltr">
          {block.block_id}
        </p>
      ) : null}
    </aside>
  );
}

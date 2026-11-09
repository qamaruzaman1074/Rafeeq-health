import { useTranslation } from "react-i18next";
import { NoticePanel } from "@/components/public/marketing-blocks";

export function ArabicReviewNotice() {
  const { i18n, t } = useTranslation();
  if (i18n.resolvedLanguage !== "ar") {
    return null;
  }
  return (
    <NoticePanel>
      <p className="text-sm font-medium">{t("locale.arReviewNotice")}</p>
    </NoticePanel>
  );
}

import { useTranslation } from "react-i18next";
import { NoticePanel } from "@/components/public/marketing-blocks";

import type { AppNamespace } from "@/i18n/namespaces";

type NonDirectiveNoticeProps = {
  messageKey?: string;
  ns?: AppNamespace;
};

export function NonDirectiveNotice({
  messageKey = "informedChoices.nonDirective",
  ns = "public",
}: NonDirectiveNoticeProps) {
  const { t } = useTranslation();
  return (
    <NoticePanel>
      <p className="font-medium">{t(messageKey, { ns })}</p>
    </NoticePanel>
  );
}

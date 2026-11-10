import { useTranslation } from "react-i18next";
import { SuggestedQuestions } from "@/features/assistant/components/SuggestedQuestions";

type AssistantWelcomeProps = {
  pathname: string;
  onSelect: (question: string) => void;
};

export function AssistantWelcome({ pathname, onSelect }: AssistantWelcomeProps) {
  const { t } = useTranslation("website-assistant");

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border-subtle bg-secondary/60 p-4 text-sm text-ink-900">
        <p className="whitespace-pre-line leading-relaxed">{t("welcomeMessage")}</p>
      </div>
      <p className="rounded-lg border border-amber-100 bg-amber-100/40 px-3 py-2 text-xs text-ink-600">
        {t("educationNotice")}
      </p>
      <SuggestedQuestions pathname={pathname} onSelect={onSelect} mode="welcome" />
    </div>
  );
}

import { useTranslation } from "react-i18next";
import { allSuggestionGroups, contextualSuggestionQuestions } from "@/features/assistant/knowledge/suggestions";
import { cn } from "@/lib/utils";

type SuggestedQuestionsProps = {
  pathname: string;
  onSelect: (question: string) => void;
  mode?: "welcome" | "contextual";
  className?: string;
};

export function SuggestedQuestions({
  pathname,
  onSelect,
  mode = "welcome",
  className,
}: SuggestedQuestionsProps) {
  const { t } = useTranslation("website-assistant");

  if (mode === "contextual") {
    const questions = contextualSuggestionQuestions(pathname);
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <p className="text-sm font-medium text-ink-900">{t("suggestedIntro")}</p>
        <ul className="flex flex-wrap gap-2">
          {questions.map((question) => (
            <li key={question}>
              <button
                type="button"
                className="rounded-full border border-border-subtle bg-card px-3 py-1.5 text-start text-sm text-ink-900 transition-colors hover:border-teal-500 hover:bg-secondary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                onClick={() => onSelect(question)}
              >
                {question}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p className="text-sm font-medium text-ink-900">{t("suggestedIntro")}</p>
      {allSuggestionGroups().map((group) => (
        <div key={group.id} className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            {t(group.labelKey)}
          </p>
          <ul className="flex flex-wrap gap-2">
            {group.questions.map((question) => (
              <li key={question}>
                <button
                  type="button"
                  className="rounded-full border border-border-subtle bg-card px-3 py-1.5 text-start text-sm text-ink-900 transition-colors hover:border-teal-500 hover:bg-secondary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                  onClick={() => onSelect(question)}
                >
                  {question}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

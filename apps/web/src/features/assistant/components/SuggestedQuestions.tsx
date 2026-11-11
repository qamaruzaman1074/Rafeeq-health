import { useTranslation } from "react-i18next";
import {
  allSuggestionGroups,
  contextualSuggestionQuestions,
} from "@/features/assistant/knowledge/suggestions";
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
  const { i18n, t } = useTranslation("website-assistant");
  const language = i18n.resolvedLanguage === "ar" ? "ar" : "en";

  if (mode === "contextual") {
    const questions = contextualSuggestionQuestions(pathname, language);
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <p className="text-sm font-medium text-ink-900">{t("suggestedIntro")}</p>
        <ul className="flex flex-wrap gap-2">
          {questions.map((question) => (
            <li key={question}>
              <button
                type="button"
                className="rounded-full border border-teal-100 bg-white px-3.5 py-2 text-start text-sm text-teal-950 shadow-sm transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
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
      <p className="text-sm font-semibold text-teal-950">{t("suggestedIntro")}</p>
      {allSuggestionGroups(language).map((group) => (
        <div key={group.id} className="flex flex-col gap-2.5">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-teal-700">
            {t(group.labelKey)}
          </p>
          <ul className="flex flex-wrap gap-2">
            {group.questions.map((question) => (
              <li key={question}>
                <button
                  type="button"
                  className="rounded-full border border-teal-100 bg-white px-3.5 py-2 text-start text-sm text-teal-950 shadow-sm transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-teal-400 hover:bg-teal-50 hover:shadow-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
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

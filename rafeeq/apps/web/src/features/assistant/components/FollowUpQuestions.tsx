import { useTranslation } from "react-i18next";

type FollowUpQuestionsProps = {
  questions: string[];
  onSelect: (question: string) => void;
};

export function FollowUpQuestions({ questions, onSelect }: FollowUpQuestionsProps) {
  const { t } = useTranslation("website-assistant");

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <p className="text-xs font-medium text-ink-600">{t("followUpIntro")}</p>
      <ul className="flex flex-wrap gap-2">
        {questions.map((question) => (
          <li key={question}>
            <button
              type="button"
              className="rounded-full border border-teal-500/40 bg-teal-pale px-3 py-1.5 text-start text-xs font-medium text-teal-900 transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
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

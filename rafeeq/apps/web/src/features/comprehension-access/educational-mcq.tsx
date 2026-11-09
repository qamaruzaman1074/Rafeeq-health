import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EDUCATIONAL_QUESTIONS } from "./demo-data";
import { markTopicVisited, recordCheckTopic } from "./learning-progress";
import type { ComprehensionTopicId } from "./content-model";

export function EducationalMcq({ id = "comprehension-mcq" }: { id?: string }) {
  const { t } = useTranslation();
  const [activeTopic, setActiveTopic] = useState<ComprehensionTopicId | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const question = EDUCATIONAL_QUESTIONS.find((entry) => entry.topicId === activeTopic) ?? null;

  function openTopic(topicId: ComprehensionTopicId): void {
    markTopicVisited(topicId);
    setActiveTopic(topicId);
    setSelected(null);
    setRevealed(false);
  }

  function submitAnswer(): void {
    if (question === null || selected === null) {
      return;
    }
    const correct = selected === question.correctOptionId;
    recordCheckTopic(question.topicId, correct);
    setRevealed(true);
  }

  return (
    <section id={id} className="flex scroll-mt-28 flex-col gap-6" aria-labelledby={`${id}-heading`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id={`${id}-heading`} className="text-2xl font-semibold text-teal-900">
            {t("comprehension.heading", { ns: "check" })}
          </h2>
          <Badge variant="notice">{t("comprehension.demoBadge", { ns: "check" })}</Badge>
        </div>
        <p className="max-w-3xl text-base leading-relaxed text-ink-600">
          {t("comprehension.intro", { ns: "check" })}
        </p>
        <p className="text-sm font-medium text-amber-900">{t("comprehension.notDiagnostic", { ns: "check" })}</p>
      </div>

      <nav aria-label={t("comprehension.topicNav", { ns: "check" })}>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {EDUCATIONAL_QUESTIONS.map((entry) => (
            <li key={entry.topicId}>
              <Button
                type="button"
                variant={activeTopic === entry.topicId ? "primary" : "secondary"}
                className="h-auto min-h-11 w-full justify-start whitespace-normal text-start"
                aria-current={activeTopic === entry.topicId ? "step" : undefined}
                onClick={() => {
                  openTopic(entry.topicId);
                }}
              >
                {t(`comprehension.topics.${entry.topicId}.title`, { ns: "check" })}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {question === null ? (
        <p className="text-sm text-ink-600">{t("comprehension.pickTopic", { ns: "check" })}</p>
      ) : (
        <article className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-sand-100 p-6">
          <h3 className="text-lg font-semibold text-teal-900">
            {t(`comprehension.topics.${question.topicId}.title`, { ns: "check" })}
          </h3>
          <p id={`${id}-question`}>{t(question.questionKey, { ns: "check" })}</p>
          <fieldset aria-labelledby={`${id}-question`} className="flex flex-col gap-2">
            <legend className="mb-1 text-sm font-medium text-teal-900">
              {t("comprehension.chooseOne", { ns: "check" })}
            </legend>
            {question.optionKeys.map((option) => {
              const inputId = `${id}-${question.topicId}-${option.id}`;
              return (
                <label
                  key={option.id}
                  htmlFor={inputId}
                  className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border-subtle bg-card px-4 py-2 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-500"
                >
                  <input
                    id={inputId}
                    type="radio"
                    name={`${id}-${question.topicId}`}
                    className="size-4 shrink-0 accent-teal-800"
                    checked={selected === option.id}
                    disabled={revealed}
                    onChange={() => {
                      setSelected(option.id);
                    }}
                  />
                  <span>{t(option.labelKey, { ns: "check" })}</span>
                </label>
              );
            })}
          </fieldset>
          {!revealed ? (
            <Button type="button" disabled={selected === null} className="self-start" onClick={submitAnswer}>
              {t("comprehension.submit", { ns: "check" })}
            </Button>
          ) : (
            <aside role="status" className="rounded-lg border border-teal-700 bg-amber-100 p-4">
              <p className="font-medium">
                {selected === question.correctOptionId
                  ? t("comprehension.feedback.correct", { ns: "check" })
                  : t("comprehension.feedback.retry", { ns: "check" })}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{t(question.explanationKey, { ns: "check" })}</p>
              <Button
                type="button"
                variant="secondary"
                className="mt-3"
                onClick={() => {
                  setSelected(null);
                  setRevealed(false);
                }}
              >
                {t("comprehension.retry", { ns: "check" })}
              </Button>
            </aside>
          )}
        </article>
      )}
    </section>
  );
}

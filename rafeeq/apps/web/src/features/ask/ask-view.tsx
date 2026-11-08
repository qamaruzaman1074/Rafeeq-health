import { useState } from "react";
import { useTranslation } from "react-i18next";
import faqFile from "../../../../../content/faq.json";
import { Button } from "@/components/ui/button";
import { boundaryBlocks } from "@/features/ask/boundary";
import { readSuggestedQuestions } from "@/features/ask/faq";
import { limitQuestion, QUESTION_LIMIT } from "@/features/ask/limit";
import { AskExchange } from "@/features/ask/messages";
import { postAsk } from "@/features/ask/api";
import type { AskPayload } from "@/features/ask/types";
import { BoundaryBanner } from "@/features/couple/boundary-banner";
import { documentLocale } from "@/i18n/locale";

const faq: unknown = faqFile;

type AskTurn = {
  id: string;
  question: string;
  status: "pending" | "ready" | "failed";
  payload: AskPayload | null;
};

export function AskView() {
  const { i18n, t } = useTranslation();
  const locale = documentLocale(i18n.resolvedLanguage ?? i18n.language).lang;
  const chips = readSuggestedQuestions(faq);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<AskTurn[]>([]);
  const [pending, setPending] = useState(false);

  function send(question: string): void {
    const trimmed = limitQuestion(question).trim();
    if (trimmed.length === 0 || pending) {
      return;
    }
    const id = crypto.randomUUID();
    setPending(true);
    setDraft("");
    setTurns((current) => [
      ...current,
      { id, question: trimmed, status: "pending", payload: null },
    ]);
    void postAsk({ question: trimmed, locale })
      .then((payload) => {
        setTurns((current) =>
          current.map((turn) => (turn.id === id ? { ...turn, status: "ready", payload } : turn)),
        );
      })
      .catch(() => {
        setTurns((current) =>
          current.map((turn) =>
            turn.id === id ? { ...turn, status: "failed", payload: null } : turn,
          ),
        );
      })
      .finally(() => {
        setPending(false);
      });
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-teal-900">{t("page.title", { ns: "ask" })}</h1>
      <BoundaryBanner
        blocks={boundaryBlocks(locale)}
        label={t("boundary.label", { ns: "ask" })}
        notice={t("boundary.notice", { ns: "ask" })}
      />
      <div role="group" aria-label={t("chips.label", { ns: "ask" })} data-suggested={chips.length}>
        {chips.length > 0 ? (
          <ul className="flex flex-wrap gap-3">
            {chips.map((chip) => (
              <li key={chip.id}>
                <Button
                  variant="secondary"
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    send(chip.question);
                  }}
                >
                  {chip.question}
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <form
        className="flex flex-col items-start gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
      >
        <label htmlFor="ask-question" className="text-lg font-medium text-teal-900">
          {t("composer.label", { ns: "ask" })}
        </label>
        <textarea
          id="ask-question"
          name="question"
          rows={4}
          maxLength={QUESTION_LIMIT}
          value={draft}
          onChange={(event) => {
            setDraft(limitQuestion(event.target.value));
          }}
          className="w-full rounded-md border border-teal-700 bg-sand-100 p-3 text-base text-ink-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        />
        <p>{t("composer.count", { ns: "ask", count: draft.length, max: QUESTION_LIMIT })}</p>
        <Button type="submit" disabled={pending || draft.trim().length === 0}>
          {t("composer.send", { ns: "ask" })}
        </Button>
      </form>
      <ol aria-label={t("transcript.label", { ns: "ask" })} className="flex flex-col gap-6">
        {turns.map((turn) => (
          <li key={turn.id} className="flex flex-col gap-3">
            <p className="font-medium text-teal-900">{t("transcript.you", { ns: "ask" })}</p>
            <p className="whitespace-pre-wrap">{turn.question}</p>
            {turn.status === "pending" ? <p>{t("loading", { ns: "ask" })}</p> : null}
            {turn.status === "failed" ? <p role="alert">{t("error.send", { ns: "ask" })}</p> : null}
            {turn.status === "ready" && turn.payload !== null ? (
              <AskExchange payload={turn.payload} />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

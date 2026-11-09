import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import faqArFile from "../../../../../content/faq.ar.json";
import faqFile from "../../../../../content/faq.json";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/empty-state";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotify } from "@/components/ui/toast";
import { boundaryBlocks } from "@/features/ask/boundary";
import { readSuggestedQuestions } from "@/features/ask/faq";
import { limitQuestion, QUESTION_LIMIT } from "@/features/ask/limit";
import { AskExchange } from "@/features/ask/messages";
import { postAsk } from "@/features/ask/api";
import type { AskPayload } from "@/features/ask/types";
import { NoticePanel } from "@/components/public/marketing-blocks";
import { BoundaryBanner } from "@/features/couple/boundary-banner";
import { NonDirectiveNotice } from "@/features/informed-choices/non-directive-notice";
import { documentLocale } from "@/i18n/locale";

const faqEn: unknown = faqFile;
const faqAr: unknown = faqArFile;

type AskTurn = {
  id: string;
  question: string;
  status: "pending" | "ready" | "failed";
  payload: AskPayload | null;
};

export function AskView() {
  const { i18n, t } = useTranslation();
  const locale = documentLocale(i18n.resolvedLanguage ?? i18n.language).lang;
  const chips = readSuggestedQuestions(locale === "ar" ? faqAr : faqEn);
  const notify = useNotify();
  const contact = humanContact(t);
  const [name, setName] = useState("");
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<AskTurn[]>([]);
  const [pending, setPending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  function deliver(id: string, question: string): void {
    setPending(true);
    setTurns((current) =>
      current.map((turn) =>
        turn.id === id ? { ...turn, status: "pending", payload: null } : turn,
      ),
    );
    void postAsk({ question, locale })
      .then((payload) => {
        setTurns((current) =>
          current.map((turn) => (turn.id === id ? { ...turn, status: "ready", payload } : turn)),
        );
        setSendSuccess(true);
        notify({ title: t("composer.sendSuccess", { ns: "ask" }) });
      })
      .catch(() => {
        setTurns((current) =>
          current.map((turn) =>
            turn.id === id ? { ...turn, status: "failed", payload: null } : turn,
          ),
        );
        notify({ title: t("error.send", { ns: "ask" }), variant: "error" });
      })
      .finally(() => {
        setPending(false);
      });
  }

  function send(question: string): void {
    const trimmed = limitQuestion(question).trim();
    if (trimmed.length === 0 || pending) {
      return;
    }
    const id = crypto.randomUUID();
    setDraft("");
    setTurns((current) => [
      ...current,
      { id, question: trimmed, status: "pending", payload: null },
    ]);
    deliver(id, trimmed);
  }

  return (
    <AppPageLayout width="wide">
      <PageHeader
        title={t("page.title", { ns: "ask" })}
        description={t("page.intro", { ns: "ask" })}
        actions={
          <Button asChild>
            <Link to="/app/care">{t("talk.button", { ns: "ask" })}</Link>
          </Button>
        }
      />

      <p className="max-w-2xl text-base leading-relaxed text-ink-600">
        {t("page.notCounsellor", { ns: "ask" })}
      </p>

      <NonDirectiveNotice />

      <NoticePanel>
        <p className="text-sm">{t("page.nonDirective", { ns: "ask" })}</p>
      </NoticePanel>

      <p className="text-sm">
        <Link to="/informed-choices" className="font-medium text-teal-800 underline-offset-4 hover:underline">
          {t("page.informedChoicesLink", { ns: "ask" })}
        </Link>
      </p>

      <BoundaryBanner
        blocks={boundaryBlocks(locale)}
        label={t("boundary.label", { ns: "ask" })}
        notice={t("boundary.notice", { ns: "ask" })}
      />

      <Card className="hover:shadow-surface">
        <CardHeader>
          <CardTitle>{t("human.heading", { ns: "ask" })}</CardTitle>
          <CardDescription>{t("human.body", { ns: "ask" })}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="secondary">
            <Link to="/app/care">{t("human.action", { ns: "ask" })}</Link>
          </Button>
        </CardContent>
      </Card>

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
      {sendSuccess ? (
        <p role="status" className="rounded-lg border border-green-600 bg-teal-50 px-4 py-3 text-base font-medium text-teal-900">
          {t("composer.sendSuccess", { ns: "ask" })}
        </p>
      ) : null}
      <form
        className="flex flex-col items-start gap-3 rounded-lg border border-border-subtle bg-sand-100 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          setSendSuccess(false);
          send(draft);
        }}
      >
        <label htmlFor="ask-name" className="text-sm font-medium text-teal-900">
          {t("composer.nameLabel", { ns: "ask" })}
        </label>
        <input
          id="ask-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          placeholder={t("composer.namePlaceholder", { ns: "ask" })}
          onChange={(event) => {
            setName(event.target.value);
          }}
          className="min-h-11 w-full rounded-md border border-teal-700 bg-card px-3 text-base text-ink-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        />
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
      {turns.length === 0 ? <EmptyState title={t("empty", { ns: "ask" })} /> : null}
      <ol aria-label={t("transcript.label", { ns: "ask" })} className="flex flex-col gap-6">
        {turns.map((turn) => (
          <li key={turn.id} className="flex flex-col gap-3">
            <p className="font-medium text-teal-900">{t("transcript.you", { ns: "ask" })}</p>
            <p className="whitespace-pre-wrap">{turn.question}</p>
            {turn.status === "pending" ? <Skeleton label={t("loading", { ns: "ask" })} /> : null}
            {turn.status === "failed" ? (
              <ErrorState
                title={t("error.send", { ns: "ask" })}
                retryLabel={t("composer.send", { ns: "ask" })}
                onRetry={() => {
                  deliver(turn.id, turn.question);
                }}
                {...contact}
              />
            ) : null}
            {turn.status === "ready" && turn.payload !== null ? (
              <AskExchange payload={turn.payload} />
            ) : null}
          </li>
        ))}
      </ol>
    </AppPageLayout>
  );
}

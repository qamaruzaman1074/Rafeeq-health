import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { presentAsk } from "@/features/ask/present";
import { isHardReason, type HardReason } from "@/features/ask/reasons";
import type { AskPayload } from "@/features/ask/types";
import { readLocaleBlock } from "@/features/learn/blocks";
import { documentLocale } from "@/i18n/locale";

function reasonText(reason: HardReason, t: TFunction): string {
  switch (reason) {
    case "distress":
      return t("handoff.reason.distress", { ns: "ask" });
    case "termination":
      return t("handoff.reason.termination", { ns: "ask" });
    case "religious":
      return t("handoff.reason.religious", { ns: "ask" });
    case "other_person":
      return t("handoff.reason.other_person", { ns: "ask" });
    case "blame":
      return t("handoff.reason.blame", { ns: "ask" });
    case "diagnosis":
      return t("handoff.reason.diagnosis", { ns: "ask" });
    case "decision":
      return t("handoff.reason.decision", { ns: "ask" });
    case "medication":
      return t("handoff.reason.medication", { ns: "ask" });
    case "legal":
      return t("handoff.reason.legal", { ns: "ask" });
    case "minor":
      return t("handoff.reason.minor", { ns: "ask" });
    default: {
      const unreachable: never = reason;
      return unreachable;
    }
  }
}

export function HandoffCard({ reason }: { reason: string | null }) {
  const { i18n, t } = useTranslation();
  const locale = documentLocale(i18n.resolvedLanguage ?? i18n.language).lang;
  const crisisText = readLocaleBlock(locale, "ask.handoff.crisis").text;
  const known = reason !== null && isHardReason(reason) ? reason : null;

  return (
    <section
      data-handoff="human"
      aria-label={t("handoff.region", { ns: "ask" })}
      className="flex flex-col items-start gap-3 rounded-lg border border-teal-700 bg-lilac-100 p-6 shadow-xs"
    >
      <Badge variant="conversation">{t("handoff.badge", { ns: "ask" })}</Badge>
      <h2 className="text-xl font-semibold text-teal-900">{t("handoff.title", { ns: "ask" })}</h2>
      {known !== null ? <p>{reasonText(known, t)}</p> : null}
      {known === "distress" ? (
        <p>
          <span>{t("handoff.crisisLabel", { ns: "ask" })}</span>{" "}
          <span lang="en" dir="ltr">
            {crisisText ?? t("content.missing")}
          </span>
        </p>
      ) : null}
      <Button asChild>
        <Link to="/app/care">{t("handoff.book", { ns: "ask" })}</Link>
      </Button>
    </section>
  );
}

export function AnswerCard({
  sourceIds,
  text,
}: {
  sourceIds: readonly string[];
  text: string | null;
}) {
  const { t } = useTranslation();

  return (
    <article
      data-answer="content"
      className="flex flex-col items-start gap-3 rounded-lg border border-border-subtle bg-sand-100 p-6 shadow-xs"
    >
      {text === null ? (
        <p>
          <span>{t("content.missing")}</span>
        </p>
      ) : (
        <p>{text}</p>
      )}
      <ul aria-label={t("source.list", { ns: "ask" })}>
        {sourceIds.map((id) => (
          <li key={id} lang="en" dir="ltr">
            {t("source.label", { ns: "ask", id })}
          </li>
        ))}
      </ul>
      <Button asChild variant="secondary">
        <Link to="/app/care">{t("talk.button", { ns: "ask" })}</Link>
      </Button>
    </article>
  );
}

export function BlockedAnswer() {
  const { t } = useTranslation();

  return (
    <div
      role="alert"
      data-answer="blocked"
      className="flex flex-col items-start gap-3 rounded-lg border border-teal-700 bg-sand-100 p-6 shadow-xs"
    >
      <p>{t("error.noSource", { ns: "ask" })}</p>
      <Button asChild variant="secondary">
        <Link to="/app/care">{t("talk.button", { ns: "ask" })}</Link>
      </Button>
    </div>
  );
}

export function AskExchange({ payload }: { payload: AskPayload }) {
  const presentation = presentAsk(payload);
  if (presentation.kind === "handoff") {
    return <HandoffCard reason={presentation.reason} />;
  }
  if (presentation.kind === "blocked") {
    return <BlockedAnswer />;
  }
  return <AnswerCard sourceIds={presentation.sourceIds} text={presentation.text} />;
}

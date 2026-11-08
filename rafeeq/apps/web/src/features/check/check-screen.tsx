import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { EmptyState } from "@/components/empty-state";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OptionPicture, pictureLabel } from "@/features/check/pictures";
import type { CheckItemView, FeedbackBlock } from "@/features/check/types";

function dotLabel(state: "passed" | "current" | "upcoming", t: TFunction): string {
  switch (state) {
    case "passed":
      return t("progress.passed", { ns: "check" });
    case "current":
      return t("progress.current", { ns: "check" });
    case "upcoming":
      return t("progress.upcoming", { ns: "check" });
    default: {
      const unreachable: never = state;
      return unreachable;
    }
  }
}

function ProgressDots({
  count,
  index,
  finished,
}: {
  count: number;
  index: number;
  finished: boolean;
}) {
  const { t } = useTranslation();
  return (
    <ol
      aria-label={t("progress.label", { ns: "check" })}
      className="flex flex-wrap gap-3"
      data-progress="dots"
    >
      {Array.from({ length: count }, (_, dotIndex) => {
        const state =
          finished || dotIndex < index ? "passed" : dotIndex === index ? "current" : "upcoming";
        const fill =
          state === "current" ? "bg-teal-700" : state === "passed" ? "bg-green-600" : "bg-teal-100";
        return (
          <li key={dotIndex}>
            <span
              className={`block h-3 w-3 rounded-full ${fill}`}
              data-progress-dot={state}
              aria-current={state === "current" ? "step" : undefined}
            />
            <span className="sr-only">{dotLabel(state, t)}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function CheckScreen({
  item,
  itemCount,
  index,
  finished,
  showFeedback,
  feedback,
  pending,
  saveError,
  onChoose,
  onSkip,
  onRetrySave,
}: {
  item: CheckItemView | null;
  itemCount: number;
  index: number;
  finished: boolean;
  showFeedback: boolean;
  feedback: FeedbackBlock | null;
  pending: boolean;
  saveError: boolean;
  onChoose: (optionId: string) => void;
  onSkip: () => void;
  onRetrySave?: () => void;
}) {
  const { t } = useTranslation();
  const contact = humanContact(t);

  if (finished) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold text-teal-900">{t("page.title", { ns: "check" })}</h1>
        <ProgressDots count={itemCount} index={index} finished />
        <h2 className="text-2xl font-semibold text-teal-900">{t("done.title", { ns: "check" })}</h2>
        <p>{t("done.body", { ns: "check" })}</p>
        <Link
          to="/app"
          className="inline-flex min-h-11 items-center text-teal-700 underline decoration-teal-700 underline-offset-4 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        >
          {t("done.home", { ns: "check" })}
        </Link>
      </div>
    );
  }

  if (item === null) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold text-teal-900">{t("page.title", { ns: "check" })}</h1>
        <EmptyState title={t("empty", { ns: "check" })} />
      </div>
    );
  }

  const feedbackText = feedback?.text ?? null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-teal-900">{t("page.title", { ns: "check" })}</h1>
      <ProgressDots count={itemCount} index={index} finished={false} />
      <article
        className="flex flex-col gap-4 rounded-lg border border-teal-500 bg-sand-100 p-6"
        data-item-id={item.id}
        data-block-id={item.prompt.block_id}
      >
        {item.status === "draft" ? (
          <Badge variant="notice">{t("prototype", { ns: "check" })}</Badge>
        ) : null}
        {item.prompt.text !== null ? (
          <p lang={item.prompt.locale}>{item.prompt.text}</p>
        ) : (
          <p>
            <span>{t("content.missing", { ns: "common" })}</span>{" "}
            <span lang="en" dir="ltr">
              {item.prompt.block_id}
            </span>
          </p>
        )}
        <div
          role="radiogroup"
          aria-label={t("options.legend", { ns: "check" })}
          className="flex flex-wrap gap-4"
        >
          {item.options.map((option) => {
            const label = pictureLabel(option.picture, t);
            return (
              <Button
                key={option.id}
                variant="secondary"
                role="radio"
                aria-checked={false}
                aria-label={label}
                disabled={pending}
                className="h-20 w-20"
                onClick={() => {
                  onChoose(option.id);
                }}
              >
                <OptionPicture picture={option.picture} />
              </Button>
            );
          })}
        </div>
        {showFeedback && feedback !== null ? (
          <aside
            role="status"
            aria-label={t("feedback.region", { ns: "check" })}
            className="rounded-lg border border-teal-700 bg-amber-100 p-4"
            data-block-id={feedback.block_id}
          >
            <p>{feedbackText !== null ? feedbackText : t("feedback.note", { ns: "check" })}</p>
            {feedbackText === null ? (
              <p lang="en" dir="ltr">
                {feedback.block_id}
              </p>
            ) : (
              <Badge variant="notice">{t("prototype", { ns: "check" })}</Badge>
            )}
          </aside>
        ) : null}
        {pending ? <Skeleton label={t("loading", { ns: "check" })} /> : null}
        {saveError ? (
          <ErrorState
            title={t("saveError", { ns: "check" })}
            retryLabel={t("retry", { ns: "check" })}
            onRetry={() => {
              onRetrySave?.();
            }}
            {...contact}
          />
        ) : null}
        <Button variant="ghost" disabled={pending} onClick={onSkip}>
          {t("skip", { ns: "check" })}
        </Button>
      </article>
    </div>
  );
}

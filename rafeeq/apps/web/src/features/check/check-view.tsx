import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { useLiteracy } from "@/app/literacy";
import { getSessionPersona, subscribeSession } from "@/app/session";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { useFailureToast, useNotify } from "@/components/ui/toast";
import { buildAnswerRequest, fetchCheckItems, submitAnswer } from "@/features/check/api";
import { CheckScreen } from "@/features/check/check-screen";
import { applyAnswer, initialFlow, nextIndexFor, skipForNow } from "@/features/check/flow";
import { recordCheckOutcome } from "@/features/check/progress";
import type { CheckItemView, FeedbackBlock } from "@/features/check/types";
import { documentLocale } from "@/i18n/locale";

function toView(item: {
  id: string;
  status: CheckItemView["status"];
  prompt: CheckItemView["prompt"];
  options: CheckItemView["options"];
}): CheckItemView {
  return {
    id: item.id,
    status: item.status,
    prompt: item.prompt,
    options: item.options,
  };
}

function CheckSession({
  locale,
  hideHeading = false,
}: {
  locale: "en" | "ar";
  hideHeading?: boolean;
}) {
  const { t } = useTranslation();
  const { mode } = useLiteracy();
  const personaId = useSyncExternalStore(subscribeSession, getSessionPersona, getSessionPersona);
  const itemsQuery = useQuery({
    queryKey: ["comprehension", "items", personaId, locale],
    queryFn: () => fetchCheckItems(locale),
    retry: false,
  });
  const [flow, setFlow] = useState(initialFlow);
  const [feedback, setFeedback] = useState<FeedbackBlock | null>(null);
  const [pending, setPending] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const startedAt = useRef(Date.now());
  const lastOption = useRef<string | null>(null);
  const notify = useNotify();
  const contact = humanContact(t);
  useFailureToast(itemsQuery.isError, t("error", { ns: "check" }));

  useEffect(() => {
    startedAt.current = Date.now();
  }, [flow.index, flow.attempt]);

  if (itemsQuery.isPending) {
    return (
      <div className="flex flex-col gap-6">
        {hideHeading ? null : (
          <h1 className="text-3xl font-semibold text-teal-900">
            {t("page.title", { ns: "check" })}
          </h1>
        )}
        <Skeleton label={t("loading", { ns: "check" })} />
      </div>
    );
  }

  if (itemsQuery.isError) {
    return (
      <div className="flex flex-col gap-6">
        {hideHeading ? null : (
          <h1 className="text-3xl font-semibold text-teal-900">
            {t("page.title", { ns: "check" })}
          </h1>
        )}
        <ErrorState
          title={t("error", { ns: "check" })}
          retryLabel={t("retry", { ns: "check" })}
          onRetry={() => {
            void itemsQuery.refetch();
          }}
          {...contact}
        />
      </div>
    );
  }

  const loaded = itemsQuery.data;
  if (loaded == null || loaded.items.length === 0) {
    return (
      <CheckScreen
        item={null}
        itemCount={0}
        index={0}
        finished={false}
        showFeedback={false}
        feedback={null}
        pending={false}
        saveError={false}
        hideHeading={hideHeading}
        onChoose={() => undefined}
        onSkip={() => undefined}
      />
    );
  }

  const items = loaded.items;
  const current = items[flow.index] ?? null;
  const view = current === null ? null : toView(current);

  function onSkip(): void {
    if (pending) {
      return;
    }
    const next = skipForNow(flow, items.length);
    setFeedback(null);
    setSaveError(false);
    setFlow(next);
    recordCheckOutcome(next);
  }

  function onChoose(optionId: string): void {
    if (pending || current === null) {
      return;
    }
    lastOption.current = optionId;
    const body = buildAnswerRequest({
      itemId: current.id,
      optionId,
      startedAtMs: startedAt.current,
      nowMs: Date.now(),
      attempt: flow.attempt,
      locale,
      literacyMode: mode,
    });
    setPending(true);
    setSaveError(false);
    void submitAnswer(body)
      .then((result) => {
        const next = applyAnswer(flow, items.length, {
          matched: result.matched,
          nextIndex: nextIndexFor(items, result.next_item_id),
        });
        setFeedback(next.showFeedback ? result.feedback : null);
        setFlow(next);
        recordCheckOutcome(next);
        notify({ title: t("toast.success") });
      })
      .catch(() => {
        setSaveError(true);
        notify({ title: t("saveError", { ns: "check" }), variant: "error" });
      })
      .finally(() => {
        setPending(false);
      });
  }

  return (
    <CheckScreen
      item={view}
      itemCount={items.length}
      index={flow.index}
      finished={flow.finished}
      showFeedback={flow.showFeedback}
      feedback={feedback}
      pending={pending}
      saveError={saveError}
      hideHeading={hideHeading}
      onChoose={onChoose}
      onSkip={onSkip}
      onRetrySave={() => {
        if (lastOption.current !== null) {
          onChoose(lastOption.current);
        }
      }}
    />
  );
}

export function CheckView({ hideHeading = false }: { hideHeading?: boolean }) {
  const { i18n } = useTranslation();
  const locale = documentLocale(i18n.resolvedLanguage ?? i18n.language).lang;
  const personaId = useSyncExternalStore(subscribeSession, getSessionPersona, getSessionPersona);
  return (
    <CheckSession
      key={`${personaId ?? "none"}:${locale}`}
      locale={locale}
      hideHeading={hideHeading}
    />
  );
}

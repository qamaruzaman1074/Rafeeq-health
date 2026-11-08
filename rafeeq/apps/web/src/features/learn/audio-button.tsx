import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import { useNotify } from "@/components/ui/toast";
import { requestTts } from "@/features/learn/api";
import type { LocaleCode } from "@/features/learn/blocks";

export function AudioButton({
  blockId,
  locale,
  title,
  moduleId,
  large,
}: {
  blockId: string;
  locale: LocaleCode;
  title: string;
  moduleId: string;
  large: boolean;
}) {
  const { t } = useTranslation();
  const notify = useNotify();
  const contact = humanContact(t);
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);
  const name = t("audio.name", { ns: "learn", title, id: moduleId });

  const request = () => {
    setPending(true);
    setFailed(false);
    void requestTts(blockId, locale)
      .then((result) => {
        setUrl(result.url);
        notify({ title: t("toast.success") });
      })
      .catch(() => {
        setFailed(true);
        notify({ title: t("audio.error", { ns: "learn" }), variant: "error" });
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <Button
        aria-label={name}
        aria-busy={pending}
        className={large ? "min-h-20 w-full text-3xl" : undefined}
        onClick={request}
      >
        {t("audio.play", { ns: "learn" })}
      </Button>
      {pending ? <Skeleton label={t("audio.loading", { ns: "learn" })} /> : null}
      {failed ? (
        <ErrorState
          title={t("audio.error", { ns: "learn" })}
          retryLabel={t("retry", { ns: "learn" })}
          onRetry={request}
          {...contact}
        />
      ) : null}
      {url !== null ? <audio controls preload="none" src={url} aria-label={name} /> : null}
    </div>
  );
}

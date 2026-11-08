import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
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
      })
      .catch(() => {
        setFailed(true);
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
      {failed ? <p role="alert">{t("audio.error", { ns: "learn" })}</p> : null}
      {url !== null ? <audio controls preload="none" src={url} aria-label={name} /> : null}
    </div>
  );
}

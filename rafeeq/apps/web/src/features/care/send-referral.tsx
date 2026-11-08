import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function SendReferral({
  enabled,
  pending,
  showShareHint,
  failed,
  onSend,
}: {
  enabled: boolean;
  pending: boolean;
  showShareHint: boolean;
  failed: boolean;
  onSend: () => void;
}) {
  const { t } = useTranslation();

  return (
    <section
      className="flex flex-col items-start gap-3"
      aria-label={t("send.label", { ns: "care" })}
    >
      <Button
        disabled={!enabled || pending}
        data-send="referral"
        onClick={() => {
          onSend();
        }}
      >
        {t("send.action", { ns: "care" })}
      </Button>
      {showShareHint ? (
        <p>
          <span>{t("send.needsShare", { ns: "care" })}</span>{" "}
          <Button variant="link" asChild>
            <Link to="/app/privacy">{t("send.privacy", { ns: "care" })}</Link>
          </Button>
        </p>
      ) : null}
      {failed ? <p role="alert">{t("send.failed", { ns: "care" })}</p> : null}
    </section>
  );
}

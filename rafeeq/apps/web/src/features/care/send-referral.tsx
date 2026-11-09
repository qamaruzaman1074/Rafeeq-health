import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { landmarkName } from "@/lib/landmark-name";

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
      aria-label={landmarkName(
        t("send.label", { ns: "care" }),
        t("send.label", { ns: "care", lng: "en" }),
      )}
    >
      <Card className="w-full hover:shadow-surface">
        <CardHeader>
          <CardTitle>{t("send.label", { ns: "care" })}</CardTitle>
          <CardDescription>{t("send.lead", { ns: "care" })}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-3">
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
        </CardContent>
      </Card>
    </section>
  );
}

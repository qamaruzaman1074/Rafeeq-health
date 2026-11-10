import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadReceiptFile, receiptFile } from "@/features/privacy/download";
import { scopeLabel } from "@/features/privacy/labels";
import { isRevocableScope, type RevocableScope } from "@/features/privacy/matrix";
import type { ConsentReceipt } from "@/features/privacy/types";
import { useNumerals } from "@/i18n/numerals";

export function ReceiptCard({
  receipt,
  disabled,
  onRevoke,
}: {
  receipt: ConsentReceipt;
  disabled: boolean;
  onRevoke: (scope: RevocableScope) => void;
}) {
  const { t } = useTranslation();
  const { formatDate, formatNumber } = useNumerals();
  const titleId = useId();
  const revocable = isRevocableScope(receipt.scope) ? receipt.scope : null;
  const recorded = new Date(receipt.at);

  return (
    <Card role="article" aria-labelledby={titleId} data-scope={receipt.scope}>
      <CardHeader>
        <CardTitle id={titleId}>{scopeLabel(receipt.scope, t)}</CardTitle>
        <CardDescription>
          {receipt.granted
            ? t("receipt.on", { ns: "privacy" })
            : t("receipt.off", { ns: "privacy" })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-3">
        <p>
          <span>{t("receipt.version", { ns: "privacy" })}</span>{" "}
          <span>{formatNumber(receipt.version)}</span>
        </p>
        <p>
          <span>{t("receipt.recorded", { ns: "privacy" })}</span>{" "}
          <time dateTime={receipt.at}>{formatDate(recorded)}</time>
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            data-download="receipt"
            onClick={() => {
              downloadReceiptFile(receiptFile(receipt));
            }}
          >
            {t("receipt.download", { ns: "privacy" })}
          </Button>
          {revocable !== null && receipt.granted ? (
            <Button
              variant="secondary"
              disabled={disabled}
              onClick={() => {
                onRevoke(revocable);
              }}
            >
              {t("receipt.revoke", { ns: "privacy" })}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

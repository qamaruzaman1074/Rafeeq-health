import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Carrier } from "@/features/result/types";
import { userVisibleBlockId } from "@/lib/content-marker";

function MissingBlock({ blockId }: { blockId: string }) {
  const { t } = useTranslation();
  const visibleId = userVisibleBlockId(blockId);
  return (
    <span>
      <span>{t("content.missing", { ns: "common" })}</span>
      {visibleId !== null ? (
        <>
          {" "}
          <span lang="en" dir="ltr" className="break-all">
            {visibleId}
          </span>
        </>
      ) : null}
    </span>
  );
}

export function ResultCard({ carrier }: { carrier: Carrier }) {
  const { t } = useTranslation();
  const conditionLang = carrier.condition_locale ?? "en";

  return (
    <article>
      <Card className="hover:shadow-surface">
        <CardHeader>
          <p className="text-eyebrow">{t("card.kind", { ns: "result" })}</p>
          <CardTitle>
            {carrier.condition_name !== null ? (
              <span lang={conditionLang} dir={conditionLang === "ar" ? "rtl" : "ltr"}>
                {carrier.condition_name}
              </span>
            ) : (
              t("content.missing", { ns: "common" })
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p>
            <span className="font-medium">{t("card.gene", { ns: "result" })}</span>{" "}
            {carrier.gene_symbol !== null ? (
              <span lang="en" dir="ltr" className="break-all">
                {carrier.gene_symbol}
              </span>
            ) : (
              <MissingBlock blockId={carrier.gene_block_id} />
            )}
          </p>
          <p>
            <span className="font-medium">{t("card.condition", { ns: "result" })}</span>{" "}
            {carrier.condition_name !== null ? (
              <span lang={conditionLang} dir={conditionLang === "ar" ? "rtl" : "ltr"}>
                {carrier.condition_name}
              </span>
            ) : (
              <MissingBlock blockId={carrier.condition_block_id} />
            )}
          </p>
          <p className="text-sm text-ink-600">{t("card.notDiagnosis", { ns: "result" })}</p>
          <div className="flex flex-col gap-3">
            <details className="flex flex-col gap-2">
              <summary className="inline-flex min-h-11 cursor-pointer items-center text-teal-700 underline decoration-teal-700 underline-offset-4">
                {t("card.learnMore", { ns: "result" })}
              </summary>
              {carrier.condition_name !== null ? (
                <p lang={conditionLang} dir={conditionLang === "ar" ? "rtl" : "ltr"}>
                  {carrier.condition_name}
                </p>
              ) : null}
              <p>
                <MissingBlock blockId={carrier.condition_block_id} />
              </p>
            </details>
            <details className="flex flex-col gap-2">
              <summary className="inline-flex min-h-11 cursor-pointer items-center">
                <Badge>{t("card.whoCanSee", { ns: "result" })}</Badge>
              </summary>
              <p>{t("card.whoCanSeeBody", { ns: "result" })}</p>
              <p>{t("content.missing", { ns: "common" })}</p>
            </details>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

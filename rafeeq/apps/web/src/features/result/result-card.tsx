import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import type { Carrier } from "@/features/result/types";

function MissingBlock({ blockId }: { blockId: string }) {
  const { t } = useTranslation();
  return (
    <span>
      <span>{t("content.missing", { ns: "common" })}</span>{" "}
      <span lang="en" dir="ltr">
        {blockId}
      </span>
    </span>
  );
}

export function ResultCard({ carrier }: { carrier: Carrier }) {
  const { t } = useTranslation();
  const conditionLang = carrier.condition_locale ?? "en";

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-teal-500 bg-sand-100 p-6">
      <h2 className="text-xl font-semibold text-teal-900">
        {carrier.condition_name !== null ? (
          <span lang={conditionLang} dir={conditionLang === "ar" ? "rtl" : "ltr"}>
            {carrier.condition_name}
          </span>
        ) : (
          t("content.missing", { ns: "common" })
        )}
      </h2>
      <p>
        <span className="font-medium">{t("card.gene", { ns: "result" })}</span>{" "}
        {carrier.gene_symbol !== null ? (
          <span lang="en" dir="ltr">
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
    </article>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { useCopyList } from "@/i18n/copy-list";
import {
  CONSENT_PROTOTYPE_ROW_IDS,
  type ConsentPrototypeRowId,
} from "@/features/privacy/consent-integration-model";
import { PrototypeInteractionNotice } from "@/features/privacy/prototype-notice";

type MatrixRow = {
  id: ConsentPrototypeRowId;
  category: string;
  recipient: string;
  purpose: string;
  explanation: string;
};

const switchFocus =
  "focus-visible:[outline:3px_solid_var(--teal-500)] focus-visible:outline-offset-2";

export function ConsentMatrixPrototype() {
  const { t } = useTranslation();
  const rows = useCopyList<MatrixRow>("education.matrix.rows", "privacy");
  const [permissions, setPermissions] = useState<Record<ConsentPrototypeRowId, boolean>>({
    education: false,
    screening: false,
    family: false,
    counselling: false,
  });

  return (
    <section className="flex flex-col gap-4" aria-labelledby="consent-matrix-prototype-heading">
      <h2 id="consent-matrix-prototype-heading" className="text-xl font-semibold text-teal-900">
        {t("education.matrix.heading", { ns: "privacy" })}
      </h2>
      <p className="max-w-2xl text-base text-ink-600">{t("education.matrix.lead", { ns: "privacy" })}</p>
      <PrototypeInteractionNotice />
      <div className="overflow-x-auto rounded-lg border border-border-subtle bg-card shadow-xs">
        <table className="w-full min-w-[48rem] border-collapse text-start text-sm">
          <caption className="sr-only">{t("education.matrix.caption", { ns: "privacy" })}</caption>
          <thead>
            <tr className="border-b border-border-subtle bg-sand-100">
              {(
                [
                  "category",
                  "recipient",
                  "purpose",
                  "permission",
                  "explanation",
                ] as const
              ).map((col) => (
                <th key={col} scope="col" className="px-4 py-3 text-start font-semibold text-teal-900">
                  {t(`education.matrix.columns.${col}`, { ns: "privacy" })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border-subtle last:border-0">
                <td className="px-4 py-3 font-medium text-ink-900">{row.category}</td>
                <td className="px-4 py-3 text-ink-600">{row.recipient}</td>
                <td className="px-4 py-3 text-ink-600">{row.purpose}</td>
                <td className="px-4 py-3">
                  <Switch
                    checked={permissions[row.id]}
                    aria-label={t("education.matrix.toggle", { ns: "privacy", category: row.category })}
                    className={switchFocus}
                    onCheckedChange={(checked) => {
                      setPermissions((current) => ({ ...current, [row.id]: checked }));
                    }}
                  />
                  <span className="mt-1 block text-xs text-ink-600">
                    {permissions[row.id]
                      ? t("education.matrix.stateOn", { ns: "privacy" })
                      : t("education.matrix.stateOff", { ns: "privacy" })}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-600">{row.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-ink-600">
        {t("education.matrix.memoryOnly", { ns: "privacy" })}{" "}
        {CONSENT_PROTOTYPE_ROW_IDS.length} {t("education.matrix.categories", { ns: "privacy" })}
      </p>
    </section>
  );
}

import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { scopeLabel } from "@/features/privacy/labels";
import {
  MATRIX_PARTIES,
  MATRIX_ROWS,
  matrixCell,
  type MatrixParty,
  type RevocableScope,
} from "@/features/privacy/matrix";

const switchFocus =
  "focus-visible:[outline:3px_solid_var(--teal-500)] focus-visible:outline-offset-2";

function partyLabel(party: MatrixParty, t: ReturnType<typeof useTranslation>["t"]): string {
  switch (party) {
    case "me":
      return t("matrix.me", { ns: "privacy" });
    case "partner":
      return t("matrix.partner", { ns: "privacy" });
    case "clinic":
      return t("matrix.clinic", { ns: "privacy" });
    default: {
      const unreachable: never = party;
      return unreachable;
    }
  }
}

export function ShareMatrix({
  partnerGranted,
  clinicGranted,
  disabled,
  onToggle,
}: {
  partnerGranted: boolean;
  clinicGranted: boolean;
  disabled: boolean;
  onToggle: (scope: RevocableScope, next: boolean) => void;
}) {
  const { t } = useTranslation();

  function toggleGranted(scope: RevocableScope): boolean {
    if (scope === "share_overlap_with_partner") {
      return partnerGranted;
    }
    return clinicGranted;
  }

  return (
    <div
      className="max-w-full min-w-0 overflow-x-auto rounded-lg border border-border-subtle bg-sand-100 shadow-xs"
      data-matrix="shares"
    >
      <table className="w-full min-w-[36rem] border-collapse text-start">
        <caption className="py-4 ps-4 pe-4 text-start text-2xl font-semibold text-teal-900">
          {t("matrix.caption", { ns: "privacy" })}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="py-3 ps-4 pe-4 text-start font-medium text-teal-900">
              {t("matrix.item", { ns: "privacy" })}
            </th>
            {MATRIX_PARTIES.map((party) => (
              <th
                key={party}
                scope="col"
                className="py-3 ps-4 pe-4 text-start font-medium text-teal-900"
              >
                {partyLabel(party, t)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MATRIX_ROWS.map((scope) => (
            <tr key={scope} data-scope={scope}>
              <th scope="row" className="py-3 ps-4 pe-4 text-start font-medium text-ink-900">
                {scopeLabel(scope, t)}
              </th>
              {MATRIX_PARTIES.map((party) => {
                const cell = matrixCell(scope, party);
                return (
                  <td key={party} className="py-3 ps-4 pe-4 align-top">
                    {cell.kind === "locked" ? (
                      <div className="flex flex-col items-start gap-2">
                        <Switch
                          checked
                          disabled
                          aria-label={t("matrix.ownSwitch", { ns: "privacy" })}
                          className={switchFocus}
                        />
                        <span>{t("matrix.ownNote", { ns: "privacy" })}</span>
                      </div>
                    ) : null}
                    {cell.kind === "toggle" ? (
                      <Switch
                        checked={toggleGranted(cell.scope)}
                        disabled={disabled}
                        aria-label={
                          cell.scope === "share_overlap_with_partner"
                            ? t("matrix.partnerSwitch", { ns: "privacy" })
                            : t("matrix.clinicSwitch", { ns: "privacy" })
                        }
                        className={switchFocus}
                        onCheckedChange={(checked) => {
                          onToggle(cell.scope, checked);
                        }}
                      />
                    ) : null}
                    {cell.kind === "empty" ? (
                      <span className="text-ink-600">{t("matrix.empty", { ns: "privacy" })}</span>
                    ) : null}
                    {cell.kind === "open_question" ? (
                      <span data-question="open">{t("content.missing", { ns: "common" })}</span>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

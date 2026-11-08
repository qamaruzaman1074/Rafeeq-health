import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { REFERRAL_STATUSES, type ReferralStatus } from "@/features/care/steps";
import { StatusChips } from "@/features/care/status-chips";
import { languageLabel, literacyLabel, referralStatusLabel } from "@/features/clinic/labels";
import { TierChip } from "@/features/clinic/tier-chip";
import type { BriefNote, CaseBrief, FormulaLine } from "@/features/clinic/types";
import type { Carrier } from "@/features/result/types";
import { landmarkName } from "@/lib/landmark-name";

function NoteBody({ note }: { note: BriefNote }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1" data-block={note.block_id}>
      <p className="text-sm text-ink-600" lang="en" dir="ltr">
        {note.block_id}
      </p>
      {note.text === null ? <p>{t("content.missing", { ns: "common" })}</p> : <p>{note.text}</p>}
    </div>
  );
}

function GeneItem({ gene }: { gene: Carrier }) {
  const { t } = useTranslation();
  return (
    <li
      data-gene={gene.id}
      className="flex flex-col gap-1 rounded-lg border border-teal-500 bg-sand-100 p-4"
    >
      {gene.gene_symbol === null ? (
        <p>{t("content.missing", { ns: "common" })}</p>
      ) : (
        <p lang="en" dir="ltr">
          {gene.gene_symbol}
        </p>
      )}
      {gene.condition_name === null ? null : (
        <p
          lang={gene.condition_locale ?? undefined}
          dir={gene.condition_locale === "ar" ? "rtl" : "ltr"}
        >
          {gene.condition_name}
        </p>
      )}
    </li>
  );
}

function FormulaBlock({ formula }: { formula: FormulaLine }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2" data-formula="payload">
      <h3 className="text-lg font-semibold text-teal-900">{t("case.formula", { ns: "clinic" })}</h3>
      <p>{formula.text}</p>
      <h4 className="text-base font-semibold text-teal-900">
        {t("case.inputs", { ns: "clinic" })}
      </h4>
      <dl className="flex flex-col gap-1">
        {formula.inputs.map((input) => (
          <div key={`${input.name}:${input.value}`} className="flex flex-wrap gap-2">
            <dt lang="en" dir="ltr">
              {input.name}
            </dt>
            <dd lang="en" dir="ltr">
              {input.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function BriefPanel({
  brief,
  status,
  pending,
  failed,
  onStatus,
  onSave,
}: {
  brief: CaseBrief;
  status: ReferralStatus;
  pending: boolean;
  failed: boolean;
  onStatus: (status: ReferralStatus) => void;
  onSave: () => void;
}) {
  const { t } = useTranslation();
  const region = (key: string) =>
    landmarkName(t(key, { ns: "clinic" }), t(key, { ns: "clinic", lng: "en" }));

  return (
    <div className="flex flex-col gap-8" data-brief={brief.id}>
      <div className="flex flex-wrap items-center gap-3">
        <TierChip tier={brief.tier} />
        <StatusChips status={brief.status} />
      </div>

      <section className="flex flex-col gap-3" aria-label={region("case.sharedGenes")}>
        <h2 id="shared-genes" className="text-2xl font-semibold text-teal-900">
          {t("case.sharedGenes", { ns: "clinic" })}
        </h2>
        {brief.shared_genes.length === 0 ? (
          <p>{t("case.noSharedGenes", { ns: "clinic" })}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {brief.shared_genes.map((gene) => (
              <GeneItem key={gene.id} gene={gene} />
            ))}
          </ul>
        )}
        {brief.formulas.map((formula) => (
          <FormulaBlock key={formula.text} formula={formula} />
        ))}
      </section>

      <section className="flex flex-col gap-3" aria-label={region("case.questions")}>
        <h2 id="user-questions" className="text-2xl font-semibold text-teal-900">
          {t("case.questions", { ns: "clinic" })}
        </h2>
        {brief.user_questions.length === 0 ? (
          <p>{t("case.noQuestions", { ns: "clinic" })}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {brief.user_questions.map((question) => (
              <li key={question.id}>
                {question.text === null ? t("content.missing", { ns: "common" }) : question.text}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3" aria-label={region("case.gaps")}>
        <h2 id="teach-back-gaps" className="text-2xl font-semibold text-teal-900">
          {t("case.gaps", { ns: "clinic" })}
        </h2>
        {brief.teach_back_gaps.length === 0 ? (
          <p>{t("case.noGaps", { ns: "clinic" })}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {brief.teach_back_gaps.map((gap) => (
              <li key={gap.item_id} lang="en" dir="ltr">
                {gap.block_id}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3" aria-label={region("case.preferences")}>
        <h2 id="preferences" className="text-2xl font-semibold text-teal-900">
          {t("case.preferences", { ns: "clinic" })}
        </h2>
        <p className="flex flex-wrap gap-2">
          <span className="text-ink-600">{t("case.language", { ns: "clinic" })}</span>
          <span>{languageLabel(brief.preferences.language, t)}</span>
        </p>
        <p className="flex flex-wrap gap-2">
          <span className="text-ink-600">{t("case.literacy", { ns: "clinic" })}</span>
          <span>{literacyLabel(brief.preferences.literacy_mode, t)}</span>
        </p>
      </section>

      <section className="flex flex-col gap-3" aria-label={region("case.cultural")}>
        <h2 id="cultural-notes" className="text-2xl font-semibold text-teal-900">
          {t("case.cultural", { ns: "clinic" })}
        </h2>
        <NoteBody note={brief.cultural_notes} />
      </section>

      <section className="flex flex-col gap-3" aria-label={region("case.prompts.label")}>
        <h2 id="talking-prompts" className="text-2xl font-semibold text-teal-900">
          {t("case.prompts.label", { ns: "clinic" })}
        </h2>
        <p>{t("case.prompts.note", { ns: "clinic" })}</p>
        {brief.talking_points.map((point) => (
          <NoteBody key={point.block_id} note={point} />
        ))}
      </section>

      <section
        className="flex flex-col items-start gap-3"
        aria-label={region("case.status.update")}
      >
        <h2 id="status-update" className="text-2xl font-semibold text-teal-900">
          {t("case.status.update", { ns: "clinic" })}
        </h2>
        <label htmlFor="case-status" className="flex flex-col gap-1 text-sm text-ink-600">
          <span>{t("case.status.choose", { ns: "clinic" })}</span>
          <select
            id="case-status"
            value={status}
            onChange={(event) => {
              const next = REFERRAL_STATUSES.find((item) => item === event.target.value);
              if (next !== undefined) {
                onStatus(next);
              }
            }}
            className="min-h-11 rounded-md border border-teal-700 bg-sand-100 ps-3 pe-3 text-base text-ink-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            {REFERRAL_STATUSES.map((item) => (
              <option key={item} value={item}>
                {referralStatusLabel(item, t)}
              </option>
            ))}
          </select>
        </label>
        <Button
          type="button"
          data-save="status"
          aria-busy={pending}
          disabled={pending}
          onClick={onSave}
        >
          {t("case.status.update", { ns: "clinic" })}
        </Button>
        {failed ? <p role="alert">{t("case.status.failed", { ns: "clinic" })}</p> : null}
      </section>
    </div>
  );
}

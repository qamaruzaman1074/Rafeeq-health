import { useTranslation } from "react-i18next";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { BoundaryBanner } from "@/features/couple/boundary-banner";
import type {
  FactCardDTO,
  LocalizedBlock,
  OutcomeProportions,
} from "@/features/couple/fact-card-dto";
import { documentLocale } from "@/i18n/locale";
import { useNumerals } from "@/i18n/numerals";
import { cn } from "@/lib/utils";

const OUTCOMES = ["affected", "carrier", "neither"] as const;

type Outcome = (typeof OUTCOMES)[number];

const outcomeClass: Record<Outcome, string> = {
  affected: "text-teal-900",
  carrier: "text-gold-500",
  neither: "text-teal-500",
};

function repeatCount(count: number): number {
  if (!Number.isInteger(count) || count < 0) {
    return 0;
  }
  return count;
}

function PersonGlyph({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <circle cx="8" cy="4" r="2.2" fill="currentColor" />
      <path d="M3.5 14c.4-3 2.2-4.5 4.5-4.5S12.1 11 12.5 14" fill="currentColor" />
    </svg>
  );
}

function BlockText({ block }: { block: LocalizedBlock }) {
  const { t } = useTranslation();
  if (block.text === null) {
    return (
      <p>
        <span>{t("content.missing", { ns: "common" })}</span>{" "}
        <span lang="en" dir="ltr">
          {block.block_id}
        </span>
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <p lang={block.locale} dir={block.locale === "ar" ? "rtl" : "ltr"}>
        {block.text}
      </p>
      <p className="text-sm text-ink-600" lang="en" dir="ltr">
        {block.block_id}
      </p>
    </div>
  );
}

function IconArray({ proportions }: { proportions: OutcomeProportions }) {
  return (
    <ul className="flex flex-wrap gap-1" aria-hidden="true">
      {OUTCOMES.map((outcome) =>
        Array.from({ length: repeatCount(proportions[outcome]) }, (_, index) => (
          <li key={`${outcome}-${index}`} data-outcome={outcome}>
            <PersonGlyph className={cn("h-4 w-4", outcomeClass[outcome])} />
          </li>
        )),
      )}
    </ul>
  );
}

function OutcomeLegend({ proportions }: { proportions: OutcomeProportions }) {
  const { t } = useTranslation();
  const numerals = useNumerals();
  const label: Record<Outcome, string> = {
    affected: t("outcomes.affected", { ns: "couple" }),
    carrier: t("outcomes.carrier", { ns: "couple" }),
    neither: t("outcomes.neither", { ns: "couple" }),
  };

  return (
    <ul aria-label={t("outcomes.legend", { ns: "couple" })} className="flex flex-col gap-2">
      {OUTCOMES.map((outcome) => (
        <li key={outcome} className="flex items-center gap-2">
          <span className={cn("inline-block h-4 w-4", outcomeClass[outcome])} aria-hidden="true">
            <PersonGlyph className="h-4 w-4" />
          </span>
          <span>{label[outcome]}</span>
          <span>{numerals.formatNumber(proportions[outcome])}</span>
        </li>
      ))}
    </ul>
  );
}

function HowCalculated({ card }: { card: FactCardDTO }) {
  const { t } = useTranslation();
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">{t("fact.howCalculated", { ns: "couple" })}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle>{t("fact.howCalculated", { ns: "couple" })}</DrawerTitle>
        <DrawerDescription className="sr-only">
          {t("fact.howCalculated", { ns: "couple" })}
        </DrawerDescription>
        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-teal-900">
              {t("fact.formula", { ns: "couple" })}
            </h2>
            <p lang="en" dir="ltr">
              {card.formula}
            </p>
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-teal-900">
              {t("fact.inputs", { ns: "couple" })}
            </h2>
            <ul className="flex flex-col gap-2">
              {card.inputs.map((input) => (
                <li key={input.name} lang="en" dir="ltr">
                  <span>{input.name}</span> <span>{input.value}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function FactCard({ card }: { card: FactCardDTO }) {
  const { i18n, t } = useTranslation();
  const locale = documentLocale(i18n.resolvedLanguage ?? i18n.language).lang;
  const sentences = card.sentences.filter((block) => block.locale === locale);

  return (
    <section
      aria-label={t("fact.region", { ns: "couple" })}
      className="flex flex-col gap-4 rounded-lg border border-teal-500 bg-sand-100 p-6"
    >
      <IconArray proportions={card.proportions} />
      <OutcomeLegend proportions={card.proportions} />
      <div className="flex flex-col gap-3">
        {sentences.length === 0 ? <p>{t("content.missing", { ns: "common" })}</p> : null}
        {sentences.map((block) => (
          <BlockText key={`${block.locale}-${block.block_id}`} block={block} />
        ))}
      </div>
      <HowCalculated card={card} />
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-teal-900">
          {t("fact.limits", { ns: "couple" })}
        </h2>
        <ul className="flex list-disc flex-col gap-2 ps-6">
          {card.limits.map((limit) => (
            <li key={limit} lang="en" dir="ltr">
              {limit}
            </li>
          ))}
        </ul>
      </section>
      <BoundaryBanner blocks={card.diagnosis_banner} />
    </section>
  );
}

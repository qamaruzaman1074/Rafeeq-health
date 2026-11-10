import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLiteracy, type LiteracyMode } from "@/app/literacy";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AudioButton } from "@/features/learn/audio-button";
import { BlockBody } from "@/features/learn/block-body";
import { readLocaleBlock, type LocaleCode } from "@/features/learn/blocks";
import { EducationGuide } from "@/features/learn/education-guide";
import { GlossaryTerm } from "@/features/learn/glossary-term";
import { ModuleIcon } from "@/features/learn/module-icon";
import { LEARN_MODULES, type LearnModule } from "@/features/learn/modules";
import { LearnRelatedLinks } from "@/features/learn/related-links";
import { ArabicReviewNotice } from "@/features/comprehension-access/arabic-review-notice";
import { LearningJourney } from "@/features/comprehension-access/learning-journey";
import { LearnModuleProgress } from "@/features/inherited-risk-education/learn-module-progress";
import { NonDirectiveNotice } from "@/features/informed-choices/non-directive-notice";
import { documentLocale } from "@/i18n/locale";

function Transcript({
  title,
  moduleId,
  text,
  blockId,
  shown,
  large,
}: {
  title: string;
  moduleId: string;
  text: string | null;
  blockId: string;
  shown: boolean;
  large: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const regionId = `transcript-${moduleId}`;
  const label = t("transcript.label", { ns: "learn", title, id: moduleId });
  const body = (
    <div id={regionId} role="region" aria-label={label}>
      <BlockBody text={text} blockId={blockId} />
    </div>
  );

  if (shown) {
    return body;
  }

  const showName = t("transcript.show", { ns: "learn", title, id: moduleId });
  return (
    <div className="flex flex-col items-start gap-3">
      <Button
        variant="secondary"
        aria-expanded={open}
        aria-controls={regionId}
        aria-label={showName}
        className={large ? "min-h-20 w-full text-3xl" : undefined}
        onClick={() => {
          setOpen((value) => !value);
        }}
      >
        {t("transcript.showLabel", { ns: "learn" })}
      </Button>
      {open ? body : null}
    </div>
  );
}

function LearnModuleCard({
  module,
  locale,
  mode,
}: {
  module: LearnModule;
  locale: LocaleCode;
  mode: LiteracyMode;
}) {
  const { t } = useTranslation();
  const title = t(module.titleKey, { ns: "learn" });
  const spokenId = mode === "simple" ? module.shortBlockId : module.fullBlockId;
  const spoken = readLocaleBlock(locale, spokenId);

  return (
    <article
      id={`learn-${module.id}`}
      className="scroll-mt-28 flex flex-col gap-4"
      data-content-locale={locale}
      data-literacy={mode}
    >
      <Card className="hover:shadow-surface">
        <CardContent className="flex flex-col gap-4 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-teal-900">{title}</h2>
          <p className="text-sm text-ink-600">{t("modules.educationOnly", { ns: "learn" })}</p>
          <GlossaryTerm
            term={module.glossaryTerm}
            termKey={module.termKey}
            locale={locale}
            large={mode === "voice"}
          />
          {mode === "simple" ? (
            <div className="flex items-start gap-4">
              <ModuleIcon moduleId={module.id} />
              <Transcript
                title={title}
                moduleId={module.id}
                text={spoken.text}
                blockId={spokenId}
                shown
                large={false}
              />
            </div>
          ) : null}
          {mode === "standard" ? (
            <Transcript
              title={title}
              moduleId={module.id}
              text={spoken.text}
              blockId={spokenId}
              shown
              large={false}
            />
          ) : null}
          <AudioButton
            blockId={spokenId}
            locale={locale}
            title={title}
            moduleId={module.id}
            large={mode === "voice"}
          />
          {mode === "voice" ? (
            <Transcript
              title={title}
              moduleId={module.id}
              text={spoken.text}
              blockId={spokenId}
              shown={false}
              large
            />
          ) : null}
        </CardContent>
      </Card>
    </article>
  );
}

function GlossaryStrip({ locale, large }: { locale: LocaleCode; large: boolean }) {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col gap-3" data-learn-section="glossary">
      <h2 className="text-xl font-semibold text-teal-900">
        {t("glossary.heading", { ns: "learn" })}
      </h2>
      <p className="max-w-2xl text-base leading-relaxed text-ink-600">
        {t("glossary.lead", { ns: "learn" })}
      </p>
      <ul className="flex flex-wrap gap-2">
        {LEARN_MODULES.map((module) => (
          <li key={module.glossaryTerm}>
            <GlossaryTerm
              term={module.glossaryTerm}
              termKey={module.termKey}
              locale={locale}
              large={large}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LearnView() {
  const { t, i18n } = useTranslation();
  const { mode } = useLiteracy();
  const locale = documentLocale(i18n.resolvedLanguage ?? i18n.language).lang;
  const modules: readonly LearnModule[] = LEARN_MODULES;

  return (
    <TooltipProvider delayDuration={200}>
      <AppPageLayout width="wide">
        <PageHeader
          title={t("page.title", { ns: "learn" })}
          description={t("page.intro", { ns: "learn" })}
        />
        <p className="max-w-2xl text-base leading-relaxed text-ink-600">
          {t("page.notAdvice", { ns: "learn" })}
        </p>
        <NonDirectiveNotice />
        <ArabicReviewNotice />
        <LearningJourney />
        <p className="text-sm">
          <a href="/informed-choices" className="font-medium text-teal-800 underline-offset-4 hover:underline">
            {t("page.informedChoicesLink", { ns: "learn" })}
          </a>
        </p>
        <p>{t("blocks.language", { ns: "learn" })}</p>
        <EducationGuide />
        <LearnModuleProgress />
        {modules.length === 0 ? (
          <EmptyState title={t("empty", { ns: "learn" })} />
        ) : (
          <ul className="flex flex-col gap-6" aria-label={t("modules.label", { ns: "learn" })}>
            {modules.map((module) => (
              <li key={module.id}>
                <LearnModuleCard module={module} locale={locale} mode={mode} />
              </li>
            ))}
          </ul>
        )}
        <GlossaryStrip locale={locale} large={mode === "voice"} />
        <LearnRelatedLinks />
      </AppPageLayout>
    </TooltipProvider>
  );
}

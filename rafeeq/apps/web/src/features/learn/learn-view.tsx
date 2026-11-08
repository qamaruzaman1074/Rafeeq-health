import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLiteracy, type LiteracyMode } from "@/app/literacy";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AudioButton } from "@/features/learn/audio-button";
import { BlockBody } from "@/features/learn/block-body";
import { readLocaleBlock, type LocaleCode } from "@/features/learn/blocks";
import { GlossaryTerm } from "@/features/learn/glossary-term";
import { ModuleIcon } from "@/features/learn/module-icon";
import { LEARN_MODULES, type LearnModule } from "@/features/learn/modules";
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
      className="flex flex-col gap-4 rounded-lg border border-teal-500 bg-sand-100 p-6"
      data-content-locale={locale}
      data-literacy={mode}
    >
      <h2 className="text-2xl font-semibold text-teal-900">{title}</h2>
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
    </article>
  );
}

export function LearnView() {
  const { t, i18n } = useTranslation();
  const { mode } = useLiteracy();
  const locale = documentLocale(i18n.resolvedLanguage ?? i18n.language).lang;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold text-teal-900">{t("page.title", { ns: "learn" })}</h1>
        <p>{t("blocks.language", { ns: "learn" })}</p>
        <ul className="flex flex-col gap-6" aria-label={t("modules.label", { ns: "learn" })}>
          {LEARN_MODULES.map((module) => (
            <li key={module.id}>
              <LearnModuleCard module={module} locale={locale} mode={mode} />
            </li>
          ))}
        </ul>
      </div>
    </TooltipProvider>
  );
}

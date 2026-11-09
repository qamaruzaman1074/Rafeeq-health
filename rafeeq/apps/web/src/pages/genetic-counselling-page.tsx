import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import {
  CheckList,
  MediaSplit,
  NumberedSteps,
  SectionIntro,
} from "@/components/public/marketing-blocks";
import { Button } from "@/components/ui/button";
import { useCopyList } from "@/i18n/copy-list";

type Profile = { name: string; focus: string };

function initials(name: string): string {
  return name
    .replace(/^Dr\.\s*/u, "")
    .split(/\s+/u)
    .filter((part) => part.length > 0 && part !== "Al")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function Component() {
  const { t } = useTranslation();
  const when = useCopyList<string>("counsellingPage.when", "public");
  const what = useCopyList<string>("counsellingPage.what", "public");
  const profiles = useCopyList<Profile>("counsellingPage.profiles", "public");

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-6 !pt-10 sm:!pt-14">
        <MediaSplit
          image="/images/counselling-couple-clinic.webp"
          imageAlt={t("counsellingPage.imageAlt", { ns: "public" })}
        >
          <PageHeader
            eyebrow={t("counsellingPage.eyebrow", { ns: "public" })}
            title={t("counsellingPage.heroTitle", { ns: "public" })}
            description={t("counsellingPage.heroIntro", { ns: "public" })}
          />
        </MediaSplit>
      </Section>

      <Section wide className="surface-muted" aria-labelledby="counselling-when-heading">
        <div className="grid w-full gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <SectionIntro
              id="counselling-when-heading"
              heading={t("counsellingPage.whenHeading", { ns: "public" })}
            />
            <CheckList items={when} />
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-section text-teal-900 sm:text-[1.875rem] sm:leading-tight">
              {t("counsellingPage.whatHeading", { ns: "public" })}
            </h2>
            <NumberedSteps
              steps={what.map((title) => ({ title }))}
              className="sm:grid-cols-2 lg:grid-cols-2"
            />
          </div>
        </div>
      </Section>

      <Section wide aria-labelledby="counselling-profiles-heading">
        <SectionIntro
          id="counselling-profiles-heading"
          heading={t("counsellingPage.profilesHeading", { ns: "public" })}
          body={<p>{t("counsellingPage.profilesIntro", { ns: "public" })}</p>}
        />
        <RevealStagger className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {profiles.map((profile) => (
            <article
              key={profile.name}
              aria-label={profile.name}
              className="flex h-full flex-col gap-4 rounded-xl border border-border-subtle bg-card p-6 shadow-xs"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-teal-900"
                >
                  {initials(profile.name)}
                </span>
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-teal-900">{profile.name}</h3>
                  <p className="text-sm text-ink-600">{profile.focus}</p>
                </div>
              </div>
              <p className="rounded-md border border-gold-500/60 bg-amber-100 p-3 text-xs font-semibold uppercase tracking-wide text-ink-900">
                {t("counsellingPage.fictionalLabel", { ns: "public" })}
              </p>
            </article>
          ))}
        </RevealStagger>
      </Section>

      <Section wide className="!pb-16 !pt-2">
        <div className="flex w-full flex-col gap-4 rounded-2xl border border-border-subtle bg-secondary p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <p className="max-w-2xl text-base text-secondary-foreground">
            {t("counsellingPage.ctaNote", { ns: "public" })}
          </p>
          <Button asChild>
            <Link to="/demo">{t("counsellingPage.cta", { ns: "public" })}</Link>
          </Button>
        </div>
      </Section>
    </div>
  );
}

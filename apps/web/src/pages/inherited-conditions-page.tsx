import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { RevealStagger } from "@/components/motion/reveal-stagger";
import { NoticePanel } from "@/components/public/marketing-blocks";
import { ClinicalDraftBadge } from "@/features/inherited-risk-education/clinical-draft-badge";
import { EducationHubCallout } from "@/features/inherited-risk-education/education-hub-callout";
import { Button } from "@/components/ui/button";
import { useCopyList } from "@/i18n/copy-list";

const uaeCityProfiles = [
  { city: "Abu Dhabi", diseaseRates: [6.4, 11.6, 8.2, 9.7] },
  { city: "Dubai", diseaseRates: [9.5, 12.8, 7.9, 11.2] },
  { city: "Sharjah", diseaseRates: [7.8, 10.4, 6.7, 8.9] },
  { city: "Ajman", diseaseRates: [8.2, 9.7, 7.3, 10.1] },
  { city: "Ras Al Khaimah", diseaseRates: [10.6, 12.4, 9.1, 11.8] },
  { city: "Fujairah", diseaseRates: [7.1, 8.9, 6.4, 9.3] },
  { city: "Umm Al Quwain", diseaseRates: [6.9, 9.3, 7.7, 8.6] },
] as const;

type Condition = {
  id: string;
  name: string;
  summary: string;
  pattern: string;
  carrier: string;
  screening: string;
  advice: string;
};

const detailKeys = ["pattern", "carrier", "screening", "advice"] as const;

export function Component() {
  const { t } = useTranslation();
  const conditions = useCopyList<Condition>("conditions.items", "public");

  const diseaseNames = conditions.map((item) => item.name);
  const cityProfiles = useMemo(
    () =>
      uaeCityProfiles.map((cityProfile) => ({
        ...cityProfile,
        diseaseRates: diseaseNames.map((_, index) => {
          const value =
            cityProfile.diseaseRates[index] ??
            cityProfile.diseaseRates[index % cityProfile.diseaseRates.length] ??
            0;
          return Number(value.toFixed(1));
        }),
      })),
    [diseaseNames],
  );

  const fallbackCityProfile = cityProfiles[0] ?? { city: "Dubai", diseaseRates: [0, 0, 0, 0] };
  const [selectedCity, setSelectedCity] = useState(fallbackCityProfile.city);
  const selectedCityProfile = cityProfiles.find((city) => city.city === selectedCity) ?? fallbackCityProfile;
  const averageDiseaseRate =
    selectedCityProfile.diseaseRates.reduce((sum, value) => sum + value, 0) / Math.max(selectedCityProfile.diseaseRates.length, 1);
  const donutRadius = 74;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const donutOffset = donutCircumference - (averageDiseaseRate / 100) * donutCircumference;

  return (
    <div className="flex w-full min-w-0 flex-col">
      <Section wide className="!pb-6 !pt-10 sm:!pt-14">
        <PageHeader
          eyebrow={
            <span className="flex flex-wrap items-center gap-2">
              {t("conditions.eyebrow", { ns: "public" })}
              <ClinicalDraftBadge />
            </span>
          }
          title={t("conditions.heroTitle", { ns: "public" })}
          description={t("conditions.heroIntro", { ns: "public" })}
        />
        <EducationHubCallout />
        <nav aria-label={t("conditions.title", { ns: "public" })}>
          <ul className="flex flex-wrap gap-2">
            {conditions.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="nav-pill inline-flex min-h-11 items-center border border-border-subtle bg-card"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      <Section wide className="!pt-0">
        <div className="overflow-hidden rounded-[28px] border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-sky-50 p-5 shadow-[0_18px_40px_rgba(15,118,110,0.08)] sm:p-8">
          <div className="flex flex-col gap-5 border-b border-teal-100 pb-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-20 items-center justify-center overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-sm">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_United_Arab_Emirates.svg"
                    alt="United Arab Emirates flag"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700/80">
                    Country snapshot
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-teal-950 sm:text-3xl">
                    United Arab Emirates
                  </h3>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {cityProfiles.map((city) => {
                  const isSelected = city.city === selectedCity;
                  return (
                    <button
                      key={city.city}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedCity(city.city)}
                      className={[
                        "rounded-full border px-3 py-2 text-sm font-medium transition-all duration-300 ease-out",
                        isSelected
                          ? "border-teal-700 bg-teal-700 text-white shadow-lg shadow-teal-700/20"
                          : "border-teal-200 bg-white text-teal-800 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md",
                      ].join(" ")}
                    >
                      {city.city}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-inner shadow-teal-100/60 backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Selected city</p>
                  <h4 className="mt-2 text-2xl font-semibold text-slate-900">{selectedCityProfile.city}</h4>
                </div>
                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                  Avg. prevalence {averageDiseaseRate.toFixed(1)}%
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {diseaseNames.map((disease, index) => {
                  const value = selectedCityProfile.diseaseRates[index] ?? 0;
                  return (
                    <div key={disease} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-3.5 transition-transform duration-300 hover:scale-[1.01]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-700">{disease}</span>
                        <span className="text-sm font-semibold text-slate-900">{value.toFixed(1)}%</span>
                      </div>
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500 transition-[width] duration-700 ease-out"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-center rounded-3xl border border-teal-100 bg-white/70 p-5 shadow-inner shadow-sky-100/50">
              <div className="relative flex h-60 w-60 items-center justify-center">
                <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90 drop-shadow-[0_12px_25px_rgba(14,116,144,0.18)]">
                  <defs>
                    <linearGradient id="disease-average-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="55%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#f71d00" />
                    </linearGradient>
                  </defs>
                  <circle cx="110" cy="110" r={donutRadius} fill="none" stroke="#e2e8f0" strokeWidth="18" />
                  <circle
                    cx="110"
                    cy="110"
                    r={donutRadius}
                    fill="none"
                    stroke="url(#disease-average-gradient)"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray={donutCircumference}
                    strokeDashoffset={donutOffset}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold tracking-tight text-slate-900">{averageDiseaseRate.toFixed(1)}%</span>
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Average</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section wide className="surface-muted">
        <RevealStagger className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
          {conditions.map((item) => (
            <article
              key={item.id}
              id={item.id}
              aria-labelledby={`${item.id}-name`}
              className="flex scroll-mt-28 flex-col gap-5 rounded-xl border border-border-subtle bg-card p-6 shadow-xs sm:p-8"
            >
              <div className="flex flex-col gap-2">
                <h2 id={`${item.id}-name`} className="text-2xl font-semibold text-teal-900">
                  {item.name}
                </h2>
                <p className="text-base leading-relaxed text-ink-900">{item.summary}</p>
              </div>
              <dl className="grid grid-cols-1 gap-4 border-t border-border-subtle pt-5 sm:grid-cols-2">
                {detailKeys.map((key) => (
                  <div key={key} className="flex flex-col gap-1">
                    <dt className="text-sm font-semibold text-teal-900">
                      {t(`conditions.labels.${key}`, { ns: "public" })}
                    </dt>
                    <dd className="text-base leading-relaxed text-ink-600">{item[key]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </RevealStagger>
      </Section>

      <Section wide className="!pb-16">
        <NoticePanel>
          <p>{t("conditions.disclaimer", { ns: "public" })}</p>
        </NoticePanel>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/understanding-genetic-risk">{t("nav.risk", { ns: "public" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/genetic-counselling">{t("nav.counselling", { ns: "public" })}</Link>
          </Button>
        </div>
      </Section>
    </div>
  );
}

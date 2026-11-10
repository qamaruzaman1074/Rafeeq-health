import { useTranslation } from "react-i18next";
import { INHERITED_RISK_SECTION_IDS, type InheritedRiskSectionId } from "./content-model";

const SECTION_I18N: Record<InheritedRiskSectionId, string> = {
  "carrier-status": "risk.nav.carrier",
  "inheritance": "risk.nav.inheritance",
  "couple-risk": "risk.nav.couple",
  "risk-vs-diagnosis": "risk.nav.riskVsDiagnosis",
  uncertainty: "risk.nav.uncertainty",
  "next-steps": "risk.nav.next",
};

export function InheritedRiskSectionNav({ labelledBy }: { labelledBy?: string }) {
  const { t } = useTranslation();

  return (
    <nav
      aria-labelledby={labelledBy}
      className="sticky top-16 z-10 -mx-1 overflow-x-auto border-b border-border-subtle bg-background/95 px-1 py-3 backdrop-blur-sm"
    >
      <ul className="flex min-w-min gap-2">
        {INHERITED_RISK_SECTION_IDS.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="nav-pill inline-flex min-h-11 items-center border border-border-subtle bg-card px-4 text-sm transition-colors duration-200 hover:border-teal-500 hover:bg-teal-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              {t(SECTION_I18N[id], { ns: "public" })}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

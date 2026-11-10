import { useTranslation } from "react-i18next";

type PatternId = "recessive" | "dominant" | "xLinked";

export function PatternDiagram({ pattern }: { pattern: PatternId }) {
  const { t } = useTranslation();
  const titleId = `pattern-${pattern}-title`;

  return (
    <svg viewBox="0 0 200 120" className="mt-3 h-auto w-full" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{t(`risk.diagrams.pattern.${pattern}.title`, { ns: "public" })}</title>
      <rect width="200" height="120" rx="8" className="fill-sand-100" />
      {pattern === "recessive" ? (
        <>
          <circle cx="60" cy="36" r="10" className="fill-teal-100 stroke-teal-700" strokeWidth="2" />
          <circle cx="100" cy="36" r="10" className="fill-teal-100 stroke-teal-700" strokeWidth="2" />
          <line x1="60" y1="46" x2="80" y2="62" className="stroke-teal-700" strokeWidth="2" />
          <line x1="100" y1="46" x2="80" y2="62" className="stroke-teal-700" strokeWidth="2" />
          <circle cx="80" cy="82" r="10" className="fill-amber-100 stroke-amber-600" strokeWidth="2" />
        </>
      ) : null}
      {pattern === "dominant" ? (
        <>
          <circle cx="70" cy="36" r="10" className="fill-amber-100 stroke-amber-600" strokeWidth="2" />
          <circle cx="110" cy="36" r="10" className="fill-teal-100 stroke-teal-700" strokeWidth="2" />
          <line x1="70" y1="46" x2="90" y2="62" className="stroke-teal-700" strokeWidth="2" />
          <line x1="110" y1="46" x2="90" y2="62" className="stroke-teal-700" strokeWidth="2" />
          <circle cx="80" cy="82" r="10" className="fill-amber-100 stroke-amber-600" strokeWidth="2" />
          <circle cx="100" cy="82" r="10" className="fill-teal-100 stroke-teal-700" strokeWidth="2" />
        </>
      ) : null}
      {pattern === "xLinked" ? (
        <>
          <circle cx="70" cy="36" r="10" className="fill-amber-100 stroke-amber-600" strokeWidth="2" />
          <circle cx="110" cy="36" r="10" className="fill-teal-100 stroke-teal-700" strokeWidth="2" />
          <line x1="70" y1="46" x2="90" y2="62" className="stroke-teal-700" strokeWidth="2" />
          <line x1="110" y1="46" x2="90" y2="62" className="stroke-teal-700" strokeWidth="2" />
          <rect x="72" y="74" width="22" height="14" rx="4" className="fill-teal-100 stroke-teal-700" strokeWidth="2" />
          <circle cx="108" cy="81" r="7" className="fill-amber-100 stroke-amber-600" strokeWidth="2" />
        </>
      ) : null}
    </svg>
  );
}

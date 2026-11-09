import { useTranslation } from "react-i18next";

const cellClass = {
  neither: "fill-teal-100 stroke-teal-700",
  carrier: "fill-amber-100 stroke-gold-500",
  affected: "fill-teal-900 stroke-teal-900",
} as const;

type CellKind = keyof typeof cellClass;

const CELLS: { id: string; kind: CellKind; x: number; y: number }[] = [
  { id: "tl", kind: "neither", x: 48, y: 108 },
  { id: "tr", kind: "carrier", x: 188, y: 108 },
  { id: "bl", kind: "carrier", x: 48, y: 188 },
  { id: "br", kind: "affected", x: 188, y: 188 },
];

export function CouplePunnettDiagram() {
  const { t } = useTranslation();
  const titleId = "couple-punnett-title";
  const descId = "couple-punnett-desc";

  return (
    <figure className="min-w-0 max-w-lg">
      <svg
        viewBox="0 0 360 320"
        className="h-auto w-full max-w-full rounded-xl border border-border-subtle bg-sand-100 shadow-surface-md"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
      >
        <title id={titleId}>{t("risk.diagrams.couple.title", { ns: "public" })}</title>
        <desc id={descId}>{t("risk.diagrams.couple.desc", { ns: "public" })}</desc>
        <rect width="360" height="320" rx="12" className="fill-sand-100" />
        <text x="180" y="36" textAnchor="middle" className="fill-teal-900 text-[13px] font-semibold">
          {t("risk.diagrams.couple.caption", { ns: "public" })}
        </text>
        <circle cx="90" cy="72" r="20" className="fill-teal-pale stroke-teal-700" strokeWidth="2" />
        <text x="90" y="77" textAnchor="middle" className="fill-teal-900 text-[11px] font-medium">
          {t("risk.diagrams.parentWithLetter", { ns: "public", letter: "A" })}
        </text>
        <circle cx="270" cy="72" r="20" className="fill-teal-pale stroke-teal-700" strokeWidth="2" />
        <text x="270" y="77" textAnchor="middle" className="fill-teal-900 text-[11px] font-medium">
          {t("risk.diagrams.parentWithLetter", { ns: "public", letter: "B" })}
        </text>
        {CELLS.map((cell) => (
          <g key={cell.id}>
            <rect
              x={cell.x}
              y={cell.y}
              width="124"
              height="68"
              rx="10"
              className={cellClass[cell.kind]}
              strokeWidth="2"
            />
            <text
              x={cell.x + 62}
              y={cell.y + 40}
              textAnchor="middle"
              className={`text-[12px] font-medium ${cell.kind === "affected" ? "fill-primary-foreground" : "fill-ink-900"}`}
            >
              {t(`risk.diagrams.couple.cell.${cell.kind}`, { ns: "public" })}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-sm text-ink-600">
        {t("risk.diagrams.couple.fig", { ns: "public" })}
      </figcaption>
    </figure>
  );
}

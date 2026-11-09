import { useTranslation } from "react-i18next";

const cellClass = {
  neither: "fill-teal-100 stroke-teal-600",
  carrier: "fill-amber-100 stroke-amber-600",
  affected: "fill-teal-200 stroke-teal-800",
} as const;

type CellKind = keyof typeof cellClass;

const CELLS: { id: string; kind: CellKind; x: number; y: number }[] = [
  { id: "tl", kind: "neither", x: 24, y: 88 },
  { id: "tr", kind: "carrier", x: 112, y: 88 },
  { id: "bl", kind: "carrier", x: 24, y: 144 },
  { id: "br", kind: "affected", x: 112, y: 144 },
];

export function CouplePunnettDiagram() {
  const { t } = useTranslation();
  const titleId = "couple-punnett-title";
  const descId = "couple-punnett-desc";

  return (
    <figure className="max-w-md">
      <svg viewBox="0 0 220 220" className="h-auto w-full" role="img" aria-labelledby={titleId} aria-describedby={descId}>
        <title id={titleId}>{t("risk.diagrams.couple.title", { ns: "public" })}</title>
        <desc id={descId}>{t("risk.diagrams.couple.desc", { ns: "public" })}</desc>
        <rect width="220" height="220" rx="12" className="fill-sand-100" />
        <text x="110" y="28" textAnchor="middle" className="fill-teal-900 text-[11px] font-semibold">
          {t("risk.diagrams.couple.caption", { ns: "public" })}
        </text>
        <circle cx="48" cy="56" r="14" className="fill-teal-50 stroke-teal-700" strokeWidth="2" />
        <text x="48" y="60" textAnchor="middle" className="fill-teal-900 text-[9px] font-medium">
          {t("risk.diagrams.parent", { ns: "public" })} A
        </text>
        <circle cx="172" cy="56" r="14" className="fill-teal-50 stroke-teal-700" strokeWidth="2" />
        <text x="172" y="60" textAnchor="middle" className="fill-teal-900 text-[9px] font-medium">
          {t("risk.diagrams.parent", { ns: "public" })} B
        </text>
        {CELLS.map((cell) => (
          <g key={cell.id}>
            <rect
              x={cell.x}
              y={cell.y}
              width="84"
              height="52"
              rx="8"
              className={cellClass[cell.kind]}
              strokeWidth="2"
            />
            <text x={cell.x + 42} y={cell.y + 30} textAnchor="middle" className="fill-ink-900 text-[8px]">
              {t(`risk.diagrams.cell.${cell.kind}`, { ns: "public" })}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-sm text-ink-600">{t("risk.diagrams.couple.fig", { ns: "public" })}</figcaption>
    </figure>
  );
}

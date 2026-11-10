import { useTranslation } from "react-i18next";
import { landmarkName } from "@/lib/landmark-name";

const CELLS = [
  { id: "neither-a", kind: "neither" },
  { id: "carrier-a", kind: "carrier" },
  { id: "carrier-b", kind: "carrier" },
  { id: "affected", kind: "affected" },
] as const;

const cellClass = {
  neither: "border-teal-500 bg-teal-100 text-teal-900",
  carrier: "border-gold-500 bg-sand-100 text-teal-900",
  affected: "border-teal-700 bg-teal-100 text-teal-900",
} as const;

export function InheritanceExample() {
  const { t } = useTranslation();
  const region = landmarkName(
    t("example.visual", { ns: "result" }),
    "Four equally likely pregnancy outcomes in this example",
  );

  return (
    <section
      className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-sand-100 p-6 shadow-xs"
      data-result-section="inheritance-example"
      aria-labelledby="inheritance-example-heading"
    >
      <div className="flex flex-col gap-2">
        <h2 id="inheritance-example-heading" className="text-xl font-semibold text-teal-900">
          {t("example.title", { ns: "result" })}
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-ink-600">
          {t("example.lead", { ns: "result" })}
        </p>
        <p className="max-w-2xl text-base leading-relaxed">{t("example.when", { ns: "result" })}</p>
      </div>
      <div className="grid max-w-md grid-cols-2 gap-3" role="img" aria-label={region}>
        {CELLS.map((cell) => (
          <div
            key={cell.id}
            data-example-cell={cell.kind}
            className={`flex min-h-24 items-center justify-center rounded-lg border p-3 text-center text-sm font-medium ${cellClass[cell.kind]}`}
          >
            {t(`example.cell.${cell.kind}`, { ns: "result" })}
          </div>
        ))}
      </div>
      <ul className="flex max-w-2xl flex-col gap-2">
        <li>{t("example.affected", { ns: "result" })}</li>
        <li>{t("example.carrier", { ns: "result" })}</li>
        <li>{t("example.neither", { ns: "result" })}</li>
      </ul>
      <p className="max-w-2xl text-base leading-relaxed">
        {t("example.independent", { ns: "result" })}
      </p>
    </section>
  );
}

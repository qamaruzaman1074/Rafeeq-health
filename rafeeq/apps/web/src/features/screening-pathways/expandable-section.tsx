import { useId, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function ExpandableSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <article className="rounded-xl border border-border-subtle bg-card p-5">
      <h3 className="text-lg font-semibold text-teal-900">{title}</h3>
      <Button
        type="button"
        variant="secondary"
        className="mt-3"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => {
          setOpen((value) => !value);
        }}
      >
        {open
          ? t("screeningPathways.expand.hide", { ns: "public" })
          : t("screeningPathways.expand.show", { ns: "public" })}
      </Button>
      {open ? (
        <div id={regionId} className="mt-3 text-base leading-relaxed text-ink-600">
          {children}
        </div>
      ) : null}
    </article>
  );
}

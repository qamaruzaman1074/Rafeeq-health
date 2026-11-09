import { useId, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

type EducationReadMoreProps = {
  title: string;
  children: ReactNode;
};

export function EducationReadMore({ title, children }: EducationReadMoreProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const regionId = useId();
  const label = t("risk.readMore.label", { ns: "public", title });

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-card p-5 shadow-xs">
      <h3 className="text-lg font-semibold text-teal-900">{title}</h3>
      <Button
        type="button"
        variant="secondary"
        className="w-fit"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => {
          setOpen((value) => !value);
        }}
      >
        {open
          ? t("risk.readMore.hide", { ns: "public" })
          : t("risk.readMore.show", { ns: "public" })}
      </Button>
      {open ? (
        <div id={regionId} role="region" aria-label={label} className="text-base leading-relaxed text-ink-600">
          {children}
        </div>
      ) : null}
    </div>
  );
}

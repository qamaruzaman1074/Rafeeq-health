import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

export function PrototypeInteractionNotice({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <p className={className ?? "text-sm font-medium text-amber-900"}>
      <Badge variant="notice" className="me-2 align-middle">
        {t("education.prototypeBadge", { ns: "privacy" })}
      </Badge>
      {t("education.prototypeNotice", { ns: "privacy" })}
    </p>
  );
}

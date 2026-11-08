import type { TFunction } from "i18next";
import type { ConsentScope } from "@/features/couple/share-state";

export function scopeLabel(scope: ConsentScope, t: TFunction): string {
  switch (scope) {
    case "view_own":
      return t("scopes.view_own", { ns: "privacy" });
    case "share_overlap_with_partner":
      return t("scopes.share_overlap_with_partner", { ns: "privacy" });
    case "share_with_clinic":
      return t("scopes.share_with_clinic", { ns: "privacy" });
    case "research_aggregate":
      return t("scopes.research_aggregate", { ns: "privacy" });
    default: {
      const unreachable: never = scope;
      return unreachable;
    }
  }
}

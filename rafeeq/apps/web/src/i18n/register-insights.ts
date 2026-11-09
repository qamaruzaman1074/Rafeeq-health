import insightsEn from "./locales/en/insights.json";
import i18n from "@/i18n";

export function registerInsightsCatalog(): void {
  i18n.addResourceBundle("en", "insights", insightsEn, true, true);
}

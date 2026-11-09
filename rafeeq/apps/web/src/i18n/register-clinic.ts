import clinicEn from "./locales/en/clinic.json";
import i18n from "@/i18n";

export function registerClinicCatalog(): void {
  i18n.addResourceBundle("en", "clinic", clinicEn, true, true);
}

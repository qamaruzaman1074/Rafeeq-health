import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import {
  formatDate,
  formatNumber,
  numeralPreferenceUpdate,
  resolveNumeralSystem,
  type NumeralSystem,
} from "@/i18n/format";
import { documentLocale, type AppLocale } from "@/i18n/locale";
import { browserStorage, readStoredNumeralSystem, writeStoredNumeralSystem } from "@/i18n/storage";

type NumeralContextValue = {
  system: NumeralSystem;
  setSystem: (system: NumeralSystem) => void;
  formatNumber: (value: number) => string;
  formatDate: (value: Date) => string;
};

const NumeralContext = createContext<NumeralContextValue | null>(null);

export function NumeralProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState<AppLocale>(
    () => documentLocale(i18n.resolvedLanguage ?? i18n.language).lang,
  );
  const [stored, setStored] = useState<NumeralSystem | null>(() =>
    readStoredNumeralSystem(browserStorage()),
  );

  useEffect(() => {
    const apply = (language: string) => {
      setLocale(documentLocale(language).lang);
    };
    apply(i18n.resolvedLanguage ?? i18n.language);
    i18n.on("languageChanged", apply);
    return () => {
      i18n.off("languageChanged", apply);
    };
  }, [i18n]);

  const system = resolveNumeralSystem(locale, stored);

  const setSystem = useCallback(
    (next: NumeralSystem) => {
      const preference = numeralPreferenceUpdate(locale, next);
      writeStoredNumeralSystem(browserStorage(), preference);
      setStored(preference);
    },
    [locale],
  );

  const value = useMemo<NumeralContextValue>(
    () => ({
      system,
      setSystem,
      formatNumber: (amount) => formatNumber(amount, system, locale),
      formatDate: (date) => formatDate(date, system, locale),
    }),
    [locale, setSystem, system],
  );

  return <NumeralContext.Provider value={value}>{children}</NumeralContext.Provider>;
}

export function useNumerals(): NumeralContextValue {
  const value = useContext(NumeralContext);
  if (value === null) {
    throw new Error("useNumerals must be used within NumeralProvider");
  }
  return value;
}

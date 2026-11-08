import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { applyDocumentLocale } from "@/i18n/locale";
import { NumeralProvider } from "@/i18n/numerals";

function DocumentLocale({ children }: { children: ReactNode }) {
  const { i18n: instance } = useTranslation();

  useEffect(() => {
    const apply = (language: string) => {
      applyDocumentLocale(language);
    };

    apply(instance.resolvedLanguage ?? instance.language);
    instance.on("languageChanged", apply);
    return () => {
      instance.off("languageChanged", apply);
    };
  }, [instance]);

  return children;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <DocumentLocale>
          <NumeralProvider>{children}</NumeralProvider>
        </DocumentLocale>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

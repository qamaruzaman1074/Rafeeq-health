import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { AppDirection, AppLocale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "error";

export type ToastInput = {
  title: string;
  description?: string;
  dismissLabel?: string;
  variant?: ToastVariant;
  dir?: AppDirection;
  lang?: AppLocale;
};

type ToastRecord = ToastInput & { id: string; variant: ToastVariant };

type ToastContextValue = {
  push: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantClass: Record<ToastVariant, string> = {
  default: "border-teal-500 bg-sand-50 text-ink-900",
  error: "border-danger-600 bg-sand-50 text-ink-900",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((toast: ToastInput) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { ...toast, id, variant: toast.variant ?? "default" }]);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitives.Provider duration={6000} label={t("toast.region")}>
        {children}
        {toasts.map((toast) => (
          <ToastPrimitives.Root
            key={toast.id}
            dir={toast.dir}
            lang={toast.lang}
            type="foreground"
            onOpenChange={(open) => {
              if (!open) {
                dismiss(toast.id);
              }
            }}
            className={cn(
              "flex w-full flex-col gap-2 rounded-lg border p-4 motion-safe:animate-fade-in",
              variantClass[toast.variant],
            )}
          >
            <ToastPrimitives.Title
              className={cn(
                "text-base font-semibold",
                toast.variant === "error" ? "text-danger-600" : "text-ink-900",
              )}
            >
              {toast.title}
            </ToastPrimitives.Title>
            {toast.description !== undefined ? (
              <ToastPrimitives.Description className="text-sm text-ink-600">
                {toast.description}
              </ToastPrimitives.Description>
            ) : null}
            <ToastPrimitives.Close asChild>
              <Button variant="ghost">{toast.dismissLabel ?? t("toast.dismiss")}</Button>
            </ToastPrimitives.Close>
          </ToastPrimitives.Root>
        ))}
        <ToastPrimitives.Viewport
          label={t("toast.viewport")}
          className="fixed bottom-4 end-4 z-50 m-0 flex w-[min(24rem,calc(100%-2rem))] list-none flex-col gap-2 p-0"
        />
      </ToastPrimitives.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

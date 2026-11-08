import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  browserStorage,
  readStoredLiteracyMode,
  writeStoredLiteracyMode,
  type KeyValueStore,
  type StoredLiteracyMode,
} from "@/i18n/storage";

export const LITERACY_MODES = ["standard", "simple", "voice"] as const;

export type LiteracyMode = StoredLiteracyMode;

type LiteracyContextValue = {
  mode: LiteracyMode;
  setMode: (mode: LiteracyMode) => void;
};

const LiteracyContext = createContext<LiteracyContextValue | null>(null);

export function LiteracyProvider({
  children,
  storage,
}: {
  children: ReactNode;
  storage?: KeyValueStore | null;
}) {
  // When `rafeeq.literacy` is absent or invalid, the initial selection is standard.
  const [store] = useState(() => (storage === undefined ? browserStorage() : storage));
  const [mode, setModeState] = useState<LiteracyMode>(
    () => readStoredLiteracyMode(store) ?? "standard",
  );
  const setMode = useCallback(
    (next: LiteracyMode) => {
      setModeState(next);
      writeStoredLiteracyMode(store, next);
    },
    [store],
  );
  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return <LiteracyContext.Provider value={value}>{children}</LiteracyContext.Provider>;
}

export function useLiteracy(): LiteracyContextValue {
  const value = useContext(LiteracyContext);
  if (value === null) {
    throw new Error("useLiteracy must be used within LiteracyProvider");
  }
  return value;
}

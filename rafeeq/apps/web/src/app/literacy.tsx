import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export const LITERACY_MODES = ["standard", "simple", "voice"] as const;

export type LiteracyMode = (typeof LITERACY_MODES)[number];

type LiteracyContextValue = {
  mode: LiteracyMode;
  setMode: (mode: LiteracyMode) => void;
};

const LiteracyContext = createContext<LiteracyContextValue | null>(null);

export function LiteracyProvider({ children }: { children: ReactNode }) {
  // OPEN_QUESTION: MASTER.md lists literacy_mode but not the default, and it does
  // not say the shell persists the choice. "standard" is only the initial selection.
  const [mode, setMode] = useState<LiteracyMode>("standard");
  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return <LiteracyContext.Provider value={value}>{children}</LiteracyContext.Provider>;
}

export function useLiteracy(): LiteracyContextValue {
  const value = useContext(LiteracyContext);
  if (value === null) {
    throw new Error("useLiteracy must be used within LiteracyProvider");
  }
  return value;
}

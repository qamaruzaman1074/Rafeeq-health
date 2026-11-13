import { useSyncExternalStore } from "react";
import { getSessionIdentity, subscribeSession } from "@/app/session";
import {
  generateReportAccessCode,
  isValidReportAccessCode,
  normalizeReportAccessCode,
} from "@/features/report-access/report-code";
export {
  generateReportAccessCode as generatePrototypeReportCode,
  isValidReportAccessCode as isValidPrototypeReportCode,
};
const INITIAL_STATE: PrototypeReportAccessState = {
  code: null,
  unlocked: false,
};

export type PrototypeReportAccessState = {
  code: string | null;
  unlocked: boolean;
};

const states = new Map<string, PrototypeReportAccessState>();
const listeners = new Set<() => void>();

function stateKey(): string {
  return getSessionIdentity() ?? "prototype-anonymous";
}

export function getPrototypeReportAccess(): PrototypeReportAccessState {
  return states.get(stateKey()) ?? INITIAL_STATE;
}

export function subscribePrototypeReportAccess(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function updateState(next: PrototypeReportAccessState): void {
  states.set(stateKey(), next);
  for (const listener of listeners) {
    listener();
  }
}

export function createPrototypeReportCode(value: string): void {
  const code = normalizeReportAccessCode(value);
  if (!isValidReportAccessCode(code)) {
    throw new Error("Report access codes must contain exactly 6 digits.");
  }
  updateState({ code, unlocked: false });
}

export function unlockPrototypeReport(value: string): boolean {
  const state = getPrototypeReportAccess();
  if (state.code === null || state.code !== normalizeReportAccessCode(value)) {
    return false;
  }
  updateState({ ...state, unlocked: true });
  return true;
}

export function usePrototypeReportAccess(): PrototypeReportAccessState {
  useSyncExternalStore(subscribeSession, getSessionIdentity, getSessionIdentity);
  return useSyncExternalStore(
    subscribePrototypeReportAccess,
    getPrototypeReportAccess,
    getPrototypeReportAccess,
  );
}

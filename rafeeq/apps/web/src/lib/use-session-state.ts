import { useCallback, useState } from "react";

/** Demonstration state kept for this browser session only. */
export function useSessionState<T>(
  key: string,
  initial: () => T,
): [T, (update: T | ((current: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial();
    try {
      const stored = window.sessionStorage.getItem(key);
      return stored === null ? initial() : (JSON.parse(stored) as T);
    } catch {
      return initial();
    }
  });

  const update = useCallback(
    (next: T | ((current: T) => T)) => {
      setValue((current) => {
        const resolved = typeof next === "function" ? (next as (current: T) => T)(current) : next;
        try {
          window.sessionStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Storage can be unavailable (private mode); state still updates in memory.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update];
}

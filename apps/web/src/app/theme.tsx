import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  browserStorage,
  readStoredTheme,
  writeStoredTheme,
  type AppTheme,
  type KeyValueStore,
} from "@/i18n/storage";

export type { AppTheme };

type ThemeContextValue = {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type DocumentThemeRoot = {
  setAttribute: (name: string, value: string) => void;
  style: { colorScheme: string };
};

function defaultThemeRoot(): DocumentThemeRoot | null {
  if (typeof document === "undefined") {
    return null;
  }
  return document.documentElement;
}

function prefersDarkScheme(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveTheme(stored: AppTheme | null, prefersDark: boolean): AppTheme {
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return prefersDark ? "dark" : "light";
}

export function applyDocumentTheme(
  theme: AppTheme,
  root: DocumentThemeRoot | null = defaultThemeRoot(),
): void {
  if (root === null) {
    return;
  }
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  if (typeof document === "undefined") {
    return;
  }
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta !== null) {
    themeMeta.setAttribute("content", theme === "dark" ? "#101C1D" : "#103D40");
  }
}

function readBootstrappedTheme(): AppTheme | null {
  if (typeof document === "undefined") {
    return null;
  }
  const value = document.documentElement.getAttribute("data-theme");
  if (value === "light" || value === "dark") {
    return value;
  }
  return null;
}

export function ThemeProvider({
  children,
  storage,
}: {
  children: ReactNode;
  storage?: KeyValueStore | null;
}) {
  const [store] = useState(() => (storage === undefined ? browserStorage() : storage));
  const [theme, setThemeState] = useState<AppTheme>(
    () => readBootstrappedTheme() ?? resolveTheme(readStoredTheme(store), prefersDarkScheme()),
  );

  const setTheme = useCallback(
    (next: AppTheme) => {
      setThemeState(next);
      writeStoredTheme(store, next);
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme-transition", "");
        window.setTimeout(() => {
          document.documentElement.removeAttribute("data-theme-transition");
        }, 220);
      }
    },
    [store],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  useEffect(() => {
    applyDocumentTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readStoredTheme(store) === null) {
        setThemeState(media.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
    };
  }, [store]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (value === null) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return value;
}

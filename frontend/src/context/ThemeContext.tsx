"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getThemeSnapshot(): Theme {
  return localStorage.getItem("researchforge-theme") === "light"
    ? "light"
    : "dark";
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

function subscribeToTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("researchforge-theme-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("researchforge-theme-change", callback);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = getThemeSnapshot() === "dark" ? "light" : "dark";
    localStorage.setItem("researchforge-theme", next);
    window.dispatchEvent(new Event("researchforge-theme-change"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}

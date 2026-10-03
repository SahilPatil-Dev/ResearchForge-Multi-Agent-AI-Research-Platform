"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { theme, toggleTheme } = useTheme();
  const light = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${light ? "dark" : "light"} theme`}
      title={`Switch to ${light ? "dark" : "light"} theme`}
      className={
        compact
          ? "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white"
          : "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
      }
    >
      {light ? <Moon size={compact ? 16 : 18} /> : <Sun size={compact ? 16 : 18} />}
      {!compact && (
        <span>{light ? "Dark appearance" : "Light appearance"}</span>
      )}
    </button>
  );
}

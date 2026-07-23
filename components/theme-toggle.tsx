"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "godocs-theme";

function applyTheme(theme: ResolvedTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ResolvedTheme | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const nextTheme =
        stored === "light" || stored === "dark"
          ? stored
          : media.matches
            ? "dark"
            : "light";

      applyTheme(nextTheme);
      setTheme(nextTheme);
    };

    syncTheme();
    media.addEventListener("change", syncTheme);

    return () => media.removeEventListener("change", syncTheme);
  }, []);

  const currentTheme = theme ?? "dark";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  function handleToggle() {
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      aria-label={`Ativar tema ${nextTheme === "dark" ? "escuro" : "claro"}`}
      className="icon-button theme-toggle"
      onClick={handleToggle}
      title={`Ativar tema ${nextTheme === "dark" ? "escuro" : "claro"}`}
      type="button"
    >
      {currentTheme === "dark" ? (
        <Sun aria-hidden="true" size={18} strokeWidth={1.8} />
      ) : (
        <Moon aria-hidden="true" size={18} strokeWidth={1.8} />
      )}
    </button>
  );
}

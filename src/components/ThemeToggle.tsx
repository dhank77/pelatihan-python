import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  // index.html runs an inline script before paint that already applies the
  // saved theme (or system default) to <html data-theme>, on every route.
  // Read that back instead of recomputing, so this stays in sync with it.
  const applied = document.documentElement.getAttribute("data-theme");
  if (applied === "light" || applied === "dark") return applied;

  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50"
      aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
